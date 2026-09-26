import type { Emphasis, Strong } from 'mdast'
import { fetchConversation, getCurrentChatId, processConversation, shouldSkipMessageInExport } from '../api'
import i18n from '../i18n'
import { checkIfConversationStarted } from '../page'
import { checkIfTemporaryChatIsExportable } from '../temporaryChat'
import { transformContentReferences } from '../utils/citations'
import { copyToClipboard } from '../utils/clipboard'
import { protectMath } from '../utils/latex'
import { flatMap, fromMarkdown, toMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import { transformAuthor } from '../utils/author'
import type { ConversationNodeMessage } from '../api'

export async function exportToText() {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    if (!checkIfTemporaryChatIsExportable()) {
        alert(i18n.t('Temporary chat could not be captured'))
        return false
    }

    const chatId = await getCurrentChatId()
    // All image in text output will be replaced with `[image]`
    // So we don't need to waste time to download them
    const rawConversation = await fetchConversation(chatId)

    const { conversationNodes } = processConversation(rawConversation)
    const text = conversationNodes
        .map(({ message }) => transformMessage(message))
        .filter(Boolean)
        .join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))

    return true
}

function transformMessage(message?: ConversationNodeMessage) {
    if (!message || !message.content) return null

    if (shouldSkipMessageInExport(message)) return null

    const author = transformAuthor(message.author)
    let content = transformContent(message.content, message.metadata)

    if (message.author.role === 'assistant') {
        content = transformContentReferences(content, message.metadata, {
            output: 'text',
            inlineReferenceMode: 'alt',
            includeSourceList: false,
        })
        content = transformFootNotes(content, message.metadata)
    }

    // Only message from assistant will be reformatted
    if (message.author.role === 'assistant' && content) {
        // Keep formulas out of the markdown round trip, as in the markdown export
        const { text, restore } = protectMath(content)
        content = restore(reformatContent(text))
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
                if (part.content_type === 'image_asset_pointer') return '[image]'
                if (part.content_type === 'audio_transcription') return `[audio] ${part.text}`
                if (part.content_type === 'audio_asset_pointer') return null
                if (part.content_type === 'real_time_user_audio_video_asset_pointer') return null
                return '[Unsupported multimodal content]'
            }).join('\n') || ''
        }
        default:
            console.warn('[Exporter] Unsupported Content:', content.content_type, content)
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
    return toMarkdown(root, input)
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
        if (citation) return ''

        return match
    })
}
