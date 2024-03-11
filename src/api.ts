import urlcat from 'urlcat'
import { apiUrl, baseUrl } from './constants'
import { getChatIdFromUrl, getConversationFromSharePage, isSharePage } from './page'
import { blobToDataURL } from './utils/dom'

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
    aggregate_result?: {
        code: string
        final_expression_output?: string
        end_time: number
        jupyter_messages: unknown[]
        messages: Array<{
            image_url: string
            message_type: 'image'
            sender: 'server'
            time: number
            width: number
            height: number
        }>
        run_id: string
        start_time: number
        status: 'success' | 'error' & (string & {})
        update_time: number
    }
    args?: unknown
    command?: 'click' | 'search' | 'quote' | 'quote_lines' | 'scroll' & (string & {})
    finish_details?: {
        // stop: string
        stop_tokens?: number[]
        type: 'stop' | 'interrupted' & (string & {})
    }
    is_complete?: boolean
    model_slug?: ModelSlug & (string & {})
    parent_id?: string
    timestamp_?: 'absolute' & (string & {})
    citations?: Citation[]
    _cite_metadata?: CiteMetadata
}

export type AuthorRole = 'system' | 'assistant' | 'user' | 'tool'

interface MultiModalInputImage {
    /**
     * hack: this come from the api in the form of `file-service://file-base64`, but we replace it
     * automatically in the api wrapper with a data uri
     */
    asset_pointer: string
    content_type: 'image_asset_pointer' & (string & {})
    fovea: number
    height: number
    size_bytes: number
    width: number
    metadata?: {
        dalle?: {
            gen_id: string
            prompt: string
            seed: number
            serialization_title: string
        }
    }
}

