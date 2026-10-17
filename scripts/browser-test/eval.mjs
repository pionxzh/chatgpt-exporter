// Run JavaScript in the ChatGPT tab and print the result. The file (or the
// inline code after -e) is the body of an async function, so use `return`.
// Strings print raw, which suits base64 or large text; anything else prints
// as JSON.
//
// Usage: node eval.mjs <file.js>
//        node eval.mjs -e "return document.title"

import { readFileSync } from 'node:fs'
import { connect } from './cdp.mjs'

const [flag, value] = process.argv.slice(2)
const body = flag === '-e' ? value : readFileSync(flag, 'utf8')

const cdp = await connect()
try {
    const result = await cdp.run(body)
    process.stdout.write(typeof result === 'string' ? result : `${JSON.stringify(result, null, 2)}\n`)
}
catch (error) {
    console.error(String(error))
    process.exitCode = 1
}
finally {
    cdp.close()
}
