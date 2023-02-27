import type { ConversationLine } from '../type'
import { getConversation } from '../parser'
import { copyToClipboard } from '../utils/clipboard'
import { codeBlockToMarkdown, codeToMarkdown, headingToMarkdown, hrToMarkdown, imageToMarkdown, linkToMarkdown, orderedListToMarkdown, quoteToMarkdown, tableToMarkdown, unorderedListToMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'

export function exportToText() {
    const conversations = getConversation()
    if (conversations.length === 0) return alert('No conversation found. Please send a message first.')

    const text = conversations.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map(line => lineToText(line)).join('\n\n')
        return `${name}:\n${text}`
    }).join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))
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
            case 'image': {
                if (node.src.startsWith('data:')) return '[image]'
                return imageToMarkdown(node)
            }
            case 'link': return linkToMarkdown(node)
            case 'ordered-list-item': return orderedListToMarkdown(node, lineToText)
            case 'unordered-list-item': return unorderedListToMarkdown(node, lineToText)
            case 'code': return codeToMarkdown(node)
            case 'code-block': return codeBlockToMarkdown(node)
            case 'table': return tableToMarkdown(node.headers, node.rows)
        }
    }).join('')
}
