import urlcat from 'urlcat'
import { apiUrl, baseUrl } from './constants'
import { getChatIdFromUrl, getConversationFromSharePage, getPageAccessToken, isSharePage } from './page'
import { blobToDataURL } from './utils/dom'
import { memorize } from './utils/memorize'

interface ApiSession {
    accessToken: string
    authProvider: string
    expires: string
    user: {
        email: string
        groups: string[]
        // token's issued_at timestamp
        iat: number
        id: string
        // token's expiration timestamp
        idp: string
        image: string
        intercom_hash: string
        // whether the user has multi-factor authentication enabled
        mfa: boolean
        name: string
        picture: string
    }
}

type ModelSlug = 'text-davinci-002-render-sha' | 'text-davinci-002-render-paid' | 'text-davinci-002-browse' | 'gpt-4' | 'gpt-4-browsing' | 'gpt-4o'

export interface Reference {
    matched_text: string
    start_idx: number
    end_idx: number
    alt: string | null
    prompt_text: string | null
    type: 'webpage' | 'hidden' | 'sources_footnote'
    invalid: boolean
    title?: string
    url?: string
    snippet?: string
    attributions?: string
    attributions_debug?: string
    pub_date?: number
    attribution?: string
}

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
    content_references?: Reference[]
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
        content_type: 'user_editable_context'
        user_profile: string
        user_instructions: string
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
    } | {
        content_type: 'model_editable_context'
        model_set_context: string
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

interface ApiAccountsCheckAccountDetail {
    account_user_role: 'account-owner' | string
    account_user_id: string | null
    processor: Record<string, boolean>
    account_id: string | null
    organization_id?: string | null
    is_most_recent_expired_subscription_gratis: boolean
    has_previously_paid_subscription: boolean
    name?: string | null
    profile_picture_id?: string | null
    profile_picture_url?: string | null
    structure: 'workspace' | 'personal'
    plan_type: 'team' | 'free'
    is_deactivated: boolean
    promo_data: Record<string, unknown>
}

interface ApiAccountsCheckEntitlement {
    subscription_id?: string | null
    has_active_subscription?: boolean
    subscription_plan?: 'chatgptteamplan' | 'chatgptplusplan'
    expires_at?: string | null
    billing_period?: 'monthly' | string | null
}

interface ApiAccountsCheckAccount {
    account: ApiAccountsCheckAccountDetail
    features: string[]
    entitlement: ApiAccountsCheckEntitlement
    last_active_subscription?: Record<string, unknown> | null
    is_eligible_for_yearly_plus_subscription: boolean
}

interface ApiAccountsCheck {
    accounts: {
        [key: string]: ApiAccountsCheckAccount
    }
    account_ordering: string[]
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

// eslint-disable-next-line no-restricted-syntax
const enum ChatGPTCookie {
    AgeVerification = 'oai-av-seen',
    AllowNonessential = 'oai-allow-ne',
    DeviceId = 'oai-did',
    DomainMigrationSourceCompleted = 'oai-dm-src-c-240329',
    DomainMigrationTargetCompleted = 'oai-dm-tgt-c-240329',
    HasClickedOnTryItFirstLink = 'oai-tif-20240402',
    HasLoggedInBefore = 'oai-hlib',
    HideLoggedOutBanner = 'hide-logged-out-banner',
    IntercomDeviceIdDev = 'intercom-device-id-izw1u7l7',
    IntercomDeviceIdProd = 'intercom-device-id-dgkjq2bp',
    IpOverride = 'oai-ip-country',
    IsEmployee = '_oaiauth',
    IsPaidUser = '_puid',
    LastLocation = 'oai-ll',
    SegmentUserId = 'ajs_user_id',
    SegmentUserTraits = 'ajs_user_traits',
    ShowPaymentModal = 'ui-show-payment-modal',
    TempEnableUnauthedCompliance = 'temp-oai-compliance',
    Workspace = '_account',
}

const sessionApi = urlcat(baseUrl, '/api/auth/session')
const conversationApi = (id: string) => urlcat(apiUrl, '/conversation/:id', { id })
const conversationsApi = (offset: number, limit: number) => urlcat(apiUrl, '/conversations', { offset, limit })
const fileDownloadApi = (id: string) => urlcat(apiUrl, '/files/:id/download', { id })
const accountsCheckApi = urlcat(apiUrl, '/accounts/check/v4-2023-04-27')

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
/** avoid errors in parsing multimodal parts we don't understand */
async function replaceImageAssets(conversation: ApiConversation): Promise<void> {
    const isMultiModalInputImage = (part: any): part is MultiModalInputImage => {
        return typeof part === 'object' && part !== null && 'asset_pointer' in part
               && typeof part.asset_pointer === 'string' && part.asset_pointer.startsWith('file-service://')
    }

    const imageAssets = Object.values(conversation.mapping).flatMap((node) => {
        if (!node.message) return []
        if (node.message.content.content_type !== 'multimodal_text') return []

        return (Array.isArray(node.message.content.parts) ? node.message.content.parts : [])
            .filter(isMultiModalInputImage)
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
    const limit = 100
    let offset = 0
    while (true) {
        const result = await fetchConversations(offset, limit)
        conversations.push(...result.items)
        if (offset + limit >= result.total) break
        if (offset + limit >= 1000) break
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
    const accountId = await getTeamAccountId()

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Authorization': `Bearer ${accessToken}`,
            ...(accountId ? { 'Chatgpt-Account-Id': accountId } : {}),
            ...options?.headers,
        },
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

async function _fetchSession(): Promise<ApiSession> {
    const response = await fetch(sessionApi)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

const fetchSession = memorize(_fetchSession)

async function getAccessToken(): Promise<string> {
    const pageAccessToken = getPageAccessToken()
    if (pageAccessToken) return pageAccessToken

    const session = await fetchSession()
    return session.accessToken
}

async function _fetchAccountsCheck(): Promise<ApiAccountsCheck> {
    const accessToken = await getAccessToken()

    const response = await fetch(accountsCheckApi, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Authorization': `Bearer ${accessToken}`,
        },
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

const fetchAccountsCheck = memorize(_fetchAccountsCheck)

const getCookie = (key: string) => document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || ''

export async function getTeamAccountId(): Promise<string | null> {
    const accountsCheck = await fetchAccountsCheck()
    const workspaceId = getCookie(ChatGPTCookie.Workspace)
    if (workspaceId) {
        const account = accountsCheck.accounts[workspaceId]
        if (account) {
            return account.account.account_id
        }
    }

    return null
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
    'gpt-4o': 'GPT-4o',

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

        if (
            // Skip system messages
            node.message?.author.role !== 'system'
            // Skip model memory context
            && node.message?.content.content_type !== 'model_editable_context'
            // Skip user custom instructions
            && node.message?.content.content_type !== 'user_editable_context'
        ) {
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
