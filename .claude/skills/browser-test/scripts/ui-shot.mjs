// Open one exporter UI state and screenshot it, so a UI change can be
// compared before and after in both themes.
//
// Usage: node ui-shot.mjs <state> [--theme light|dark] [--scroll bottom] [--out file.png]
//   state: page | menu | setting | export | json
//
// The theme is switched on <html> only, so the account setting is untouched.
// It lasts until the tab reloads. Output goes to the system temp dir by default.

import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const option = (name) => {
    const index = args.indexOf(`--${name}`)
    return index === -1 ? undefined : args.splice(index, 2)[1]
}
const theme = option('theme')
const scroll = option('scroll')
const outOption = option('out')
const state = args[0]
const out = outOption ?? join(tmpdir(), 'chatgpt-exporter-browser-test', `ui-${state}-${theme ?? 'current'}.png`)

const STATES = ['page', 'menu', 'setting', 'export', 'json']
if (!STATES.includes(state)) {
    console.error(`Usage: node ui-shot.mjs <${STATES.join('|')}> [--theme light|dark] [--scroll bottom] [--out file.png]`)
    process.exit(1)
}

const cdp = await connect()
try {
    await cdp.run(`
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        // Close whatever an earlier run left open.
        esc(); await sleep(300); esc(); await sleep(300)

        const theme = ${JSON.stringify(theme ?? null)}
        if (theme) {
            document.documentElement.dataset.theme = theme
            document.documentElement.classList.toggle('dark', theme === 'dark')
        }

        const state = ${JSON.stringify(state)}
        if (state !== 'page') {
            let trigger
            for (let i = 0; i < 50 && !trigger; i++) {
                trigger = [...document.querySelectorAll('.ce-root')]
                    .find(root => !root.closest('[inert]'))
                    ?.querySelector('.ce-nav-trigger')
                if (!trigger) await sleep(200)
            }
            if (!trigger) throw new Error('Exporter menu not found. Inject the build first.')
            trigger.click()
            await sleep(600)
        }
        const item = { setting: 'Setting', export: 'Export All', json: 'JSON' }[state]
        if (item) {
            const el = [...document.querySelectorAll('.ce-card .ce-menu-item')].find(e => e.textContent.trim() === item)
            if (!el) throw new Error('Menu item not found: ' + item)
            el.click()
            // Export All fetches the conversation list before it settles.
            await sleep(state === 'export' ? 3000 : 800)
        }
        if (${JSON.stringify(scroll === 'bottom')}) {
            const body = document.querySelector('.ce-dialog-body, .ce-select-list')
            if (body) body.scrollTop = body.scrollHeight
        }
        // Let color transitions finish, or a theme switch shows half-way colors.
        await sleep(500)
    `)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' }).then(m => m.result)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, Buffer.from(data, 'base64'))
    console.log('saved', out)
}
catch (error) {
    console.error(String(error))
    process.exitCode = 1
}
finally {
    cdp.close()
}
