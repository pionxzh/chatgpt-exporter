// Trusted click (or hover) on the first visible element whose text matches,
// via CDP Input events. Unlike element.click(), this counts as a user
// gesture, so popups, hover menus and gesture-gated actions behave as for a
// real user. The element is scrolled into view first.
//
// Usage: node click.mjs "Sign in" [--selector "nav button"] [--hover]
//        node click.mjs --selector "#submit"     (no text: first visible match)

import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const opt = name => (i => (i >= 0 ? args.splice(i, 2)[1] : undefined))(args.indexOf(name))
const sel = opt('--selector')
const hoverOnly = args.includes('--hover')
const text = args.find(a => a !== '--hover')
if (!text && !sel) throw new Error('usage: node click.mjs "<text>" [--selector css] [--hover]')

const cdp = await connect()
try {
    const rect = await cdp.run(`
        const want = ${JSON.stringify(text ?? null)}
        const sel = ${JSON.stringify(sel ?? 'button, a, [role=button], input, label, div, span')}
        const visible = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 }
        const el = [...document.querySelectorAll(sel)]
            .filter(e => want === null || e.textContent.trim() === want)
            .find(visible)
        if (!el) return null
        el.scrollIntoView({ block: 'center', inline: 'center' })
        await new Promise(r => requestAnimationFrame(() => r()))
        const r = el.getBoundingClientRect()
        const x = r.x + r.width / 2
        const y = r.y + r.height / 2
        // A trusted click lands on whatever is on top, such as an open menu or modal.
        const top = document.elementFromPoint(x, y)
        if (top && !el.contains(top)) return { covered: top.tagName.toLowerCase() + (top.className ? '.' + String(top.className).trim().split(/\\s+/).join('.') : '') }
        return { x, y }
    `)
    const what = text ? `"${text}"` : sel
    if (!rect) throw new Error(`no visible element matching ${what}`)
    if (rect.covered) throw new Error(`${what} is covered by ${rect.covered}; close it first`)
    const { x, y } = rect
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
    if (!hoverOnly) {
        await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
        await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
    }
    console.log(`${hoverOnly ? 'hovered' : 'clicked'} ${what} at ${Math.round(x)},${Math.round(y)}`)
}
catch (error) {
    console.error(String(error))
    process.exitCode = 1
}
finally {
    cdp.close()
}
