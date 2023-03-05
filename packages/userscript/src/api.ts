import urlcat from 'urlcat'
import { getAccessToken, getConversationChoice } from './page'

interface ConversationNode {
    children: string[]
    id: string
    message: {
        author: {
            role: 'system' | 'assistant' | 'user'
            name: string | null
            metadata: unknown
        }
        content: {
            content_type: 'text' & (string & {})
            parts: string[]
        }
        create_time: number
        end_turn: boolean
        id: string
        metadata: unknown
        recipient: string
        update_time: string | null
        weight: number
    } | null
    parent: string | null
}

interface ApiConversation {
    create_time: number
    current_node: string
    mapping: {
        [key: string]: ConversationNode
    }
    moderation_results: unknown[]
    title: string
}

interface ApiConversations {
    items: {
        id: string
        title: string
        create_time: number
    }[]
    limit: number
    offset: number
    total: number
}

export const baseUrl = 'https://chat.openai.com'
const apiUrl = `${baseUrl}/backend-api`

const conversationApi = (id: string) => urlcat(apiUrl, '/conversation/:id', { id })
const conversationsApi = (offset: number, limit: number) => urlcat(apiUrl, '/conversations', { offset, limit })

async function getCurrentChatId(): Promise<string> {
    const match = location.pathname.match(/^\/chat\/([a-z0-9-]+)$/i)
    if (match) return match[1]

    const conversations = await fetchConversations()
    if (conversations && conversations.items.length > 0) {
        return conversations.items[0].id
    }

    throw new Error('No chat id found.')
}

export async function fetchConversation(): Promise<ApiConversation & { id: string }> {
    const chatId = await getCurrentChatId()
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

async function fetchApi<T>(url: string): Promise<T> {
    const accessToken = getAccessToken()

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

class LinkedListItem<T> {
    value: T
    child: LinkedListItem<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}

interface ConversationResult {
    id: string
    title: string
    createTime: number
    conversations: ConversationNode[]
}

export async function getConversations(): Promise<ConversationResult> {
    const conversation = await fetchConversation()

    const title = conversation.title || 'ChatGPT Conversation'
    const createTime = conversation.create_time

    const result: ConversationNode[] = []
    const nodes = Object.values(conversation.mapping)
    const root = nodes.find(node => node.parent === null)
    if (!root) throw new Error('No root node found.')

    const conversationChoices = getConversationChoice()
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
        const childId = node.children[choice]
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
        conversations: result,
    }
}