export interface ConversationNodeMessage {
    author: {
        role: AuthorRole
        name?: 'browser' | 'python' & (string & {})
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
    create_time?: number
    update_time?: number
    // end_turn: boolean
    id: string
    metadata?: MessageMeta
    recipient: 'all' | 'browser' | 'python' | 'dalle.text2im' & (string & {})
    status: string
    end_turn?: boolean
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
    conversation_id?: string
    current_node: string
    mapping: {
        [key: string]: ConversationNode
    }
    moderation_results: unknown[]
    title: string
    is_archived: boolean
    update_time: number
    safe_urls?: string[]
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

type ApiFileDownload = {
    status: 'success'
    /** signed download url */
    download_url: string
    metadata: {}
    file_name: string
    /** iso8601 datetime string */
    creation_time: string
} | {
    status: 'error'
    error_code: string
    error_message: string | null
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
    if (imageDetails.status === 'error') {
        console.error('Failed to fetch image asset', imageDetails.error_code, imageDetails.error_message)
        return null
    }

    const image = await fetch(imageDetails.download_url)
    const blob = await image.blob()
    const base64 = await blobToDataURL(blob)
    return base64.replace(/^data:.*?;/, `data:${image.headers.get('content-type')};`)
}

/** replaces `file-service://` pointers with data uris containing the image */
async function replaceImageAssets(conversation: ApiConversation): Promise<void> {
    const isMultiModalInputImage = (part: string | MultiModalInputImage): part is MultiModalInputImage => {
        return typeof part !== 'string' && part.asset_pointer.startsWith('file-service://')
    }
    const imageAssets = Object.values(conversation.mapping).flatMap((node) => {
        if (!node.message) return []
        if (node.message.content.content_type !== 'multimodal_text') return []

        return node.message.content.parts.filter(isMultiModalInputImage)
    })

    const executionOutputs = Object.values(conversation.mapping).flatMap((node) => {
        if (!node.message) return []
        if (node.message.content.content_type !== 'execution_output') return []
        if (!node.message.metadata?.aggregate_result?.messages) return []

        return node.message.metadata.aggregate_result.messages
            .filter(msg => msg.message_type === 'image')
    })

    await Promise.all([
        ...imageAssets.map(async (asset) => {
            try {
                const newAssetPointer = await fetchImageFromPointer(asset.asset_pointer)
                if (newAssetPointer) asset.asset_pointer = newAssetPointer
            }
            catch (error) {
                console.error('Failed to fetch image asset', error)
            }
        }),
        ...executionOutputs.map(async (msg) => {
            try {
                const newImageUrl = await fetchImageFromPointer(msg.image_url)
                if (newImageUrl) msg.image_url = newImageUrl
            }
            catch (error) {
                console.error('Failed to fetch image asset', error)
            }
        }),
    ])
}

export async function fetchConversation(chatId: string, shouldReplaceAssets: boolean): Promise<ApiConversationWithId> {
    if (chatId.startsWith('__share__')) {
        const id = chatId.replace('__share__', '')
        const shareConversation = getConversationFromSharePage() as ApiConversation
        await replaceImageAssets(shareConversation)

        return {
            id,
            ...shareConversation,
        }
    }

    const url = conversationApi(chatId)
    const conversation = await fetchApi<ApiConversation>(url)

    if (shouldReplaceAssets) {
        await replaceImageAssets(conversation)
    }

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

export async function archiveConversation(chatId: string): Promise<boolean> {
    const url = conversationApi(chatId)
    const { success } = await fetchApi<{ success: boolean }>(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: true }),
    })
    return success
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
            'Authorization': `Bearer ${accessToken}`,
            'X-Authorization': `Bearer ${accessToken}`,
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

export interface ConversationResult {
    id: string
    title: string
    modelSlug: string
    model: string
    createTime: number
    updateTime: number
    conversationNodes: ConversationNode[]
}

const ModelMapping: { [key in ModelSlug]: string } & { [key: string]: string } = {
    'text-davinci-002-render-sha': 'GPT-3.5',
    'text-davinci-002-render-paid': 'GPT-3.5',
    'text-davinci-002-browse': 'GPT-3.5',
    'gpt-4': 'GPT-4',
    'gpt-4-browsing': 'GPT-4 (Browser)',

    // fuzzy matching
    'text-davinci-002': 'GPT-3.5',
}

export function processConversation(conversation: ApiConversationWithId): ConversationResult {
    const title = conversation.title || 'ChatGPT Conversation'
    const createTime = conversation.create_time
    const updateTime = conversation.update_time
    const { model, modelSlug } = extractModel(conversation.mapping)

    const startNodeId = conversation.current_node
        || Object.values(conversation.mapping).find(node => !node.children || node.children.length === 0)?.id
    if (!startNodeId) throw new Error('Failed to find start node.')

    const conversationNodes = extractConversationResult(conversation.mapping, startNodeId)
    const mergedConversationNodes = mergeContinuationNodes(conversationNodes)

    return {
        id: conversation.id,
        title,
        model,
        modelSlug,
        createTime,
        updateTime,
        conversationNodes: mergedConversationNodes,
    }
}

function extractModel(conversationMapping: Record<string, ConversationNode>) {
    let model = ''
    const modelSlug = Object.values(conversationMapping).find(node => node.message?.metadata?.model_slug)?.message?.metadata?.model_slug || ''
    if (modelSlug) {
        if (ModelMapping[modelSlug]) {
            model = ModelMapping[modelSlug]
        }
        else {
            Object.keys(ModelMapping).forEach((key) => {
                if (modelSlug.startsWith(key)) {
                    model = key
                }
            })
        }
    }

    return {
        model,
        modelSlug,
    }
}

function extractConversationResult(conversationMapping: Record<string, ConversationNode>, startNodeId: string): ConversationNode[] {
    const result: ConversationNode[] = []
    let currentNodeId: string | undefined = startNodeId

    while (currentNodeId) {
        const node: ConversationNode = conversationMapping[currentNodeId]
        if (!node) {
            break // Node not found
        }

        if (node.parent === undefined) {
            break // Stop at root message.
        }

        if (node.message?.author.role !== 'system') { // Skip system messages
            result.unshift(node)
        }

        currentNodeId = node.parent
    }

    return result
}

/**
 * Merge continuation nodes generated by official continuation
 * to improve the readability of the conversation. (#146)
 */
function mergeContinuationNodes(nodes: ConversationNode[]): ConversationNode[] {
    const result: ConversationNode[] = []
    for (const node of nodes) {
        const prevNode = result[result.length - 1]
        if (
            prevNode?.message?.author.role === 'assistant' && node.message?.author.role === 'assistant'
         && prevNode.message.recipient === 'all' && node.message.recipient === 'all'
         && prevNode.message.content.content_type === 'text' && node.message.content.content_type === 'text'
        ) {
            // the last part of the previous node should directly concat to the first part of the current node
            prevNode.message.content.parts[prevNode.message.content.parts.length - 1] += node.message.content.parts[0]
            prevNode.message.content.parts.push(...node.message.content.parts.slice(1))
        }
        else {
            result.push(node)
        }
    }
    return result
}
