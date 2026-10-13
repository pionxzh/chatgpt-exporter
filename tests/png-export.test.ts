// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    snapdom: vi.fn(),
    downloadFile: vi.fn(),
    alert: vi.fn(),
}))

vi.mock('@zumer/snapdom', () => ({ snapdom: mocks.snapdom }))
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.mock('../src/i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../src/utils/download', () => ({
    downloadFile: mocks.downloadFile,
    getFileNameWithFormat: (_format: string, ext: string) => `conversation.${ext}`,
}))
vi.mock('../src/utils/utils', async importOriginal => ({
    ...await importOriginal<typeof import('../src/utils/utils')>(),
    sleep: async () => {},
}))

const { exportToPng } = await import('../src/exporter/image')

// happy-dom has no layout. Model the browser's zero-sized boxes throughout a
// display:none subtree, including the cached route's otherwise valid turns.
function measurement(element: HTMLElement, attribute: string, fallback: number) {
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor.hidden || ancestor.style.display === 'none' || getComputedStyle(ancestor).display === 'none') return 0
    }
    return Number(element.getAttribute(attribute) ?? fallback)
}

function mountThread(name: string, hidden = false) {
    const shell = document.createElement('section')
    if (hidden) shell.style.setProperty('display', 'none', 'important')
    shell.innerHTML = `
        <div data-app-action-timeline-scroll data-scroll-height="1000" data-client-height="400">
            <div data-chatgpt-conversation-selection-target data-height="300">
                <div data-turn-key="${name}" data-height="300">
                    <div data-chatgpt-search-message-ids="${name}">${name} message</div>
                </div>
            </div>
        </div>
    `
    document.body.append(shell)
    const scrollRoot = shell.firstElementChild as HTMLElement
    let scrollTop = 120
    Object.defineProperty(scrollRoot, 'scrollTop', {
        get: () => scrollTop,
        set: (value: number) => { scrollTop = Math.max(0, Math.min(600, value)) },
    })
    return scrollRoot
}

beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', mocks.alert)
    document.documentElement.setAttribute('data-theme', 'light')
    Object.defineProperty(document, 'fonts', {
        configurable: true,
        value: { load: async () => [] },
    })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
        return measurement(this, 'data-width', 800)
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
        return measurement(this, 'data-height', 100)
    })
    vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function () {
        return measurement(this as HTMLElement, 'data-scroll-height', 300)
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function () {
        return measurement(this, 'data-client-height', 300)
    })
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (!(this instanceof HTMLElement)) return new DOMRect(0, 0, 0, 0)
        return new DOMRect(0, 0, this.offsetWidth, this.offsetHeight)
    })
    mocks.snapdom.mockResolvedValue({
        meta: { vbW: 800, vbH: 300 },
        toCanvas: async () => ({
            getContext: () => ({ imageSmoothingEnabled: true }),
            toBlob: (callback: BlobCallback) => callback(new Blob(['png'], { type: 'image/png' })),
        }),
    })
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('data-theme')
    Reflect.deleteProperty(document, 'fonts')
})

