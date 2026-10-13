import JSZip from 'jszip'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'
import type { ImageMode } from '../src/ui/SettingContext'

const downloadFile = vi.hoisted(() => vi.fn())
const settings = vi.hoisted(() => ({ imageMode: null as ImageMode | null }))

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { documentElement: { lang: 'en' } })

vi.mock('../src/i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../src/page', () => ({}))
vi.mock('../src/temporaryChat', () => ({}))
vi.mock('../src/utils/storage', () => ({
    ScriptStorage: { get: (key: string) => key === 'exporter:image_mode' ? settings.imageMode : null },
}))
vi.mock('../src/utils/download', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/download')>(),
    downloadFile,
}))

const { exportAllToMarkdown } = await import('../src/exporter/markdown')
const { exportAllToJson } = await import('../src/exporter/json')

const PNG = 'data:image/png;base64,iVBORw0KGgo='
const JPEG = 'data:image/jpeg;base64,/9j/4AAQ'

function conversation(id: string, sources: { upload: string, output?: string }): ApiConversationWithId {
    const mapping: Record<string, unknown> = {
        m0: {
            id: 'm0',
            parent: null,
            children: sources.output ? ['m1'] : [],
            message: {
                id: 'm0',
                author: { role: 'user' },
                recipient: 'all',
                content: { content_type: 'multimodal_text', parts: [{ content_type: 'image_asset_pointer', asset_pointer: sources.upload }, 'look'] },
                metadata: {},
            },
        },
    }
    if (sources.output) {
        mapping.m1 = {
            id: 'm1',
            parent: 'm0',
            children: [],
            message: {
                id: 'm1',
                author: { role: 'tool' },
                recipient: 'all',
                content: { content_type: 'execution_output', text: '' },
                metadata: { aggregate_result: { messages: [{ message_type: 'image', image_url: sources.output }] } },
            },
        }
    }
    return {
        id,
        title: id,
        create_time: 1,
        update_time: 2,
        current_node: sources.output ? 'm1' : 'm0',
        mapping,
    } as unknown as ApiConversationWithId
}

async function exportZip(conversations: ApiConversationWithId[], exportAll: typeof exportAllToMarkdown = exportAllToMarkdown) {
    downloadFile.mockClear()
    await exportAll('{title}', conversations)
    const [, , blob] = downloadFile.mock.calls[0]
    return JSZip.loadAsync(await blob.arrayBuffer())
}

describe('exportAllToMarkdown image modes', () => {
    beforeEach(() => {
        settings.imageMode = null
    })

    it('embeds data uris by default', async () => {
        const zip = await exportZip([conversation('a', { upload: PNG })])
        expect(await zip.file('a.md')!.async('string')).toContain(`![image](${PNG})`)
    })

    it('replaces images with a placeholder when omitted', async () => {
        settings.imageMode = 'omit'
        const zip = await exportZip([conversation('a', { upload: PNG, output: JPEG })])
        const markdown = await zip.file('a.md')!.async('string')
        expect(markdown).toContain('[image]\nlook')
        expect(markdown).not.toContain('data:')
        expect(markdown).not.toContain('![image]')
    })

    it('moves images into a shared assets folder', async () => {
        settings.imageMode = 'files'
        const a = conversation('a', { upload: PNG, output: JPEG })
        const b = conversation('b', { upload: PNG })
        const zip = await exportZip([a, b])

        const assets = Object.keys(zip.files).filter(name => name.startsWith('assets/') && !zip.files[name].dir)
        expect(assets).toHaveLength(2)
        const png = assets.find(name => name.endsWith('.png'))!
        const jpg = assets.find(name => name.endsWith('.jpg'))!
        expect(png).toMatch(/^assets\/image-[0-9a-f]{16}\.png$/)
        expect(await zip.file(png)!.async('base64')).toBe('iVBORw0KGgo=')

        const markdownA = await zip.file('a.md')!.async('string')
        expect(markdownA).toContain(`![image](${png})`)
        expect(markdownA).toContain(`![image](${jpg})`)
        expect(markdownA).not.toContain('data:')
        // The same image in another conversation points to the same file
        expect(await zip.file('b.md')!.async('string')).toContain(`![image](${png})`)

        // The input conversations are not touched
        expect((a.mapping.m0.message!.content as any).parts[0].asset_pointer).toBe(PNG)
    })

    it('keeps sources that are not data uris', async () => {
        settings.imageMode = 'files'
        const zip = await exportZip([conversation('a', { upload: 'sediment://file_1' })])
        expect(Object.keys(zip.files).some(name => name.startsWith('assets/'))).toBe(false)
        expect(await zip.file('a.md')!.async('string')).toContain('![image](sediment://file_1)')
    })
})

describe('exportAllToJson image modes', () => {
    beforeEach(() => {
        settings.imageMode = null
    })

    async function exportJson(conversations: ApiConversationWithId[]) {
        const zip = await exportZip(conversations, exportAllToJson)
        const json = async (name: string) => JSON.parse(await zip.file(name)!.async('string')) as ApiConversationWithId
        return { zip, json }
    }

    const uploadOf = (conv: ApiConversationWithId) => (conv.mapping.m0.message!.content as any).parts[0].asset_pointer
    const outputOf = (conv: ApiConversationWithId) => (conv.mapping.m1.message!.metadata as any).aggregate_result.messages[0].image_url

    it('keeps data uris by default', async () => {
        const { zip, json } = await exportJson([conversation('a', { upload: PNG })])
        expect(uploadOf(await json('a.json'))).toBe(PNG)
        expect(Object.keys(zip.files)).toEqual(['a.json'])
    })

    it('moves images into a shared assets folder', async () => {
        settings.imageMode = 'files'
        const a = conversation('a', { upload: PNG, output: JPEG })
        const { zip, json } = await exportJson([a, conversation('b', { upload: PNG })])

        const exportedA = await json('a.json')
        expect(uploadOf(exportedA)).toMatch(/^assets\/image-[0-9a-f]{16}\.png$/)
        expect(outputOf(exportedA)).toMatch(/^assets\/image-[0-9a-f]{16}\.jpg$/)
        expect(uploadOf(await json('b.json'))).toBe(uploadOf(exportedA))
        expect(await zip.file(uploadOf(exportedA))!.async('base64')).toBe('iVBORw0KGgo=')
        expect(await zip.file(outputOf(exportedA))!.async('base64')).toBe('/9j/4AAQ')
        expect(uploadOf(a)).toBe(PNG)
    })
})
