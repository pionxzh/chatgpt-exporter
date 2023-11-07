import html2canvas from 'html2canvas'
import i18n from '../i18n'
import { checkIfConversationStarted, conversationChoiceSelector, getChatIdFromUrl } from '../page'
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

    const thread = document.querySelector('main .group')?.parentElement as HTMLElement
    if (!thread || thread.children.length === 0) return false

    const effect = new Effect()

    // hide model bar
    const modelBar = thread.firstElementChild
    if (modelBar?.textContent?.startsWith('Model:')) {
        effect.add(() => {
            modelBar.classList.add('hidden')
            return () => modelBar.classList.remove('hidden')
        })
    }

    // hide bottom bar
    effect.add(() => {
        const bottomBar = thread.children[thread.children.length - 1]
        bottomBar.classList.add('hidden')
        return () => bottomBar.classList.remove('hidden')
    })

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

    // hide conversation choices. eg. <1 / 6>
    const conversationChoices = document.querySelectorAll(conversationChoiceSelector)
    conversationChoices.forEach((choice) => {
        effect.add(() => {
            const parent = choice.parentElement
            if (!parent) return
            parent.classList.add('hidden')
            return () => parent.classList.remove('hidden')
        })
    })

    // disabled the avatar srcset
    // fix https://github.com/pionxzh/chatgpt-exporter/issues/53
    // seems related to https://github.com/niklasvh/html2canvas/issues/2218
    const avatarEls = Array.from(document.querySelectorAll('img[alt]:not([aria-hidden])'))
    avatarEls.forEach((el) => {
        const srcset = el.getAttribute('srcset')
        if (srcset) {
            effect.add(() => {
                el.setAttribute('data-srcset', srcset)
                el.removeAttribute('srcset')
                return () => {
                    el.setAttribute('srcset', srcset)
                    el.removeAttribute('data-srcset')
                }
            })
        }
    })

    // add `break-words` to all message elements
    // html2canvas cannot handle the spacing correctly on Firefox with MacOS
    // fix https://github.com/pionxzh/chatgpt-exporter/issues/78
    const messageEls = Array.from(thread.querySelectorAll('.group .whitespace-pre-wrap'))
    messageEls.forEach((el) => {
        effect.add(() => {
            el.classList.add('break-words')
            return () => el.classList.remove('break-words')
        })
    })

    effect.run()

    await sleep(100)

    const passLimit = 5
    const takeScreenshot = async (width: number, height: number, additionalScale = 1, currentPass = 1): Promise<string | null> => {
        const ratio = window.devicePixelRatio || 1
        const canvas = await html2canvas(thread, {
            scale: ratio * 2 * additionalScale, // scale up to 2x to avoid blurry images
            useCORS: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: thread.scrollWidth,
            windowHeight: thread.scrollHeight,
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
    if (!dataUrl) {
        alert('Failed to export to PNG. This might be caused by the size of the conversation. Please try to export a smaller conversation.')
        return false
    }

    effect.dispose()

    const chatId = getChatIdFromUrl() || undefined
    const fileName = getFileNameWithFormat(fileNameFormat, 'png', { chatId })
    downloadUrl(fileName, dataUrl)
    window.URL.revokeObjectURL(dataUrl)

    return true
}
