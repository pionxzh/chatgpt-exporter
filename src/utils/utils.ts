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

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
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
