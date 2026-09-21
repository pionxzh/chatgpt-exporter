import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/share.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
})
const exports = {}
runInNewContext(outputText, { exports })
const { loadShareConversation } = exports

function mappingConversation(title = 'Mapping fixture') {
    return {
        title,
        current_node: 'assistant',
        mapping: {
            user: { id: 'user', parent: null, children: ['assistant'], message: { id: 'user' } },
            assistant: { id: 'assistant', parent: 'user', children: [], message: { id: 'assistant' } },
        },
    }
}

test('uses embedded loader data without making a fallback request', async () => {
    let requests = 0
    const result = await loadShareConversation(mappingConversation('Embedded'), async () => {
        requests += 1
        return mappingConversation('Fetched')
    })

    assert.equal(result.title, 'Embedded')
    assert.equal(requests, 0)
})

test('loads the share API payload when loader data is absent', async () => {
    const result = await loadShareConversation(null, async () => mappingConversation('Fetched'))

    assert.equal(result.title, 'Fetched')
    assert.equal(result.current_node, 'assistant')
    assert.deepEqual(Object.keys(result.mapping), ['user', 'assistant'])
})

test('rejects a payload without a complete conversation', async () => {
    await assert.rejects(
        loadShareConversation(null, async () => ({ title: 'Missing history' })),
        /shared conversation data/i,
    )
})
