export function getBase64FromImg(el: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    canvas.width = el.naturalWidth
    canvas.height = el.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    ctx.drawImage(el, 0, 0)
    return canvas.toDataURL('image/png')
}

export async function getBase64FromImageUrl(url: string) {
    const img = await loadImage(url)
    return getBase64FromImg(img)
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
    })
}

export function blobToDataURL(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
    })
}
