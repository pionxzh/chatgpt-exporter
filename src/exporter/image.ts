import type { SnapdomPlugin } from '@zumer/snapdom'
import { snapdom } from '@zumer/snapdom'
import JSZip from 'jszip'
import i18n from '../i18n'
import { checkIfConversationStarted, getChatIdFromUrl } from '../page'
import { getBase64FromImg } from '../utils/dom'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { Effect } from '../utils/effect'
import { encodePng } from '../utils/png'
import { getColorScheme, sleep } from '../utils/utils'

const MAX_SCREENSHOT_DIMENSION = 16_000
const MAX_TILE_PIXELS = 16_000_000

function scrollElementWithinRoot(scrollRoot: HTMLElement, target: HTMLElement, block: 'start' | 'center') {
    const scrollRect = scrollRoot.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const offset = targetRect.top - scrollRect.top
    const alignment = block === 'center' ? (scrollRoot.clientHeight - targetRect.height) / 2 : 0
    const requestedScrollTop = Math.max(0, Math.min(
        scrollRoot.scrollHeight - scrollRoot.clientHeight,
        scrollRoot.scrollTop + offset - alignment,
    ))

    scrollRoot.scrollTop = requestedScrollTop
    scrollRoot.dispatchEvent(new Event('scroll', { bubbles: true }))
}

function findCommonAncestor(elements: HTMLElement[]) {
    let ancestor = elements[0]?.parentElement
    while (ancestor && !elements.every(element => ancestor!.contains(element))) {
        ancestor = ancestor.parentElement
    }
    return ancestor
}

// Redesigned layout: a windowed list inside `[data-app-action-timeline-scroll]`.
// Only turns near the viewport are mounted, and older history loads in pages
// while a spinner sits above the list.
const REDESIGNED_THREAD_SELECTOR = '[data-chatgpt-conversation-selection-target]'
const REDESIGNED_SCROLL_ROOT_SELECTOR = '[data-app-action-timeline-scroll]'
const REDESIGNED_TURN_SELECTOR = '[data-turn-key]'
const HISTORY_SPINNER_SELECTOR = ':scope > div > [role="status"]'
const HISTORY_LOAD_ATTEMPTS = 120

function scrollRootTo(scrollRoot: HTMLElement, scrollTop: number) {
    scrollRoot.scrollTop = scrollTop
    scrollRoot.dispatchEvent(new Event('scroll', { bubbles: true }))
}

/**
 * The thread scroller is reversed: `scrollTop` is 0 at the bottom and goes
 * negative towards the top. Work in distance from the top instead.
 */
function createScrollPosition(scrollRoot: HTMLElement) {
    const initialScrollTop = scrollRoot.scrollTop
    scrollRoot.scrollTop = -1
    const reversed = initialScrollTop < 0 || scrollRoot.scrollTop < 0
    scrollRoot.scrollTop = initialScrollTop

    const max = () => Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight)
    return {
        reversed,
        max,
        get: () => reversed ? scrollRoot.scrollTop + max() : scrollRoot.scrollTop,
        set: (top: number) => scrollRootTo(scrollRoot, reversed ? top - max() : top),
    }
}

const IMAGE_LOAD_TIMEOUT = 5000

function waitForImages(root: HTMLElement) {
    const pending = Array.from(root.querySelectorAll('img')).filter(img => !img.complete)
    if (pending.length === 0) return Promise.resolve()

    return Promise.race([
        Promise.all(pending.map(img => new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
        }))),
        sleep(IMAGE_LOAD_TIMEOUT),
    ])
}

/**
 * Generated images and attachments use blob URLs that ChatGPT revokes once
 * the turn unmounts, so copy their pixels while the live image still has them.
 */
function inlineBlobImages(live: HTMLElement, snapshot: HTMLElement) {
    const snapshotImages = snapshot.querySelectorAll('img')
    live.querySelectorAll('img').forEach((img, index) => {
        const target = snapshotImages[index]
        if (!target || !img.currentSrc.startsWith('blob:') || !img.complete || img.naturalWidth === 0) return

        try {
            const dataUrl = getBase64FromImg(img)
            if (!dataUrl) return
            target.removeAttribute('srcset')
            target.src = dataUrl
        }
        catch (error) {
            console.warn('[ChatGPT Exporter:screenshot] failed to copy image', error)
        }
    })
}

/**
 * User bubbles shrink to fit their text, so any sub-pixel difference in the
 * rasterized text wraps a line that the bubble's fixed height then clips.
 * Let the bubble and its ancestors follow the rendered text instead.
 */
