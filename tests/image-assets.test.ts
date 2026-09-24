import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationWithId } from '../src/api'

// The userscript client touches `document` and constants read `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { cookie: '' })

const imageStore = vi.hoisted(() => new Map<string, string>())
vi.mock('../src/utils/imageCache', () => ({
    getCachedImage: async (pointer: string) => imageStore.get(pointer) ?? null,
    setCachedImage: async (pointer: string, dataUrl: string) => { imageStore.set(pointer, dataUrl) },
}))
// Node has no FileReader
vi.mock('../src/utils/dom', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/dom')>(),
    blobToDataURL: async () => 'data:application/octet-stream;base64,AAAA',
}))

const fetchMock = vi.fn(async (url: string) => {
    if (url.includes('/api/auth/session')) return Response.json({ accessToken: 'token' })
    if (url.includes('/accounts/check')) return Response.json({ accounts: {} })
    if (url.includes('/files/download/')) return Response.json({ status: 'success', download_url: 'https://files.example/image' })
    if (url === 'https://files.example/image') return new Response('img', { headers: { 'content-type': 'image/png' } })
    throw new Error(`unexpected fetch: ${url}`)
})
vi.stubGlobal('fetch', fetchMock)

const { withImageAssets } = await import('../src/api')

function conversationWithImage(pointer: string): ApiConversationWithId {
    return {
        id: 'chat',
        title: 'chat',
        create_time: 0,
        update_time: 0,
        current_node: 'node',
        mapping: {
            node: {
                id: 'node',
                children: [],
                message: {
                    id: 'node',
                    author: { role: 'user' },
                    content: { content_type: 'multimodal_text', parts: [{ content_type: 'image_asset_pointer', asset_pointer: pointer }] },
                },
            },
        },
    } as unknown as ApiConversationWithId
}

function pointerOf(conversation: ApiConversationWithId) {
    return (conversation.mapping.node.message!.content as any).parts[0].asset_pointer
}

function imageRequests() {
    return fetchMock.mock.calls.filter(([url]) => url.includes('/files/download/')).length
}

describe('withImageAssets', () => {
    beforeEach(() => {
        imageStore.clear()
        fetchMock.mockClear()
    })

    it('returns a copy with data uris and leaves the raw conversation untouched', async () => {
        const raw = conversationWithImage('sediment://file_1')

        const result = await withImageAssets(raw)

        expect(pointerOf(result)).toBe('data:image/png;base64,AAAA')
        expect(pointerOf(raw)).toBe('sediment://file_1')
    })

    it('stores downloaded images and serves them from the cache next time', async () => {
        await withImageAssets(conversationWithImage('sediment://file_2'))
        expect(imageRequests()).toBe(1)
        expect(imageStore.get('sediment://file_2')).toBe('data:image/png;base64,AAAA')

        const again = await withImageAssets(conversationWithImage('sediment://file_2'))
        expect(imageRequests()).toBe(1)
        expect(pointerOf(again)).toBe('data:image/png;base64,AAAA')
    })
})
