import { snapdom } from '@zumer/snapdom'
import i18n from '../i18n'
import { checkIfConversationStarted, getChatIdFromUrl } from '../page'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { Effect } from '../utils/effect'
import { encodePng } from '../utils/png'
import { sleep } from '../utils/utils'

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

export async function exportToPng(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const effect = new Effect()

    const conversationTurns = Array.from(document.querySelectorAll<HTMLElement>('#thread [data-testid^="conversation-turn-"]'))
    const thread = findCommonAncestor(conversationTurns)
    if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) {
        alert(i18n.t('Failed to export to PNG. Failed to find the element node.'))
        return false
    }

    const isDarkMode = document.documentElement.classList.contains('dark')
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

    effect.add(() => {
        const minHeight = screenshotEl.style.minHeight
        screenshotEl.style.minHeight = `${screenshotEl.scrollHeight}px`
        return () => {
            screenshotEl.style.minHeight = minHeight
        }
    })
    effect.run()

    await sleep(0)

    const backgroundColor = isDarkMode ? '#212121' : '#fff'
    const width = Math.max(screenshotEl.offsetWidth, screenshotEl.scrollWidth)
    const height = Math.max(screenshotEl.offsetHeight, screenshotEl.scrollHeight)

    let capture: Awaited<ReturnType<typeof snapdom>> | null = null
    try {
        capture = await snapdom(screenshotEl, {
            embedFonts: true,
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
    effect.dispose()

    if (!png) {
        alert('Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.')
        return false
    }

    const chatId = getChatIdFromUrl() || undefined
    const fileName = getFileNameWithFormat(fileNameFormat, 'png', { chatId })
    downloadFile(fileName, 'image/png', png)

    return true
}
