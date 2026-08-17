import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation, shouldSkipMessageInExport } from '../api'
import { KEY_SOURCES_ENABLED, KEY_THINKING_ENABLED, KEY_TIMESTAMP_24H, KEY_TIMESTAMP_ENABLED, KEY_TIMESTAMP_MARKDOWN, baseUrl } from '../constants'
import i18n from '../i18n'
import { checkIfConversationStarted } from '../page'
import { transformContentReferences } from '../utils/citations'
import { buildZipFileName, downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toMarkdown } from '../utils/markdown'
import { ScriptStorage } from '../utils/storage'
import { standardizeLineBreaks } from '../utils/text'
import { dateStr, timestamp, unixTimestampToISOString } from '../utils/utils'
import type { ApiConversationWithId, Citation, ConversationNodeMessage, ConversationResult, ThinkingContent } from '../api'
import type { ExportMeta } from '../ui/SettingContext'
import type { PartInfo } from '../utils/download'

export async function exportToMarkdown(fileNameFormat: string, metaList: ExportMeta[]) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId, true)
    const enableThinking = ScriptStorage.get<boolean>(KEY_THINKING_ENABLED) ?? false
    const conversation = processConversation(rawConversation, { enableThinking })
    const markdown = conversationToMarkdown(conversation, metaList)

    const fileName = getFileNameWithFormat(fileNameFormat, 'md', { title: conversation.title, chatId, createTime: conversation.createTime, updateTime: conversation.updateTime })
    downloadFile(fileName, 'text/markdown', standardizeLineBreaks(markdown))

    return true
}

export async function exportAllToMarkdown(fileNameFormat: string, apiConversations: ApiConversationWithId[], metaList?: ExportMeta[], projectName?: string, partIndex?: number, totalParts?: number) {
    const zip = new JSZip()
    const filenameMap = new Map<string, number>()
    const enableThinking = ScriptStorage.get<boolean>(KEY_THINKING_ENABLED) ?? false
    const conversations = apiConversations.map(x => processConversation(x, { enableThinking }))
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
    const partInfo: PartInfo | undefined = (partIndex != null && totalParts != null)
        ? { part: partIndex, total: totalParts }
        : undefined
    downloadFile(buildZipFileName('markdown', projectName, partInfo), 'application/zip', blob)

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
    const enableSources = ScriptStorage.get<boolean>(KEY_SOURCES_ENABLED) ?? true

    const content = conversationNodes.map(({ message, thinking }) => {
        if (!message || !message.content) return null

        if (shouldSkipMessageInExport(message)) return null

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
        const thinkingBlock = thinking ? formatThinkingMarkdown(thinking) : ''

        const postSteps: Array<(input: string) => string> = []
        if (message.author.role === 'assistant') {
            // Handle new-style content references (web search citations with Unicode markers)
            postSteps.push(input => transformContentReferences(input, message.metadata, {
                includeSourceList: enableSources,
                sourceListLabel: i18n.t('Sources'),
            }))
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

        return `#### ${author}:\n${timestampHtml}${thinkingBlock}${content}`
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
            console.warn('[Exporter] Unsupported Content:', content.content_type, content)
            return postProcess(`[Unsupported Content: ${content.content_type}]`)
    }
}

function formatThinkingMarkdown(thinking: ThinkingContent): string {
    const durationLabel = thinking.durationSeconds != null
        ? `Thought for ${thinking.durationSeconds} seconds`
        : 'Thinking'

    const parts: string[] = []

    if (thinking.activities?.length) {
        parts.push(thinking.activities.map(a => `- ${a}`).join('\n'))
    }

    const thoughts = thinking.thoughts
        .map(t => t.content || t.summary)
        .filter(Boolean)
        .join('\n\n')
    if (thoughts) parts.push(thoughts)

    const body = parts.join('\n\n')

    if (!body) return ''

    return `<details>\n<summary>${durationLabel}</summary>\n\n${body}\n\n</details>\n\n`
}
