import html2canvas from 'html2canvas'
import { chatGPTAvatarSVG, fileCode, iconCamera, iconCopy } from './icons'
import './style.scss'
import { copyToClipboard, downloadFile, downloadUrl, getBase64FromImg, onloadSafe, sleep } from './utils'
import templateHtml from './template.html?raw'

type ConversationLine = |
{ type: 'text'; text: string } |
{ type: 'image'; src: string } |
{ type: 'code'; code: string } |
{ type: 'code-block'; lang: string; code: string } |
{ type: 'link'; text: string; href: string }

interface ConversationItem {
    author: {
        name: string
        avatar: string
    }
    lines: ConversationLine[][]
}

main()

function main() {
    onloadSafe(() => {
        const firstItem = document.querySelector('[class^="Navigation__NavMenuItem"]')
        if (!firstItem) return

        const container = firstItem.parentElement
        if (!container) return

        const divider = document.createElement('div')
        divider.className = 'Navigation__NavMenuDivider'
        container.appendChild(divider)

        const copyHtml = `${iconCopy}Copy`
        const copiedHtml = `${iconCopy}Copied`
        const copyButton = <HTMLAnchorElement>firstItem.cloneNode(true)
        copyButton.removeAttribute('href')
        copyButton.innerHTML = copyHtml
        copyButton.addEventListener('click', () => {
            const items = getConversation()
            if (items.length === 0) {
                // eslint-disable-next-line no-alert
                alert('No conversation found. Please send a message first.')
                return
            }

            const text = conversationToText(items)
            copyToClipboard(text)

            copyButton.innerHTML = copiedHtml
            setTimeout(() => {
                copyButton.innerHTML = copyHtml
                copyButton.classList.remove('copied')
            }, 3000)
        })
        container.appendChild(copyButton)

        const imageButton = <HTMLAnchorElement>firstItem.cloneNode(true)
        imageButton.removeAttribute('href')
        imageButton.innerHTML = `${iconCamera}Screenshot`
        imageButton.addEventListener('click', () => exportToPng())
        container.appendChild(imageButton)

        const htmlButton = <HTMLAnchorElement>firstItem.cloneNode(true)
        htmlButton.removeAttribute('href')
        htmlButton.innerHTML = `${fileCode}Export WebPage`
        htmlButton.addEventListener('click', () => exportToHtml())
        container.appendChild(htmlButton)
    })
}

function exportToHtml() {
    const items = getConversation()
    if (items.length === 0) {
        // eslint-disable-next-line no-alert
        alert('No conversation found. Please send a message first.')
        return
    }

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
                        return item.text
                    case 'image':
                        return `<img src="${item.src}" referrerpolicy="no-referrer" />`
                    case 'code':
                        return `<code>${item.code}</code>`
                    case 'code-block':
                        return `<pre><code class="language-${item.lang}">${item.code}</code></pre>`
                    case 'link':
                        return `<a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.text}</a>`
                    default:
                        return ''
                }
            }).join('')
            return lineHtml.startsWith('<pre>') ? lineHtml : `<p>${lineHtml}</p>`
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

    const fileName = `ChatGPT-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.html`
    downloadFile(fileName, 'text/html', html)
}

async function exportToPng() {
    const thread = document.querySelector('[class^="ThreadLayout__NodeWrapper"]') as HTMLElement
    if (!thread) return

    // hide irrelevant elements
    thread.style.height = 'auto'
    document.querySelectorAll('[class^="_app__AlertWrapper"], [class^="Thread__PositionForm"], [class^="ThreadLayout__BottomSpacer"]').forEach((element) => {
        element.classList.add('hidden')
    })

    const threadWrapper = document.querySelector('[class^="Thread__Wrapper"]')
    if (threadWrapper && threadWrapper.children.length > 1) {
        const leftSidebar = threadWrapper.children[1] as HTMLElement
        const mainContent = threadWrapper.children[0] as HTMLElement
        leftSidebar.style.display = 'none'
        mainContent.style.paddingLeft = '0'
    }

    await sleep(100)

    const canvas = await html2canvas(thread, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: thread.scrollWidth,
        windowHeight: thread.scrollHeight,
    })

    // restore the layout
    if (threadWrapper && threadWrapper.children.length > 1) {
        const leftSidebar = threadWrapper.children[1] as HTMLElement
        const mainContent = threadWrapper.children[0] as HTMLElement
        leftSidebar.style.display = ''
        mainContent.style.paddingLeft = ''
    }
    thread.style.height = ''
    document.querySelectorAll('[class^="_app__AlertWrapper"], [class^="Thread__PositionForm"], [class^="ThreadLayout__BottomSpacer"]').forEach((element) => {
        element.classList.remove('hidden')
    })

    const dataUrl = canvas.toDataURL('image/png', 1)
        .replace(/^data:image\/[^;]/, 'data:application/octet-stream')
    const fileName = `ChatGPT-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.png`
    downloadUrl(fileName, dataUrl)
}

function getConversation(): ConversationItem[] {
    const thread = document.querySelector('[class^="ThreadLayout__NodeWrapper"]')
    if (!thread) return []

    const items: ConversationItem[] = []
    thread.querySelectorAll('[class^="ConversationItem__Message"]').forEach((item) => {
        const avatarEl = item.querySelector<HTMLImageElement>('[class^="Avatar__Wrapper"] img:not([aria-hidden="true"])')
        // actually we can get the name from the avatar's alt
        // but let's keep it anonymous for privacy reasons
        const name = avatarEl?.getAttribute('alt') ? 'You' : 'ChatGPT'
        const avatar = avatarEl ? getBase64FromImg(avatarEl) : ''

        const textNode = <HTMLDivElement>item.children?.[1]?.firstChild?.firstChild
        if (!textNode) return

        const lines = parseTextNode(textNode)
        items.push({ author: { name, avatar }, lines })
    })

    return items
}

function parseTextNode(textNode: HTMLDivElement): ConversationLine[][] {
    const children = textNode.children
    if (!children || children.length === 0) {
        return [[{ type: 'text', text: textNode.textContent ?? '' }]]
    }

    const lines: ConversationLine[][] = []
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
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
            case 'P':
            default: {
                const line: ConversationLine[] = []
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
    }

    return lines
}

function conversationToText(conversation: ConversationItem[]) {
    return conversation.map((item) => {
        const { author: { name }, lines } = item
        const text = lines.map((line) => {
            return line.map((item) => {
                switch (item.type) {
                    case 'text': return item.text
                    case 'image': return '[image]'
                    case 'link': return `[${item.text}](${item.href})`
                    case 'code': return `\`${item.code}\``
                    case 'code-block': return `\`\`\`${item.lang}\r\n${item.code}\`\`\``
                    default: return ''
                }
            }).join('')
        }).join('\r\n\r\n')
        return `${name}:\r\n${text}`
    }).join('\r\n\r\n')
}
