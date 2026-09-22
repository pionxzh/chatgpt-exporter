import { describe, expect, it } from 'vitest'
import { loadShareConversation } from '../src/share'
import type { ApiConversation } from '../src/api'

function conversation(title: string): ApiConversation {
    return {
        title,
        current_node: 'assistant',
        mapping: {
            user: { id: 'user', parent: null, children: ['assistant'], message: { id: 'user' } },
            assistant: { id: 'assistant', parent: 'user', children: [], message: { id: 'assistant' } },
        },
    } as unknown as ApiConversation
}

describe('loadShareConversation', () => {
    it('uses embedded loader data without making a fallback request', async () => {
        let requests = 0
        const result = await loadShareConversation(conversation('Embedded'), async () => {
            requests += 1
            return conversation('Fetched')
        })

        expect(result.title).toBe('Embedded')
        expect(requests).toBe(0)
    })

    it('loads the share API payload when loader data is absent', async () => {
        const result = await loadShareConversation(null, async () => conversation('Fetched'))

        expect(result.title).toBe('Fetched')
        expect(Object.keys(result.mapping)).toEqual(['user', 'assistant'])
    })

    it('rejects a payload without a complete conversation', async () => {
        await expect(
            loadShareConversation(null, async () => ({ title: 'Missing history' } as unknown as ApiConversation)),
        ).rejects.toThrow(/shared conversation data/i)
    })
})