const growUserBubbles: SnapdomPlugin = {
    name: 'chatgpt-exporter-grow-user-bubbles',
    afterClone({ clone: root, nodeMap }) {
        nodeMap?.forEach((source, clone) => {
            if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement)) return
            if (!source.matches('.bg-user-message')) return

            for (let el: HTMLElement | null = clone; el && el !== root; el = el.parentElement) {
                el.style.height = 'auto'
            }
            clone.querySelectorAll<HTMLElement>('*').forEach((child) => {
                if (!(child instanceof HTMLImageElement)) child.style.height = 'auto'
            })
        })
    },
}

const CJK_FONT_FAMILY = 'chatgpt-exporter-cjk'
const CJK_UNICODE_RANGE = 'U+2E80-2FFF, U+3000-303F, U+3040-30FF, U+3100-31FF, U+3400-4DBF, U+4E00-9FFF, U+F900-FAFF, U+FE30-FE4F, U+FF00-FFEF'
const CJK_FONT_FACES = [
    { weight: '100 400', names: ['PingFang TC', 'PingFangTC-Regular'] },
    { weight: '500', names: ['PingFangTC-Medium'] },
    { weight: '600 900', names: ['PingFangTC-Semibold'] },
].map(({ weight, names }) => `
    @font-face {
        font-family: "${CJK_FONT_FAMILY}";
        src: ${names.map(name => `local("${name}")`).join(', ')};
        font-weight: ${weight};
        unicode-range: ${CJK_UNICODE_RANGE};
    }
`).join('')

/**
 * On macOS, `system-ui` tracks its CJK fallback tighter on the page than
 * inside the SVG image (15.34px vs 16px per glyph at 16px). Every
 * shrink-to-fit box, such as a user bubble, is frozen at its page width, so
 * the wider text in the image wraps its last character or gets truncated.
 * Lay the copy out with an untracked CJK font so both sides agree. Where the
 * font is missing, the face does not load and the original stack applies.
 * `root` must be attached and include `CJK_FONT_FACES`.
 */
async function matchCjkMetrics(root: HTMLElement) {
    // Prepend the face to every element that sets its own font stack.
    const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
    const families = new Map(elements.map(el => [el, getComputedStyle(el).fontFamily]))
    elements.forEach((el) => {
        const family = families.get(el)
        if (!family || (el !== root && family === families.get(el.parentElement!))) return
        el.style.fontFamily = `"${CJK_FONT_FAMILY}", ${family}`
    })

    await Promise.all(['400', '500', '600'].map(weight => document.fonts.load(`${weight} 16px "${CJK_FONT_FAMILY}"`, '中').catch(() => [])))
}

/** One emoji as drawn: presentation, modifiers, ZWJ sequences, flags and keycaps. */
const EMOJI_PATTERN = /[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]️⃣|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)(?:[\u{1F3FB}-\u{1F3FF}]|️|‍(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️?))*/gu

/**
 * Chrome gives emoji below 24px a wider advance inside the SVG image than on
 * the page (20px vs 16px at 16px), while the glyph itself stays the same
 * size. The extra room pushes the following text into the next glyph or
 * swallows the space after the emoji. Pin every emoji to its page width.
 * `root` must be attached.
 */
function pinEmojiWidths(root: HTMLElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        EMOJI_PATTERN.lastIndex = 0
        if (EMOJI_PATTERN.test(node.nodeValue ?? '') && !node.parentElement?.closest('style, script, svg')) {
            textNodes.push(node as Text)
        }
    }

    const wrappers: HTMLSpanElement[] = []
    textNodes.forEach((node) => {
        const text = node.nodeValue ?? ''
        const fragment = document.createDocumentFragment()
        let last = 0
        for (const match of text.matchAll(EMOJI_PATTERN)) {
            fragment.append(text.slice(last, match.index))
            const wrapper = document.createElement('span')
            wrapper.textContent = match[0]
            fragment.append(wrapper)
            wrappers.push(wrapper)
            last = match.index + match[0].length
        }
        fragment.append(text.slice(last))
        node.replaceWith(fragment)
    })

    // Read every width before writing any, so layout runs once.
    const widths = wrappers.map(wrapper => wrapper.getBoundingClientRect().width)
    wrappers.forEach((wrapper, index) => {
        Object.assign(wrapper.style, {
            display: 'inline-block',
            width: `${widths[index]}px`,
            textIndent: '0',
        })
    })
}

