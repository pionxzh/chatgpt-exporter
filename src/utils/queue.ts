import EventEmitter from 'mitt'
import { sleep } from './utils'

type RequestFn<T> = () => Promise<T>
interface RequestObject<T> {
    name: string
    request: RequestFn<T>
}
interface ProgressEvent {
    total: number
    completed: number
    currentName: string
    currentStatus: 'processing' | 'retrying'
}

interface ChunkCompleteEvent<T> {
    chunk: T[]
    chunkIndex: number
    totalChunks: number
}

export class RequestQueue<T> {
    private eventEmitter = EventEmitter<{
        done: T[]
        progress: ProgressEvent
        chunkComplete: ChunkCompleteEvent<T>
    } & Record<string, any[]>>()

    private queue: Array<RequestObject<T>> = []
    private results: T[] = []

    private status: 'IDLE' | 'IN_PROGRESS' | 'STOPPED' | 'COMPLETED' = 'IDLE'

    private readonly backoffMultiplier = 2
    private backoff: number

    private total = 0
    private completed = 0
    private currentChunkIndex = 0

    constructor(private minBackoff: number, private maxBackoff: number, private chunkSize?: number) {
        this.backoff = minBackoff
    }

    add(requestObject: RequestObject<T>) {
        this.queue.push(requestObject)
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
        this.total = 0
        this.completed = 0
        this.currentChunkIndex = 0
    }

    on(event: 'progress', fn: (progress: ProgressEvent) => void): () => void
    on(event: 'done', fn: (result: T[]) => void): () => void
    on(event: 'chunkComplete', fn: (event: ChunkCompleteEvent<T>) => void): () => void
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

        this.status = 'IN_PROGRESS'
        const requestObject = this.queue.shift()!
        const { name, request } = requestObject

        try {
            this.progress(name, 'processing')
            const result = await request()
            this.results.push(result)
            this.completed++
            this.progress(name, 'processing')
            this.backoff = this.minBackoff // reset backoff on success

            // Check if we should emit a chunk complete event
            if (this.chunkSize && this.results.length >= this.chunkSize) {
                const chunk = this.results.splice(0, this.chunkSize)
                const totalChunks = Math.ceil(this.total / this.chunkSize)
                this.eventEmitter.emit('chunkComplete', {
                    chunk,
                    chunkIndex: this.currentChunkIndex,
                    totalChunks,
                })
                this.currentChunkIndex++
            }
        }
        catch (error) {
            console.error(`Request ${name} failed:`, error)
            this.progress(name, 'retrying')
            this.backoff = Math.min(this.backoff * this.backoffMultiplier, this.maxBackoff)
            this.queue.unshift(requestObject) // add request back to the front of the queue
        }

        await sleep(this.backoff)
        this.process()
    }

    private progress(name: string, status: 'processing' | 'retrying') {
        this.eventEmitter.emit('progress', {
            total: this.total,
            completed: this.completed,
            currentName: name,
            currentStatus: status,
        })
    }

    private done() {
        this.status = 'COMPLETED'

        // Emit final chunk if there are any remaining results
        if (this.chunkSize && this.results.length > 0) {
            const chunk = this.results.splice(0, this.results.length)
            const totalChunks = Math.ceil(this.total / this.chunkSize)
            this.eventEmitter.emit('chunkComplete', {
                chunk,
                chunkIndex: this.currentChunkIndex,
                totalChunks,
            })
        }

        this.eventEmitter.emit('done', this.results)
    }
}