describe('png conversation selection', () => {
    it('exports a visible redesigned conversation and restores the page', async () => {
        const scrollRoot = mountThread('active')

        expect(await exportToPng('{title}')).toBe(true)

        expect(mocks.snapdom).toHaveBeenCalledTimes(1)
        expect(mocks.snapdom.mock.calls[0][0].textContent).toContain('active message')
        expect(mocks.downloadFile).toHaveBeenCalledOnce()
        expect(mocks.alert).not.toHaveBeenCalled()
        expect(scrollRoot.scrollTop).toBe(120)
        expect(document.querySelector('[data-chatgpt-exporter-screenshot-root]')).toBeNull()
    })

    it('uses specific local CJK font faces for each screenshot weight', async () => {
        mountThread('active')

        expect(await exportToPng('{title}')).toBe(true)

        const captured = mocks.snapdom.mock.calls[0][0] as HTMLElement
        const css = captured.querySelector(':scope > style')?.textContent
        expect(css).toMatch(/src: local\("PingFangTC-Regular"\);\s+font-weight: 100 400;/)
        expect(css).toMatch(/src: local\("PingFangTC-Medium"\);\s+font-weight: 500;/)
        expect(css).toMatch(/src: local\("PingFangTC-Semibold"\);\s+font-weight: 600 900;/)
        expect(css).not.toContain('local("PingFang TC")')
    })

    it('skips a cached hidden conversation before the active redesigned conversation', async () => {
        mountThread('cached', true)
        const scrollRoot = mountThread('active')

        expect(await exportToPng('{title}')).toBe(true)

        expect(mocks.snapdom).toHaveBeenCalledTimes(1)
        const captured = mocks.snapdom.mock.calls[0][0] as HTMLElement
        expect(captured.textContent).toContain('active message')
        expect(captured.textContent).not.toContain('cached message')
        expect(mocks.downloadFile).toHaveBeenCalledOnce()
        expect(mocks.alert).not.toHaveBeenCalled()
        expect(scrollRoot.scrollTop).toBe(120)
        expect(document.querySelector('[data-chatgpt-exporter-screenshot-root]')).toBeNull()
    })

    it('does not export a cached hidden conversation when there is no active thread', async () => {
        mountThread('cached', true)

        expect(await exportToPng('{title}')).toBe(false)

        expect(mocks.snapdom).not.toHaveBeenCalled()
        expect(mocks.downloadFile).not.toHaveBeenCalled()
        expect(mocks.alert).toHaveBeenCalledWith('Please start a conversation first')
        expect(document.querySelector('[data-chatgpt-exporter-screenshot-root]')).toBeNull()
    })

    it('still exports a legacy conversation', async () => {
        document.body.innerHTML = `
            <div id="thread">
                <div>
                    <article data-testid="conversation-turn-0">User message</article>
                    <article data-testid="conversation-turn-1">Assistant message</article>
                </div>
            </div>
        `

        expect(await exportToPng('{title}')).toBe(true)

        expect(mocks.snapdom).toHaveBeenCalledTimes(1)
        expect(mocks.snapdom.mock.calls[0][0].textContent).toContain('Assistant message')
        expect(mocks.downloadFile).toHaveBeenCalledOnce()
        expect(mocks.alert).not.toHaveBeenCalled()
        expect(document.querySelector('[data-chatgpt-exporter-screenshot-root]')).toBeNull()
    })
})

describe('png CJK metrics', () => {
    // Stand in for the SVG probe: the image loads, and the painted box ends
    // at `imageWidth` CSS px. The probe measures 800px on the page.
    function stubProbeImage(imageWidth: number) {
        vi.stubGlobal('Image', class {
            onload: (() => void) | null = null
            onerror: (() => void) | null = null
            #src = ''
            get src() { return this.#src }
            set src(url: string) {
                this.#src = url
                setTimeout(() => this.onload?.())
            }
        })
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
            // The probe image is 40px wider than the 800px page width.
            const scale = this.width / 840
            return {
                drawImage: () => {},
                getImageData: (_x: number, _y: number, width: number) => {
                    const data = new Uint8ClampedArray(width * 4)
                    for (let x = 0; x < Math.min(width, imageWidth * scale); x++) data.set([255, 0, 0, 255], x * 4)
                    return { data }
                },
            } as unknown as CanvasRenderingContext2D
        } as typeof HTMLCanvasElement.prototype.getContext)
    }

    function exportWithFont() {
        mountThread('active')
        document.querySelector<HTMLElement>('[data-chatgpt-conversation-selection-target]')!.style.fontFamily = 'system-ui'
        return exportToPng('{title}')
    }

    it('keeps the page font when the image lays out CJK text at the page width', async () => {
        stubProbeImage(800)

        expect(await exportWithFont()).toBe(true)

        const captured = mocks.snapdom.mock.calls[0][0] as HTMLElement
        expect(captured.style.fontFamily).not.toContain('chatgpt-exporter-cjk')
    })

    it('swaps in the untracked CJK face when the image lays out CJK text wider', async () => {
        stubProbeImage(808.5)

        expect(await exportWithFont()).toBe(true)

        const captured = mocks.snapdom.mock.calls[0][0] as HTMLElement
        expect(captured.style.fontFamily).toContain('chatgpt-exporter-cjk')
    })
})
