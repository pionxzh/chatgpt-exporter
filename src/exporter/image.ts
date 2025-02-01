import html2canvas from 'html2canvas'
import i18n from '../i18n'
import { checkIfConversationStarted, getChatIdFromUrl } from '../page'
import { downloadUrl, getFileNameWithFormat } from '../utils/download'
import { Effect } from '../utils/effect'
import { sleep } from '../utils/utils'

// https://github.com/niklasvh/html2canvas/issues/2792#issuecomment-1042948572
function fnIgnoreElements(el: any) {
    return typeof el.shadowRoot === 'object' && el.shadowRoot !== null
}

export async function exportToPng(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const effect = new Effect()

    const thread = document.querySelector('main [class^=\'react-scroll-to-bottom\'] > div > div')
    if (!thread || thread.children.length === 0 || thread.scrollHeight < 50) {
        alert(i18n.t('Failed to export to PNG. Failed to find the element node.'))
        return false
    }

    const isDarkMode = document.documentElement.classList.contains('dark')

    effect.add(() => {
        const style = document.createElement('style')
        style.textContent = `
        main [class^=\'react-scroll-to-bottom\'] > div > div,
        [data-testid^="conversation-turn-"] {
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
            `
        thread!.appendChild(style)
        return () => style.remove()
    })

    // hide top header
    const topHeader = thread.querySelector('.sticky.top-0')
    if (topHeader) {
        effect.add(() => {
            topHeader.classList.add('hidden')
            return () => topHeader.classList.remove('hidden')
        })
    }

    // hide feedback bar
    const feedbackBar = thread.querySelector('[data-testid^="conversation-turn-"] + .mx-auto')
    if (feedbackBar) {
        effect.add(() => {
            feedbackBar.classList.add('hidden')
            return () => feedbackBar.classList.remove('hidden')
        })
    }

    // hide switch context button
    const switchContextBuuton1 = thread.querySelectorAll('div.mb-2.flex.gap-3.empty\\:hidden.mr-1.flex-row-reverse')
    if (switchContextBuuton1) {
        effect.add(() => {
            switchContextBuuton1.forEach(a => a.classList.add('hidden'))
            return () => switchContextBuuton1.forEach(a => a.classList.remove('hidden'))
        })
    }
    const switchContextBuuton2 = thread.querySelectorAll('div.mb-2.flex.gap-3.empty\\:hidden.-ml-2')
    if (switchContextBuuton2) {
        effect.add(() => {
            switchContextBuuton2.forEach(a => a.classList.add('hidden'))
            return () => switchContextBuuton2.forEach(a => a.classList.remove('hidden'))
        })
    }

    // hide code block copy button
    const copyButtons = thread.querySelectorAll('pre button')
    copyButtons.forEach((button) => {
        effect.add(() => {
            button.classList.add('hidden')
            return () => button.classList.remove('hidden')
        })
    })

    // hide back to top button
    const backToTop = thread.querySelectorAll('button.absolute')
    backToTop.forEach((button) => {
        effect.add(() => {
            button.classList.add('hidden')
            return () => button.classList.remove('hidden')
        })
    })

    const threadEl = thread as HTMLElement

    effect.run()

    await sleep(100)

    const passLimit = 10
    const takeScreenshot = async (width: number, height: number, additionalScale = 1, currentPass = 1): Promise<string | null> => {
        const ratio = window.devicePixelRatio || 1
        const scale = ratio * 2 * additionalScale // scale up to 2x to avoid blurry images

        let canvas: HTMLCanvasElement | null = null
        try {
            canvas = await html2canvas(threadEl, {
                scale,
                useCORS: true,
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                windowWidth: width,
                windowHeight: height,
                ignoreElements: fnIgnoreElements,
            })
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.log(`ChatGPT Exporter:takeScreenshot with height=${height} width=${width} scale=${scale}`)
            console.error('Failed to take screenshot', error)
        }

        const context = canvas?.getContext('2d')
        if (context) context.imageSmoothingEnabled = false

        const dataUrl = canvas?.toDataURL('image/png', 1)
            .replace(/^data:image\/[^;]/, 'data:application/octet-stream')

        /**
         * corrupted image
         * meaning we might hit on the canvas size limit
         * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
         * Chromium will not throw,  we can only get an empty canvas
         * Firefox will throw "DOMException: CanvasRenderingContext2D.scale: Canvas exceeds max size."
         */
        if (!canvas || !dataUrl || dataUrl === 'data:,') {
            if (currentPass > passLimit) return null

            // 1.4 ^ 5 ~= 5.37, should be enough for most cases
            return takeScreenshot(width, height, additionalScale / 1.4, currentPass + 1)
        }

        return dataUrl
    }

    const dataUrl = await takeScreenshot(thread.scrollWidth, thread.scrollHeight)
    effect.dispose()

    if (!dataUrl) {
        alert('Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.')
        return false
    }

    const chatId = getChatIdFromUrl() || undefined
    const fileName = getFileNameWithFormat(fileNameFormat, 'png', { chatId })
    downloadUrl(fileName, dataUrl)
    window.URL.revokeObjectURL(dataUrl)

    return true
}
