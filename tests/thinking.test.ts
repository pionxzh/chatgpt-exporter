import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })

const { processConversation } = await import('../src/api')

// Real conversations with every text replaced by a placeholder, numbered in order of appearance.
function fixture(name: string): ApiConversationWithId {
    return JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8'))
}

function answers(name: string, enableThinking: boolean) {
    return processConversation(fixture(name), { enableThinking }).conversationNodes
        .filter(node => node.message?.author.role === 'assistant')
        .map(({ message, thinking }) => ({
            text: message?.content.content_type === 'text' ? message.content.parts.join('') : '',
            durationSeconds: thinking?.durationSeconds,
            activities: thinking?.activities,
            thoughts: thinking?.thoughts.map(t => t.content || t.summary),
        }))
}

describe('thinking export', () => {
    it('keeps preambles out of the answer text', () => {
        expect(answers('thinking-multi-preamble', false).map(a => a.text))
            .toEqual(['answer 1', 'answer 2', 'answer 3'])
    })

    it('shows a lone preamble as the thinking of an older reply', () => {
        // gpt-5-5-thinking: empty thoughts, one preamble before the recap
        expect(answers('thinking-single-preamble', true)).toEqual([
            { text: 'answer 1', durationSeconds: 16, activities: undefined, thoughts: ['preamble 1'] },
        ])
    })

    it('keeps thoughts in order within each reasoning step', () => {
        expect(answers('thinking-summaries', true)).toEqual([
            {
                text: 'answer 1',
                durationSeconds: 29,
                activities: ['activity 1', 'activity 2'],
                thoughts: ['thought 1', 'summary 1', 'thought 2', 'thought 3', 'summary 4', 'summary 5'],
            },
            { text: 'answer 2', durationSeconds: 14, activities: undefined, thoughts: ['thought 4', 'summary 7'] },
        ])
    })

    it('places preambles between thoughts and keeps each activity once', () => {
        // gpt-5-6-pro: preambles at the start, mid-reasoning and right before the recap
        expect(answers('thinking-multi-preamble', true)).toEqual([
            { text: 'answer 1', durationSeconds: 2, activities: ['activity 1'], thoughts: ['summary 1'] },
            {
                text: 'answer 2',
                durationSeconds: 282,
                activities: ['activity 2', 'activity 3', 'activity 4'],
                thoughts: ['preamble 1', 'thought 1', 'summary 2', 'thought 2', 'thought 3', 'summary 5', 'thought 4', 'summary 6', 'summary 7'],
            },
            {
                text: 'answer 3',
                durationSeconds: 307,
                activities: ['activity 4', 'activity 5', 'activity 6'],
                thoughts: ['preamble 2', 'summary 8', 'thought 5', 'summary 10', 'thought 6', 'thought 7', 'thought 8', 'summary 14', 'preamble 3'],
            },
        ])
    })
})
