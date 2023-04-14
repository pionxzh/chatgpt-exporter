import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { baseUrl } from '../constants'
import { checkIfConversationStarted, getConversationChoice } from '../page'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import { dateStr, timestamp } from '../utils/utils'
import type { ApiConversationWithId, ConversationResult } from '../api'
import type { ExportMeta } from '../ui/SettingContext'

export async function exportToMarkdown(fileNameFormat: string, metaList: ExportMeta[]) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)
    const markdown = conversationToMarkdown(conversation, metaList)

    const fileName = getFileNameWithFormat(fileNameFormat, 'md', { title: conversation.title, chatId })
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

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadFile('chatgpt-export.zip', 'application/zip', blob)

    return true
}

function conversationToMarkdown(conversation: ConversationResult, metaList?: ExportMeta[]) {
    const { id, title, model, modelSlug, conversationNodes } = conversation
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
                .replace('{modelSlug}', modelSlug)

            return `${name}: ${val}`
        })
    ?? []
    const frontMatter = _metaList.length > 0
        ? `---\n${_metaList.join('\n')}\n---\n\n`
        : ''

    const content = conversationNodes.map((item) => {
        const author = item.message?.author.role === 'assistant' ? 'ChatGPT' : 'You'
        const content = item.message?.content.parts.join('\n') ?? ''
        let message = content

        // User's message will not be reformatted
        if (author === 'ChatGPT') {
            const root = fromMarkdown(content)
            message = toMarkdown(root)
        }
        return `#### ${author}:\n${message}`
    }).join('\n\n')

    const markdown = `${frontMatter}# ${title}\n\n${content}`

    return markdown
}
