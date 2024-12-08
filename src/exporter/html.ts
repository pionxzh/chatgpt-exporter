import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { KEY_TIMESTAMP_24H, KEY_TIMESTAMP_ENABLED, KEY_TIMESTAMP_HTML, baseUrl } from '../constants'
import i18n from '../i18n'
import { checkIfConversationStarted, getUserAvatar } from '../page'
import templateHtml from '../template.html?raw'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toHtml } from '../utils/markdown'
import { ScriptStorage } from '../utils/storage'
import { standardizeLineBreaks } from '../utils/text'
import { dateStr, getColorScheme, timestamp, unixTimestampToISOString } from '../utils/utils'
import type { ApiConversationWithId, ConversationNodeMessage, ConversationResult } from '../api'
import type { ExportMeta } from '../ui/SettingContext'

export async function exportToHtml(fileNameFormat: string, metaList: ExportMeta[]) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const userAvatar = await getUserAvatar()

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId, true)
    const conversation = processConversation(rawConversation)
    const html = conversationToHtml(conversation, userAvatar, metaList)

    const fileName = getFileNameWithFormat(fileNameFormat, 'html', { title: conversation.title, chatId, createTime: conversation.createTime, updateTime: conversation.updateTime })
    downloadFile(fileName, 'text/html', standardizeLineBreaks(html))

    return true
}

export async function exportAllToHtml(fileNameFormat: string, apiConversations: ApiConversationWithId[], metaList?: ExportMeta[]) {
    const userAvatar = await getUserAvatar()

    const zip = new JSZip()
    const filenameMap = new Map<string, number>()
    const conversations = apiConversations.map(x => processConversation(x))
    conversations.forEach((conversation) => {
        let fileName = getFileNameWithFormat(fileNameFormat, 'html', {
            title: conversation.title,
            chatId: conversation.id,
            createTime: conversation.createTime,
            updateTime: conversation.updateTime,
        })
        if (filenameMap.has(fileName)) {
            const count = filenameMap.get(fileName) ?? 1
            filenameMap.set(fileName, count + 1)
            fileName = `${fileName.slice(0, -5)} (${count}).html`
        }
        else {
            filenameMap.set(fileName, 1)
        }
        const content = conversationToHtml(conversation, userAvatar, metaList)
        zip.file(fileName, content)
    })

    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9,
        },
    })
    downloadFile('chatgpt-export-html.zip', 'application/zip', blob)

    return true
}