const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/** Images at or below this rendered size are favicons. */
const FAVICON_MAX_SIZE = 40

function toSvgDataUrl(svg: string) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/** The site a favicon belongs to. Google's favicon service names it in `url`. */
function getFaviconHost(src: string) {
    try {
        const url = new URL(src)
        const site = url.searchParams.get('url') || url.searchParams.get('domain')
        return new URL(site && /^https?:/.test(site) ? site : `https://${site || url.hostname}`).hostname.replace(/^www\./, '')
    }
    catch {
        return ''
    }
}

/**
 * Stand-in for an image whose host sends no CORS headers, so its pixels
 * cannot be read. Favicons become the site's initial; other images become a
 * neutral tile with a picture icon, at the size they were rendered.
 */
function createImagePlaceholder(target: HTMLImageElement, src: string, isDarkMode: boolean) {
    const rect = target.getBoundingClientRect()
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)
    if (width === 0 || height === 0) return TRANSPARENT_PIXEL

    const fill = isDarkMode ? '#303030' : '#ececec'
    const ink = isDarkMode ? '#8f8f8f' : '#a3a3a3'

    if (Math.max(width, height) <= FAVICON_MAX_SIZE) {
        const initial = getFaviconHost(src).charAt(0).toUpperCase()
        const size = Math.min(width, height)
        return toSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
            + `<circle cx="${width / 2}" cy="${height / 2}" r="${size / 2}" fill="${fill}"/>`
            + `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${size * 0.55}" font-weight="600" fill="${ink}">${initial}</text>`
            + `</svg>`)
    }

    // A 24-unit picture icon: a frame, a sun and a hill.
    const iconSize = Math.max(16, Math.min(48, Math.min(width, height) * 0.3))
    const scale = iconSize / 24
    const x = (width - iconSize) / 2
    const y = (height - iconSize) / 2
    return toSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
        + `<rect width="${width}" height="${height}" fill="${fill}"/>`
        + `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${ink}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">`
        + `<rect x="3" y="4" width="18" height="16" rx="2.5"/>`
        + `<circle cx="9" cy="9.5" r="1.75"/>`
        + `<path d="M3.5 17.5l5-5 3.5 3.5 2.5-2.5 6 6"/>`
        + `</g></svg>`)
}

const EXTERNAL_IMAGE_CONCURRENCY = 6
/** Encode images at this multiple of their rendered size. */
const EXTERNAL_IMAGE_SCALE = 2

function loadCorsImage(url: string) {
    return new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image()
        const timer = setTimeout(() => resolve(null), IMAGE_LOAD_TIMEOUT)
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            clearTimeout(timer)
            resolve(img)
        }
        img.onerror = () => {
            clearTimeout(timer)
            resolve(null)
        }
        img.src = url
    })
}

function encodeImage(source: HTMLImageElement, target: HTMLImageElement) {
    // Keep the aspect ratio and only shrink, so the layout does not change.
    const rect = target.getBoundingClientRect()
    const ratio = rect.width > 0 && rect.height > 0
        ? Math.min(1, Math.max(
                rect.width * EXTERNAL_IMAGE_SCALE / source.naturalWidth,
                rect.height * EXTERNAL_IMAGE_SCALE / source.naturalHeight,
            ))
        : 1
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(source.naturalWidth * ratio))
    canvas.height = Math.max(1, Math.round(source.naturalHeight * ratio))
    const context = canvas.getContext('2d')
    if (!context) return null
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
}

/**
 * ChatGPT's CSP blocks the fetch SnapDOM uses for third-party images, but
 * image loads are allowed. Hosts that send CORS headers can be copied through
 * a canvas; the rest get a placeholder so SnapDOM does not retry them.
 * `root` must be attached so rendered sizes are known.
 */
async function inlineExternalImages(root: HTMLElement, isDarkMode: boolean) {
    const imagesBySrc = new Map<string, HTMLImageElement[]>()
    root.querySelectorAll('img').forEach((img) => {
        const src = img.currentSrc || img.src
        try {
            const url = new URL(src, location.href)
            if (!url.protocol.startsWith('http') || url.origin === location.origin) return
        }
        catch {
            return
        }
        imagesBySrc.set(src, [...(imagesBySrc.get(src) ?? []), img])
    })

    const queue = Array.from(imagesBySrc.entries())
    const worker = async () => {
        for (let entry = queue.shift(); entry; entry = queue.shift()) {
            const [src, targets] = entry
            const source = await loadCorsImage(src)
            targets.forEach((target) => {
                let dataUrl: string | null = null
                try {
                    dataUrl = source && encodeImage(source, target)
                }
                catch {
                    // A tainted canvas throws; fall through to the placeholder.
                }
                target.removeAttribute('srcset')
                target.src = dataUrl || createImagePlaceholder(target, src, isDarkMode)
            })
        }
    }
    await Promise.all(Array.from({ length: EXTERNAL_IMAGE_CONCURRENCY }, worker))
}

