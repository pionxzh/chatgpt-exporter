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
    postProcess: (input: string) => string = input => input,
) => {
    switch (content.content_type) {
        case 'text':
            return postProcess(content.parts?.join('\n') || '')
        case 'code':
            return postProcess(content.text || '')
        case 'execution_output':
            return postProcess(content.text || '')
        case 'tether_quote':
            return postProcess(`> ${content.title || content.text || ''}`)
        case 'tether_browsing_code':
            return postProcess('') // TODO: implement
        case 'tether_browsing_display': {
            const metadataList = metadata?._cite_metadata?.metadata_list
            if (Array.isArray(metadataList) && metadataList.length > 0) {
                return postProcess(metadataList.map(({ title, url }) => `> [${title}](${url})`).join('\n'))
            }
            return postProcess('')
        }
        case 'multimodal_text': {
            return content.parts?.map((part) => {
                if (typeof part === 'string') return postProcess(part)
                if (part.asset_pointer) return `![image](${part.asset_pointer})`
                return postProcess('[Unsupported multimodal content]')
            }).join('\n') || ''
        }
        default:
            return postProcess('[Unsupported Content]')
    }
}

/**
 * Transform foot notes in assistant's message
 */
const transformFootNotes = (
    input: string,
    metadata: ConversationNodeMessage['metadata'],
) => {
    // 【11†(PrintWiki)】
    const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g
    return input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
        const citation = metadata?.citations?.find(cite => cite.metadata?.extra?.cited_message_idx === +citeIndex)
        // We simply remove the foot note mark in text output
        if (citation) return ''

        return match
    })
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

        if (message.recipient !== 'all') return null // ChatGPT is talking to tool
        // Skip tool's intermediate message.
        //
        // HACK: we special case the content_type 'multimodal_text' here because it is used by
        // the dall-e tool to return the image result, and we do want to show that.
        if (message.author.role === 'tool' && message.content.content_type !== 'multimodal_text') return null

        const author = transformAuthor(message.author)
        let content = transformContent(message.content, message.metadata)
        if (message.author.role === 'assistant') {
            content = transformFootNotes(content, message.metadata)
        }

        // User's message will not be reformatted
        if (message.author.role !== 'user' && content) {
            content = reformatContent(content)
        }
        return `${author}:\n${content}`
    }).filter(Boolean).join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))

    return true
}
