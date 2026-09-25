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

const INJECTED = '<style>body { display: none }</style><div class="open">'

function conversation(messages: Array<{ role: string, content: unknown }>): ApiConversationWithId {
    const ids = messages.map((_, i) => `m${i}`)
    const mapping = Object.fromEntries(messages.map((message, i) => [ids[i], {
        id: ids[i],
        parent: ids[i - 1] ?? null,
        children: ids[i + 1] ? [ids[i + 1]] : [],
        message: { id: ids[i], author: { role: message.role }, recipient: 'all', content: message.content, metadata: {} },
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

async function exportHtml(conv: ApiConversationWithId): Promise<string> {
    downloadFile.mockClear()
    await exportAllToHtml('{title}', [conv])
    const [, , blob] = downloadFile.mock.calls[0]
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    return Object.values(zip.files)[0].async('string')
}

describe('exportAllToHtml', () => {
    it('escapes text that is not an assistant reply', async () => {
        const html = await exportHtml(conversation([
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
        expect(html.match(/&lt;style&gt;body \{ display: none \}&lt;\/style&gt;/g)).toHaveLength(2)
        // The code message renders as a markdown code block.
        expect(html).toContain('<pre><code>&#x3C;style>body { display: none }&#x3C;/style>')
    })
})
