import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

// Exercise the real page module without loading browser-only dependencies.
const source = readFileSync(new URL('../src/page.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
})

function getChatId(url) {
    const exports = {}
    runInNewContext(outputText, {
        exports,
        location: new URL(url, 'https://chatgpt.com'),
        require(specifier) {
            if (specifier === 'vite-plugin-monkey/dist/client') return { unsafeWindow: {} }
            if (specifier === './utils/dom') return {}
            throw new Error(`Unexpected dependency: ${specifier}`)
        },
    }, { timeout: 1000 })
    return exports.getChatIdFromUrl()
}

const id = '00000000-0000-0000-0000-000000000001'
const cases = [
    [`/c/${id}`, id],
    [`/share/${id}`, id],
    [`/share/${id}/continue`, id],
    [`/share/e/${id}`, id],
    [`/share/e/${id}/`, id],
    [`/share/e/${id}/continue`, id],
    [`/share/e/${id}?foo=bar#main`, id],
    [`/g/g-example/c/${id}`, id],
    ['/', null],
    ['/c/', null],
    ['/share/', null],
    ['/g/g-example', null],
    ['/settings', null],
]

for (const [url, expected] of cases) {
    test(`getChatIdFromUrl: ${url}`, () => {
        assert.equal(getChatId(url), expected)
    })
}
