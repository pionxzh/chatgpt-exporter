import EventEmitter from 'mitt'
import { RateLimitError } from '../api'
import { sleep } from './utils'

type RequestFn<T> = () => Promise<T>

/** Public shape callers pass to `add()` */
interface RequestObject<T> {
    name: string
    request: RequestFn<T>
}

/** Internal shape with per-item retry counters */
interface InternalRequestObject<T> extends RequestObject<T> {
    retries: number // general error retries
    rateRetries: number // 429-specific retries
}

export type RequestStatus = 'processing' | 'retrying' | 'rate_limited'

interface ProgressEvent {
    total: number
    completed: number
    currentName: string
    currentStatus: RequestStatus
    /** Seconds remaining in a rate-limit pause (only set when status === 'rate_limited') */
    rateLimitWaitSecs?: number
}

/** Max retries for generic (non-429) errors before skipping a single request */
const MAX_RETRIES = 5
/**
 * Base pause (ms) on a 429 when the API does not return a Retry-After header.
 * Doubles on each successive 429 within the same batch, up to MAX_429_PAUSE_MS.
 */
const DEFAULT_429_PAUSE_MS = 60_000
/**
 * Hard cap on the per-pause wait time so a single 429 never freezes the queue
 * for more than this long. The queue keeps retrying after every pause — there
 * is no limit on the number of pauses per batch.
 */
const MAX_429_PAUSE_MS = 5 * 60_000

export class RequestQueue<T> {
    private eventEmitter = EventEmitter<{
        done: T[]
        progress: ProgressEvent
    } & Record<string, any[]>>()

    private queue: Array<InternalRequestObject<T>> = []
    private results: T[] = []

    private status: 'IDLE' | 'IN_PROGRESS' | 'STOPPED' | 'COMPLETED' = 'IDLE'

    private readonly backoffMultiplier = 2
    private backoff: number

    private total = 0
    private completed = 0

    /**
     * Timestamp (ms since epoch) until which the whole queue is frozen after
     * receiving a 429. While Date.now() < pauseUntil every process() iteration
     * waits out the remainder before making the next request.
     */
    private pauseUntil = 0
    /**
     * Number of 429 pauses taken so far in this batch.
     * Drives the exponential backoff formula. Reset to 0 by clear() at the
     * start of each new batch so every batch gets a fresh backoff curve.
     */
    private batchPauses = 0

    constructor(private minBackoff: number, private maxBackoff: number) {
        this.backoff = minBackoff
    }

    add(requestObject: RequestObject<T>) {
        this.queue.push({ ...requestObject, retries: 0, rateRetries: 0 })
    }

    start() {
        if (this.status === 'IDLE') {
            this.total = this.queue.length
            this.process()
        }
    }

    stop() {
        this.status = 'STOPPED'
        this.eventEmitter.emit('done', this.results)
    }

    clear() {
        this.queue = []
        this.results = []
        this.status = 'IDLE'
        this.backoff = this.minBackoff
        this.pauseUntil = 0
        this.batchPauses = 0
        this.total = 0
        this.completed = 0
    }

    on(event: 'progress', fn: (progress: ProgressEvent) => void): () => void
    on(event: 'done', fn: (result: T[]) => void): () => void
    on(event: string, fn: (...args: any[]) => void): () => void {
        this.eventEmitter.on(event, fn)
        return () => this.eventEmitter.off(event, fn)
    }

    private async process() {
        if (this.status === 'STOPPED' || this.status === 'COMPLETED') {
            return
        }

        if (this.queue.length === 0) {
            this.done()
            return
        }

        // ── Global rate-limit pause ──────────────────────────────────────────
        // If a previous request set pauseUntil, wait for the remainder before
        // making any new request. This freezes the whole queue at once instead
        // of per-item retries, so 100 queued items don't each wait 30s in turn.
        const remaining = this.pauseUntil - Date.now()
        if (remaining > 0) {
            const waitSecs = Math.ceil(remaining / 1000)
            // Broadcast the pause status for every item currently at the front
            this.progress(this.queue[0].name, 'rate_limited', waitSecs)
            await sleep(remaining)
            this.pauseUntil = 0
        }

        this.status = 'IN_PROGRESS'
        const requestObject = this.queue.shift()!
        const { name, request } = requestObject

        let waitMs = this.backoff

        try {
            this.progress(name, 'processing')
            const result = await request()
            this.results.push(result)
            this.completed++
            this.progress(name, 'processing')
            this.backoff = this.minBackoff // reset on success
            requestObject.retries = 0
        }
        catch (error) {
            if (error instanceof RateLimitError) {
                this.batchPauses++
                // Respect Retry-After if the API gave one; otherwise use
                // exponential backoff starting at DEFAULT_429_PAUSE_MS and
                // doubling each pause, capped at MAX_429_PAUSE_MS. The queue
                // never aborts due to rate limiting — it keeps waiting until
                // the batch completes or the user clicks Cancel.
                const backoffMs = DEFAULT_429_PAUSE_MS * (2 ** (this.batchPauses - 1))
                const pauseMs = Math.min(MAX_429_PAUSE_MS, Math.max(error.retryAfterMs, backoffMs))
                this.pauseUntil = Date.now() + pauseMs
                this.progress(name, 'rate_limited', Math.round(pauseMs / 1000))
                console.warn(`[Exporter] Rate limited (429). Pausing ${Math.round(pauseMs / 1000)}s (pause #${this.batchPauses} this batch)`)
                // Put this item back — it will be retried after the pause clears
                this.queue.unshift(requestObject)
                waitMs = 0 // the sleep is handled at the top of the next process() call
            }
            else {
                console.error(`[Exporter] "${name}" failed:`, error)
                requestObject.retries++
                if (requestObject.retries > MAX_RETRIES) {
                    console.warn(`[Exporter] "${name}" skipped after ${MAX_RETRIES} retries`)
                    waitMs = 0 // skip — don't re-queue
                }
                else {
                    this.backoff = Math.min(this.backoff * this.backoffMultiplier, this.maxBackoff)
                    waitMs = this.backoff
                    this.progress(name, 'retrying')
                    this.queue.unshift(requestObject)
                }
            }
        }

        await sleep(waitMs)
        this.process()
    }

    private progress(name: string, status: RequestStatus, rateLimitWaitSecs?: number) {
        this.eventEmitter.emit('progress', {
            total: this.total,
            completed: this.completed,
            currentName: name,
            currentStatus: status,
            rateLimitWaitSecs,
        })
    }

    private done() {
        this.status = 'COMPLETED'
        this.eventEmitter.emit('done', this.results)
    }
}
