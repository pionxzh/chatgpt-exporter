declare global {
    interface Window {
        __NEXT_DATA__?: {
            props: {
                pageProps: {
                    accessToken: string
                }
            }
        }
    }
}

interface ApiConversation {
    create_time: number
    current_node: string
    mapping: {
        [key: string]: {
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

const baseUrl = 'https://chat.openai.com'
const apiUrl = `${baseUrl}/backend-api`

function getAccessToken(): string {
    const accessToken = window?.__NEXT_DATA__?.props?.pageProps?.accessToken
    if (!accessToken) throw new Error('No access token found.')
    return accessToken
}

async function getCurrentChatId(): Promise<string> {
    const match = location.pathname.match(/^\/chat\/([a-z0-9-]+)$/i)
    if (match) return match[1]

    const conversations = await fetchConversations()
    if (conversations && conversations.items.length > 0) {
        return conversations.items[0].id
    }

    throw new Error('No chat id found.')
}

export async function fetchConversation(): Promise<ApiConversation | null> {
    try {
        const chatId = await getCurrentChatId()

        const accessToken = getAccessToken()
        const response = await fetch(`${apiUrl}/conversation/${chatId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return response.json()
    }
    catch (error) {
        console.error(error)
        return null
    }
}

async function fetchConversations(): Promise<ApiConversations | null> {
    try {
        const accessToken = getAccessToken()
        const response = await fetch(`${apiUrl}/conversations?offset=0&limit=20`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return response.json()
    }
    catch (e) {
        console.error(e)
        return null
    }
}
