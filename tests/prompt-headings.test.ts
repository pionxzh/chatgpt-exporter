import JSZip from 'jszip'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const downloadFile = vi.hoisted(() => vi.fn())
const settings = vi.hoisted(() => new Map<string, unknown>())

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { documentElement: { lang: 'en' } })

vi.mock('../src/i18n', async () => {
    const { default: en } = await import('../src/locales/en.json')
    const messages: Record<string, string> = en
    const t = (key: string, options: Record<string, unknown> = {}) =>
        (messages[key] ?? key).replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(options[name]))
    return { default: { t } }
})
vi.mock('../src/page', () => ({}))
vi.mock('../src/temporaryChat', () => ({}))
vi.mock('../src/utils/storage', () => ({
    ScriptStorage: { get: (key: string) => settings.get(key) ?? null },
}))
vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))

const { exportAllToMarkdown } = await import('../src/exporter/markdown')
const { KEY_PROMPT_HEADINGS_ENABLED, KEY_THINKING_ENABLED } = await import('../src/constants')

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

const text = (value: string) => ({ content_type: 'text', parts: [value] })

async function exportMarkdown(conv: ApiConversationWithId): Promise<string> {
    downloadFile.mockClear()
    await exportAllToMarkdown('{title}', [conv])
    const [, , blob] = downloadFile.mock.calls[0]
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    return Object.values(zip.files)[0].async('string')
}

const chat = conversation([
    { role: 'user', content: text('How do I **export** a chat?\nIt has images.') },
    { role: 'assistant', content: text('## Steps\n\nUse the menu.') },
    { role: 'user', content: text('Thanks') },
    { role: 'assistant', content: text('You are welcome.') },
])

describe('prompt headings in Markdown exports', () => {
    beforeEach(() => {
        settings.clear()
    })

    it('keeps You and ChatGPT as headings by default', async () => {
        expect(await exportMarkdown(chat)).toBe([
            '# Chat',
            '',
            '#### You:',
            'How do I **export** a chat?',
            'It has images.',
            '',
            '#### ChatGPT:',
            '## Steps',
            '',
            'Use the menu.',
            '',
            '',
            '#### You:',
            'Thanks',
            '',
            '#### ChatGPT:',
            'You are welcome.',
            '',
        ].join('\n'))
    })

    it('heads each prompt with its first line and keeps the authors as labels', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        expect(await exportMarkdown(chat)).toBe([
            '# Chat',
            '',
            '# How do I export a chat?',
            '',
            '**You:**',
            '',
            'How do I **export** a chat?',
            'It has images.',
            '',
            '**ChatGPT:**',
            '',
            '## Steps',
            '',
            'Use the menu.',
            '',
            '',
            '# Thanks',
            '',
            '**You:**',
            '',
            'Thanks',
            '',
            '**ChatGPT:**',
            '',
            'You are welcome.',
            '',
        ].join('\n'))
    })

    it('titles prompts without text by their code or file, else numbers them', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('```js\nconsole.log(1)\n```') },
            { role: 'assistant', content: text('It logs 1.') },
            {
                role: 'user',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'image_asset_pointer', asset_pointer: 'https://example.com/a.png' }] },
            },
            { role: 'assistant', content: text('A cat.') },
            {
                role: 'user',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'image_asset_pointer', asset_pointer: 'https://example.com/b.png' }, 'And this one?'] },
            },
            { role: 'assistant', content: text('A dog.') },
            { role: 'user', content: text(''), metadata: { attachments: [{ name: 'report.pdf', mime_type: 'application/pdf' }] } },
            { role: 'assistant', content: text('A report.') },
        ]))
        expect(markdown.match(/^#+ .*$/gm)).toEqual(['# Chat', '# console.log(1)', '# Prompt 2', '# And this one?', '# report.pdf'])
    })

    it('uses the transcript of a voice prompt', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            {
                role: 'user',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'audio_transcription', text: 'What is the weather like today?' }] },
            },
            { role: 'assistant', content: text('Sunny.') },
        ]))
        expect(markdown).toContain('# What is the weather like today?\n\n**You:**\n\n[audio] What is the weather like today?')
    })

    it('escapes the excerpt so the heading shows it as written', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('Why does a*b fail with <T> in my_func [v2]?') },
            { role: 'assistant', content: text('Because.') },
        ]))
        expect(markdown).toContain('# Why does a\\*b fail with \\<T> in my_func \\[v2]?\n')
    })

    it('adds no heading for replies and nests their headings under the prompt', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('Draw a cat') },
            {
                role: 'tool',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'image_asset_pointer', asset_pointer: 'https://example.com/cat.png' }] },
            },
            { role: 'assistant', content: text('# Here it is\n\nA cat.\n\n### Details\n\nOrange.') },
        ]))
        expect(markdown.match(/^#+ .*$/gm)).toEqual(['# Chat', '# Draw a cat', '## Here it is', '#### Details'])
        expect(markdown).toContain('**ChatGPT:**\n\n![image](https://example.com/cat.png)\n\n**ChatGPT:**\n\n## Here it is')
    })

    it('nests headings in the prompt under its heading and keeps the rest as written', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('Review this README:\n\n# My *lib*\n\nUse   it.\n\n## Install') },
            { role: 'assistant', content: text('Looks good.') },
        ]))
        expect(markdown.match(/^#+ .*$/gm)).toEqual(['# Chat', '# Review this README:', '## My *lib*', '### Install'])
        expect(markdown).toContain('**You:**\n\nReview this README:\n\n## My *lib*\n\nUse   it.\n\n### Install')
    })

    it('leaves the prompt as written when the setting is off', async () => {
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('# Notes\n\nSome text') },
            { role: 'assistant', content: text('OK.') },
        ]))
        expect(markdown).toContain('#### You:\n# Notes\n\nSome text')
    })

    it('nests headings in the thinking process', async () => {
        settings.set(KEY_PROMPT_HEADINGS_ENABLED, true)
        settings.set(KEY_THINKING_ENABLED, true)
        const markdown = await exportMarkdown(conversation([
            { role: 'user', content: text('Plan a trip') },
            { role: 'assistant', content: { content_type: 'thoughts', thoughts: [{ summary: 'Plan', content: '# Options\n\nTrain or plane.' }] } },
            { role: 'assistant', content: text('Take the train.') },
        ]))
        expect(markdown.match(/^#+ .*$/gm)).toEqual(['# Chat', '# Plan a trip', '## Options'])
        expect(markdown).toContain('<summary>Thinking</summary>\n\n## Options\n\nTrain or plane.')
    })
})
