import html2canvas from 'html2canvas'
import { checkIfConversationStarted } from '../page'
import { downloadUrl, getFileNameWithFormat } from '../utils/download'
import { sleep } from '../utils/utils'

// https://github.com/niklasvh/html2canvas/issues/2792#issuecomment-1042948572
function fnIgnoreElements(el: any) {
    return typeof el.shadowRoot === 'object' && el.shadowRoot !== null
}

export async function exportToPng(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const thread = document.querySelector('main .group')?.parentElement as HTMLElement
    if (!thread || thread.children.length === 0) return false

    // hide model bar
    Array.from(thread.children).forEach((el) => {
        const text = el.textContent
        if (text === 'Model: Default' || text === 'Model: Legacy' || text === 'Model: GPT-4') {
            el.classList.add('hidden')
        }
    })

    // hide bottom bar
    thread.children[thread.children.length - 1].classList.add('hidden')

    const avatarEls = Array.from(document.querySelectorAll('img[alt]:not([aria-hidden])'))
    // disabled the avatar srcset
    // fix https://github.com/pionxzh/chatgpt-exporter/issues/53
    // seems related to https://github.com/niklasvh/html2canvas/issues/2218
    avatarEls.forEach((el) => {
        const srcset = el.getAttribute('srcset')
        if (srcset) {
            el.setAttribute('data-srcset', srcset)
            el.removeAttribute('srcset')
        }
    })

    await sleep(100)

    const canvas = await html2canvas(thread, {
        scale: 1,
        useCORS: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: thread.scrollWidth,
        windowHeight: thread.scrollHeight,
        ignoreElements: fnIgnoreElements,
    })

    // restore the layout
    Array.from(thread.children).forEach((el) => {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden')
        }
    })

    // restore the avatar srcset
    avatarEls.forEach((el) => {
        const srcset = el.getAttribute('data-srcset')
        if (srcset) {
            el.setAttribute('srcset', srcset)
            el.removeAttribute('data-srcset')
        }
    })

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const fileName = getFileNameWithFormat(fileNameFormat, 'png')
    downloadUrl(fileName, dataUrl)
    window.URL.revokeObjectURL(dataUrl)

    return true
}
