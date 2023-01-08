import html2canvas from 'html2canvas'
import sentinel from 'sentinel-js'
import { chatGPTAvatarSVG, fileCode, iconCamera, iconCopy, iconMarkdown } from './icons'
import { copyToClipboard, downloadFile, downloadUrl, escapeHtml, getBase64FromImg, onloadSafe, sleep, timestamp } from './utils'
import templateHtml from './template.html?raw'

type ConversationLineNode = |
{ type: 'text'; text: string } |
{ type: 'image'; src: string } |
{ type: 'code'; code: string } |
{ type: 'code-block'; lang: string; code: string } |
{ type: 'link'; text: string; href: string } |
{ type: 'ordered-list-item'; items: string[] } |
{ type: 'unordered-list-item'; items: string[] } |
{ type: 'table'; headers: string[]; rows: string[][] }

type ConversationLine = ConversationLineNode[]

interface Conversation {
    author: {
        name: string
        avatar: string
    }
    lines: ConversationLine[]
}

main()

function main() {
    onloadSafe(() => {
        const nav = document.querySelector('nav')
        if (!nav) {
            console.error('Failed to locate the nav element. Please report this issue to the developer.')
            return
        }

        const copyHtml = `${iconCopy}Copy Text`
        const copiedHtml = `${iconCopy}Copied`
        const onCopyText = (e: MouseEvent) => {
            const items = getConversation()
            if (items.length === 0) return alert('No conversation found. Please send a message first.')

            const text = conversationToText(items)
            copyToClipboard(text)

            const menuItem = e.target as HTMLAnchorElement
            menuItem.innerHTML = copiedHtml
            setTimeout(() => {
                menuItem.innerHTML = copyHtml
            }, 3000)
        }

        const divider = createDivider()
        const textExport = createMenuItem(iconCopy, 'Copy Text', onCopyText)
        const pngExport = createMenuItem(iconCamera, 'Screenshot', exportToPng)
        const mdExport = createMenuItem(iconMarkdown, 'Export Markdown', exportToMarkdown)
        const htmlExport = createMenuItem(fileCode, 'Export WebPage', exportToHtml)
        const container = createMenuContainer()
        container.append(textExport, pngExport, mdExport, htmlExport, divider)
    })
}

function createMenuContainer() {
    const container = document.createElement('div')
    container.id = 'exporter-menu'
    container.className = 'pt-1'

    const chatList = document.querySelector('nav > div.overflow-y-auto')
    if (chatList) {
        chatList.after(container)
        sentinel.on('nav > div.overflow-y-auto', (el) => {
            const nav = document.querySelector('nav')!
            if (container.parentElement !== nav) {
                el.after(container)
            }
        })
    }
    else {
        const nav = document.querySelector('nav')!
        nav.append(container)
        sentinel.on('nav', (el) => {
            if (container.parentElement !== nav) {
                el.append(container)
            }
        })
    }

    return container
}

function createDivider() {
    const divider = document.createElement('div')
    divider.className = 'border-b border-white/20'
    return divider
}

function createMenuItem(icon: string, title: string, onClick: (e: MouseEvent) => void) {
    const menuItem = document.createElement('a')
    menuItem.className = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
    menuItem.removeAttribute('href')
    menuItem.innerHTML = `${icon}${title}`
    menuItem.addEventListener('click', onClick)

    return menuItem
}

function exportToMarkdown() {
    const items = getConversation()
    if (items.length === 0) return alert('No conversation found. Please send a message first.')

    const text = conversationToMarkdown(items)
    downloadFile(`chatgpt-${timestamp()}.md`, 'text/markdown', text)
}

