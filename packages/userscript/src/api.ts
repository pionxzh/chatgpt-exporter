import urlcat from 'urlcat'
import { apiUrl, baseUrl } from './constants'
import { getChatIdFromUrl, getConversationFromSharePage, isSharePage } from './page'

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

type ModelSlug = 'text-davinci-002-render-sha' | 'text-davinci-002-render-paid' | 'text-davinci-002-browse' | 'gpt-4' | 'gpt-4-browsing'

export interface Citation {
    start_ix: number
    end_ix: number
    citation_format_type: 'tether_og' & (string & {})
    metadata?: {
        extra?: {
            cited_message_idx: number
            evidence_text: string
        }
        text: string
        title: string
        type: 'webpage' & (string & {})
        url: string
    }
}

interface CiteMetadata {
    citation_format: {
        name: 'tether_og' & (string & {})
    }
    metadata_list: Array<{
        title: string
        url: string
        text: string
    }>
}

interface MessageMeta {
    command: 'click' | 'search' | 'quote' | 'quote_lines' | 'scroll' & (string & {})
    args: unknown
    finish_details?: {
        stop: string
        type: 'stop' | 'interrupted' & (string & {})
    }
    model_slug?: ModelSlug & (string & {})
    timestamp_: 'absolute' & (string & {})
    citations?: Citation[]
    _cite_metadata?: CiteMetadata
}

export type AuthorRole = 'system' | 'assistant' | 'user' | 'tool'

interface MultiModalInputImage {
    /**
     * hack: this come from the api in the form of 'file-service://file-base64', but we replace it
     * automatically in the api wrapper with a data uri
     */
    asset_pointer: string
    content_type: 'image_asset_pointer' & (string & {})
    height: number
    size_bytes: number
    width: number
}

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
        content_type: 'execution_output'
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
    } | {
        // multi-modal input
        content_type: 'multimodal_text'
        parts: Array<MultiModalInputImage | string>
    }
    create_time: number
    end_turn: boolean
    id: string
    metadata?: MessageMeta
    recipient: 'all' | 'browser' & (string & {})
    status: string
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

interface ApiFileDownload {
    status: 'success'
    /** signed download url */
    download_url: string
    metadata: {}
    file_name: string
    /** iso8601 datetime string */
    creation_time: string
}

const sessionApi = urlcat(baseUrl, '/api/auth/session')
const conversationApi = (id: string) => urlcat(apiUrl, '/conversation/:id', { id })
const conversationsApi = (offset: number, limit: number) => urlcat(apiUrl, '/conversations', { offset, limit })
const fileDownloadApi = (id: string) => urlcat(apiUrl, '/files/:id/download', { id })

export async function getCurrentChatId(): Promise<string> {
    if (isSharePage()) {
        return `__share__${getChatIdFromUrl()}`
    }

    const chatId = getChatIdFromUrl()
    if (chatId) return chatId

    const conversations = await fetchConversations()
    if (conversations && conversations.items.length > 0) {
        return conversations.items[0].id
    }

    throw new Error('No chat id found.')
}

async function fetchImageFromPointer(uri: string) {
    const pointer = uri.replace('file-service://', '')
    const imageDetails = await fetchApi<ApiFileDownload>(fileDownloadApi(pointer))
    const image = await fetch(imageDetails.download_url)
    const blob = await image.blob()
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
    })
    return base64.replace(/^data:.*?;/, `data:${image.headers.get('content-type')};`)
}

/** replaces file-service:// pointers with data uris containing the image */
async function enhanceImageAssets(conversation: ApiConversationWithId): Promise<ApiConversationWithId> {
    const imageAssets = Object.values(conversation.mapping).flatMap((node) => {
        if (!node.message) return []
        if (node.message.content.content_type !== 'multimodal_text') return []
        return node.message.content.parts.filter(
            (part): part is MultiModalInputImage =>
                typeof part !== 'string' && part.asset_pointer.startsWith('file-service://'),
        )
    })

    await Promise.all(imageAssets.map(async (asset) => {
        asset.asset_pointer = await fetchImageFromPointer(asset.asset_pointer)
    }))

    return conversation
}

export async function fetchConversation(chatId: string): Promise<ApiConversationWithId> {
    if (chatId.startsWith('__share__')) {
        const shareConversation = getConversationFromSharePage() as ApiConversation
        const id = chatId.replace('__share__', '')
        return enhanceImageAssets({
            id,
            ...shareConversation,
        })
    }

    const url = conversationApi(chatId)
    const conversation = await fetchApi<ApiConversation>(url)
    return enhanceImageAssets({
        id: chatId,
        ...conversation,
    })
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
    updateTime: number
    conversationNodes: ConversationNode[]
}

const modelMapping: { [key in ModelSlug]: string } & { [key: string]: string } = {
    'text-davinci-002-render-sha': 'GTP-3.5',
    'text-davinci-002-render-paid': 'GTP-3.5',
    'text-davinci-002-browse': 'GTP-3.5',
    'gpt-4': 'GPT-4',
    'gpt-4-browsing': 'GPT-4 (Browser)',

    // fuzzy matching
    'text-davinci-002': 'GTP-3.5',
}

export function processConversation(conversation: ApiConversationWithId, conversationChoices: Array<number | null> = []): ConversationResult {
    const title = conversation.title || 'ChatGPT Conversation'
    const createTime = conversation.create_time
    const updateTime = conversation.update_time
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
        let isContinueGeneration = false
        if (role === 'assistant' || role === 'user' || role === 'tool') {
            const prevNode = result[result.length - 1]

            // If the previous node is also an assistant, we merge them together.
            // This is to improve the output of the conversation when an official
            // continuation is used. (#146)
            if (role === 'assistant'
                && prevNode?.message
                && prevNode.message.author.role === 'assistant'
                && prevNode.message.recipient === 'all'
                && prevNode.message.content.content_type === 'text'
                && node.message
                && node.message.recipient === 'all'
                && node.message.content.content_type === 'text'
            ) {
                isContinueGeneration = true
                // the last part of the previous node should directly concat to the first part of the current node
                prevNode.message.content.parts[prevNode.message.content.parts.length - 1] += node.message.content.parts[0]
                prevNode.message.content.parts.push(...node.message.content.parts.slice(1))
            }
            else {
                result.push(node)
            }
        }

        if (node.children.length === 0) continue

        const _last = node.children.length - 1
        let choice = 0
        // If the current node is an continue generation like [A -> B], A will always
        // only have one child which is the continue generation node B. In this case,
        // when we are processing A, we don't know we have a continue generation node
        // and no matter what choice we choose, we will always get B, so it's acceptable
        // And here in B, we will use the previous choice to get the correct child node
        if (isContinueGeneration) {
            choice = conversationChoices[index] ?? _last
        }
        // Conversation choices will only applied to nodes with message
        else if ('message' in node && node.message?.recipient === 'all') {
            index++
            choice = conversationChoices[index] ?? _last
        }

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
        updateTime,
        conversationNodes: result,
    }
}
