// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'

// The userscript client touches `document` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))

const { checkIfConversationStarted, getChatIdFromUrl } = await import('../src/page')

const id = '00000000-0000-0000-0000-000000000001'

afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
})

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

describe('checkIfConversationStarted', () => {
    it.each<[string, string, boolean]>([
        ['legacy conversation', '<article data-testid="conversation-turn-0">Hello</article>', true],
        ['redesigned conversation', '<div data-chatgpt-conversation-selection-target="true"><div data-chatgpt-search-message-ids="message-1">Hello</div></div>', true],
        ['new chat', '<main><textarea placeholder="Ask ChatGPT"></textarea></main>', false],
        ['loading conversation', '<div data-chatgpt-conversation-selection-target="true"></div>', false],
        ['message outside the conversation', '<aside data-chatgpt-search-message-ids="message-1">Search result</aside>', false],
    ])('%s', (_name, html, expected) => {
        document.body.innerHTML = html
        expect(checkIfConversationStarted()).toBe(expected)
    })
})
