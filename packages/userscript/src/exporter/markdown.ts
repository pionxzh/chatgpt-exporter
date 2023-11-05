import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { KEY_TIMESTAMP_24H, KEY_TIMESTAMP_ENABLED, KEY_TIMESTAMP_HTML, baseUrl } from '../constants'
import i18n from '../i18n'
import { checkIfConversationStarted, getConversationChoice } from '../page'
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
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)
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
    downloadFile('chatgpt-export.zip', 'application/zip', blob)

    return true
}

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
            return postProcess(`Code:\n\`\`\`\n${content.text}\n\`\`\`` || '')
        case 'execution_output':
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
    const timeStampHtml = ScriptStorage.get<boolean>(KEY_TIMESTAMP_HTML) ?? false
    const timeStamp24H = ScriptStorage.get<boolean>(KEY_TIMESTAMP_24H) ?? false

    const content = conversationNodes.map(({ message }) => {
        if (!message || !message.content) return null

        if (message.recipient !== 'all') return null // ChatGPT is talking to tool
        // Skip tool's intermediate message.
        //
        // HACK: we special case the content_type 'multimodal_text' here because it is used by
        // the dall-e tool to return the image result, and we do want to show that.
        if (message.author.role === 'tool' && message.content.content_type !== 'multimodal_text') return null

        const timestamp = message?.create_time ?? ''
        const showTimestamp = enableTimestamp && timeStampHtml && timestamp
        let timestampHtml = ''
        if (showTimestamp) {
            const date = new Date(timestamp * 1000)
            // format: 20:12 / 08:12 PM
            const conversationTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: !timeStamp24H })
            timestampHtml = `<time datetime="${date.toISOString()}" title="${date.toLocaleString()}">${conversationTime}</time>\n\n`
        }

        const isUser = message.author.role === 'user'
        const author = transformAuthor(message.author)

        let postSteps: Array<(input: string) => string> = []
        if (message.author.role === 'assistant') {
            postSteps = [...postSteps, input => transformFootNotes(input, message.metadata)]
        }
        if (!isUser) { // User's message will not be reformatted
            postSteps = [...postSteps, input => toMarkdown(fromMarkdown(input))]
        }
        const postProcess = (input: string) => postSteps.reduce((acc, fn) => fn(acc), input)
        const content = transformContent(message.content, message.metadata, postProcess)

        return `#### ${author}:\n${timestampHtml}${content}`
    }).filter(Boolean).join('\n\n')

    const markdown = `${frontMatter}# ${title}\n\n${content}`

    return markdown
}