function conversationToHtml(conversation: ConversationResult, avatar: string, metaList?: ExportMeta[]) {
    const { id, title, model, modelSlug, createTime, updateTime, conversationNodes } = conversation

    const enableTimestamp = ScriptStorage.get<boolean>(KEY_TIMESTAMP_ENABLED) ?? false
    const timeStampHtml = ScriptStorage.get<boolean>(KEY_TIMESTAMP_HTML) ?? false
    const timeStamp24H = ScriptStorage.get<boolean>(KEY_TIMESTAMP_24H) ?? false

    const LatexRegex = /(\s\$\$.+?\$\$\s|\s\$.+?\$\s|\\\[.+?\\\]|\\\(.+?\\\))|(^\$$[\S\s]+?^\$$)|(^\$\$[\S\s]+?^\$\$\$)/gm

    const conversationHtml = conversationNodes.map(({ message }) => {
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
        const model = message?.metadata?.model_slug === 'gpt-4' ? 'GPT-4' : 'GPT-3'
        const authorType = message.author.role === 'user' ? 'user' : model
        const avatarEl = message.author.role === 'user'
            ? `<img alt="${author}" />`
            : '<svg width="41" height="41"><use xlink:href="#chatgpt" /></svg>'

        let postSteps: Array<(input: string) => string> = []
        if (message.author.role === 'assistant') {
            postSteps = [...postSteps, input => transformFootNotes(input, message.metadata)]
            postSteps.push((input) => {
                const matches = input.match(LatexRegex)

                // Skip code block as the following steps can potentially break the code
                const isCodeBlock = /```/.test(input)
                if (!isCodeBlock && matches) {
                    let index = 0
                    input = input.replace(LatexRegex, () => {
                        // Replace it with `╬${index}╬` to avoid processing from ruining the formula
                        return `╬${index++}╬`
                    })
                    input = input
                        .replace(/^\\\[(.+)\\\]$/gm, '$$$$$1$$$$')
                        .replace(/\\\[/g, '$$')
                        .replace(/\\\]/g, '$$')
                        .replace(/\\\(/g, '$')
                        .replace(/\\\)/g, '$')
                }

                let transformed = toHtml(fromMarkdown(input))

                if (!isCodeBlock && matches) {
                    // Replace `╬${index}╬` back to the original latex
                    transformed = transformed.replace(/╬(\d+)╬/g, (_, index) => {
                        return matches[+index]
                    })
                }

                return transformed
            })
        }
        if (message.author.role === 'user') {
            postSteps = [...postSteps, input => `<p class="no-katex">${escapeHtml(input)}</p>`]
        }
        const postProcess = (input: string) => postSteps.reduce((acc, fn) => fn(acc), input)
        const content = transformContent(message.content, message.metadata, postProcess)

        const timestamp = message?.create_time ?? ''
        const showTimestamp = enableTimestamp && timeStampHtml && timestamp
        let timestampHtml = ''
        let conversationTime = ''

        if (showTimestamp) {
            const date = new Date(timestamp * 1000)
            // format: 20:12 / 08:12 PM
            conversationTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: !timeStamp24H })
            timestampHtml = `<time class="time" datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>`
        }

        return `
<div class="conversation-item">
    <div class="author ${authorType}">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        <div class="conversation-content">
            ${content}
        </div>
    </div>
    ${timestampHtml}
</div>`
    }).filter(Boolean).join('\n\n')

    const date = dateStr()
    const time = new Date().toISOString()
    const source = `${baseUrl}/c/${id}`
    const lang = document.documentElement.lang ?? 'en'
    const theme = getColorScheme()

    const _metaList = metaList
        ?.filter(x => !!x.name)
        .map(({ name, value }) => {
            const val = value
                .replace('{title}', title)
                .replace('{date}', date)
                .replace('{timestamp}', timestamp())
                .replace('{source}', source)
                .replace('{model}', model)
                .replace('{mode_name}', modelSlug)
                .replace('{create_time}', unixTimestampToISOString(createTime))
                .replace('{update_time}', unixTimestampToISOString(updateTime))

            return [name, val] as const
        })
    ?? []
    const detailsHtml = _metaList.length > 0
        ? `<details>
    <summary>Metadata</summary>
    <div class="metadata_container">
        ${_metaList.map(([key, value]) => `<div class="metadata_item"><div>${key}</div><div>${value}</div></div>`).join('\n')}
    </div>
</details>`
        : ''

    const html = templateHtml
        .replaceAll('{{title}}', title)
        .replaceAll('{{date}}', date)
        .replaceAll('{{time}}', time)
        .replaceAll('{{source}}', source)
        .replaceAll('{{lang}}', lang)
        .replaceAll('{{theme}}', theme)
        .replaceAll('{{avatar}}', avatar)
        .replaceAll('{{details}}', detailsHtml)
        .replaceAll('{{content}}', conversationHtml)
    return html
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
        // We simply remove the foot note mark in html output
        if (citation) return ''

        return match
    })
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
                    .map(msg => `<img src="${msg.image_url}" height="${msg.height}" width="${msg.width}" />`)
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
                return postProcess(metadataList.map(({ title, url }) => {
                    return `> [${title}](${url})`
                }).join('\n'))
            }
            return postProcess('')
        }
        case 'multimodal_text': {
            return content.parts?.map((part) => {
                if (typeof part === 'string') return postProcess(part)
                if (part.asset_pointer) return `<img src="${part.asset_pointer}" height="${part.height}" width="${part.width}" />`
                return postProcess('[Unsupported multimodal content]')
            }).join('\n') || ''
        }
        default:
            return postProcess(`[Unsupported Content: ${content.content_type} ]`)
    }
}

function escapeHtml(html: string) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
