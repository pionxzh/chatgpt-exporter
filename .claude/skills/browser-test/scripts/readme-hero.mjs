// Shoot the README hero: the exporter menu open on a staged ChatGPT home
// page, once per README language, in light and dark.
//
// Usage: node readme-hero.mjs [code ...] [--out dir]
//   code: en | fr | id | ko | tr | zh-Hans | zh-Hant (default: all)
//
// Run `pnpm build` first and collapse ChatGPT's sidebar by hand, so no chat
// titles show. Each language switches ChatGPT's UI language in Settings and
// the exporter's language, then puts both back to automatic at the end. The
// page itself is staged: the greeting is replaced, the suggestions under the
// composer are hidden and the avatar becomes the OpenAI logo.
// Output goes to docs/readme by default, as hero-<code>-<theme>.png.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connect } from './cdp.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '../../../..')

// ChatGPT's option in Settings > General > Language (null: "Auto detect",
// the first option, whose label is translated), the exporter locale (null:
// none, so Korean falls back to English), and the greeting.
const LANGUAGES = {
    'en': [null, 'en-US', 'Good ideas shouldn\'t stay in a tab.'],
    'fr': ['français (France)', 'fr', 'Ne laissez pas vos idées dans un onglet.'],
    'id': ['Indonesia', 'id-ID', 'Jangan biarkan ide bagus terjebak di tab.'],
    'ko': ['한국어', null, '좋은 아이디어, 탭에만 두지 마세요.'],
    'tr': ['Türkçe', 'tr-TR', 'Güzel fikirler sekmede kalmasın.'],
    'zh-Hans': ['简体中文', 'zh-Hans', '灵感不该困在标签页里'],
    'zh-Hant': ['繁體中文（台灣）', 'zh-Hant', '靈感不該困在分頁裡'],
}
// The viewport, in CSS px. Screenshots are 2x.
const WIDTH = 960
const HEIGHT = 600
// inject.mjs's GM shim JSON-encodes what ScriptStorage already encoded.
const EXPORTER_LANGUAGE_KEY = '__gm_exporter:language'

const args = process.argv.slice(2)
const option = (name) => {
    const index = args.indexOf(`--${name}`)
    return index === -1 ? undefined : args.splice(index, 2)[1]
}
const outDir = option('out') ?? join(repo, 'docs/readme')
const codes = args.length ? args : Object.keys(LANGUAGES)
const unknown = codes.filter(code => !(code in LANGUAGES))
if (unknown.length) {
    console.error(`Unknown language: ${unknown.join(', ')}. Use ${Object.keys(LANGUAGES).join(' | ')}`)
    process.exit(1)
}

const logoPath = readFileSync(join(repo, 'src/template.html'), 'utf8')
    .match(/<symbol id="chatgpt"[^>]*>\s*(<path[\s\S]*?<\/path>)/)[1]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run(body) {
    const cdp = await connect()
    try {
        return await cdp.run(body)
    }
    finally {
        cdp.close()
    }
}

async function goto(path) {
    // The navigation tears down the context, which can reject the call.
    await run(`location.href = ${JSON.stringify(path)}; return 1`).catch(() => {})
    await sleep(6000)
}

async function setChatGptLanguage(label) {
    await goto('/settings/general-settings')
    const picked = await run(`
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        let button
        for (let i = 0; i < 50 && !button; i++) {
            button = document.querySelector('main [aria-haspopup=dialog]')
            if (!button) await sleep(200)
        }
        if (!button) throw new Error('Language setting not found')
        button.click()
        await sleep(800)
        const label = ${JSON.stringify(label)}
        const options = [...document.querySelectorAll('[role=dialog] [role=option], [role=dialog] button')]
        const option = label === null ? options[0] : options.find(e => e.textContent.trim() === label)
        if (!option) throw new Error('Language option not found: ' + label)
        if (button.textContent.trim() === option.textContent.trim()) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
            return false
        }
        // Picking it reloads the page, so click after this call returns.
        setTimeout(() => option.click())
        return true
    `)
    if (picked) await sleep(6000)
}

async function setExporterLanguage(code) {
    const key = JSON.stringify(EXPORTER_LANGUAGE_KEY)
    await run(code
        ? `localStorage.setItem(${key}, ${JSON.stringify(JSON.stringify(JSON.stringify(code)))}); return 1`
        : `localStorage.removeItem(${key}); return 1`)
}

async function shoot(theme, greeting, out) {
    const cdp = await connect()
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2, mobile: false })
    try {
        await cdp.run(`
            const sleep = ms => new Promise(r => setTimeout(r, ms))
            const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
            esc()
            await sleep(800)
            document.documentElement.dataset.theme = ${JSON.stringify(theme)}
            document.documentElement.classList.toggle('dark', ${JSON.stringify(theme)} === 'dark')

            // Run twice: opening the menu can re-render parts of the page.
            const stage = () => {
                // ChatGPT shows one of several greetings, some with the user's name.
                document.querySelectorAll('[data-headline]').forEach((headline) => {
                    headline.textContent = ${JSON.stringify(greeting)}
                })
                // Suggestions under the composer come from the user's calendar and apps.
                document.querySelectorAll('[class*="group/home-suggestion-list-item"]').forEach((item) => {
                    item.parentElement.style.visibility = 'hidden'
                })
                const avatar = document.querySelector('[data-app-navigation-rail] button[aria-haspopup="menu"] img')
                if (avatar) {
                    const logo = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                    logo.setAttribute('viewBox', '0 0 41 41')
                    logo.setAttribute('class', avatar.getAttribute('class'))
                    logo.style.cssText = 'padding: 3px; background: #10a37f; color: #fff'
                    logo.innerHTML = ${JSON.stringify(logoPath)}
                    avatar.replaceWith(logo)
                }
            }
            stage()

            const trigger = [...document.querySelectorAll('.ce-root')]
                .find(root => !root.closest('[inert]'))
                ?.querySelector('.ce-nav-trigger')
            if (!trigger) throw new Error('Exporter menu not found. Inject the build first.')
            trigger.click()
            await sleep(600)
            stage()
            // Drop the caret in the composer and any focus ring on the trigger.
            document.activeElement?.blur()
            // Let color transitions finish.
            await sleep(500)
        `)
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' }).then(m => m.result)
        writeFileSync(out, Buffer.from(data, 'base64'))
        console.log('saved', out)
    }
    finally {
        await cdp.send('Emulation.clearDeviceMetricsOverride')
        cdp.close()
    }
}

try {
    for (const code of codes) {
        const [label, exporterLanguage, greeting] = LANGUAGES[code]
        await setChatGptLanguage(label)
        await setExporterLanguage(exporterLanguage)
        await goto('/')
        execFileSync('node', [join(here, 'inject.mjs'), '--reload'], { stdio: 'ignore' })
        await sleep(4000)
        for (const theme of ['light', 'dark']) {
            await shoot(theme, greeting, join(outDir, `hero-${code}-${theme}.png`))
        }
    }
}
finally {
    await setChatGptLanguage(null)
    await setExporterLanguage(null)
    await goto('/')
}
