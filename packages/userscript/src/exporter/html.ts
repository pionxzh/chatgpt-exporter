import { ChatGPTAvatar } from '../icons'
import { getConversation } from '../parser'
import { downloadFile, getFileNameWithFormat } from '../utils/download'

import templateHtml from '../template.html?raw'

export function exportToHtml(fileNameFormat: string) {
    const conversations = getConversation()
    if (conversations.length === 0) return alert('No conversation found. Please send a message first.')

    const lang = document.documentElement.lang ?? 'en'
    const conversationHtml = conversations.map((item) => {
        const { author: { name, avatar }, lines } = item

        const avatarEl = name === 'ChatGPT'
            ? `${ChatGPTAvatar}`
            : `<img src="${avatar}" alt="${name}" />`

        const linesHtml = lines.map((line) => {
            const lineHtml = line.map((item) => {
                switch (item.type) {
                    case 'text':
                        return escapeHtml(item.text)
                    case 'image':
                        return `<img src="${item.src}" referrerpolicy="no-referrer" />`
                    case 'code':
                        return `<code>${escapeHtml(item.code)}</code>`
                    case 'code-block':
                        return `<pre><code class="language-${item.lang}">${escapeHtml(item.code)}</code></pre>`
                    case 'link':
                        return `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.text)}</a>`
                    case 'ordered-list-item':
                        return `<ol>${item.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`
                    case 'unordered-list-item':
                        return `<ul>${item.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
                    case 'table': {
                        const header = item.headers.map(item => `<th>${escapeHtml(item)}</th>`).join('')
                        const body = item.rows.map(row => `<tr>${row.map(item => `<td>${escapeHtml(item)}</td>`).join('')}</tr>`).join('')
                        return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
                    }
                    default:
                        return ''
                }
            }).join('')

            const skipTags = ['pre', 'ul', 'ol', 'table']
            if (skipTags.some(tag => lineHtml.startsWith(`<${tag}>`))) return lineHtml
            return `<p>${lineHtml}</p>`
        }).join('')

        return `
<div class="conversation-item">
<div class="author">
    ${avatarEl}
    </div>
<div class="conversation-content">
${linesHtml}
</div>
</div>`
    }).join('')

    const html = templateHtml
        .replace('{{time}}', new Date().toISOString())
        .replace('{{lang}}', lang)
        .replace('{{content}}', conversationHtml)

    const fileName = getFileNameWithFormat(fileNameFormat, 'html')
    downloadFile(fileName, 'text/html', html)
}

function escapeHtml(html: string) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
