import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    downloadFile: vi.fn(),
    fetchConversation: vi.fn(),
    getCurrentChatId: vi.fn(),
    processConversation: vi.fn(),
}))

vi.mock('../src/api', () => ({
    fetchConversation: mocks.fetchConversation,
    getCurrentChatId: mocks.getCurrentChatId,
    processConversation: mocks.processConversation,
    shouldSkipMessageInExport: () => false,
}))

vi.mock('../src/constants', () => ({
    KEY_SOURCES_ENABLED: 'sources',
    KEY_THINKING_ENABLED: 'thinking',
    KEY_TIMESTAMP_24H: 'timestamp-24h',
    KEY_TIMESTAMP_ENABLED: 'timestamp-enabled',
    KEY_TIMESTAMP_HTML: 'timestamp-html',
    baseUrl: 'https://chatgpt.com',
}))

vi.mock('../src/i18n', () => ({
    default: {
        t: (value: string) => value,
    },
}))

vi.mock('../src/page', () => ({
    checkIfConversationStarted: () => true,
    getUserAvatar: async () => '',
}))

vi.mock('../src/temporaryChat', () => ({
    checkIfTemporaryChatIsExportable: () => true,
}))

vi.mock('../src/utils/citations', () => ({
    transformContentReferences: (value: string) => value,
}))

vi.mock('../src/utils/download', () => ({
    buildZipFileName: () => 'conversations.zip',
    downloadFile: mocks.downloadFile,
    getFileNameWithFormat: () => 'conversation.html',
}))

vi.mock('../src/utils/markdown', () => ({
    fromMarkdown: (value: string) => value,
    toHtml: (value: string) => value,
}))

vi.mock('../src/utils/storage', () => ({
    ScriptStorage: {
        get: () => false,
    },
}))

vi.mock('../src/utils/text', () => ({
    standardizeLineBreaks: (value: string) => value,
}))

vi.mock('../src/utils/utils', () => ({
    dateStr: () => '2026-09-22',
    getColorScheme: () => 'light',
    timestamp: () => '2026-09-22T12-00-00',
    unixTimestampToISOString: (value: number) => String(value),
}))

const { exportToHtml } = await import('../src/exporter/html')

beforeEach(() => {
    vi.stubGlobal('document', {
        documentElement: {
            lang: 'en',
        },
    })

    mocks.downloadFile.mockReset()
    mocks.fetchConversation.mockReset()
    mocks.getCurrentChatId.mockReset()
    mocks.processConversation.mockReset()

    mocks.fetchConversation.mockResolvedValue({})
    mocks.getCurrentChatId.mockResolvedValue('chat-id')
    mocks.processConversation.mockReturnValue({
        id: 'chat-id',
        title: 'Metadata test',
        model: 'GPT-5',
        modelSlug: 'gpt-5-2',
        createTime: 1,
        updateTime: 2,
        conversationNodes: [],
    })
})

describe('html metadata export', () => {
    it('replaces the documented model_name variable with the model slug', async () => {
        await exportToHtml('{title}', [
            {
                name: 'Model slug',
                value: '{model_name}',
            },
        ])

        const [, mimeType, html] = mocks.downloadFile.mock.calls[0]
        expect(mimeType).toBe('text/html')
        expect(html).toContain('<div>gpt-5-2</div>')
        expect(html).not.toContain('{model_name}')
    })
})
