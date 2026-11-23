import { readFileSync } from 'node:fs'
import JSZip from 'jszip'
import { describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const downloadFile = vi.hoisted(() => vi.fn())
const copyToClipboard = vi.hoisted(() => vi.fn())
const fetchConversation = vi.hoisted(() => vi.fn())

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { documentElement: { lang: 'en' } })

vi.mock('../src/i18n', () => ({
    default: { t: (key: string, options?: { title?: string }) => options?.title ? `${key}: ${options.title}` : key },
}))
vi.mock('../src/page', () => ({ getUserAvatar: async () => '', checkIfConversationStarted: () => true }))
vi.mock('../src/temporaryChat', () => ({ checkIfTemporaryChatIsExportable: () => true }))
vi.mock('../src/utils/storage', () => ({ ScriptStorage: { get: () => null } }))
vi.mock('../src/utils/clipboard', () => ({ copyToClipboard }))
vi.mock('../src/utils/utils', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/utils')>(),
    getColorScheme: () => 'light',
}))
vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))
vi.mock('../src/api', async importOriginal => ({
    ...await importOriginal<typeof import('../src/api')>(),
    fetchConversation,
    getCurrentChatId: async () => 'fixture',
}))

const { applyCanvasUpdate, expandReplacement } = await import('../src/utils/canvas')
const { processConversation } = await import('../src/api')
const { exportAllToMarkdown } = await import('../src/exporter/markdown')
const { exportAllToHtml } = await import('../src/exporter/html')
const { exportToText } = await import('../src/exporter/text')

// Real conversations with every text replaced by a placeholder, numbered in order of appearance.
function fixture(name: string): ApiConversationWithId {
    return JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8'))
}

// Like the mocked `i18n.t`, which shows each key with its title
const label = (key: string, options?: { title: string }) => options ? `${key}: ${options.title}` : key

function answers(name: string) {
    return processConversation(fixture(name), { canvasLabels: label }).conversationNodes
        .filter(node => node.message?.author.role === 'assistant')
        .map(({ message }) => message?.content.content_type === 'text' ? message.content.parts.join('') : '')
}

async function exportFile(exportAll: typeof exportAllToMarkdown, conversation: ApiConversationWithId): Promise<string> {
    downloadFile.mockClear()
    await exportAll('{title}', [conversation])
    const [, , blob] = downloadFile.mock.calls[0]
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    return Object.values(zip.files)[0].async('string')
}

describe('replaying Canvas edits', () => {
    // Expected results come from Python's `re.finditer` with DOTALL and `re.Match.expand`.
    it.each([
        ['rewrites the whole text with .*', 'First line\nSecond line\n', '.*', 'Only line\n', false, 'Only line\n'],
        ['replaces the first match', 'one two one', 'one', 'three', false, 'three two one'],
        ['replaces every match when multiple', 'one two one', 'one', 'three', true, 'three two three'],
        ['appends before a final line break with $', 'First line\nSecond line\n', '$', '\\nThird line', false, 'First line\nSecond line\nThird line\n'],
        ['inserts numbered groups', 'Total: 10 apples', '(\\d+) (\\w+)', '\\2 \\1', false, 'Total: apples 10'],
        ['inserts named groups', 'Total: 10 apples', '(?P<count>\\d+)', '[\\g<count>]', false, 'Total: [10] apples'],
        ['expands escapes in the replacement', 'Title\nBody', 'Title', 'Heading\\n=======', false, 'Heading\n=======\nBody'],
        ['inserts the whole match with \\g<0>', 'aaa', 'a', '\\g<0>b', true, 'ababab'],
    ])('%s', (_, content, pattern, replacement, multiple, expected) => {
        expect(applyCanvasUpdate(content, { pattern, replacement, multiple })).toBe(expected)
    })

    it('fails where Python fails', () => {
        expect(applyCanvasUpdate('abc', { pattern: 'x', replacement: 'y' })).toBeNull()
        expect(expandReplacement('\\q', ['b'])).toBeNull()
        expect(expandReplacement('\\1', ['b'])).toBeNull()
    })

    it('treats replacement text literally apart from Python escapes', () => {
        expect(applyCanvasUpdate('cost', { pattern: 'cost', replacement: '$1 and $&' })).toBe('$1 and $&')
    })
})

