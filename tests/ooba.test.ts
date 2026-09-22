import { describe, expect, it, vi } from 'vitest'

vi.mock('../src/api', () => ({
    shouldSkipMessageInExport: () => false,
}))

const { convertToOoba } = await import('../src/utils/conversion')

describe('convertToOoba', () => {
    it('preserves all text content parts for user and assistant messages', () => {
        const conversation = {
            conversationNodes: [
                {
                    message: {
                        author: { role: 'user' },
                        content: {
                            content_type: 'text',
                            parts: ['first user part', 'second user part'],
                        },
                    },
                },
                {
                    message: {
                        author: { role: 'assistant' },
                        content: {
                            content_type: 'text',
                            parts: ['first assistant part', 'second assistant part'],
                        },
                    },
                },
            ],
        } as Parameters<typeof convertToOoba>[0]

        const result = JSON.parse(convertToOoba(conversation))

        expect(result.internal).toEqual([
            [
                'first user part\nsecond user part',
                'first assistant part\nsecond assistant part',
            ],
        ])
        expect(result.visible).toEqual(result.internal)
    })
})
