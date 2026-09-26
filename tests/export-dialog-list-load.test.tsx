// @vitest-environment happy-dom
import { render } from 'preact'
import { act } from 'preact/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiConversationItem, ApiProjectInfo } from '../src/api'

// Without the GM_* APIs, `ScriptStorage` falls back to localStorage.
vi.mock('vite-plugin-monkey/dist/client', () => ({
    unsafeWindow: globalThis,
    monkeyWindow: globalThis,
    GM_info: {},
    GM_getValue: undefined,
    GM_setValue: undefined,
    GM_deleteValue: undefined,
    GM_listValues: undefined,
    GM_addValueChangeListener: undefined,
    GM_removeValueChangeListener: undefined,
    GM_xmlhttpRequest: undefined,
}))

// ---------------------------------------------------------------------------
// API stub
// ---------------------------------------------------------------------------

function item(id: string): ApiConversationItem {
    return { id, title: id, create_time: '2026-01-01T00:00:00Z', update_time: '2026-01-01T00:00:00Z' }
}

function project(id: string, name: string): ApiProjectInfo {
    return { id, organization_id: 'org', display: { name, description: '' } }
}

function json(body: unknown) {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

function page(items: ApiConversationItem[], total: number | null = items.length) {
    return json({ items, total, limit: 100, offset: 0 })
}

function tooManyRequests(retryAfter?: string) {
    return new Response('', { status: 429, headers: retryAfter != null ? { 'Retry-After': retryAfter } : {} })
}

/** A response the test releases by hand, to hold a load open across a scope change */
function deferred() {
    let release!: (response: Response) => void
    const promise = new Promise<Response>((resolve) => {
        release = resolve
    })
    return { thunk: () => promise, release }
}

type PageSource = Response | (() => Promise<Response>)

/**
 * Serves the endpoints the dialog walks, so the component drives the real
 * fetch -> `RateLimitError` -> `onError` path rather than a stubbed callback.
 *
 * `list` and `projectList` are handed out in order, one per requested page.
 */
function stubApi({ list = [], projectList = [], projects = [] }: {
    list?: PageSource[]
    projectList?: PageSource[]
    projects?: ApiProjectInfo[]
}) {
    const mainPages = [...list]
    const projectPages = [...projectList]
    const serve = (queue: PageSource[]) => {
        const next = queue.shift() ?? page([], 0)
        return typeof next === 'function' ? next() : next
    }
    const fetchMock = vi.fn(async (input: string | URL) => {
        const url = String(input)
        if (url.includes('/api/auth/session')) return json({ accessToken: 'token' })
        if (url.includes('/accounts/check/')) return json({ accounts: {} })
        if (url.includes('/gizmos/snorlax/sidebar')) {
            return json({ cursor: null, items: projects.map(p => ({ gizmo: { gizmo: p } })) })
        }
        // Must follow the sidebar branch: a project's list path holds both segments
        if (url.includes('/conversations')) return serve(url.includes('/gizmos/') ? projectPages : mainPages)
        throw new Error(`unexpected request: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

// ---------------------------------------------------------------------------
// Rendering and queries
// ---------------------------------------------------------------------------

// The dialog portals into document.body, so queries search there.
let host: HTMLDivElement

const tick = () => new Promise(resolve => setTimeout(resolve, 0))

/** Lets queued promises, and the effects they trigger in turn, settle */
async function flush() {
    // One pass per link in fetch -> setState -> effect
    await act(tick)
    await act(tick)
    await act(tick)
}

async function openDialog() {
    // Re-imported per test: `listCache` lives at module scope in ExportDialog
    const { ExportDialog } = await import('../src/ui/ExportDialog')
    await act(async () => {
        render(
            <ExportDialog format="markdown" open onOpenChange={() => {}} />,
            host,
        )
    })
    await flush()
}

function button(label: string) {
    const found = [...document.body.querySelectorAll('button')].find(b => b.textContent?.trim() === label)
    if (!found) throw new Error(`no ${label} button: ${document.body.textContent}`)
    return found as HTMLButtonElement
}

/** The `Error: …` row the list renders, or '' when the list shows no error */
function listError() {
    const row = [...document.body.querySelectorAll('.ce-select-list .ce-select-item')]
        .find(el => el.textContent?.startsWith('Error:'))
    return row?.textContent ?? ''
}

function conversationRows() {
    return [...document.body.querySelectorAll('.ce-select-list .ce-select-item')]
        .filter(el => el.querySelector('input[type="checkbox"]'))
}

function conversationTitles() {
    return conversationRows().map(el => el.querySelector('.ce-checkbox-label')?.textContent ?? '')
}

/** The `selected / shown` counter above the list */
function counter() {
    return [...document.body.querySelectorAll('*')]
        .map(el => el.textContent?.trim() ?? '')
        .find(text => /^\d+ \/ \d+$/.test(text)) ?? ''
}

function projectSelect() {
    const select = document.body.querySelector('.ce-project-select select')
    if (!select) throw new Error('no project select')
    return select as HTMLSelectElement
}

/** preact/compat listens for `change` here; `input` is dispatched for parity with the browser */
async function fire(target: HTMLElement) {
    await act(async () => {
        target.dispatchEvent(new Event('input', { bubbles: true }))
        target.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await flush()
}

async function chooseProject(id: string) {
    const select = projectSelect()
    select.value = id
    await fire(select)
}

async function checkFirstConversation() {
    const box = conversationRows()[0]?.querySelector('input[type="checkbox"]') as HTMLInputElement | null
    if (!box) throw new Error(`no conversation to select: ${document.body.textContent}`)
    box.checked = true
    await fire(box)
}

beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
    host = document.createElement('div')
    document.body.append(host)
})

afterEach(() => {
    render(null, host)
    host.remove()
    vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('export All conversation-list load', () => {
    it('shows a rate-limited list as an error, not as an empty account', async () => {
        stubApi({ list: [tooManyRequests('60')] })

        await openDialog()

        // Without the error this looks like an account with no conversations.
        expect(counter()).toBe('0 / 0')
        expect(conversationTitles()).toEqual([])
        expect(listError()).toMatch(/rate limited/i)
        // Quoted only because the server sent Retry-After
        expect(listError()).toContain('60s')
        expect(button('Export').disabled).toBe(true)
    })

    it('keeps the conversations it did load visible and exportable under the error', async () => {
        const first = Array.from({ length: 100 }, (_, i) => item(`c${i}`))
        stubApi({ list: [page(first, 250), tooManyRequests('30')] })

        await openDialog()

        expect(conversationTitles()).toHaveLength(100)
        expect(conversationTitles()).toContain('c0')
        expect(listError()).toMatch(/rate limited/i)

        await checkFirstConversation()
        expect(button('Export').disabled).toBe(false)
    })

    it('does not quote our own fallback as the wait the server asked for', async () => {
        // Without Retry-After, the 30s wait is our fallback, not the server's.
        stubApi({ list: [tooManyRequests()] })

        await openDialog()

        expect(listError()).toMatch(/rate limited/i)
        expect(listError()).not.toContain('30')
    })

    it('clears the error when the next load succeeds', async () => {
        stubApi({
            list: [tooManyRequests('60')],
            projectList: [json({ items: [item('p1'), item('p2')], cursor: null })],
            projects: [project('proj-1', 'Kitchen')],
        })

        await openDialog()
        expect(listError()).toMatch(/rate limited/i)

        await chooseProject('proj-1')

        expect(listError()).toBe('')
        expect(conversationTitles()).toEqual(['p1', 'p2'])
    })

    it('does not let a superseded load write over the current scope', async () => {
        const held = deferred()
        stubApi({
            list: [held.thunk],
            projectList: [json({ items: [item('p1')], cursor: null })],
            projects: [project('proj-1', 'Kitchen')],
        })

        await openDialog()
        // The main list is still in flight when the scope changes
        expect(conversationTitles()).toEqual([])

        await chooseProject('proj-1')
        expect(conversationTitles()).toEqual(['p1'])

        held.release(tooManyRequests('60'))
        await flush()

        // The abandoned load's failure belongs to a scope no longer on screen
        expect(listError()).toBe('')
        expect(conversationTitles()).toEqual(['p1'])
    })
})
