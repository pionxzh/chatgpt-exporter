import JSZip from 'jszip'
import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const downloadFile = vi.hoisted(() => vi.fn())

// Only loaded for the single-chat export path, which this test does not use.
vi.mock('../src/i18n', () => ({ default: {} }))
vi.mock('../src/page', () => ({}))
vi.mock('../src/temporaryChat', () => ({}))

vi.mock('../src/api', () => ({
    processConversation: () => {
        throw new Error('raw JSON export must not call processConversation')
    },
}))

vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))

const { exportAllToJson } = await import('../src/exporter/json')

describe('exportAllToJson', () => {
    it('archives each raw conversation as is', async () => {
        const raw = {
            id: 'chat-id',
            title: 'Raw conversation',
            create_time: 1,
            update_time: 2,
            current_node: 'assistant',
            mapping: {
                assistant: {
                    id: 'assistant',
                    children: [],
                    message: { author: { role: 'assistant' }, content: { content_type: 'text', parts: ['Hi'] } },
                },
            },
        } as unknown as ApiConversationWithId

        await exportAllToJson('{title}', [raw])

        const [, mimeType, blob] = downloadFile.mock.calls[0]
        expect(mimeType).toBe('application/zip')

        const zip = await JSZip.loadAsync(await blob.arrayBuffer())
        const files = Object.values(zip.files)
        expect(files).toHaveLength(1)
        expect(JSON.parse(await files[0].async('string'))).toEqual(raw)
    })
})
