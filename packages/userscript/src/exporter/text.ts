import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import i18n from '../i18n'
import { checkIfConversationStarted, getConversationChoice } from '../page'
import { copyToClipboard } from '../utils/clipboard'
import { flatMap, fromMarkdown, toMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import type { ConversationNodeMessage } from '../api'
import type { Emphasis, Strong } from 'mdast'

const transformAuthor = (author: ConversationNodeMessage['author']): string => {
    switch (author.role) {
        case 'assistant':
            return 'ChatGPT'
        case 'user':
            return 'You'
        case 'tool':
            return `Plugin${author.name ? ` (${author.name})` : ''}`
        default:
            return author.role
    }
}

/**
 * Convert the content based on the type of message
 */
const transformContent = (
    content: ConversationNodeMessage['content'],
    metadata: ConversationNodeMessage['metadata'],
) => {
    switch (content.content_type) {
        case 'text':
            return content.parts?.join('\n') || ''
        case 'code':
            return content.text || ''
        case 'tether_quote':
            return `> ${content.title || content.text || ''}`
        case 'tether_browsing_code':
            return '' // TODO: implement
        case 'tether_browsing_display': {
            const metadataList = metadata?._cite_metadata?.metadata_list
            if (Array.isArray(metadataList) && metadataList.length > 0) {
                return metadataList.map(({ title, url }) => {
                    return `> [${title}](${url})`
                }).join('\n')
            }
            return ''
        }
        default:
            return ''
    }
}

/**
 * Remove some markdown syntaxes from the content
 */
const reformatContent = (input: string) => {
    const root = fromMarkdown(input)
    flatMap(root, (item) => {
        // Replace strong/bold with text
        if (item.type === 'strong') return (item as Strong).children
        // Replace emphasis/italic with text
        if (item.type === 'emphasis') return (item as Emphasis).children

        return [item]
    })
    return toMarkdown(root)
}

export async function exportToText() {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const { conversationNodes } = processConversation(rawConversation, conversationChoices)
    const text = conversationNodes.map(({ message }) => {
        if (!message || !message.content) return null

        const author = transformAuthor(message.author)
        let content = transformContent(message.content, message.metadata)

        // User's message will not be reformatted
        if (message.author.role !== 'user' && content) {
            content = reformatContent(content)
        }
        return `${author}:\n${content}`
    }).filter(Boolean).join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))

    return true
}
