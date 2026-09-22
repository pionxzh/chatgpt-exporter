import { describe, expect, it, vi } from 'vitest'

// The userscript client touches `document` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))

const { getChatIdFromUrl } = await import('../src/page')

const id = '00000000-0000-0000-0000-000000000001'

describe('getChatIdFromUrl', () => {
    it.each<[string, string | null]>([
        [`/c/${id}`, id],
        [`/share/${id}`, id],
        [`/share/e/${id}`, id],
        [`/share/team/${id}`, id],
        [`/share/enterprise/${id}/continue`, id],
        [`/g/g-example/c/${id}`, id],
        ['/share/e/not-a-uuid', null],
        ['/share/e/', null],
        ['/share/e', null],
        ['/share/', null],
        ['/settings', null],
    ])('%s', (path, expected) => {
        vi.stubGlobal('location', new URL(path, 'https://chatgpt.com'))
        expect(getChatIdFromUrl()).toBe(expected)
    })
})
