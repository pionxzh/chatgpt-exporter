import { readFileSync } from 'node:fs'
import JSZip from 'jszip'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

const downloadFile = vi.hoisted(() => vi.fn())

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: globalThis }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { documentElement: { lang: 'en' } })

vi.mock('../src/i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../src/page', () => ({ getUserAvatar: async () => '', checkIfConversationStarted: () => true }))
vi.mock('../src/temporaryChat', () => ({ checkIfTemporaryChatIsExportable: () => true }))
vi.mock('../src/utils/storage', () => ({ ScriptStorage: { get: () => null } }))
vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))

const { canSaveToFolder, pickExportFolder, saveZip, withChatId } = await import('../src/utils/exportTarget')
const { exportAllToMarkdown } = await import('../src/exporter/markdown')

/** An in-memory folder with the parts of `FileSystemDirectoryHandle` the export uses */
function fakeFolder(options: { failOn?: string } = {}) {
    const files = new Map<string, string>()
    const aborted: string[] = []
    const directory = (prefix: string): FileSystemDirectoryHandle => ({
        getDirectoryHandle: async (name: string) => directory(`${prefix}${name}/`),
        getFileHandle: async (name: string) => ({
            createWritable: async () => {
                const path = `${prefix}${name}`
                let data: Blob | undefined
                return {
                    write: async (chunk: Blob) => {
                        if (path === options.failOn) throw new Error('disk full')
                        data = chunk
                    },
                    close: async () => { files.set(path, await data!.text()) },
                    abort: async () => { aborted.push(path) },
                }
            },
        }),
    }) as unknown as FileSystemDirectoryHandle
    return { root: directory(''), files, aborted }
}

function zipOf(entries: Record<string, string>) {
    const zip = new JSZip()
    for (const [path, content] of Object.entries(entries)) zip.file(path, content)
    return zip
}

afterEach(() => {
    downloadFile.mockClear()
    delete (globalThis as { showDirectoryPicker?: unknown }).showDirectoryPicker
})

describe('file names in a folder', () => {
    it('adds the chat id when the format has none', () => {
        expect(withChatId('ChatGPT-{title}')).toBe('ChatGPT-{title}-{chat_id}')
        expect(withChatId('{chat_id}-{title}')).toBe('{chat_id}-{title}')
    })
})

describe('saving to a folder', () => {
    it('writes every file, with folders, in place of older copies', async () => {
        const folder = fakeFolder()
        folder.files.set('a.md', 'old')

        await saveZip(zipOf({ 'a.md': 'new', 'assets/img.png': 'png' }), 'unused.zip', { kind: 'folder', directory: folder.root })

        expect(Object.fromEntries(folder.files)).toEqual({ 'a.md': 'new', 'assets/img.png': 'png' })
        expect(downloadFile).not.toHaveBeenCalled()
    })

    it('keeps the older copy when a write fails', async () => {
        const folder = fakeFolder({ failOn: 'b.md' })
        folder.files.set('b.md', 'old')

        await expect(saveZip(zipOf({ 'b.md': 'new' }), 'unused.zip', { kind: 'folder', directory: folder.root })).rejects.toThrow('disk full')

        expect(folder.files.get('b.md')).toBe('old')
        expect(folder.aborted).toEqual(['b.md'])
    })

    it('downloads a ZIP otherwise', async () => {
        await saveZip(zipOf({ 'a.md': 'text' }), 'chatgpt.zip')

        const [name, type, blob] = downloadFile.mock.calls[0]
        expect([name, type]).toEqual(['chatgpt.zip', 'application/zip'])
        const zip = await JSZip.loadAsync(await (blob as Blob).arrayBuffer())
        expect(await zip.file('a.md')!.async('string')).toBe('text')
    })

    it('writes each conversation of a Markdown export to its own file', async () => {
        const conversation = JSON.parse(readFileSync(new URL('./fixtures/canvas-document-rewrite.json', import.meta.url), 'utf8')) as ApiConversationWithId
        const folder = fakeFolder()

        await exportAllToMarkdown(withChatId('ChatGPT-{title}'), [conversation], [], undefined, 1, 1, { kind: 'folder', directory: folder.root })

        expect([...folder.files.keys()]).toEqual([`ChatGPT-${conversation.title}-${conversation.id}.md`])
        expect(folder.files.get(`ChatGPT-${conversation.title}-${conversation.id}.md`)).toContain('question 1')
    })
})

describe('picking a folder', () => {
    it('is offered only where the browser can write to a folder', () => {
        expect(canSaveToFolder()).toBe(false)
        Object.assign(globalThis, { showDirectoryPicker: async () => ({}) })
        expect(canSaveToFolder()).toBe(true)
    })

    it('returns null when the picker is closed', async () => {
        Object.assign(globalThis, {
            showDirectoryPicker: async () => {
                throw new DOMException('The user aborted a request.', 'AbortError')
            },
        })
        expect(await pickExportFolder()).toBeNull()
    })
})