function getSurfaceColor(element: HTMLElement, fallback: string) {
    for (let el: HTMLElement | null = element; el; el = el.parentElement) {
        const color = getComputedStyle(el).backgroundColor
        if (color && color !== 'transparent' && !/^rgba\(.*,\s*0\)$/.test(color)) return color
    }
    return fallback
}

async function prepareRedesignedThread(threadEl: HTMLElement, effect: Effect, isDarkMode: boolean): Promise<ScreenshotSource | null> {
    const scrollRoot = threadEl.closest<HTMLElement>(REDESIGNED_SCROLL_ROOT_SELECTOR)
    if (!scrollRoot || !threadEl.querySelector(REDESIGNED_TURN_SELECTOR)) return null

    const backgroundColor = getSurfaceColor(threadEl, isDarkMode ? '#212121' : '#fff')

    const position = createScrollPosition(scrollRoot)

    // Loading history grows the list above the viewport, so restore the
    // position relative to the bottom.
    effect.add(() => {
        const distanceFromBottom = position.max() - position.get()
        return () => position.set(position.max() - distanceFromBottom)
    })
    effect.run()

    // Stay at the top until every page of history has loaded. The loader
    // may only fire when the spinner enters the viewport, so step away and
    // back whenever the list stops growing.
    let previousScrollHeight = -1
    for (let attempt = 0; attempt < HISTORY_LOAD_ATTEMPTS && threadEl.querySelector(HISTORY_SPINNER_SELECTOR); attempt++) {
        if (scrollRoot.scrollHeight === previousScrollHeight) {
            position.set(scrollRoot.clientHeight * 2)
            await sleep(100)
        }
        previousScrollHeight = scrollRoot.scrollHeight
        position.set(0)
        await sleep(500)
    }
    if (threadEl.querySelector(HISTORY_SPINNER_SELECTOR)) {
        console.warn('[ChatGPT Exporter:screenshot] history is still loading; exporting the loaded part')
    }

    // Walk down and clone each turn while it is mounted. Mounted turns form
    // a contiguous range, so each step moves the last one to the top of the
    // viewport. The list can lag behind a scroll, so order the copies by
    // where each turn sits in the list rather than by when it was copied.
    const snapshots = new Map<string, { top: number, snapshot: HTMLElement }>()
    const getListOffset = (turn: HTMLElement) => turn.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + position.get()
    const getMountedTurns = () => Array.from(threadEl.querySelectorAll<HTMLElement>(REDESIGNED_TURN_SELECTOR))
    const captureMountedTurns = async () => {
        const turns = getMountedTurns().filter((turn) => {
            const key = turn.dataset.turnKey
            return !!key && !snapshots.has(key) && turn.offsetHeight > 0
        })
        if (turns.length === 0) return

        // Lazy images outside the viewport never start loading on their own.
        // Let them finish, then give React a moment to swap its loading
        // placeholders for them.
        turns.forEach(turn => turn.querySelectorAll('img[loading="lazy"]').forEach(img => img.setAttribute('loading', 'eager')))
        await Promise.all(turns.map(waitForImages))
        await sleep(100)

        turns.forEach((turn) => {
            const key = turn.dataset.turnKey!
            if (snapshots.has(key) || !turn.isConnected) return

            const snapshot = turn.cloneNode(true) as HTMLElement
            // The copy sits off-screen, where lazy images would never load.
            snapshot.querySelectorAll('img[loading="lazy"]').forEach(img => img.setAttribute('loading', 'eager'))
            inlineBlobImages(turn, snapshot)
            snapshots.set(key, { top: getListOffset(turn), snapshot })
        })
    }

    position.set(0)
    await sleep(250)
    while (true) {
        await captureMountedTurns()
        const previousTop = position.get()
        if (previousTop >= position.max() - 1) break

        const lastTurn = getMountedTurns().at(-1)
        const lastTurnOffset = lastTurn
            ? lastTurn.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top
            : 0
        // Once the last mounted turn reaches the top, whatever is left fits
        // in the final window, so jump straight to the bottom.
        position.set(lastTurnOffset > 0 ? previousTop + Math.floor(lastTurnOffset) : position.max())
        await sleep(250)
        if (position.get() <= previousTop) break
    }
    await captureMountedTurns()
    if (snapshots.size === 0) return null

    // Keep the copy next to the live thread so it inherits the same CSS
    // variables and container queries.
    const staticThread = threadEl.cloneNode(false) as HTMLElement
    staticThread.removeAttribute('data-chatgpt-conversation-selection-target')
    staticThread.removeAttribute('data-thread-find-target')
    staticThread.setAttribute('data-chatgpt-exporter-screenshot-root', '')
    Object.assign(staticThread.style, {
        position: 'absolute',
        left: '-100000px',
        top: '0',
        width: `${threadEl.offsetWidth}px`,
        height: 'auto',
        minHeight: '0',
        pointerEvents: 'none',
    })

    const style = document.createElement('style')
    style.textContent = `${CJK_FONT_FACES}
        [data-chatgpt-exporter-screenshot-root] {
            color: ${isDarkMode ? '#ececec' : '#0d0d0d'};
            background-color: ${backgroundColor};
        }

        [data-chatgpt-exporter-screenshot-root] [data-virtualized-turn-content] {
            content-visibility: visible !important;
        }

        /* date separators such as "Yesterday 10:08 AM" */
        [data-chatgpt-exporter-screenshot-root] [role="separator"] {
            display: none;
        }

        /* the "Is this conversation helpful so far?" card */
        [data-chatgpt-exporter-screenshot-root] :has(> aside) {
            display: none;
        }

        /* image groups ChatGPT hid for lack of images, left as empty skeletons */
        [data-chatgpt-exporter-screenshot-root] :has(> [class~="group/generated-image-preview"]):not(:has(img)) {
            display: none;
        }

        /* Keep the spacing of the action row and code block headers. */
        [data-chatgpt-exporter-screenshot-root] .turn-action-controls,
        [data-chatgpt-exporter-screenshot-root] [data-markdown-copy="code-block"] button {
            visibility: hidden;
        }
    `
    staticThread.appendChild(style)
    Array.from(snapshots.values())
        .sort((a, b) => a.top - b.top)
        .forEach(({ snapshot }) => staticThread.appendChild(snapshot))

    // Line breaking follows the page language. The SVG copy loses the
    // `<html lang>` ancestor, so carry it on the root.
    if (document.documentElement.lang) staticThread.lang = document.documentElement.lang

    effect.add(() => {
        threadEl.after(staticThread)
        return () => staticThread.remove()
    })
    effect.run()
    await matchCjkMetrics(staticThread)
    pinEmojiWidths(staticThread)
    await inlineExternalImages(staticThread, isDarkMode)
    await sleep(100)

    return { screenshotEls: splitIntoParts(staticThread, effect), backgroundColor }
}

