import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { checkIfConversationStarted, getConversationChoice } from '../page'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { fromMarkdown, toMarkdown } from '../utils/markdown'
import { standardizeLineBreaks } from '../utils/text'
import type { ApiConversationWithId, ConversationResult } from '../api'
// import { dateStr } from '../utils/utils'

export async function exportToMarkdown(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)
    const markdown = conversationToMarkdown(conversation)

    const fileName = getFileNameWithFormat(fileNameFormat, 'md', { title: conversation.title })
    downloadFile(fileName, 'text/markdown', standardizeLineBreaks(markdown))

    return true
}

export async function exportAllToMarkdown(fileNameFormat: string, apiConversations: ApiConversationWithId[]) {
    const zip = new JSZip()
    const conversations = apiConversations.map(x => processConversation(x))
    conversations.forEach((conversation) => {
        const fileName = getFileNameWithFormat(fileNameFormat, 'md', { title: conversation.title })
        const content = conversationToMarkdown(conversation)
        zip.file(fileName, content)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadFile('chatgpt-export.zip', 'application/zip', blob)

    return true
}

function conversationToMarkdown(conversation: ConversationResult) {
    const { conversationNodes } = conversation

    // const date = dateStr()
    // const source = `${baseUrl}/chat/${id}`
    // const frontMatter = `---
    // title: ${title}
    // date: ${date}
    // source: ${source}
    // ---`

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

    // const markdown = `${frontMatter}\n\n${content}`
    const markdown = content

    return markdown
}