describe('canvas export', () => {
    it('shows each created and rewritten code canvas in its reply', () => {
        const blocks = answers('canvas-code-rewrites').filter(text => text.includes('Canvas'))
        expect(blocks).toEqual([
            '**Canvas Created: canvas title 2**\n\n```html\ncanvas 1\n```\n\n**Canvas Created: canvas title 4**\n\n```css\ncanvas 2\n```\n\nanswer 2',
            '**Canvas Created: canvas title 2**\n\n```javascript\ncanvas 3\n```\n\nanswer 3',
            '**Canvas Updated: canvas title 2**\n\n```javascript\ncanvas 4\n```\n\nanswer 5',
            '**Canvas Updated: canvas title 2**\n\n```javascript\ncanvas 5\n```\n\nanswer 6',
            '**Canvas Created: canvas title 7**\n\ncanvas 6\n\nanswer 16',
            // The version before this comment was edited by hand, so later edits cannot be replayed
            '**Canvas Updated: canvas title 7**\n\nCanvas Edit Unavailable\n\ncanvas 7\n\nanswer 20',
            '**Canvas Updated: canvas title 7**\n\nCanvas Edit Unavailable\n\ncanvas 8\n\nanswer 23',
        ])
    })

    it('rewrites a document and skips a failed call', () => {
        expect(answers('canvas-document-rewrite')).toEqual([
            '**Canvas Created: canvas title 2**\n\ncanvas 1\n\nassistant text 1',
            '**Canvas Updated: canvas title 2**\n\ncanvas 2\n\nassistant text 2',
        ])
    })

    it('reads calls stored as code, as in 2026', () => {
        const conversation = fixture('canvas-document-rewrite')
        for (const node of Object.values(conversation.mapping)) {
            const message = node.message
            if (!message?.recipient?.startsWith('canmore.') || message.content.content_type !== 'text') continue
            message.content = { content_type: 'code', language: 'json', text: message.content.parts.join('') }
        }
        const texts = processConversation(conversation, { canvasLabels: label }).conversationNodes
            .filter(node => node.message?.author.role === 'assistant')
            .map(({ message }) => message?.content.content_type === 'text' ? message.content.parts.join('') : '')
        expect(texts).toEqual(answers('canvas-document-rewrite'))
    })

    it('leaves out failed edits and shows only the new text after a hand edit', () => {
        const blocks = answers('canvas-failed-edits').filter(text => text.includes('Canvas'))
        expect(blocks).toEqual([
            '**Canvas Created: canvas title 2**\n\ncanvas 1\n\nanswer 1',
            '**Canvas Updated: canvas title 2**\n\nCanvas Edit Unavailable\n\ncanvas 6\n\nanswer 3',
        ])
    })

    it('keeps the raw messages when Canvas is not enabled, as the JSON exports do', () => {
        const texts = processConversation(fixture('canvas-code-rewrites')).conversationNodes
            .map(({ message }) => message?.content.content_type === 'text' ? message.content.parts.join('') : '')
        expect(texts.some(text => text.includes('Canvas'))).toBe(false)
    })

    it('includes Canvas in Markdown, HTML and Copy Text', async () => {
        const conversation = fixture('canvas-document-rewrite')
        expect(await exportFile(exportAllToMarkdown, conversation)).toContain('**Canvas Updated: canvas title 2**\n\ncanvas 2')
        expect(await exportFile(exportAllToHtml, conversation)).toContain('<strong>Canvas Updated: canvas title 2</strong>')

        fetchConversation.mockResolvedValue(conversation)
        await exportToText()
        expect(copyToClipboard.mock.calls[0][0]).toContain('Canvas Updated: canvas title 2\n\ncanvas 2')
    })
})