/** Most image viewers cannot open a PNG taller than 32k or 64k pixels. */
const MAX_PART_HEIGHT = 32_000

/**
 * Split a long thread into several images at turn boundaries, so each one
 * stays small enough to open.
 */
function splitIntoParts(staticThread: HTMLElement, effect: Effect) {
    const scale = Math.min(2, MAX_SCREENSHOT_DIMENSION / staticThread.offsetWidth)
    // Leave room for the thread padding and the gaps between turns.
    const maxHeight = MAX_PART_HEIGHT / scale - 100
    if (staticThread.scrollHeight <= maxHeight) return [staticThread]

    const style = staticThread.querySelector(':scope > style')
    const groups: HTMLElement[][] = [[]]
    let groupHeight = 0
    Array.from(staticThread.children).forEach((turn) => {
        if (!(turn instanceof HTMLElement) || turn === style) return

        const height = turn.offsetHeight
        if (groups.at(-1)!.length > 0 && groupHeight + height > maxHeight) {
            groups.push([])
            groupHeight = 0
        }
        groups.at(-1)!.push(turn)
        groupHeight += height
    })

    const parts = groups.map((turns) => {
        const part = staticThread.cloneNode(false) as HTMLElement
        if (style) part.appendChild(style.cloneNode(true))
        part.append(...turns)
        return part
    })
    effect.add(() => {
        staticThread.after(...parts)
        return () => parts.forEach(part => part.remove())
    })
    effect.run()
    return parts
}

interface ScreenshotSource {
    /** One element per output image. */
    screenshotEls: HTMLElement[]
    backgroundColor: string
}

