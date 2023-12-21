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

    effect.add(() => {
        document.documentElement.style.setProperty('font-size', '12px')
        return () => document.documentElement.style.removeProperty('font-size')
    })

    // pre-calculated rem to px for tailwindcss
    // effect.add(() => {
    //     const stylesheet = new CSSStyleSheet()
    //     stylesheet.replaceSync(`
    //         .text-xs {
    //             font-size: 12px; // 0.75rem
    //             line-height: 16px; // 1rem
    //         }

    //         .text-sm {
    //             font-size: 14px; // 0.875rem
    //             line-height: 20px; // 1.25rem
    //         }

    //         .text-base {
    //             font-size: 16px; // 1rem
    //             line-height: 24px; // 1.5rem
    //         }

    //         .text-xl {
    //             font-size: 24px; // 1.5rem
    //             line-height: 32px; // 2rem
    //         }

    //         .px-4 {
    //             padding-left: 16px; // 1rem
    //             padding-right: 16px; // 1rem
    //         }

    //         .py-2 {
    //             padding-top: 8px; // 0.5rem
    //             padding-bottom: 8px; // 0.5rem
    //         }

    //         .font-semibold {
    //             line-height: 20px;
    //         }
    //     `)
    //     const oldAdoptedStyleSheets = document.adoptedStyleSheets
    //     document.adoptedStyleSheets = [...oldAdoptedStyleSheets, stylesheet]
    //     return () => {
    //         stylesheet.replaceSync('')
    //         document.adoptedStyleSheets = oldAdoptedStyleSheets
    //     }
    // })

    effect.add(() => {
        const style = document.createElement('style')
        style.textContent = `
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

    const conversationNodes = document.querySelectorAll<HTMLDivElement>('[data-testid^="conversation-turn-"]')
    conversationNodes.forEach((node) => {
        effect.add(() => {
            node.style.height = `${node.clientHeight}px`
            return () => node.style.removeProperty('height')
        })
    })

    // hide top header
    const topHeader = thread.querySelector('.sticky.top-0')
    if (topHeader) {
        effect.add(() => {
            topHeader.classList.add('hidden')
            return () => topHeader.classList.remove('hidden')
        })
    }

    // hide buttons
    const buttonWrappers = document.querySelectorAll<HTMLDivElement>('main .flex.justify-between')
    buttonWrappers.forEach((wrapper) => {
        if (!wrapper.querySelector('button')) return
        // ignore codeblock
        if (wrapper.closest('pre')) return

        effect.add(() => {
            wrapper.style.display = 'none'
            return () => wrapper.style.display = ''
        })
    })

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

    // hide weird cover on avatar
    const shadowStrokes = thread.querySelectorAll('.gizmo-shadow-stroke')
    shadowStrokes.forEach((stroke) => {
        effect.add(() => {
            stroke.classList.remove('gizmo-shadow-stroke')
            return () => stroke.classList.add('gizmo-shadow-stroke')
        })
    })

    const threadEl = thread as HTMLElement

    effect.run()

    await sleep(100)

    const passLimit = 5
    const takeScreenshot = async (width: number, height: number, additionalScale = 1, currentPass = 1): Promise<string | null> => {
        const ratio = window.devicePixelRatio || 1
        const canvas = await html2canvas(threadEl, {
            scale: ratio * 2 * additionalScale, // scale up to 2x to avoid blurry images
            useCORS: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: threadEl.scrollWidth,
            windowHeight: threadEl.scrollHeight,
            ignoreElements: fnIgnoreElements,
        })

        const context = canvas.getContext('2d')
        if (context) context.imageSmoothingEnabled = false

        const dataUrl = canvas.toDataURL('image/png', 1)
            .replace(/^data:image\/[^;]/, 'data:application/octet-stream')

        // corrupted image
        // meaning we might hit on the canvas size limit
        // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
        if (dataUrl === 'data:,') {
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
