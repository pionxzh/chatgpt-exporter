import sanitize from 'sanitize-filename'
import { dateStr, timestamp } from './utils'

export function downloadFile(filename: string, type: string, content: string | Blob) {
    const blob = content instanceof Blob ? content : new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function downloadUrl(filename: string, url: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

export function getFileNameWithFormat(format: string, ext: string, {
    title = document.title,
    // chatId will be empty when exporting all conversations
    chatId = '',
} = {}) {
    const _title = sanitize(title).replace(/\s+/g, '_')

    return format
        .replace('{title}', _title)
        .replace('{date}', dateStr())
        .replace('{timestamp}', timestamp())
        .replace('{chat_id}', chatId)
        .concat(`.${ext}`)
}
