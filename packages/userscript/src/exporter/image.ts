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

    const ratio = window.devicePixelRatio || 1
    const canvas = await html2canvas(thread, {
        scale: ratio * 2, // scale up to 2x to avoid blurry images
        useCORS: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: thread.scrollWidth,
        windowHeight: thread.scrollHeight,
        ignoreElements: fnIgnoreElements,
    })

    const context = canvas.getContext('2d')
    if (context) {
        context.imageSmoothingEnabled = false
    }

    effect.dispose()

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const chatId = getChatIdFromUrl() || undefined
    const fileName = getFileNameWithFormat(fileNameFormat, 'png', { chatId })
    downloadUrl(fileName, dataUrl)
    window.URL.revokeObjectURL(dataUrl)

    return true
}
