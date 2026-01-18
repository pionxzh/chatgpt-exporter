import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { KEY_TIMESTAMP_24H, KEY_TIMESTAMP_ENABLED, KEY_TIMESTAMP_MARKDOWN, baseUrl } from '../constants'
import i18n from '../i18n'
import { checkIfConversationStarted } from '../page'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toMarkdown } from '../utils/markdown'
import { ScriptStorage } from '../utils/storage'
import { standardizeLineBreaks } from '../utils/text'
import { dateStr, timestamp, unixTimestampToISOString } from '../utils/utils'
import type { ApiConversationWithId, Citation, ConversationNodeMessage, ConversationResult } from '../api'
import type { ExportMeta } from '../ui/SettingContext'

export async function exportToMarkdown(fileNameFormat: string, metaList: ExportMeta[]) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId, true)
    const conversation = processConversation(rawConversation)
    const markdown = conversationToMarkdown(conversation, metaList)

    const fileName = getFileNameWithFormat(fileNameFormat, 'md', { title: conversation.title, chatId, createTime: conversation.createTime, updateTime: conversation.updateTime })
    downloadFile(fileName, 'text/markdown', standardizeLineBreaks(markdown))

    return true
}

export async function exportAllToMarkdown(fileNameFormat: string, apiConversations: ApiConversationWithId[], metaList?: ExportMeta[]) {
    const zip = new JSZip()
    const filenameMap = new Map<string, number>()
    const conversations = apiConversations.map(x => processConversation(x))
    conversations.forEach((conversation) => {
        let fileName = getFileNameWithFormat(fileNameFormat, 'md', {
            title: conversation.title,
            chatId: conversation.id,
            createTime: conversation.createTime,
            updateTime: conversation.updateTime,
        })
        if (filenameMap.has(fileName)) {
            const count = filenameMap.get(fileName) ?? 1
            filenameMap.set(fileName, count + 1)
            fileName = `${fileName.slice(0, -3)} (${count}).md`
        }
        else {
            filenameMap.set(fileName, 1)
        }
        const content = conversationToMarkdown(conversation, metaList)
        zip.file(fileName, content)
    })

    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9,
        },
    })
    downloadFile('chatgpt-export-markdown.zip', 'application/zip', blob)

    return true
}

const LatexRegex = /(\s\$\$.+\$\$\s|\s\$.+\$\s|\\\[.+\\\]|\\\(.+\\\))|(^\$$[\S\s]+^\$$)|(^\$\$[\S\s]+^\$\$$)/gm

