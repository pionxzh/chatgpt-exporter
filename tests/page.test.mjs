import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/page.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
})

function getChatId(path) {
    const exports = {}
    runInNewContext(outputText, {
        exports,
        location: new URL(path, 'https://chatgpt.com'),
        require(specifier) {
            if (specifier === 'vite-plugin-monkey/dist/client') return { unsafeWindow: {} }
            if (specifier === './utils/dom') return {}
            throw new Error(`Unexpected dependency: ${specifier}`)
        },
    })
    return exports.getChatIdFromUrl()
}

const id = '00000000-0000-0000-0000-000000000001'
const cases = [
    [`/c/${id}`, id],
    [`/share/${id}`, id],
    [`/share/e/${id}`, id],
    [`/share/team/${id}`, id],
    [`/share/enterprise/${id}/continue`, id],
    [`/g/g-example/c/${id}`, id],
    ['/share/e/not-a-uuid', null],
    ['/share/e', null],
    ['/settings', null],
]

for (const [path, expected] of cases) {
    test(`getChatIdFromUrl: ${path}`, () => {
        assert.equal(getChatId(path), expected)
    })
}
