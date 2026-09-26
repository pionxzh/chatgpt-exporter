import JSZip from 'jszip'
import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const downloadFile = vi.hoisted(() => vi.fn())

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { documentElement: { lang: 'en' } })

vi.mock('../src/i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../src/page', () => ({ getUserAvatar: async () => '' }))
vi.mock('../src/temporaryChat', () => ({}))
vi.mock('../src/utils/storage', () => ({ ScriptStorage: { get: () => null } }))
vi.mock('../src/utils/utils', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/utils')>(),
    getColorScheme: () => 'light',
}))
vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))

const { exportAllToHtml } = await import('../src/exporter/html')
const { exportAllToMarkdown } = await import('../src/exporter/markdown')

const INJECTED = '<style>body { display: none }</style><div class="open">'

function conversation(messages: Array<{ role: string, content: unknown, metadata?: unknown }>): ApiConversationWithId {
    const ids = messages.map((_, i) => `m${i}`)
    const mapping = Object.fromEntries(messages.map((message, i) => [ids[i], {
        id: ids[i],
        parent: ids[i - 1] ?? null,
        children: ids[i + 1] ? [ids[i + 1]] : [],
        message: { id: ids[i], author: { role: message.role }, recipient: 'all', content: message.content, metadata: message.metadata ?? {} },
    }]))
    return {
        id: 'chat-id',
        title: 'Chat',
        create_time: 1,
        update_time: 2,
        current_node: ids[ids.length - 1],
        mapping,
    } as unknown as ApiConversationWithId
}

async function exportFile(exportAll: typeof exportAllToHtml, conv: ApiConversationWithId): Promise<string> {
    downloadFile.mockClear()
    await exportAll('{title}', [conv])
    const [, , blob] = downloadFile.mock.calls[0]
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    return Object.values(zip.files)[0].async('string')
}

const uploadConversation = conversation([
    {
        role: 'user',
        content: { content_type: 'text', parts: ['Is this good?'] },
        metadata: {
            attachments: [
                { id: 'file_1', name: 'notes <v2>.html', mime_type: 'text/html', size: 1 },
                { id: 'file_2', name: 'photo.png', mime_type: 'image/png', size: 1 },
            ],
        },
    },
    { role: 'tool', content: { content_type: 'multimodal_text', parts: ['FILE CONTENT', '<title>x</title>'] } },
    { role: 'assistant', content: { content_type: 'text', parts: ['Yes.'] } },
])

describe('exportAllToHtml', () => {
    it('escapes text that is not an assistant reply', async () => {
        const html = await exportFile(exportAllToHtml, conversation([
            { role: 'user', content: { content_type: 'text', parts: ['draw it'] } },
            {
                role: 'tool',
                content: {
                    content_type: 'multimodal_text',
                    parts: [{ content_type: 'image_asset_pointer', asset_pointer: 'https://example.com/a.png', width: 1, height: 1 }, INJECTED],
                },
            },
            {
                role: 'user',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'audio_transcription', text: INJECTED }] },
            },
            { role: 'assistant', content: { content_type: 'code', text: INJECTED } },
        ]))

        expect(html).toContain('<img src="https://example.com/a.png"')
        expect(html).not.toContain(INJECTED)
        // Escaped in the tool message, the transcription and the code block.
        expect(html.match(/&lt;style&gt;body \{ display: none \}&lt;\/style&gt;/g)).toHaveLength(3)
        // The code message renders as a markdown code block.
        expect(html).toContain('<pre><code>&lt;style&gt;body { display: none }&lt;/style&gt;')
    })

    it('lists uploaded files but not the tool message with their content', async () => {
        const html = await exportFile(exportAllToHtml, uploadConversation)
        expect(html).toContain('<ul class="attachments"><li>📎 notes &lt;v2&gt;.html</li></ul>')
        expect(html).not.toContain('photo.png')
        expect(html).not.toContain('FILE CONTENT')
    })
})

describe('exportAllToMarkdown', () => {
    it('lists uploaded files after the message', async () => {
        const markdown = await exportFile(exportAllToMarkdown, uploadConversation)
        expect(markdown).toContain('Is this good?\n\n- 📎 notes <v2>.html\n\n#### ChatGPT:')
        expect(markdown).not.toContain('photo.png')
        expect(markdown).not.toContain('FILE CONTENT')
    })

    it('renders a code message as a code block', async () => {
        const markdown = await exportFile(exportAllToMarkdown, conversation([
            { role: 'assistant', content: { content_type: 'code', text: 'print(1)' } },
        ]))
        expect(markdown).toContain('#### ChatGPT:\nCode:\n\n```\nprint(1)\n```')
    })
})
