// Compare how wide a piece of text is on the page and inside an SVG
// <foreignObject> image, which is what SnapDOM rasterizes. SnapDOM freezes
// box widths at their page values, so any gap here shows up in screenshots
// as wrapped, clipped or overlapping text.
//
// Usage: node measure-text.mjs "<text>" ["<more text>" ...] [--font css] [--size px] [--weight n]
// The font defaults to the computed font-family of the first chat paragraph.

import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const option = (name, fallback) => {
    const index = args.indexOf(name)
    if (index === -1) return fallback
    return args.splice(index, 2)[1]
}
const font = option('--font', '')
const size = Number(option('--size', 16))
const weight = option('--weight', '400')
if (args.length === 0) {
    console.error('Usage: node measure-text.mjs "<text>" [--font css] [--size px] [--weight n]')
    process.exit(1)
}

const cdp = await connect()
const rows = await cdp.run(`
    const texts = ${JSON.stringify(args)}
    const font = ${JSON.stringify(font)} || getComputedStyle(document.querySelector('main p') || document.body).fontFamily
    const style = 'font-family:' + font + ';font-size:${size}px;font-weight:${weight};white-space:pre'
    const escapeXml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

    const pageWidth = (text) => {
        const span = document.createElement('span')
        span.textContent = text
        span.style.cssText = style + ';position:absolute;left:-99999px;top:0'
        document.body.append(span)
        const width = span.getBoundingClientRect().width
        span.remove()
        return width
    }

    // Paint the span's box and find where it ends. The box follows the
    // advance widths, not the glyph ink.
    const svgWidth = text => new Promise((resolve) => {
        const W = 2000, H = ${size * 3}, S = 4
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"><foreignObject width="' + W + '" height="' + H + '">'
            + '<div xmlns="http://www.w3.org/1999/xhtml"><span style="' + escapeXml(style) + ';background:#f00;color:transparent">' + escapeXml(text) + '</span></div>'
            + '</foreignObject></svg>'
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = W * S
            canvas.height = H * S
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            const y = Math.floor(${size} * 0.5 * S)
            let right = 0
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4
                if (data[i] > 200 && data[i + 1] < 60 && data[i + 3] > 128) right = x + 1
            }
            resolve(right / S)
        }
        img.onerror = () => resolve(NaN)
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    })

    const rows = []
    for (const text of texts) {
        const page = pageWidth(text)
        const svg = await svgWidth(text)
        rows.push({ text, page: +page.toFixed(2), svg, diff: +(svg - page).toFixed(2) })
    }
    return { font, rows }
`)
cdp.close()

console.log(`font: ${rows.font}  size: ${size}px  weight: ${weight}`)
console.table(rows.rows)
console.log('svg is accurate to about 0.5px. A positive diff means the image is wider than the page.')
