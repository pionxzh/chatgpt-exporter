import html2canvas from 'html2canvas'
import { downloadUrl } from '../utils/download'
import { sleep, timestamp } from '../utils/utils'

export async function exportToPng() {
    const thread = document.querySelector('main .group')?.parentElement as HTMLElement
    if (!thread || thread.children.length === 0) return

    // hide bottom bar
    thread.children[thread.children.length - 1].classList.add('hidden')

    await sleep(100)

    const canvas = await html2canvas(thread, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: thread.scrollWidth,
        windowHeight: thread.scrollHeight,
    })

    // restore the layout
    thread.children[thread.children.length - 1].classList.remove('hidden')

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const fileName = `ChatGPT-${timestamp()}.png`
    downloadUrl(fileName, dataUrl)
}