async function prepareLegacyThread(effect: Effect, isDarkMode: boolean): Promise<ScreenshotSource | null> {
    const conversationTurns = Array.from(document.querySelectorAll<HTMLElement>('#thread [data-testid^="conversation-turn-"]'))
    const thread = findCommonAncestor(conversationTurns)
    if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) return null

    const threadEl = thread as HTMLElement
    const turnContainers = Array.from(threadEl.querySelectorAll<HTMLElement>('[data-turn-id-container][data-is-intersecting]'))
        .filter(element => !!element.querySelector('[data-testid^="conversation-turn-"]') || element.offsetHeight > 0 || !!element.style.getPropertyValue('--last-known-height'))
    const turnContainerIds = turnContainers
        .map(element => element.dataset.turnIdContainer)
        .filter((id): id is string => !!id && id !== 'client-created-root')

    effect.add(() => {
        threadEl.setAttribute('data-chatgpt-exporter-screenshot-root', '')

        const style = document.createElement('style')
        style.textContent = `
            [data-chatgpt-exporter-screenshot-root],
            #thread [data-testid^="conversation-turn-"] {
                color: ${isDarkMode ? '#ececec' : '#0d0d0d'};
                background-color: ${isDarkMode ? '#212121' : '#fff'};
            }

            /* https://github.com/niklasvh/html2canvas/issues/2775#issuecomment-1204988157 */
            img {
                display: initial !important;
            }

            pre {
                margin-top: 8px !important;
            }

            pre > div > div > span {
                margin-top: -12px;
                padding-bottom: 2px;
            }

            #page-header,
            #thread-bottom-container,
            /* date separators such as "Yesterday 10:08 AM" */
            [data-chatgpt-exporter-screenshot-root] [role="separator"],
            /* any other elements that are not conversation turns */
            [data-chatgpt-exporter-screenshot-root] > :not([data-turn-id-container]):not([data-testid^="conversation-turn-"]):not(:has([data-testid^="conversation-turn-"])),
            /* hide back to top button */
            button.absolute,
            /* question button */
            .group.absolute > button {
                display: none;
            }

            /* Preserve the action row's spacing while hiding its toolbar. */
            [data-testid^="conversation-turn-"] [role="group"]:has([data-testid="copy-turn-action-button"]),
            /* code block buttons */
            #thread pre button {
                visibility: hidden;
            }

            /* Later user turns currently have much larger top padding than the first one. */
            [data-testid^="conversation-turn-"][data-turn="user"] > h4 + div {
                padding-top: 0 !important;
            }
            `
        threadEl.appendChild(style)
        return () => {
            style.remove()
            threadEl.removeAttribute('data-chatgpt-exporter-screenshot-root')
        }
    })

    const scrollRoot = threadEl.closest<HTMLElement>('[data-scroll-root]')
    if (scrollRoot) {
        effect.add(() => {
            const scrollTop = scrollRoot.scrollTop
            const scrollLeft = scrollRoot.scrollLeft
            const overflowAnchor = scrollRoot.style.overflowAnchor
            scrollRoot.style.overflowAnchor = 'none'

            return () => {
                scrollRoot.style.overflowAnchor = overflowAnchor
                scrollRoot.scrollTop = scrollTop
                scrollRoot.scrollLeft = scrollLeft
            }
        })
    }

    effect.run()

    // ChatGPT virtualizes off-screen turns. Visit every placeholder in DOM
    // order and preserve a clone while each one is mounted. React cannot keep
    // distant turns mounted at the same time, so the clones become our stable
    // capture source.
    const turnSnapshots = new Map<string, HTMLElement>()
    if (scrollRoot && turnContainerIds.length > 0) {
        for (const turnContainerId of turnContainerIds) {
            for (let pass = 0; pass < 10; pass++) {
                const container = Array.from(threadEl.querySelectorAll<HTMLElement>('[data-turn-id-container][data-is-intersecting]'))
                    .find(element => element.dataset.turnIdContainer === turnContainerId)
                if (!container) break

                const renderedTurn = container.querySelector<HTMLElement>('[data-testid^="conversation-turn-"]')
                if (renderedTurn) {
                    turnSnapshots.set(turnContainerId, container.cloneNode(true) as HTMLElement)
                    break
                }

                scrollElementWithinRoot(scrollRoot, container, 'center')
                await sleep(250)
            }

            if (!turnSnapshots.has(turnContainerId)) {
                const placeholder = Array.from(threadEl.querySelectorAll<HTMLElement>('[data-turn-id-container][data-is-intersecting]'))
                    .find(element => element.dataset.turnIdContainer === turnContainerId)
                if (placeholder) turnSnapshots.set(turnContainerId, placeholder.cloneNode(true) as HTMLElement)
            }
        }
    }
    else if (scrollRoot && conversationTurns[0]) {
        scrollElementWithinRoot(scrollRoot, conversationTurns[0], 'start')
        await sleep(250)
    }
    await sleep(500)

    let screenshotEl = threadEl
    if (turnSnapshots.size > 0) {
        const staticThread = threadEl.cloneNode(false) as HTMLElement
        staticThread.setAttribute('data-chatgpt-exporter-screenshot-root', '')
        staticThread.style.position = 'absolute'
        staticThread.style.left = '-100000px'
        staticThread.style.top = '0'
        staticThread.style.width = `${threadEl.offsetWidth}px`
        staticThread.style.height = 'auto'
        staticThread.style.minHeight = '0'
        staticThread.style.maxHeight = 'none'
        staticThread.style.overflow = 'visible'
        staticThread.style.pointerEvents = 'none'

        for (const turnContainerId of turnContainerIds) {
            const snapshot = turnSnapshots.get(turnContainerId)
            if (snapshot) staticThread.appendChild(snapshot)
        }

        effect.add(() => {
            document.body.appendChild(staticThread)
            return () => staticThread.remove()
        })
        effect.run()
        screenshotEl = staticThread
        await sleep(100)
    }

    return { screenshotEls: [screenshotEl], backgroundColor: isDarkMode ? '#212121' : '#fff' }
}

