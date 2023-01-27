import type { ConversationLine } from '../type'
import { getConversation } from '../parser'
import { copyToClipboard } from '../utils/clipboard'
import { codeBlockToMarkdown, codeToMarkdown, headingToMarkdown, hrToMarkdown, linkToMarkdown, orderedListToMarkdown, quoteToMarkdown, tableToMarkdown, unorderedListToMarkdown } from '../utils/markdown'

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

function lineToText(line: ConversationLine): string {
    // eslint-disable-next-line array-callback-return
    return line.map((node) => {
        const nodeType = node.type
        switch (nodeType) {
            case 'hr': return hrToMarkdown()
            case 'text': return node.text
            case 'bold': return node.text
            case 'italic': return node.text
            case 'heading': return headingToMarkdown(node)
            case 'quote': return quoteToMarkdown(node)
            case 'image': return '[image]'
            case 'link': return linkToMarkdown(node)
            case 'ordered-list-item': return orderedListToMarkdown(node)
            case 'unordered-list-item': return unorderedListToMarkdown(node)
            case 'code': return codeToMarkdown(node)
            case 'code-block': return codeBlockToMarkdown(node)
            case 'table': return tableToMarkdown(node.headers, node.rows)
        }
    }).join('')
}
