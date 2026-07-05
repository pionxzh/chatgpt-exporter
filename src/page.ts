import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { getBase64FromImg } from './utils/dom'

declare global {
    interface Window {
        __reactRouterContext: {
            basename: string
            future: {}
            state: {
                loaderData: {
                    root: {
                        clientBootstrap: {
                            accountStatus: null
                            session: {
                                accessToken: string
                                authProvider: string
                                expires: string
                                user: {
                                    email: string
                                    group: unknown[]
                                    id: string
                                    image: string
                                    intercom_hash: string
                                    mfa: boolean
                                    name: string
                                    picture: string
                                }
                            }
                        }
                    }
                    'routes/share.$shareId.($action)': {
                        serverResponse: {
                            type: 'data'
                            data: any // Basically ApiConversation
                        }
                    }
                }
            }
        }
    }
}

export function getChatIdFromUrl() {
    // /share/1e5sf-asdf-1234
    // /c/1e5sf-asdf-1234
    // /g/1e5sf-asdf-1234/c/1e5sf-asdf-1234
    const match = location.pathname.match(/^\/(?:share|c|g\/[a-z0-9-]+\/c)\/([a-z0-9-]+)/i)
    if (match) return match[1]
    return null
}

export function isSharePage() {
    return location.pathname.startsWith('/share')
        && !location.pathname.endsWith('/continue')
}

export function getConversationFromSharePage() {
    if (unsafeWindow.__reactRouterContext?.state?.loaderData?.['routes/share.$shareId.($action)']?.serverResponse?.data) {
        return JSON.parse(JSON.stringify(unsafeWindow.__reactRouterContext.state.loaderData['routes/share.$shareId.($action)'].serverResponse.data))
    }
    return null
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
