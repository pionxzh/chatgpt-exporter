import templateHtml from '../template.html?raw'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { dateStr, getColorScheme } from '../utils/utils'
import { standardizeLineBreaks } from '../utils/text'
import { baseUrl, getConversations } from '../api'
import { fromMarkdown, toHtml } from '../utils/markdown'
import { checkIfConversationStarted, getUserAvatar } from '../page'

export async function exportToHtml(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const { id, title, conversations } = await getConversations()

    const userAvatar = await getUserAvatar()

    const conversationHtml = conversations.map((item) => {
        const author = item.message?.author.role === 'assistant' ? 'ChatGPT' : 'You'
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
    <div class="author">
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
        .replaceAll('{{avatar}}', userAvatar)
        .replaceAll('{{content}}', conversationHtml)

    const fileName = getFileNameWithFormat(fileNameFormat, 'html')
    downloadFile(fileName, 'text/html', standardizeLineBreaks(html))

    return true
}
