import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { getBase64FromImg } from './utils/dom'
import type { ApiConversation, ContentReferenceSource, ThinkingContent } from './api'

declare global {
    interface Window {
        __reactRouterContext?: ReactRouterContext
        /** Older/newer ChatGPT builds have used this name for the same router. */
        __reactRouterDataRouter?: ReactRouterContext
    }
}

interface ReactRouterContext {
    state?: {
        loaderData?: Record<string, unknown>
    }
}

interface ConversationLike {
    current_node: string
    mapping: Record<string, unknown>
    title?: string
    id?: string
    conversation_id?: string
}

function isConversationLike(value: unknown): value is ConversationLike {
    if (!value || typeof value !== 'object') return false
    const candidate = value as Record<string, unknown>
    return typeof candidate.current_node === 'string'
        && !!candidate.mapping
        && typeof candidate.mapping === 'object'
}

function cloneConversation(value: ConversationLike): ApiConversation {
    return JSON.parse(JSON.stringify(value)) as ApiConversation
}

/**
 * Find a conversation embedded in ChatGPT's router state. This is useful for
 * temporary chats because they are rendered by the app but are not available
 * through the normal /backend-api/conversation/:id endpoint.
 */
function findConversation(value: unknown, chatId: string | undefined, seen: Set<object>, depth = 0): ConversationLike | null {
    if (!value || typeof value !== 'object' || seen.has(value)) return null
    seen.add(value)

    if (isConversationLike(value)) {
        const candidate = value as ConversationLike
        const candidateId = candidate.id ?? candidate.conversation_id
        if (!chatId || chatId.startsWith('__temporary__') || !candidateId || candidateId === chatId) {
            return candidate
        }
    }

    // Router state is small, but keeping a depth limit makes this safe if the
    // app starts storing unrelated, deeply nested data in the loader state.
    if (depth >= 8) return null

    if (Array.isArray(value)) {
        for (const item of value) {
            const result = findConversation(item, chatId, seen, depth + 1)
            if (result) return result
        }
        return null
    }

    for (const child of Object.values(value)) {
        const result = findConversation(child, chatId, seen, depth + 1)
        if (result) return result
    }
    return null
}

function getConversationFromRouter(chatId?: string): ApiConversation | null {
    const contexts = [unsafeWindow.__reactRouterContext, unsafeWindow.__reactRouterDataRouter]
    const seen = new Set<object>()

    for (const context of contexts) {
        const loaderData = context?.state?.loaderData
        const conversation = findConversation(loaderData, chatId, seen)
        if (conversation) {
            try {
                return cloneConversation(conversation)
            }
            catch (error) {
                console.error('[Exporter] Failed to copy temporary chat data', error)
            }
        }
    }
    return null
}

function mergePageConversationData(routerConversation: ApiConversation, domConversation: ApiConversation, chatId?: string): ApiConversation {
    const merged = cloneConversation(routerConversation)
    const domNodesById = new Map(Object.values(domConversation.mapping).map(node => [node.id, node]))
    const domNodesByRole: Record<'user' | 'assistant', ApiConversation['mapping'][string][]> = {
        user: [],
        assistant: [],
    }

    for (const node of Object.values(domConversation.mapping)) {
        const role = node.message?.author.role
        if (role === 'user' || role === 'assistant') {
            domNodesByRole[role].push(node)
        }
    }

    const roleIndexes = { user: 0, assistant: 0 }
    for (const node of Object.values(merged.mapping)) {
        const message = node.message
        const role = message?.author.role
        if (!message || (role !== 'user' && role !== 'assistant')) continue

        const roleNodes = domNodesByRole[role]
        const roleIndex = roleIndexes[role]++
        const domNode = domNodesById.get(node.id) ?? roleNodes[roleIndex]
        if (!domNode?.message || domNode.message.author.role !== role) continue

        const domReferences = domNode.message.metadata?.content_references
        if (domReferences?.length) {
            message.metadata = {
                ...(message.metadata ?? {}),
                content_references: [
                    ...(message.metadata?.content_references ?? []),
                    ...domReferences,
                ],
            }
        }
        if (!node.thinking && domNode.thinking) node.thinking = domNode.thinking
    }

    if (isTemporaryChat() || chatId?.startsWith('__temporary__')) {
        merged.is_temporary_chat = true
    }
    return merged
}

