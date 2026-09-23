import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })

const { processConversation } = await import('../src/api')

function message(role: 'user' | 'assistant', text: string, citations: unknown[] = []) {
    return {
        author: { role },
        recipient: 'all',
        content: { content_type: 'text', parts: [text] },
        metadata: { citations },
    }
}

// An assistant reply split across two nodes, which processConversation merges.
function conversation(): ApiConversationWithId {
    return {
        id: 'chat-id',
        title: 'Continuation',
        create_time: 1,
        update_time: 2,
        current_node: 'second',
        mapping: {
            root: { id: 'root', children: ['user'] },
            user: { id: 'user', parent: 'root', children: ['first'], message: message('user', 'Hi') },
            first: { id: 'first', parent: 'user', children: ['second'], message: message('assistant', 'First') },
            second: { id: 'second', parent: 'first', children: [], message: message('assistant', ' second', [{ start_ix: 0 }]) },
        },
    } as unknown as ApiConversationWithId
}

const texts = (raw: ApiConversationWithId) => processConversation(raw).conversationNodes
    .map(node => node.message?.content.content_type === 'text' && node.message.content.parts)

describe('processConversation', () => {
    it('merges continuation nodes', () => {
        expect(texts(conversation())).toEqual([['Hi'], ['First second']])
    })

    it('leaves the raw conversation untouched', () => {
        const raw = conversation()
        const expected = structuredClone(raw)

        processConversation(raw, { enableThinking: true })

        expect(raw).toEqual(expected)
    })

    it('gives the same result when the same conversation is processed twice', () => {
        const raw = conversation()
        texts(raw)

        expect(texts(raw)).toEqual([['Hi'], ['First second']])
    })
})