export async function exportToPng(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const effect = new Effect()
    const isDarkMode = getColorScheme() === 'dark'
    const redesignedThread = document.querySelector<HTMLElement>(REDESIGNED_THREAD_SELECTOR)
    const source = redesignedThread
        ? await prepareRedesignedThread(redesignedThread, effect, isDarkMode)
        : await prepareLegacyThread(effect, isDarkMode)
    if (!source) {
        effect.dispose()
        alert(i18n.t('Failed to export to PNG. Failed to find the element node.'))
        return false
    }
    const { screenshotEls, backgroundColor } = source

    const pngs: Blob[] = []
    for (const screenshotEl of screenshotEls) {
        const png = await renderPng(screenshotEl, effect, backgroundColor)
        if (!png) {
            effect.dispose()
            alert('Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.')
            return false
        }
        pngs.push(png)
    }
    effect.dispose()

    const chatId = getChatIdFromUrl() || undefined
    const fileName = getFileNameWithFormat(fileNameFormat, 'png', { chatId })
    if (pngs.length === 1) {
        downloadFile(fileName, 'image/png', pngs[0])
        return true
    }

    const zip = new JSZip()
    const baseName = fileName.replace(/\.png$/, '')
    const digits = String(pngs.length).length
    pngs.forEach((png, index) => {
        zip.file(`${baseName}-${String(index + 1).padStart(digits, '0')}.png`, png)
    })
    // PNGs are already compressed.
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' })
    downloadFile(getFileNameWithFormat(fileNameFormat, 'zip', { chatId }), 'application/zip', blob)

    return true
}

