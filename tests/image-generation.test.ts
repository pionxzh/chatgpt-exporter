import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })

const { processConversation } = await import('../src/api')

// A real image generation conversation with every text replaced by a placeholder.
const conversation: ApiConversationWithId = JSON.parse(readFileSync(new URL('./fixtures/image-generation.json', import.meta.url), 'utf8'))

describe('image generation export', () => {
    it('keeps each generated image once and drops empty replies', () => {
        const nodes = processConversation(conversation).conversationNodes.map(({ message }) => {
            const content = message!.content
            const parts = content.content_type === 'text' || content.content_type === 'multimodal_text' ? content.parts : []
            return [message!.author.role, parts.map(part => typeof part === 'string' ? part : part.content_type === 'image_asset_pointer' ? part.asset_pointer : '')]
        })

        expect(nodes).toEqual([
            ['user', ['sediment://file_1', 'question 1']],
            ['tool', ['sediment://file_2']],
            ['user', ['question 2']],
            ['tool', ['sediment://file_3']],
            ['user', ['question 3']],
            ['tool', ['sediment://file_4']],
            ['user', ['question 4']],
            ['tool', ['sediment://file_5']],
        ])
    })
})
