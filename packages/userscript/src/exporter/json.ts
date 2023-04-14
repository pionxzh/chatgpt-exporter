import JSZip from 'jszip'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import i18n from '../i18n'
import { checkIfConversationStarted, getConversationChoice } from '../page'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import type { ApiConversationWithId } from '../api'

export async function exportToJson(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert(i18n.t('Please start a conversation first'))
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const conversation = processConversation(rawConversation, conversationChoices)

    const fileName = getFileNameWithFormat(fileNameFormat, 'json', { title: conversation.title, chatId })
    const content = conversationToJson(rawConversation)
    downloadFile(fileName, 'application/json', content)

    return true
}

export async function exportAllToJson(fileNameFormat: string, apiConversations: ApiConversationWithId[]) {
    const zip = new JSZip()
    const filenameMap = new Map<string, number>()
    const conversations = apiConversations.map(x => ({
        conversation: processConversation(x),
        rawConversation: x,
    }))
    conversations.forEach(({ conversation, rawConversation }) => {
        let fileName = getFileNameWithFormat(fileNameFormat, 'json', {
            title: conversation.title,
            chatId: conversation.id,
        })
        if (filenameMap.has(fileName)) {
            const count = filenameMap.get(fileName) ?? 1
            filenameMap.set(fileName, count + 1)
            fileName = `${fileName.slice(0, -5)} (${count}).json`
        }
        else {
            filenameMap.set(fileName, 1)
        }
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