function getElementText(element: HTMLElement): string {
    const copy = element.cloneNode(true) as HTMLElement
    copy.querySelectorAll('button, [role="button"], svg, time, textarea, input').forEach(child => child.remove())
    return (copy.innerText || copy.textContent || '')
        .replace(/\u00A0/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

function isFaviconUrl(value: string): boolean {
    try {
        const url = new URL(value, location.href)
        return url.hostname === 'www.google.com' && url.pathname === '/s2/favicons'
    }
    catch {
        return false
    }
}

function getFaviconSource(value: string): ContentReferenceSource | null {
    try {
        const iconUrl = new URL(value, location.href)
        if (!isFaviconUrl(iconUrl.href)) return null

        const domain = iconUrl.searchParams.get('domain')?.trim()
        if (!domain) return null

        const sourceUrl = new URL(/^https?:\/\//i.test(domain) ? domain : `https://${domain}`)
        if (!['http:', 'https:'].includes(sourceUrl.protocol)) return null

        return { title: sourceUrl.hostname, url: sourceUrl.origin }
    }
    catch {
        return null
    }
}

function getSourceLinks(element: HTMLElement): ContentReferenceSource[] {
    const sources: ContentReferenceSource[] = []
    const seen = new Set<string>()
    const sourceHosts = new Set<string>()

    for (const anchor of Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
        let url: URL
        try {
            url = new URL(anchor.href, location.href)
        }
        catch {
            continue
        }

        if (!['http:', 'https:'].includes(url.protocol)) continue
        if (isFaviconUrl(url.href)) continue
        if (url.origin === location.origin) continue
        if (/(^|\.)chatgpt\.com$/i.test(url.hostname) || /(^|\.)chat\.openai\.com$/i.test(url.hostname)) continue
        if (seen.has(url.href)) continue
        seen.add(url.href)
        sourceHosts.add(url.hostname)

        const title = anchor.getAttribute('aria-label')?.trim()
            || anchor.getAttribute('title')?.trim()
            || getElementText(anchor).replace(/\s+/g, ' ')
            || url.hostname

        sources.push({ title, url: url.href })
    }

    // Some web-search cards expose only a Google favicon in the DOM. It does
    // not contain the exact result URL, but its `domain` query parameter still
    // lets us preserve the source website instead of exporting a meaningless
    // favicon image.
    for (const image of Array.from(element.querySelectorAll<HTMLImageElement>('img'))) {
        const source = getFaviconSource(image.currentSrc || image.src)
        if (!source || !source.url) continue

        const hostname = new URL(source.url).hostname
        if (sourceHosts.has(hostname) || seen.has(source.url)) continue
        seen.add(source.url)
        sourceHosts.add(hostname)
        sources.push(source)
    }

    return sources
}

function getThinkingCandidateText(element: HTMLElement): string {
    const copy = element.cloneNode(true) as HTMLElement
    if (copy.matches('.markdown')) return ''
    copy.querySelectorAll('.markdown, [data-message-author-role], svg, textarea, input').forEach(child => child.remove())
    return (copy.innerText || copy.textContent || '')
        .replace(/\u00A0/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

function parseThinkingDuration(text: string): number | undefined {
    const minuteMatch = text.match(/(?:thought|thinking|reasoning).*?(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?(?:\s*(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?)?/i)
    if (minuteMatch) {
        return Number(minuteMatch[1]) * 60 + (minuteMatch[2] ? Number(minuteMatch[2]) : 0)
    }

    const secondMatch = text.match(/(?:thought|thinking|reasoning).*?(\d+(?:\.\d+)?)\s*(?:s|sec(?:ond)?s?)\b/i)
    if (secondMatch) return Number(secondMatch[1])

    return undefined
}

/**
 * Extract only reasoning that ChatGPT has rendered in the page. This may be
 * a collapsed "Thought for ..." summary or a visible reasoning panel; it is
 * deliberately not an attempt to recover hidden chain-of-thought data.
 */
function getVisibleThinking(element: HTMLElement): ThinkingContent | undefined {
    const candidates = [
        ...(element.matches('details, [data-testid*="thought" i], [data-testid*="thinking" i], [data-testid*="reasoning" i], [aria-label*="thought" i], [aria-label*="thinking" i], [aria-label*="reasoning" i], [class*="thought" i], [class*="thinking" i], [class*="reasoning" i]')
            ? [element]
            : []),
        ...Array.from(element.querySelectorAll<HTMLElement>('details, [data-testid*="thought" i], [data-testid*="thinking" i], [data-testid*="reasoning" i], [aria-label*="thought" i], [aria-label*="thinking" i], [aria-label*="reasoning" i], [class*="thought" i], [class*="thinking" i], [class*="reasoning" i]')),
    ]

    const visibleCandidates = candidates
        .filter(candidate => candidate.getAttribute('aria-hidden') !== 'true' && !candidate.hidden && !candidate.closest('.markdown'))
        .map((candidate) => {
            const text = getThinkingCandidateText(candidate)
            const label = candidate.getAttribute('aria-label')?.trim()
                || candidate.getAttribute('title')?.trim()
                || ''
            return { candidate, label, text }
        })
        .filter(({ text, label }) => /\b(?:thought|thinking|reasoning)\b/i.test(`${label} ${text}`))
        .sort((a, b) => b.text.length - a.text.length)

    const candidate = visibleCandidates[0]
    if (!candidate) return undefined

    const combinedText = [candidate.label, candidate.text].filter(Boolean).join('\n').trim()
    const durationSeconds = parseThinkingDuration(combinedText)
    const body = candidate.text
        .replace(/thought\s+for\s+\d+(?:\.\d+)?\s*(?:s|sec(?:ond)?s?|m(?:in(?:ute)?s?)?)(?:\s*\d+(?:\.\d+)?\s*(?:s|sec(?:ond)?s?))?/ig, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    const summary = candidate.label || candidate.text.split('\n')[0] || 'Thinking'

    return {
        thoughts: [{ summary, content: body || summary }],
        ...(durationSeconds != null ? { durationSeconds } : {}),
    }
}

function getMessageTimestamp(element: HTMLElement, fallback: number): number {
    const timestamp = element.closest('[data-message-id]')?.getAttribute('data-created-at')
        ?? element.getAttribute('data-created-at')
        ?? element.querySelector('time[datetime]')?.getAttribute('datetime')

    if (!timestamp) return fallback

    const numericTimestamp = Number(timestamp)
    if (Number.isFinite(numericTimestamp)) {
        return numericTimestamp > 1e12 ? numericTimestamp / 1000 : numericTimestamp
    }

    const dateTimestamp = new Date(timestamp).getTime()
    return Number.isFinite(dateTimestamp) ? dateTimestamp / 1000 : fallback
}

function getConversationFromDom(chatId?: string): ApiConversation | null {
    const turns = Array.from(document.querySelectorAll<HTMLElement>('main [data-testid^="conversation-turn-"]'))
    const messages: Array<{
        role: 'user' | 'assistant'
        text: string
        id: string
        createTime: number
        sources: ContentReferenceSource[]
        thinking?: ThinkingContent
    }> = []
    const usedIds = new Set<string>()
    const fallbackTime = Date.now() / 1000

    turns.forEach((turn, index) => {
        const candidates = turn.matches('[data-message-author-role]')
            ? [turn]
            : Array.from(turn.querySelectorAll<HTMLElement>('[data-message-author-role]'))
        const messageElement = candidates.find((candidate) => {
            const role = candidate.getAttribute('data-message-author-role')
            return role === 'user' || role === 'assistant'
        })
        if (!messageElement) return

        const role = messageElement.getAttribute('data-message-author-role') as 'user' | 'assistant'
        const contentElement = messageElement.querySelector<HTMLElement>(role === 'assistant' ? '.markdown' : '.whitespace-pre-wrap')
            ?? messageElement
        let text = getElementText(contentElement)

        // Keep images in Markdown/HTML exports when the raw temporary-chat
        // data is unavailable. The links are the same browser-authorized URLs
        // that ChatGPT rendered for the current page.
        const images = Array.from(contentElement.querySelectorAll<HTMLImageElement>('img'))
            .map((image) => {
                const src = image.currentSrc || image.src
                if (!src || isFaviconUrl(src)) return ''
                const alt = image.alt || 'image'
                return `![${alt}](${src})`
            })
            .filter(Boolean)
        if (images.length > 0) text = [text, ...images].filter(Boolean).join('\n\n')
        if (!text) return

        const messageIdElement = messageElement.matches('[data-message-id]')
            ? messageElement
            : messageElement.closest('[data-message-id]') ?? messageElement.querySelector('[data-message-id]')
        const baseId = messageIdElement?.getAttribute('data-message-id') || `temporary-message-${index + 1}`
        let messageId = baseId
        let duplicateIndex = 2
        while (usedIds.has(messageId)) messageId = `${baseId}-${duplicateIndex++}`
        usedIds.add(messageId)

        messages.push({
            role,
            text,
            id: messageId,
            createTime: getMessageTimestamp(messageElement, fallbackTime + index / 1000),
            sources: role === 'assistant' ? getSourceLinks(turn) : [],
            thinking: role === 'assistant' ? getVisibleThinking(messageElement) : undefined,
        })
    })

    if (messages.length === 0) return null

    const rootId = 'temporary-chat-root'
    const mapping: ApiConversation['mapping'] = {
        [rootId]: { id: rootId, children: [] },
    }

    let parent = rootId
    for (const { role, text, id, createTime, sources, thinking } of messages) {
        const contentReferences = sources.length > 0
            ? [{
                    type: 'sources_footnote' as const,
                    start_idx: 0,
                    end_idx: 0,
                    sources,
                }]
            : undefined

        mapping[id] = {
            id,
            parent,
            children: [],
            ...(thinking ? { thinking } : {}),
            message: {
                author: { role, metadata: {} },
                content: { content_type: 'text', parts: [text] },
                create_time: createTime,
                id,
                metadata: contentReferences ? { content_references: contentReferences } : {},
                recipient: 'all',
                status: 'finished_successfully',
                weight: 1,
            },
        }
        mapping[parent].children.push(id)
        parent = id
    }

    const firstUserMessage = messages.find(message => message.role === 'user')
    const title = document.querySelector('main h1')?.textContent?.trim()
        || firstUserMessage?.text.split('\n')[0].slice(0, 80)
        || 'Temporary Chat'
    const id = chatId || `__temporary__${messages[0].id}`

    return {
        conversation_id: id,
        create_time: messages[0].createTime,
        current_node: messages[messages.length - 1].id,
        mapping,
        moderation_results: [],
        title,
        is_archived: false,
        ...(isTemporaryChat() || id.startsWith('__temporary__') ? { is_temporary_chat: true } : {}),
        update_time: messages[messages.length - 1].createTime,
    }
}

export function getChatIdFromUrl() {
    // /share/1e5sf-asdf-1234
    // /c/1e5sf-asdf-1234
    // /g/1e5sf-asdf-1234/c/1e5sf-asdf-1234
    const match = location.pathname.match(/^\/(?:share|c|g\/[a-z0-9-]+\/c)\/([a-z0-9-]+)/i)
    if (match) return match[1]

    // Temporary chats normally stay on the root route and use a query
    // parameter instead of /c/:id.
    const conversationId = new URLSearchParams(location.search).get('conversationId')
    if (conversationId) return conversationId

    return null
}

export function isTemporaryChat() {
    return new URLSearchParams(location.search).get('temporary-chat') === 'true'
}

/**
 * Return the conversation currently rendered by ChatGPT. Temporary chats are
 * not persisted in history, so this may come from router state or the DOM.
 */
export function getConversationFromPage(chatId?: string): ApiConversation | null {
    const routerConversation = getConversationFromRouter(chatId)
    const domConversation = getConversationFromDom(chatId)
    if (!routerConversation) return domConversation
    if (!domConversation) return routerConversation
    return mergePageConversationData(routerConversation, domConversation, chatId)
}

export function isSharePage() {
    return location.pathname.startsWith('/share')
        && !location.pathname.endsWith('/continue')
}

export function getConversationFromSharePage() {
    return getConversationFromRouter()
}

const defaultAvatar = 'data:image/svg+xml,%3Csvg%20stroke%3D%22currentColor%22%20fill%3D%22none%22%20stroke-width%3D%221.5%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20style%3D%22color%3A%20white%3B%20background%3A%20%23ab68ff%3B%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2021v-2a4%204%200%200%200-4-4H8a4%204%200%200%200-4%204v2%22%3E%3C%2Fpath%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E'
export async function getUserAvatar(): Promise<string> {
    try {
        const avatars = Array.from(document.querySelectorAll<HTMLImageElement>('img[alt]:not([aria-hidden])'))
        const avatar = avatars.find(avatar => avatar.src.startsWith('https://cdn.auth0.com/avatars/'))
        if (avatar) return getBase64FromImg(avatar)
    }
    catch (e) {
        console.error(e)
    }

    return defaultAvatar
}

export function checkIfConversationStarted() {
    return !!document.querySelector('[data-testid^="conversation-turn-"]')
}