function conversationToMarkdown(conversation: ConversationResult, metaList?: ExportMeta[]) {
    const { id, title, model, modelSlug, createTime, updateTime, conversationNodes } = conversation
    const source = `${baseUrl}/c/${id}`

    const _metaList = metaList
        ?.filter(x => !!x.name)
        .map(({ name, value }) => {
            const val = value
                .replace('{title}', title)
                .replace('{date}', dateStr())
                .replace('{timestamp}', timestamp())
                .replace('{source}', source)
                .replace('{model}', model)
                .replace('{model_name}', modelSlug)
                .replace('{create_time}', unixTimestampToISOString(createTime))
                .replace('{update_time}', unixTimestampToISOString(updateTime))

            return `${name}: ${val}`
        })
    ?? []
    const frontMatter = _metaList.length > 0
        ? `---\n${_metaList.join('\n')}\n---\n\n`
        : ''

    const enableTimestamp = ScriptStorage.get<boolean>(KEY_TIMESTAMP_ENABLED) ?? false
    const timeStampMarkdown = ScriptStorage.get<boolean>(KEY_TIMESTAMP_MARKDOWN) ?? false
    const timeStamp24H = ScriptStorage.get<boolean>(KEY_TIMESTAMP_24H) ?? false

    const content = conversationNodes.map(({ message }) => {
        if (!message || !message.content) return null

        // ChatGPT is talking to tool
        if (message.recipient !== 'all') return null

        // Skip "thinking" content (hidden reasoning steps from thinking models)
        if (message.content.content_type === 'thoughts') return null
        if (message.content.content_type === 'reasoning_recap') return null

        // Skip messages marked as visually hidden (e.g., internal system prompts)
        if (message.metadata?.is_visually_hidden_from_conversation) return null

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

        const timestamp = message?.create_time ?? ''
        const showTimestamp = enableTimestamp && timeStampMarkdown && timestamp
        let timestampHtml = ''
        if (showTimestamp) {
            const date = new Date(timestamp * 1000)
            // format: 20:12 / 08:12 PM
            const conversationTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: !timeStamp24H })
            timestampHtml = `<time datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>\n\n`
        }

        const author = transformAuthor(message.author)

        const postSteps: Array<(input: string) => string> = []
        if (message.author.role === 'assistant') {
            // Handle new-style content references (web search citations with Unicode markers)
            postSteps.push(input => transformContentReferences(input, message.metadata))
            // Handle old-style footnotes (【11†(PrintWiki)】 format)
            postSteps.push(input => transformFootNotes(input, message.metadata))
        }
        // Only message from assistant will be reformatted
        if (message.author.role === 'assistant') {
            postSteps.push((input) => {
                // Replace mathematical formula annotation
                input = input
                    .replace(/^\\\[(.+)\\\]$/gm, '$$$$$1$$$$')
                    .replace(/\\\[/g, '$')
                    .replace(/\\\]/g, '$')
                    .replace(/\\\(/g, '$')
                    .replace(/\\\)/g, '$')
                const matches = input.match(LatexRegex)
                // Skip code block as the following steps can potentially break the code
                const isCodeBlock = /```/.test(input)
                if (!isCodeBlock && matches) {
                    let index = 0
                    input = input.replace(LatexRegex, () => {
                        // Replace it with `╬${index}╬` to avoid markdown processor ruin the formula
                        return `╬${index++}╬`
                    })
                }

                let transformed = toMarkdown(fromMarkdown(input))

                if (!isCodeBlock && matches) {
                    // Replace `╬${index}╬` back to the original latex
                    transformed = transformed.replace(/╬(\d+)╬/g, (_, index) => {
                        return matches[+index]
                    })
                }

                return transformed
            })
        }
        const postProcess = (input: string) => postSteps.reduce((acc, fn) => fn(acc), input)
        const content = transformContent(message.content, message.metadata, postProcess)

        return `#### ${author}:\n${timestampHtml}${content}`
    }).filter(Boolean).join('\n\n')

    const markdown = `${frontMatter}# ${title}\n\n${content}`

    return markdown
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

    const citationList: Citation[] = []
    const output = input.replace(footNoteMarkRegex, (match, citeIndex, _evidenceText) => {
        const citation = metadata?.citations?.find(cite => cite.metadata?.extra?.cited_message_idx === +citeIndex)
        if (citation) {
            citationList.push(citation)
            // Use markdown caret to represent foot note ([^1])
            return `[^${citeIndex}]`
        }

        return match
    })
    const citationText = citationList.map((citation) => {
        const citeIndex = citation.metadata?.extra?.cited_message_idx ?? 1
        const citeTitle = citation.metadata?.title ?? 'No title'
        return `[^${citeIndex}]: ${citeTitle}`
    }).join('\n')

    // Foot notes are placed at the end of the conversation node, not the end of the whole document
    return `${output}\n\n${citationText}`
}

/**
 * Transform new-style content references (web search citations) in assistant's message.
 * Citations appear as plain text like "citeturn1search1" or "citeturn0search2turn1search8".
 * The metadata.content_references array contains the URL and title for each citation.
 */
function transformContentReferences(
    input: string,
    metadata: ConversationNodeMessage['metadata'],
): string {
    const contentRefs = metadata?.content_references
    if (!contentRefs || contentRefs.length === 0) return input

    // Sort by matched_text length descending to match longer patterns first
    // (e.g., "citeturn0search2turn1search8" before "citeturn0search2")
    const sortedRefs = [...contentRefs].sort((a, b) => (b.matched_text?.length || 0) - (a.matched_text?.length || 0))

    const usedRefs: Array<{ url: string; title: string }> = []
    let output = input

    for (const ref of sortedRefs) {
        if (!ref.matched_text) continue

        // For some reason, the matched_text contains non-breaking spaces but the content doesn't!
        const matchedText = ref.matched_text.replaceAll(/\s/gu, ' ')

        switch (ref.type) {
            case 'sources_footnote':
                break
            case 'nav_list':
                output = output.replaceAll(matchedText, ref.alt || '')
                break
            default: {
                // Get URL and title from items array (new format) or direct fields
                const item = ref.items?.[0]
                const url = item?.url || ref.url
                const title = item?.title || ref.title

                if (!url) continue

                // Replace all occurrences of this matched_text
                if (output.includes(ref.matched_text)) {
                    usedRefs.push({ url, title: title || url })
                    const refIndex = usedRefs.length
                    output = output.replaceAll(matchedText, `[^${refIndex}]`)
                }
            }
        }
    }

    // Add footnote definitions at the end
    if (usedRefs.length > 0) {
        const footnotes = usedRefs.map((ref, index) => {
            return `[^${index + 1}]: [${ref.title}](${ref.url})`
        }).join('\n')
        output = `${output}\n\n${footnotes}`
    }

    return output
}

/**
 * Convert the content based on the type of message
 */
function transformContent(
    content: ConversationNodeMessage['content'],
    metadata: ConversationNodeMessage['metadata'],
    postProcess: (input: string) => string,
) {
    switch (content.content_type) {
        case 'text':
            return postProcess(content.parts?.join('\n') || '')
        case 'code':
            return `Code:\n\`\`\`\n${content.text}\n\`\`\`` || ''
        case 'execution_output':
            if (metadata?.aggregate_result?.messages) {
                return metadata.aggregate_result.messages
                    .filter(msg => msg.message_type === 'image')
                    .map(msg => `![image](${msg.image_url})`)
                    .join('\n')
            }
            return postProcess(`Result:\n\`\`\`\n${content.text}\n\`\`\`` || '')
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
                if (part.content_type === 'image_asset_pointer') return `![image](${part.asset_pointer})`
                if (part.content_type === 'audio_transcription') return `[audio] ${part.text}`
                if (part.content_type === 'audio_asset_pointer') return null
                if (part.content_type === 'real_time_user_audio_video_asset_pointer') return null
                return postProcess('[Unsupported multimodal content]')
            }).join('\n') || ''
        }
        default:
            return postProcess(`[Unsupported Content: ${content.content_type}]`)
    }
}