async function renderPng(screenshotEl: HTMLElement, effect: Effect, backgroundColor: string): Promise<Blob | null> {
    effect.add(() => {
        const minHeight = screenshotEl.style.minHeight
        screenshotEl.style.minHeight = `${screenshotEl.scrollHeight}px`
        return () => {
            screenshotEl.style.minHeight = minHeight
        }
    })
    effect.run()

    await sleep(0)

    const width = Math.max(screenshotEl.offsetWidth, screenshotEl.scrollWidth)
    const height = Math.max(screenshotEl.offsetHeight, screenshotEl.scrollHeight)

    let capture: Awaited<ReturnType<typeof snapdom>> | null = null
    try {
        capture = await snapdom(screenshotEl, {
            embedFonts: true,
            // Keep text from re-wrapping and clipping under font fallback.
            reconcile: true,
            plugins: [growUserBubbles],
            backgroundColor,
        })
    }
    catch (error) {
        console.error('Failed to capture screenshot DOM', error)
    }

    const sourceWidth = capture?.meta.vbW || width
    const sourceHeight = capture?.meta.vbH || height
    // Keep export quality consistent across operating systems, display
    // densities and browser zoom levels. Only reduce it when a tile would
    // exceed the browser's maximum canvas width.
    const requestedScale = Math.min(2, MAX_SCREENSHOT_DIMENSION / sourceWidth)
    const desiredWidth = Math.max(1, Math.floor(sourceWidth * requestedScale))
    // Use one exact scale derived from SnapDOM's viewBox. Mixing live DOM
    // dimensions with capture dimensions can stretch and blur every tile.
    const desiredScale = desiredWidth / sourceWidth
    const desiredHeight = Math.max(1, Math.floor(sourceHeight * desiredScale))

    const takeTiledScreenshot = async (): Promise<Blob | null> => {
        if (!capture) {
            console.warn('[ChatGPT Exporter:screenshot] tiled capture unavailable')
            return null
        }
        if (typeof CompressionStream === 'undefined') {
            console.warn('[ChatGPT Exporter:screenshot] CompressionStream unavailable; using downscaled fallback')
            return null
        }

        const tileHeight = Math.max(1, Math.min(
            MAX_SCREENSHOT_DIMENSION,
            Math.floor(MAX_TILE_PIXELS / desiredWidth),
        ))

        try {
            return await encodePng(desiredWidth, async (appendRows) => {
                for (let targetY = 0; targetY < desiredHeight; targetY += tileHeight) {
                    const targetTileHeight = Math.min(tileHeight, desiredHeight - targetY)
                    const sourceY = sourceHeight * targetY / desiredHeight
                    const sourceBottom = sourceHeight * (targetY + targetTileHeight) / desiredHeight
                    const canvas = await capture!.toCanvas({
                        crop: {
                            x: 0,
                            y: sourceY,
                            width: sourceWidth,
                            height: sourceBottom - sourceY,
                        },
                        scale: desiredScale,
                        dpr: 1,
                        backgroundColor,
                    })
                    if (canvas.width !== desiredWidth) {
                        throw new Error(`Unexpected screenshot tile width: ${canvas.width}`)
                    }
                    const context = canvas.getContext('2d', { willReadFrequently: true })
                    if (!context) throw new Error('Failed to read screenshot tile')

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                    await appendRows(imageData)
                    canvas.width = 1
                    canvas.height = 1
                }
            })
        }
        catch (error) {
            console.error('Failed to encode tiled screenshot', error)
            return null
        }
    }

    const passLimit = 10
    const takeDownscaledScreenshot = async (additionalScale = 1, currentPass = 1): Promise<Blob | null> => {
        if (!capture) return null

        const scale = Math.min(
            requestedScale,
            MAX_SCREENSHOT_DIMENSION / sourceWidth,
            MAX_SCREENSHOT_DIMENSION / sourceHeight,
        ) * additionalScale
        const targetWidth = Math.max(1, Math.floor(sourceWidth * scale))
        const targetHeight = Math.max(1, Math.floor(sourceHeight * scale))

        let canvas: HTMLCanvasElement | null = null
        try {
            canvas = await capture.toCanvas({
                scale,
                dpr: 1,
                backgroundColor,
            })

            const context = canvas.getContext('2d')
            if (context) context.imageSmoothingEnabled = false

            const blob = await new Promise<Blob | null>(resolve => canvas!.toBlob(resolve, 'image/png', 1))
            if (blob) return blob
        }
        catch (error) {
            console.error('Failed to take screenshot', error)
        }

        // eslint-disable-next-line no-console
        console.log(`ChatGPT Exporter:takeScreenshot with height=${height} width=${width} targetHeight=${targetHeight} targetWidth=${targetWidth}`)

        /**
         * A browser may return an empty canvas instead of throwing when a
         * raster exceeds its canvas or SVG decode limit.
         * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
         * Chromium will not throw, we can only get an empty canvas
         * Firefox will throw "DOMException: CanvasRenderingContext2D.scale: Canvas exceeds max size."
         */
        if (currentPass > passLimit) return null

        // 1.4 ^ 5 ~= 5.37, should be enough for most cases
        return takeDownscaledScreenshot(additionalScale / 1.4, currentPass + 1)
    }

    const shouldTile = desiredHeight > MAX_SCREENSHOT_DIMENSION
        || desiredWidth * desiredHeight > MAX_SCREENSHOT_DIMENSION * MAX_SCREENSHOT_DIMENSION
    let png = shouldTile ? await takeTiledScreenshot() : await takeDownscaledScreenshot()
    if (!png && shouldTile) {
        console.warn('[ChatGPT Exporter:screenshot] tiled export failed; using downscaled fallback')
        png = await takeDownscaledScreenshot()
    }
    return png
}
