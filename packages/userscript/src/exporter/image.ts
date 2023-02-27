import html2canvas from 'html2canvas'
import { downloadUrl, getFileNameWithFormat } from '../utils/download'
import { sleep } from '../utils/utils'

// https://github.com/niklasvh/html2canvas/issues/2792#issuecomment-1042948572
function fnIgnoreElements(el: any) {
    return typeof el.shadowRoot === 'object' && el.shadowRoot !== null
}

export async function exportToPng(fileNameFormat: string) {
    const thread = document.querySelector('main .group')?.parentElement as HTMLElement
    if (!thread || thread.children.length === 0) return

    // hide model bar
    Array.from(thread.children).forEach((el) => {
        const text = el.textContent
        if (text === 'Model: Default' || text === 'Model: Legacy') {
            el.classList.add('hidden')
        }
    })

    // hide bottom bar
    thread.children[thread.children.length - 1].classList.add('hidden')

    await sleep(100)

    const canvas = await html2canvas(thread, {
        scale: 1,
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

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const fileName = getFileNameWithFormat(fileNameFormat, 'png')
    downloadUrl(fileName, dataUrl)
    window.URL.revokeObjectURL(dataUrl)
}
