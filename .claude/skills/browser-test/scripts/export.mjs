// Click an exporter menu item in the ChatGPT tab, wait for the download,
// move it to the output folder and unpack it if it is a zip.
// A second label clicks an item in the dialog the first one opens, such as
// `JSON "OpenAI Official Format"`.
//
// Usage: node export.mjs <menu item> [dialog item] [--out dir] [--timeout seconds]

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import JSZip from 'jszip'
import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const option = (name, fallback) => {
    const index = args.indexOf(name)
    if (index === -1) return fallback
    return args.splice(index, 2)[1]
}
// Exports hold real conversations, so keep them out of the repo by default.
const outDir = option('--out', join(tmpdir(), 'chatgpt-exporter-browser-test'))
const timeout = Number(option('--timeout', 300)) * 1000
const [item, dialogItem] = args
if (!item) {
    console.error('Usage: node export.mjs <menu item> [dialog item] [--out dir] [--timeout seconds]')
    process.exit(1)
}

// Chrome only lets a tab download once without a user gesture; later
// downloads wait on a prompt in the address bar. A DevTools download
// behavior skips that check and saves to our own folder. The folder only
// applies while this connection is open, so keep it open until the file lands.
const downloadDir = mkdtempSync(join(tmpdir(), 'chatgpt-exporter-download-'))
const browser = await connect({ target: 'browser' })
await browser.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir })

const cdp = await connect()
await cdp.run(`
    const clickItem = async (label) => {
        for (let i = 0; i < 20; i++) {
            const el = [...document.querySelectorAll('.ce-menu-item')].find(e => e.textContent.trim() === label)
            if (el) return el.click()
            await new Promise(r => setTimeout(r, 100))
        }
        throw new Error('Menu item not found: ' + label)
    }
    document.querySelector('.ce-nav-trigger').click()
    await clickItem(${JSON.stringify(item)})
    ${dialogItem ? `await clickItem(${JSON.stringify(dialogItem)})` : ''}
`)
cdp.close()
console.log('clicked', [item, dialogItem].filter(Boolean).join(' > '))

// Wait for a new file whose size has settled.
const deadline = Date.now() + timeout
let file = null
let lastSize = -1
while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const added = readdirSync(downloadDir).filter(name => !name.endsWith('.crdownload') && !name.startsWith('.'))
    if (added.length === 0) continue
    const candidate = join(downloadDir, added[0])
    const size = statSync(candidate).size
    if (candidate === file && size === lastSize) break
    file = candidate
    lastSize = size
}
browser.close()
if (!file) {
    rmSync(downloadDir, { recursive: true, force: true })
    console.error(`No download within ${timeout / 1000}s. Check the page console for errors.`)
    process.exit(1)
}

mkdirSync(outDir, { recursive: true })
let target = join(outDir, basename(file))
for (let n = 1; existsSync(target); n++) {
    target = join(outDir, `${basename(file, extname(file))}-${n}${extname(file)}`)
}
renameSync(file, target)
rmSync(downloadDir, { recursive: true, force: true })
console.log('saved', target, `${(lastSize / 1024 / 1024).toFixed(1)}MB`)

if (target.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(readFileSync(target))
    const dir = target.slice(0, -4)
    mkdirSync(dir, { recursive: true })
    for (const entry of Object.values(zip.files)) {
        if (entry.dir) continue
        const path = join(dir, basename(entry.name))
        writeFileSync(path, await entry.async('nodebuffer'))
        console.log('  ', path)
    }
}
