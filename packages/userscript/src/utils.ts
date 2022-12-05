export function onloadSafe(fn: () => void) {
    if (document.readyState === 'complete') {
        fn()
    }
    else {
        window.addEventListener('load', fn)
    }
}

export function copyToClipboard(text: string) {
    try {
        // modern browsers
        navigator.clipboard.writeText(text)
    }
    catch {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
    }
}

export function downloadFile(filename: string, type: string, content: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function downloadUrl(filename: string, url: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function getBase64FromImg(el: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    canvas.width = el.naturalWidth
    canvas.height = el.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    ctx.drawImage(el, 0, 0)
    return canvas.toDataURL('image/png')
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