function exportToHtml() {
    const items = getConversation()
    if (items.length === 0) return alert('No conversation found. Please send a message first.')

    const lang = document.documentElement.lang ?? 'en'
    const conversationHtml = items.map((item) => {
        const { author: { name, avatar }, lines } = item

        const avatarEl = name === 'ChatGPT'
            ? `${chatGPTAvatarSVG}`
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

    const fileName = `ChatGPT-${timestamp()}.html`
    downloadFile(fileName, 'text/html', html)
}

async function exportToPng() {
    const thread = document.querySelector('main .group')?.parentElement as HTMLElement
    if (!thread || thread.children.length === 0) return

    // hide bottom bar
    thread.children[thread.children.length - 1].classList.add('hidden')

    await sleep(100)

    const canvas = await html2canvas(thread, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: thread.scrollWidth,
        windowHeight: thread.scrollHeight,
    })

    // restore the layout
    thread.children[thread.children.length - 1].classList.remove('hidden')

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const fileName = `ChatGPT-${timestamp()}.png`
    downloadUrl(fileName, dataUrl)
}

function getConversation(): Conversation[] {
    const items: Conversation[] = []
    document.querySelectorAll('main .group').forEach((item) => {
        const avatarEl = item.querySelector<HTMLImageElement>('span img:not([aria-hidden="true"])')
        // actually we can get the name from the avatar's alt
        // but let's keep it anonymous for privacy reasons
        const name = avatarEl?.getAttribute('alt') ? 'You' : 'ChatGPT'
        const avatar = avatarEl ? getBase64FromImg(avatarEl) : ''

        const textNode = <HTMLDivElement>item.querySelector('.markdown') ?? item.querySelector('.w-full .whitespace-pre-wrap')
        if (!textNode) return

        const lines = parseTextNode(textNode)
        items.push({ author: { name, avatar }, lines })
    })

    return items
}

function parseTextNode(textNode: HTMLDivElement): ConversationLine[] {
    const warningBoxClass = 'bg-orange-500/10'
    const childNodes = textNode.childNodes ? Array.from(textNode.childNodes) : []
    const validChildNodes = childNodes.filter((c) => {
        // filter out non-element and non-text nodes
        if (!(c instanceof Element || c instanceof Text)) return false

        // filter out the alert box
        return !(c instanceof Element && c.classList.contains(warningBoxClass))
    })
    if (validChildNodes.length === 0) return [[{ type: 'text', text: textNode.textContent ?? '' }]]
    if (validChildNodes.length === 1 && validChildNodes[0] instanceof Text) return [[{ type: 'text', text: validChildNodes[0].textContent ?? '' }]]

    const lines: ConversationLine[] = []
    Array.from(textNode.children).forEach((child) => {
        if (child.classList.contains(warningBoxClass)) return

        switch (child.tagName.toUpperCase()) {
            case 'PRE': {
                const codeEl = child.querySelector('code')
                if (codeEl) {
                    const code = codeEl.textContent ?? ''
                    const classList = Array.from(codeEl.classList)
                    const lang = classList.find(c => c.startsWith('language-'))?.replace('language-', '') ?? ''
                    lines.push([{ type: 'code-block', lang, code }])
                }
                break
            }
            case 'OL': {
                const items = Array.from(child.children).map(item => item.textContent ?? '')
                lines.push([{ type: 'ordered-list-item', items }])
                break
            }
            case 'UL': {
                const items = Array.from(child.children).map(item => item.textContent ?? '')
                lines.push([{ type: 'unordered-list-item', items }])
                break
            }
            case 'TABLE': {
                const headers = Array.from(child.querySelector('thead tr')?.children ?? []).map(item => item.textContent ?? '')
                const rows = Array.from(child.querySelector('tbody')?.children ?? []).map(row => Array.from(row.children).map(item => item.textContent ?? ''))
                lines.push([{ type: 'table', headers, rows }])
                break
            }
            case 'P':
            default: {
                const line: ConversationLine = []
                const nodes = Array.from(child.childNodes)
                if (nodes.length === 0) {
                    const text = child.textContent ?? ''
                    line.push({ type: 'text', text })
                }
                else {
                    nodes.forEach((item) => {
                        switch (item.nodeType) {
                            // code
                            case 1: {
                                // detect is it a link
                                if ('href' in item) {
                                    const href = (<HTMLAnchorElement>item).getAttribute('href') ?? ''
                                    const text = item.textContent ?? href
                                    line.push({ type: 'link', text, href })
                                }
                                // detect is it an image
                                else if ((<HTMLImageElement>item).tagName?.toUpperCase() === 'IMG') {
                                    const src = (<HTMLImageElement>item).getAttribute('src') ?? ''
                                    line.push({ type: 'image', src })
                                }
                                else {
                                    const text = item.textContent ?? ''
                                    line.push({ type: 'code', code: text })
                                }
                                break
                            }
                            // text
                            case 3:
                            default: {
                                const text = item.textContent ?? ''
                                line.push({ type: 'text', text })
                                break
                            }
                        }
                    })
                }
                lines.push(line)
                break
            }
        }
    })

    return lines
}

function conversationToText(conversation: Conversation[]) {
    return conversation.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map(line => lineToText(line)).join('\r\n\r\n')
        return `${name}:\r\n${text}`
    }).join('\r\n\r\n')
}

function conversationToMarkdown(conversation: Conversation[]) {
    return conversation.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map(line => lineToText(line)).join('\r\n\r\n')
        return `#### ${name}:\r\n${text}`
    }).join('\r\n\r\n')
}

function lineToText(line: ConversationLine): string {
    return line.map((item) => {
        switch (item.type) {
            case 'text': return item.text
            case 'image': return '[image]'
            case 'link': return `[${item.text}](${item.href})`
            case 'ordered-list-item': return item.items.map((item, index) => `${index + 1}. ${item}`).join('\r\n')
            case 'unordered-list-item': return item.items.map(item => `- ${item}`).join('\r\n')
            case 'code': return `\`${item.code}\``
            case 'code-block': return `\`\`\`${item.lang}\r\n${item.code}\`\`\``
            case 'table': return transformTableToMarkdown(item.headers, item.rows)
            default: return ''
        }
    }).join('')
}

function transformTableToMarkdown(headers: string[], rows: string[][]): string {
    let markdown = ''

    // Find the maximum width of each column
    const columnWidths: number[] = []
    for (let i = 0; i < headers.length; i++) {
        let maxWidth = headers[i].length
        rows.forEach((row) => {
            maxWidth = Math.max(maxWidth, row[i].length)
        })
        columnWidths.push(maxWidth)
    }

    // Add the headers
    markdown += `${headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ')}\n`
    markdown += `${headers.map((_header, i) => '-'.repeat(columnWidths[i])).join(' | ')}\n`

    // Add the rows
    rows.forEach((row) => {
        markdown += `${row.map((cell, i) => cell.padEnd(columnWidths[i])).join(' | ')}\n`
    })

    return markdown
}

