import sanitize from 'sanitize-filename'
import { dateStr, timestamp, unixTimestampToISOString } from './utils'

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
    // convert to seconds for unixTimestampToISOString which expects a unix
    // timestamp (in seconds). using Date.now() directly would pass
    // milliseconds which results in an invalid far future date.
    createTime = Math.floor(Date.now() / 1000),
    updateTime = Math.floor(Date.now() / 1000),
} = {}) {
    const _title = sanitize(title).replace(/\s+/g, '_')
    const _createTime = unixTimestampToISOString(createTime)
    const _updateTime = unixTimestampToISOString(updateTime)

    return format
        .replace('{title}', _title)
        .replace('{date}', dateStr())
        .replace('{timestamp}', timestamp())
        .replace('{chat_id}', chatId)
        .replace('{create_time}', _createTime)
        .replace('{update_time}', _updateTime)
        .concat(`.${ext}`)
}
