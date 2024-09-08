import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import i18n from '../i18n'
import { checkIfConversationStarted } from '../page'
import { copyToClipboard } from '../utils/clipboard'
import { flatMap, fromMarkdown, toMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import type { ConversationNodeMessage } from '../api'
import type { Emphasis, Strong } from 'mdast'

export async function exportToText() {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const chatId = await getCurrentChatId()
    // All image in text output will be replaced with `[image]`
    // So we don't need to waste time to download them
    const rawConversation = await fetchConversation(chatId, false)

    const { conversationNodes } = processConversation(rawConversation)
    const text = conversationNodes
        .map(({ message }) => transformMessage(message))
        .filter(Boolean)
        .join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))

    return true
}

const LatexRegex = /(\s\$\$.+\$\$\s|\s\$.+\$\s|\\\[.+\\\]|\\\(.+\\\))|(^\$$[\S\s]+^\$$)|(^\$\$[\S\s]+^\$\$$)/gm

function transformMessage(message?: ConversationNodeMessage) {
    if (!message || !message.content) return null

    // ChatGPT is talking to tool
    if (message.recipient !== 'all') return null

    // Skip tool's intermediate message.
    if (message.author.role === 'tool') {
        if (
            // HACK: we special case the content_type 'multimodal_text' here because it is used by
            // the dalle tool to return the image result, and we do want to show that.
            message.content.content_type !== 'multimodal_text'
            // Code execution result with image
            && !(
                message.content.content_type === 'execution_output'
                && message.metadata?.aggregate_result?.messages?.some(msg => msg.message_type === 'image')
            )
        ) {
            return null
        }
    }

    const author = transformAuthor(message.author)
    let content = transformContent(message.content, message.metadata)

    const matches = content.match(LatexRegex)
    if (matches) {
        let index = 0
        content = content.replace(LatexRegex, () => {
            // Replace it with `╬${index}╬` to avoid markdown processor ruin the formula
            return `╬${index++}╬`
        })
    }

    if (message.author.role === 'assistant') {
        content = transformFootNotes(content, message.metadata)
    }

    // Only message from assistant will be reformatted
    if (message.author.role === 'assistant' && content) {
        content = reformatContent(content)
    }

    if (matches) {
        // Replace `╬${index}╬` back to the original latex
        content = content.replace(/╬(\d+)╬/g, (_, index) => {
            return matches[+index]
        })
    }

    return `${author}:\n${content}`
}

/**
 * Convert the content based on the type of message
 */
function transformContent(
    content: ConversationNodeMessage['content'],
    metadata: ConversationNodeMessage['metadata'],
) {
    switch (content.content_type) {
        case 'text':
            return content.parts?.join('\n') || ''
        case 'code':
            return content.text || ''
        case 'execution_output':
            if (metadata?.aggregate_result?.messages) {
                return metadata.aggregate_result.messages
                    .filter(msg => msg.message_type === 'image')
                    .map(() => '[image]')
                    .join('\n')
            }
            return content.text || ''
        case 'tether_quote':
            return `> ${content.title || content.text || ''}`
        case 'tether_browsing_code':
            return '' // TODO: implement
        case 'tether_browsing_display': {
            const metadataList = metadata?._cite_metadata?.metadata_list
            if (Array.isArray(metadataList) && metadataList.length > 0) {
                return metadataList.map(({ title, url }) => `> [${title}](${url})`).join('\n')
            }
            return ''
        }
        case 'multimodal_text': {
            return content.parts?.map((part) => {
                if (typeof part === 'string') return part
                // We show `[image]` for multimodal as the base64 string is too long. This is bad for sharing pure text.
                if (part.asset_pointer) return '[image]'
                return '[Unsupported multimodal content]'
            }).join('\n') || ''
        }
        default:
            return '[Unsupported Content]'
    }
}

/**
 * Remove some markdown syntaxes from the content
 */
function reformatContent(input: string) {
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

function transformAuthor(author: ConversationNodeMessage['author']): string {
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
 * Transform foot notes in assistant's message
 */
function transformFootNotes(
    input: string,
    metadata: ConversationNodeMessage['metadata'],
) {
    // 【11†(PrintWiki)】
    const footNoteMarkRegex = /【(\d+)†\((.+?)\)】/g
    return input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
        const citation = metadata?.citations?.find(cite => cite.metadata?.extra?.cited_message_idx === +citeIndex)
        // We simply remove the foot note mark in text output
        if (citation) return ''

        return match
    })
}
