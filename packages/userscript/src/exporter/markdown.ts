import { getConversations } from '../api'
import { fromMarkdown, toMarkdown } from '../utils/markdown'
import { downloadFile, getFileNameWithFormat } from '../utils/download'
import { standardizeLineBreaks } from '../utils/text'
import { checkIfConversationStarted } from '../page'

export async function exportToMarkdown(fileNameFormat: string) {
    if (!checkIfConversationStarted()) {
        alert('Please start a conversation first.')
        return
    }

    // const { id, title, createTime, conversations } = await getConversations()
    const { conversations } = await getConversations()

    // const date = ''
    // const source = `${baseUrl}/chat/${id}`
    // const frontMatter = `---
    // title: ${title}
    // date: ${date}
    // source: ${source}
    // ---`

    const content = conversations.map((item) => {
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

    const fileName = getFileNameWithFormat(fileNameFormat, 'md')
    downloadFile(fileName, 'text/markdown', standardizeLineBreaks(markdown))
}
