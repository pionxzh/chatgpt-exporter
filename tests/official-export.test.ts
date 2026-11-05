import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })

const { processConversation } = await import('../src/api')

// Messages in the official data export have no `recipient`, `channel`,
// `status` or `weight`, and tool and system messages are left out.
function text(role: 'user' | 'assistant', value: string) {
    return {
        id: `${value}-message`,
        author: { role, name: null },
        content: { content_type: 'text', parts: [value] },
        metadata: role === 'assistant' ? { model_slug: 'gpt-5-thinking' } : {},
    }
}

function thoughts(summary: string, content: string) {
    return {
        id: `${summary}-message`,
        author: { role: 'assistant', name: null },
        content: { content_type: 'thoughts', thoughts: [{ summary, content, chunks: [], finished: true }] },
        metadata: { model_slug: 'gpt-5-thinking' },
    }
}

function chain(...messages: object[]): ApiConversationWithId {
    const ids = messages.map((_, i) => `n${i + 1}`)
    const mapping: Record<string, object> = { root: { id: 'root', children: [ids[0]] } }
    messages.forEach((message, i) => {
        mapping[ids[i]] = {
            id: ids[i],
            parent: i === 0 ? 'root' : ids[i - 1],
            children: i === messages.length - 1 ? [] : [ids[i + 1]],
            message,
        }
    })
    return {
        id: 'chat-id',
        title: 'Official export',
        create_time: 1,
        update_time: 2,
        current_node: ids[ids.length - 1],
        mapping,
    } as unknown as ApiConversationWithId
}

// A thinking turn: reasoning, a progress note, more reasoning, then the answer.
function thinkingTurn() {
    return chain(
        text('user', 'Question'),
        thoughts('Plan', 'First step'),
        text('assistant', 'Checking the docs'),
        thoughts('Check', 'Second step'),
        {
            id: 'recap-message',
            author: { role: 'assistant', name: null },
            content: { content_type: 'reasoning_recap', content: 'Thought for 12s' },
        },
        text('assistant', 'Answer'),
    )
}

const texts = (raw: ApiConversationWithId) => processConversation(raw).conversationNodes
    .map(node => node.message?.content.content_type === 'text' && node.message.content.parts)

describe('official data export', () => {
    it('keeps messages without a recipient', () => {
        expect(texts(chain(text('user', 'Hi'), text('assistant', 'Hello')))).toEqual([['Hi'], ['Hello']])
    })

    it('leaves out thinking preambles', () => {
        expect(texts(thinkingTurn())).toEqual([['Question'], ['Answer']])
    })

    it('moves thinking preambles into the thinking block', () => {
        const nodes = processConversation(thinkingTurn(), { enableThinking: true }).conversationNodes

        expect(nodes[1].thinking).toEqual({
            thoughts: [
                { summary: 'Plan', content: 'First step' },
                { summary: '', content: 'Checking the docs' },
                { summary: 'Check', content: 'Second step' },
            ],
            durationSeconds: 12,
        })
    })

    it('leaves the raw conversation untouched', () => {
        const raw = thinkingTurn()
        const expected = structuredClone(raw)

        processConversation(raw, { enableThinking: true })

        expect(raw).toEqual(expected)
    })

    // Such as the runs of a scheduled task, which cannot be told apart from a continuation.
    it('does not merge consecutive replies', () => {
        expect(texts(chain(
            text('user', 'Every morning'),
            text('assistant', 'Monday report'),
            text('assistant', 'Tuesday report'),
        ))).toEqual([['Every morning'], ['Monday report'], ['Tuesday report']])
    })
})
