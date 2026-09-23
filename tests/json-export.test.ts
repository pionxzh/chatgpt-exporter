import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const mocks = vi.hoisted(() => ({
    downloadFile: vi.fn(),
    fetchConversation: vi.fn(),
    getCurrentChatId: vi.fn(),
    processConversation: vi.fn(),
    zipFiles: [] as Array<[string, string]>,
}))

vi.mock('jszip', () => ({
    default: class MockJSZip {
        file(name: string, content: string) {
            mocks.zipFiles.push([name, content])
            return this
        }

        async generateAsync() {
            return new Blob(['zip'])
        }
    },
}))

vi.mock('../src/api', () => ({
    fetchConversation: mocks.fetchConversation,
    getCurrentChatId: mocks.getCurrentChatId,
    processConversation: mocks.processConversation,
}))

vi.mock('../src/i18n', () => ({
    default: {
        t: (value: string) => value,
    },
}))

vi.mock('../src/page', () => ({
    checkIfConversationStarted: () => true,
}))

vi.mock('../src/temporaryChat', () => ({
    checkIfTemporaryChatIsExportable: () => true,
}))

vi.mock('../src/utils/conversion', () => ({
    convertToOoba: () => '',
    convertToTavern: () => '',
}))

vi.mock('../src/utils/download', () => ({
    buildJsonBatchFileName: () => 'conversations.json',
    buildZipFileName: () => 'conversations.zip',
    downloadFile: mocks.downloadFile,
    getFileNameWithFormat: () => 'conversation.json',
}))

const { exportAllToJson, exportAllToOfficialJson, exportToJson } = await import('../src/exporter/json')

function createRawConversation(): ApiConversationWithId {
    return {
        id: 'chat-id',
        title: 'Raw conversation',
        create_time: 1,
        update_time: 2,
        current_node: 'assistant-2',
        mapping: {
            'assistant-1': {
                id: 'assistant-1',
                parent: null,
                children: ['assistant-2'],
                message: {
                    author: { role: 'assistant' },
                    recipient: 'all',
                    content: {
                        content_type: 'text',
                        parts: ['First'],
                    },
                },
            },
            'assistant-2': {
                id: 'assistant-2',
                parent: 'assistant-1',
                children: [],
                message: {
                    author: { role: 'assistant' },
                    recipient: 'all',
                    content: {
                        content_type: 'text',
                        parts: [' continuation'],
                    },
                },
            },
        },
    } as unknown as ApiConversationWithId
}

beforeEach(() => {
    mocks.downloadFile.mockReset()
    mocks.fetchConversation.mockReset()
    mocks.getCurrentChatId.mockReset()
    mocks.processConversation.mockReset()
    mocks.zipFiles.length = 0

    mocks.processConversation.mockImplementation(() => {
        throw new Error('raw JSON export must not call processConversation')
    })
})

describe('json exports', () => {
    it('serializes the untouched raw conversation for a single export', async () => {
        const rawConversation = createRawConversation()
        const expected = structuredClone(rawConversation)
        mocks.fetchConversation.mockResolvedValue(rawConversation)
        mocks.getCurrentChatId.mockResolvedValue('chat-id')

        await exportToJson('{title}')

        expect(mocks.processConversation).not.toHaveBeenCalled()
        expect(rawConversation).toEqual(expected)

        const [, mimeType, content] = mocks.downloadFile.mock.calls[0]
        expect(mimeType).toBe('application/json')
        expect(JSON.parse(content)).toEqual([expected])
    })

    it('serializes untouched raw conversations in official batch JSON exports', async () => {
        const rawConversation = createRawConversation()
        const expected = structuredClone(rawConversation)

        await exportAllToOfficialJson('{title}', [rawConversation])

        expect(mocks.processConversation).not.toHaveBeenCalled()
        expect(rawConversation).toEqual(expected)

        const [, mimeType, content] = mocks.downloadFile.mock.calls[0]
        expect(mimeType).toBe('application/json')
        expect(JSON.parse(content)).toEqual([expected])
    })

    it('archives untouched raw conversations in JSON ZIP exports', async () => {
        const rawConversation = createRawConversation()
        const expected = structuredClone(rawConversation)

        await exportAllToJson('{title}', [rawConversation])

        expect(mocks.processConversation).not.toHaveBeenCalled()
        expect(rawConversation).toEqual(expected)
        expect(mocks.zipFiles).toHaveLength(1)

        const [, content] = mocks.zipFiles[0]
        expect(JSON.parse(content)).toEqual(expected)
    })
})
