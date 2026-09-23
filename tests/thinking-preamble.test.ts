import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', new URL('https://chatgpt.com/c/chat-id'))

const { processConversation } = await import('../src/api')

function createConversation(): ApiConversationWithId {
    return {
        id: 'chat-id',
        title: 'Thinking preamble regression',
        create_time: 1,
        update_time: 2,
        current_node: 'assistant-final',
        moderation_results: [],
        is_archived: false,
        mapping: {
            'root': {
                id: 'root',
                children: ['user'],
            },
            'user': {
                id: 'user',
                parent: 'root',
                children: ['assistant-preamble'],
                message: {
                    id: 'user-message',
                    author: { role: 'user', metadata: {} },
                    content: { content_type: 'text', parts: ['Question'] },
                    recipient: 'all',
                    status: 'finished_successfully',
                    weight: 1,
                },
            },
            'assistant-preamble': {
                id: 'assistant-preamble',
                parent: 'user',
                children: ['assistant-final'],
                message: {
                    id: 'assistant-preamble-message',
                    author: { role: 'assistant', metadata: {} },
                    content: { content_type: 'text', parts: ['Transient thinking preamble'] },
                    metadata: {
                        is_thinking_preamble_message: true,
                        model_slug: 'gpt-5-1-thinking',
                    },
                    recipient: 'all',
                    channel: 'analysis',
                    status: 'finished_successfully',
                    weight: 1,
                },
            },
            'assistant-final': {
                id: 'assistant-final',
                parent: 'assistant-preamble',
                children: [],
                message: {
                    id: 'assistant-final-message',
                    author: { role: 'assistant', metadata: {} },
                    content: { content_type: 'text', parts: ['Final answer'] },
                    metadata: { model_slug: 'gpt-5-1-thinking' },
                    recipient: 'all',
                    channel: 'final',
                    status: 'finished_successfully',
                    weight: 1,
                },
            },
        },
    }
}

describe('thinking preamble exports', () => {
    it('omits transient thinking preambles from processed conversations', () => {
        const rawConversation = createConversation()

        const result = processConversation(rawConversation)

        expect(result.conversationNodes.map(node => node.message?.content)).toEqual([
            { content_type: 'text', parts: ['Question'] },
            { content_type: 'text', parts: ['Final answer'] },
        ])
        expect(rawConversation.mapping['assistant-preamble'].message?.content).toEqual({
            content_type: 'text',
            parts: ['Transient thinking preamble'],
        })
    })
})
