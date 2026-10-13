// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The userscript client touches `document` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))

const { checkIfConversationStarted, getChatIdFromUrl } = await import('../src/page')

const id = '00000000-0000-0000-0000-000000000001'

// happy-dom has no layout: elements inside a display:none or hidden
// subtree count as zero-sized, everything else as visible.
function isHidden(element: HTMLElement) {
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor.hidden || ancestor.style.display === 'none' || getComputedStyle(ancestor).display === 'none') return true
    }
    return false
}

beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
        return isHidden(this) ? 0 : 100
    })
})

afterEach(() => {
    vi.restoreAllMocks()
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
        ['cached hidden legacy conversation', '<div style="display: none"><article data-testid="conversation-turn-0">Hello</article></div>', false],
        ['cached hidden redesigned conversation', '<div hidden><div data-chatgpt-conversation-selection-target="true"><div data-chatgpt-search-message-ids="message-1">Hello</div></div></div>', false],
    ])('%s', (_name, html, expected) => {
        document.body.innerHTML = html
        expect(checkIfConversationStarted()).toBe(expected)
    })
})
