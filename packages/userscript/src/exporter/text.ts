import type { Emphasis, Strong } from 'mdast'
import { copyToClipboard } from '../utils/clipboard'
import { standardizeLineBreaks } from '../utils/text'
import { getConversations } from '../api'
import { flatMap, fromMarkdown, toMarkdown } from '../utils/markdown'
import { checkIfConversationStarted } from '../page'

export async function exportToText() {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return
    }

    const { conversations } = await getConversations()
    const text = conversations.map((item) => {
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
}
