import { getConversation } from '../parser'
import type { Conversation, ConversationLine } from '../type'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { codeBlockToMarkdown, codeToMarkdown, headingToMarkdown, hrToMarkdown, imageToMarkdown, linkToMarkdown, orderedListToMarkdown, quoteToMarkdown, tableToMarkdown, unorderedListToMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'

export function exportToMarkdown(fileNameFormat: string) {
    const conversations = getConversation()
    if (conversations.length === 0) return alert('No conversation found. Please send a message first.')

    const text = conversationToMarkdown(conversations)
    const fileName = getFileNameWithFormat(fileNameFormat, 'md')
    downloadFile(fileName, 'text/markdown', standardizeLineBreaks(text))
}

function conversationToMarkdown(conversation: Conversation[]) {
    return conversation.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map(line => lineToMD(line)).join('\n\n')
        return `#### ${name}:\n${text}`
    }).join('\n\n')
}

function lineToMD(line: ConversationLine): string {
    // eslint-disable-next-line array-callback-return
    return line.map((node) => {
        const nodeType = node.type
        switch (nodeType) {
            case 'hr': return hrToMarkdown()
            case 'text': return node.text
            case 'bold': return `**${node.text}**`
            case 'italic': return `*${node.text}*`
            case 'heading': return headingToMarkdown(node)
            case 'quote': return quoteToMarkdown(node)
            case 'image': return imageToMarkdown(node)
            case 'link': return linkToMarkdown(node)
            case 'ordered-list-item': return orderedListToMarkdown(node, lineToMD)
            case 'unordered-list-item': return unorderedListToMarkdown(node, lineToMD)
            case 'code': return codeToMarkdown(node)
            case 'code-block': return codeBlockToMarkdown(node)
            case 'table': return tableToMarkdown(node.headers, node.rows)
        }
    }).join('')
}
