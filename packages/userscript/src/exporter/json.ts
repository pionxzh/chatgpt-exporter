import JSZip from 'jszip'
import { type ApiConversationWithId, fetchConversation, getCurrentChatId, processConversation } from '../api'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { checkIfConversationStarted, getConversationChoice } from '../page'

export async function exportToJson(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)

    const fileName = getFileNameWithFormat(fileNameFormat, 'json', { title: conversation.title })
    const content = conversationToJson(rawConversation)
    downloadFile(fileName, 'application/json', content)

    return true
}

export async function exportAllToJson(fileNameFormat: string, apiConversations: ApiConversationWithId[]) {
    const zip = new JSZip()
    const conversations = apiConversations.map(x => ({
        conversation: processConversation(x),
        rawConversation: x,
    }))
    conversations.forEach(({ conversation, rawConversation }) => {
        const fileName = getFileNameWithFormat(fileNameFormat, 'json', { title: conversation.title })
        const content = conversationToJson(rawConversation)
        zip.file(fileName, content)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadFile('chatgpt-export.zip', 'application/zip', blob)

    return true
}

function conversationToJson(conversation: ApiConversationWithId) {
    return JSON.stringify(conversation)
}
