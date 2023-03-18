import type { Emphasis, Strong } from 'mdast'
import { copyToClipboard } from '../utils/clipboard'
import { standardizeLineBreaks } from '../utils/text'
import { fetchConversation, getCurrentChatId, processConversation } from '../api'
import { flatMap, fromMarkdown, toMarkdown } from '../utils/markdown'
import { checkIfConversationStarted, getConversationChoice } from '../page'

export async function exportToText() {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const { conversationNodes } = processConversation(rawConversation, conversationChoices)
    const text = conversationNodes.map((item) => {
        const author = item.message?.author.role === 'assistant' ? 'ChatGPT' : 'You'
        const content = item.message?.content.parts.join('\n') ?? ''
        let message = content

        // User's message will not be reformatted
        if (author === 'ChatGPT') {
            const root = fromMarkdown(content)
            flatMap(root, (item) => {
                // Replace strong/bold with text
                if (item.type === 'strong') return (item as Strong).children
                // Replace emphasis/italic with text
                if (item.type === 'emphasis') return (item as Emphasis).children

                return [item]
            })
            message = toMarkdown(root)
        }
        return `${author}:\n${message}`
    }).join('\n\n')

    copyToClipboard(standardizeLineBreaks(text))

    return true
}

export async function exportToTextFromIndex(index: number) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return false
    }

    const chatId = await getCurrentChatId()
    const rawConversation = await fetchConversation(chatId)
    const conversationChoices = getConversationChoice()
    const { conversationNodes } = processConversation(rawConversation, conversationChoices)

    const text = conversationNodes[index].message?.content.parts.join('\n') ?? ''

    copyToClipboard(standardizeLineBreaks(text))
    return true
}
