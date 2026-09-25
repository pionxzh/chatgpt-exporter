// Inject the built userscript into the ChatGPT tab: the @require libraries,
// a localStorage-backed GM_* shim, then dist/chatgpt.user.js. CDP evaluation
// is not subject to the page CSP. A reload drops the injection; SPA
// navigation keeps it.
//
// Usage: node inject.mjs [--reload] [path/to/chatgpt.user.js]

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const reload = args.includes('--reload')
const distPath = args.find(arg => arg !== '--reload') || fileURLToPath(new URL('../../../../dist/chatgpt.user.js', import.meta.url))
const dist = readFileSync(distPath, 'utf8')
const requires = [...dist.matchAll(/^\/\/ @require\s+(\S+)/gm)].map(match => match[1])
const libraries = await Promise.all(requires.map(url => fetch(url).then(res => res.text())))

// src/utils/storage.ts only uses these three.
const shim = `
window.unsafeWindow = window;
window.GM_getValue = (key, fallback) => { const value = localStorage.getItem('__gm_' + key); return value === null ? fallback : JSON.parse(value) };
window.GM_setValue = (key, value) => localStorage.setItem('__gm_' + key, JSON.stringify(value));
window.GM_deleteValue = key => localStorage.removeItem('__gm_' + key);
`

const cdp = await connect()
if (reload) {
    await cdp.send('Page.reload')
    // Wait for the new document and for ChatGPT to mount its navigation.
    await new Promise(resolve => setTimeout(resolve, 1000))
    for (let i = 0; i < 30; i++) {
        const ready = await cdp.evaluate('document.readyState === "complete" && !!document.querySelector("nav")').catch(() => false)
        if (ready) break
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}
const injected = await cdp.evaluate('!!document.querySelector(".ce-nav-trigger")')
if (injected) {
    console.log('The exporter is already on the page. Pass --reload to replace it.')
    cdp.close()
    process.exit(1)
}

const sources = [...requires.map((url, index) => [url, libraries[index]]), ['GM shim', shim], [distPath, dist]]
for (const [name, source] of sources) {
    try {
        await cdp.evaluate(source)
        console.log('ok', name)
    }
    catch (error) {
        console.log('failed', name, String(error).slice(0, 400))
    }
}
cdp.close()
