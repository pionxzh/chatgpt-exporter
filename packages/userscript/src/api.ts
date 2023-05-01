import urlcat from 'urlcat'
import { baseUrl } from './constants'
import { getChatIdFromUrl } from './page'

interface ApiSession {
    accessToken: string
    expires: string
    user: {
        email: string
        groups: string[]
        id: string
        image: string
        name: string
        picture: string
    }
}

type ModelSlug = 'text-davinci-002-render-sha' | 'text-davinci-002-render-paid' | 'text-davinci-002-browse' | 'gpt-4'

interface MessageMeta {
    command: 'click' | 'search' | 'quote' | 'scroll' & (string & {})
    finish_details?: {
        stop: string
        type: 'stop' | 'interrupted' & (string & {})
    }
    model_slug?: ModelSlug & (string & {})
    timestamp_: 'absolute' & (string & {})
    _cite_metadata?: {
        citation_format: {
            name: 'tether_og' & (string & {})
        }
        metadata_list: Array<{
            title: string
            url: string
            text: string
        }>
    }
}

export type AuthorRole = 'system' | 'assistant' | 'user' | 'tool'

export interface ConversationNodeMessage {
    author: {
        role: AuthorRole
        name?: 'browser' & (string & {})
        metadata: unknown
    }
    content: {
        // chat response
        content_type: 'text'
        parts: string[]
    } | {
        // plugin response
        content_type: 'code'
        language: 'unknown' & (string & {})
        text: string
    } | {
        content_type: 'tether_quote'
        domain?: string
        text: string
        title: string
        url?: string
    } | {
        content_type: 'tether_browsing_code'
        // unknown
    } | {
        content_type: 'tether_browsing_display'
        result: string
        summary?: string
    }
    create_time: number
    end_turn: boolean
    id: string
    metadata?: MessageMeta
    recipient: 'all' & 'browser' & (string & {})
    weight: number
}

export interface ConversationNode {
    children: string[]
    id: string
    message?: ConversationNodeMessage
    parent?: string
}

export interface ApiConversation {
    create_time: number
    current_node: string
    mapping: {
        [key: string]: ConversationNode
    }
    moderation_results: unknown[]
    title: string
    update_time: number
}

export type ApiConversationWithId = ApiConversation & {
    id: string
}

export interface ApiConversationItem {
    id: string
    title: string
    create_time: number
}

export interface ApiConversations {
    // what is this for?
    has_missing_conversations: boolean
    items: ApiConversationItem[]
    limit: number
    offset: number
    total: number
}

const apiUrl = `${baseUrl}/backend-api`

const sessionApi = urlcat(baseUrl, '/api/auth/session')
const conversationApi = (id: string) => urlcat(apiUrl, '/conversation/:id', { id })
const conversationsApi = (offset: number, limit: number) => urlcat(apiUrl, '/conversations', { offset, limit })

export async function getCurrentChatId(): Promise<string> {
    const chatId = getChatIdFromUrl()
    if (chatId) return chatId

    const conversations = await fetchConversations()
    if (conversations && conversations.items.length > 0) {
        return conversations.items[0].id
    }

    throw new Error('No chat id found.')
}

export async function fetchConversation(chatId: string): Promise<ApiConversationWithId> {
    const url = conversationApi(chatId)
    const conversation = await fetchApi<ApiConversation>(url)
    return {
        id: chatId,
        ...conversation,
    }
}

async function fetchConversations(offset = 0, limit = 20): Promise<ApiConversations> {
    const url = conversationsApi(offset, limit)
    return fetchApi(url)
}

export async function fetchAllConversations(): Promise<ApiConversationItem[]> {
    const conversations: ApiConversationItem[] = []
    const limit = 20
    let offset = 0
    while (true) {
        const result = await fetchConversations(offset, limit)
        conversations.push(...result.items)
        if (offset + limit >= result.total) break
        offset += limit
    }
    return conversations
}

export async function deleteConversation(chatId: string): Promise<boolean> {
    const url = conversationApi(chatId)
    const { success } = await fetchApi<{ success: boolean }>(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: false }),
    })
    return success
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
    const accessToken = await getAccessToken()

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...options?.headers,
        },
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

async function getAccessToken(): Promise<string> {
    const session = await fetchSession()
    return session.accessToken
}

let session: ApiSession | null = null
async function fetchSession(): Promise<ApiSession> {
    if (session) return session
    const response = await fetch(sessionApi)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    session = await response.json()
    return session!
}

class LinkedListItem<T> {
    value: T
    child: LinkedListItem<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}

export interface ConversationResult {
    id: string
    title: string
    modelSlug: string
    model: string
    createTime: number
    conversationNodes: ConversationNode[]
}

const modelMapping: { [key in ModelSlug]: string } & { [key: string]: string } = {
    'text-davinci-002-render-sha': 'GTP-3.5',
    'text-davinci-002-render-paid': 'GTP-3.5',
    'text-davinci-002-browse': 'GTP-3.5',
    'gpt-4': 'GPT-4',

    // fuzzy matching
    'text-davinci-002': 'GTP-3.5',
}

export function processConversation(conversation: ApiConversationWithId, conversationChoices: Array<number | null> = []): ConversationResult {
    const title = conversation.title || 'ChatGPT Conversation'
    const createTime = conversation.create_time
    const modelSlug = Object.values(conversation.mapping).find(node => node.message?.metadata?.model_slug)?.message?.metadata?.model_slug || ''
    let model = ''
    if (modelSlug) {
        if (modelMapping[modelSlug]) {
            model = modelMapping[modelSlug]
        }
        else {
            Object.keys(modelMapping).forEach((key) => {
                if (modelSlug.startsWith(key)) {
                    model = key
                }
            })
        }
    }

    const result: ConversationNode[] = []
    const nodes = Object.values(conversation.mapping)
    const root = nodes.find(node => !node.parent)
    if (!root) throw new Error('No root node found.')

    const nodeMap = new Map(Object.entries(conversation.mapping))
    const tail = new LinkedListItem(root)
    const queue = [tail]
    let index = -1
    while (queue.length > 0) {
        const current = queue.shift()!
        const node = nodeMap.get(current.value.id)
        if (!node) throw new Error('No node found.')

        const role = node.message?.author.role
        if (role === 'assistant' || role === 'user' || role === 'tool') {
            result.push(node)
        }

        if (node.children.length === 0) continue

        const _last = node.children.length - 1
        const choice = conversationChoices[index++] ?? _last
        const childId = node.children[choice] ?? node.children[_last]
        if (!childId) throw new Error('No child node found.')

        const child = nodeMap.get(childId)
        if (!child) throw new Error('No child node found.')

        const childItem = new LinkedListItem(child)
        current.child = childItem
        queue.push(childItem)
    }

    return {
        id: conversation.id,
        title,
        modelSlug,
        model,
        createTime,
        conversationNodes: result,
    }
}
