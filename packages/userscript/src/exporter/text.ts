import type { ConversationLine } from '../type'
import { getConversation } from '../parser'
import { copyToClipboard } from '../utils/clipboard'
import { tableToMarkdown } from '../utils/markdown'

export function exportToText() {
    const conversations = getConversation()
    if (conversations.length === 0) return alert('No conversation found. Please send a message first.')

    const text = conversations.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map(line => lineToText(line)).join('\r\n\r\n')
        return `${name}:\r\n${text}`
    }).join('\r\n\r\n')

    copyToClipboard(text)
}

export function lineToText(line: ConversationLine): string {
    return line.map((item) => {
        switch (item.type) {
            case 'text': return item.text
            case 'image': return '[image]'
            case 'link': return `[${item.text}](${item.href})`
            case 'ordered-list-item': return item.items.map((item, index) => `${index + 1}. ${item}`).join('\r\n')
            case 'unordered-list-item': return item.items.map(item => `- ${item}`).join('\r\n')
            case 'code': return `\`${item.code}\``
            case 'code-block': return `\`\`\`${item.lang}\r\n${item.code}\`\`\``
            case 'table': return tableToMarkdown(item.headers, item.rows)
            default: return ''
        }
    }).join('')
}
