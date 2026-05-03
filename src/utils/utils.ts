export function noop() {}

export function nonNullable<T>(x: T): x is NonNullable<T> {
    return x != null
}

export function onloadSafe(fn: () => void) {
    if (document.readyState === 'complete') {
        fn()
    }
    else {
        window.addEventListener('load', fn)
    }
}

/**
 * Background-tab-safe sleep.
 *
 * Chrome throttles setTimeout in non-focused tabs to ≥1 s, which stalls
 * the export queue when the user switches away. Running the timer inside a
 * Web Worker bypasses that throttle. We create one persistent worker and
 * reuse it for all sleeps. If Worker creation fails (CSP, etc.) we fall
 * back to a regular setTimeout so nothing breaks.
 */

// Inline worker source — keeps us dependency-free and avoids extra bundle chunks
const _WORKER_SRC = 'onmessage=function(e){setTimeout(function(){postMessage(e.data)},e.data.ms)}'

let _sleepWorker: Worker | null = null
let _sleepWorkerFailed = false
const _pendingResolves = new Map<number, () => void>()
let _sleepIdCounter = 0

function _getSleepWorker(): Worker | null {
    if (_sleepWorkerFailed) return null
    if (_sleepWorker) return _sleepWorker
    try {
        const blob = new Blob([_WORKER_SRC], { type: 'application/javascript' })
        const url = URL.createObjectURL(blob)
        const w = new Worker(url)
        URL.revokeObjectURL(url)
        w.onmessage = (e: MessageEvent<{ id: number }>) => {
            const resolve = _pendingResolves.get(e.data.id)
            if (resolve) {
                _pendingResolves.delete(e.data.id)
                resolve()
            }
        }
        w.onerror = () => {
            // Worker crashed — fall back to setTimeout for remaining sleeps
            _sleepWorkerFailed = true
            _sleepWorker = null
            for (const resolve of _pendingResolves.values()) resolve()
            _pendingResolves.clear()
        }
        _sleepWorker = w
        return w
    }
    catch {
        _sleepWorkerFailed = true
        return null
    }
}

export function sleep(ms: number): Promise<void> {
    if (ms <= 0) return Promise.resolve()
    const worker = _getSleepWorker()
    if (!worker) return new Promise(resolve => setTimeout(resolve, ms))
    return new Promise((resolve) => {
        const id = _sleepIdCounter++
        _pendingResolves.set(id, resolve)
        worker.postMessage({ id, ms })
    })
}

export function dateStr(date: Date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function timestamp() {
    return new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')
}

export function getColorScheme(): 'light' | 'dark' {
    return document.documentElement.style.getPropertyValue('color-scheme') as 'light' | 'dark'
}

export function unixTimestampToISOString(timestamp: number) {
    if (!timestamp) return ''
    return (new Date(timestamp * 1000)).toISOString()
}

export function jsonlStringify(list: any[]): string {
    // This _has_ to be stringified without adding any indentation
    return list.map((msg: any) => JSON.stringify(msg)).join('\n')
}
