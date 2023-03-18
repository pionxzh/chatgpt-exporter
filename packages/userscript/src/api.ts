import urlcat from 'urlcat'
import { getPageAccessToken } from './page'

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

interface MessageMeta {
    finish_details?: {
        stop: string
        type: string
    }
    model_slug?: 'text-davinci-002-render-sha' | 'text-davinci-002-render-paid' | 'gpt-4' & (string & {})
    timestamp_: 'absolute' & (string & {})
}

interface ConversationNode {
    children: string[]
    id: string
    message?: {
        author: {
            role: 'system' | 'assistant' | 'user'
            metadata: unknown
        }
        content: {
            content_type: 'text' & (string & {})
            parts: string[]
        }
        create_time: number
        end_turn: boolean
        id: string
        metadata?: MessageMeta
        recipient: 'all' & (string & {})
        update_time: string | null
        weight: number
    }
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
    items: ApiConversationItem[]
    limit: number
    offset: number
    total: number
}

export const baseUrl = 'https://chat.openai.com'
const apiUrl = `${baseUrl}/backend-api`

const sessionApi = urlcat(baseUrl, '/api/auth/session')
const conversationApi = (id: string) => urlcat(apiUrl, '/conversation/:id', { id })
const conversationsApi = (offset: number, limit: number) => urlcat(apiUrl, '/conversations', { offset, limit })

export async function getCurrentChatId(): Promise<string> {
    const match = location.pathname.match(/^\/chat\/([a-z0-9-]+)$/i)
    if (match) return match[1]

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

export async function fetchConversations(offset = 0, limit = 20): Promise<ApiConversations> {
    const url = conversationsApi(offset, limit)
    return fetchApi(url)
}

export async function fetchAllConversations(): Promise<ApiConversationItem[]> {
    const conversations: ApiConversationItem[] = []
    let offset = 0
    const limit = 20
    while (true) {
        const result = await fetchConversations(offset, limit)
        conversations.push(...result.items)
        if (result.items.length < limit) break
        offset += limit
    }
    return conversations
}

async function fetchApi<T>(url: string): Promise<T> {
    const accessToken = await getAccessToken()

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

async function getAccessToken(): Promise<string> {
    const _accessToken = getPageAccessToken()
    if (_accessToken) return _accessToken

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
    createTime: number
    conversationNodes: ConversationNode[]
}

export function processConversation(conversation: ApiConversationWithId, conversationChoices: (number | null)[] = []): ConversationResult {
    const title = conversation.title || 'ChatGPT Conversation'
    const createTime = conversation.create_time

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
        if (role === 'assistant' || role === 'user') {
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
        createTime,
        conversationNodes: result,
    }
}
