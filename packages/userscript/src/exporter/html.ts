import JSZip from 'jszip'
import { baseUrl, fetchConversation, getCurrentChatId, processConversation } from '../api'
import { checkIfConversationStarted, getConversationChoice, getUserAvatar } from '../page'
import templateHtml from '../template.html?raw'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toHtml } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import { dateStr, getColorScheme } from '../utils/utils'
import type { ApiConversationWithId, ConversationResult } from '../api'

export async function exportToHtml(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const userAvatar = await getUserAvatar()

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)
    const html = conversationToHtml(conversation, userAvatar)

    const fileName = getFileNameWithFormat(fileNameFormat, 'html', { title: conversation.title })
    downloadFile(fileName, 'text/html', standardizeLineBreaks(html))

    return true
}

export async function exportAllToHtml(fileNameFormat: string, apiConversations: ApiConversationWithId[]) {
    const userAvatar = await getUserAvatar()

    const zip = new JSZip()
    const conversations = apiConversations.map(x => processConversation(x))
    conversations.forEach((conversation) => {
        const fileName = getFileNameWithFormat(fileNameFormat, 'html', { title: conversation.title })
        const content = conversationToHtml(conversation, userAvatar)
        zip.file(fileName, content)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadFile('chatgpt-export.zip', 'application/zip', blob)

    return true
}

function conversationToHtml(conversation: ConversationResult, avatar: string) {
    const { id, title, conversationNodes } = conversation

    const conversationHtml = conversationNodes.map((item) => {
        const author = item.message?.author.role === 'assistant' ? 'ChatGPT' : 'You'
        const model = item.message?.metadata?.model_slug === 'gpt-4' ? 'GPT-4' : 'GPT-3'
        const authorType = author === 'ChatGPT' ? model : 'user'
        const avatarEl = author === 'ChatGPT'
            ? '<svg width="41" height="41"><use xlink:href="#chatgpt" /></svg>'
            : `<img alt="${author}" />`
        const content = item.message?.content.parts.join('\n') ?? ''
        let conversationContent = content

        // User's message will not be reformatted
        if (author === 'ChatGPT') {
            const root = fromMarkdown(content)
            conversationContent = toHtml(root)
        }

        const timestamp = item.message?.create_time ?? ''
        let conversationDate = ''
        let conversationTime = ''

        if (timestamp) {
            const date = new Date(timestamp * 1000)
            const isoStr = date.toISOString()
            // format: 2022-01-01 10:12:00 UTC
            conversationDate = `${isoStr.split('T')[0]} ${isoStr.split('T')[1].split('.')[0]} UTC`
            // format: 10:12 AM
            conversationTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }

        return `
<div class="conversation-item">
    <div class="author ${authorType}">
        ${avatarEl}
    </div>
    <div class="conversation-content-wrapper">
        <div class="conversation-content">
            ${conversationContent}
        </div>
    </div>
    ${timestamp ? `<div class="time" title="${conversationDate}">${conversationTime}</div>` : ''}
</div>`
    }).join('\n\n')

    const date = dateStr()
    const time = new Date().toISOString()
    const source = `${baseUrl}/chat/${id}`
    const lang = document.documentElement.lang ?? 'en'
    const theme = getColorScheme()

    const html = templateHtml
        .replaceAll('{{title}}', title)
        .replaceAll('{{date}}', date)
        .replaceAll('{{time}}', time)
        .replaceAll('{{source}}', source)
        .replaceAll('{{lang}}', lang)
        .replaceAll('{{theme}}', theme)
        .replaceAll('{{avatar}}', avatar)
        .replaceAll('{{content}}', conversationHtml)
    return html
}
