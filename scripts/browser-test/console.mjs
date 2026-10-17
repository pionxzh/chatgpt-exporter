// Print the tab's console messages, uncaught exceptions and browser log
// entries (failed loads, CSP and CORS errors) for a while. Chrome first
// replays what it kept from before, then new messages follow. With -e, the
// body runs in the page after listening starts, so its logs are caught too.
// Lines over 500 characters are cut.
//
// Usage: node console.mjs [--seconds 5] [-e "<async function body>"]

import { connect } from './cdp.mjs'

const args = process.argv.slice(2)
const option = (name, fallback) => {
    const index = args.indexOf(name)
    return index === -1 ? fallback : args[index + 1]
}
const seconds = Number(option('--seconds', 5))
const body = option('-e')

const MAX = 500
const print = line => console.log(line.length > MAX ? `${line.slice(0, MAX)}…` : line)

// Objects arrive as remote handles; their preview holds the first few properties.
const format = (arg) => {
    if (arg.value !== undefined) return typeof arg.value === 'string' ? arg.value : JSON.stringify(arg.value)
    const preview = arg.preview
    if (preview?.properties) {
        const items = preview.properties.map(p => preview.subtype === 'array' ? p.value : `${p.name}: ${p.value}`)
        if (preview.overflow) items.push('…')
        return preview.subtype === 'array' ? `[${items.join(', ')}]` : `{${items.join(', ')}}`
    }
    return arg.description ?? arg.type
}

const cdp = await connect()
try {
    cdp.on('Runtime.consoleAPICalled', ({ type, args }) => {
        print(`[${type}] ${args.map(format).join(' ')}`)
    })
    cdp.on('Runtime.exceptionThrown', ({ exceptionDetails }) => {
        print(`[exception] ${exceptionDetails.exception?.description ?? exceptionDetails.text}`)
    })
    cdp.on('Log.entryAdded', ({ entry }) => {
        print(`[${entry.source}:${entry.level}] ${entry.text}${entry.url ? ` ${entry.url}` : ''}`)
    })
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    if (body) {
        const result = await cdp.run(body)
        if (result !== undefined) print(`[result] ${typeof result === 'string' ? result : JSON.stringify(result)}`)
    }
    await new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
catch (error) {
    console.error(String(error))
    process.exitCode = 1
}
finally {
    cdp.close()
}
