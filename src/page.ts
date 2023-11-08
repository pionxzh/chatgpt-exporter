import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { getBase64FromImageUrl, getBase64FromImg } from './utils/dom'

declare global {
    interface Window {
        __NEXT_DATA__?: {
            assetPrefix: string
            buildId: string
            gssp: boolean
            isFallback: boolean
            page: string
            props: {
                pageProps: {
                    allowBrowserStorage: boolean
                    canManageBrowserStorage: boolean
                    geoOk: boolean
                    isUserInCanPayGroup: boolean
                    serviceAnnouncement: {
                        paid: unknown
                        public: unknown
                    }
                    serviceStatus: unknown
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
                    userCountry: string
                    serverResponse?: {
                        type: 'data'
                        data: any // Basically ApiConversation
                    }
                }
            }
        }
    }
}

const historyDisabledKey = 'oai/apps/historyDisabled'
export function getHistoryDisabled(): boolean {
    return localStorage.getItem(historyDisabledKey) === '"true"'
}

function getUserProfile() {
    const user = unsafeWindow?.__NEXT_DATA__?.props?.pageProps?.user
    if (!user) throw new Error('No user found.')
    return user
}

export function getChatIdFromUrl() {
    const match = location.pathname.match(/^\/(?:share|c)\/([a-z0-9-]+)/i)
    if (match) return match[1]
    return null
}

export function isSharePage() {
    return location.pathname.startsWith('/share')
        && !location.pathname.endsWith('/continue')
}

export function getConversationFromSharePage() {
    if (window.__NEXT_DATA__?.props?.pageProps?.serverResponse?.data) {
        // Next.js or OpenAI started to freeze some objects, so we do a
        // deep copy here to avoid polluting the original object
        return JSON.parse(JSON.stringify(window.__NEXT_DATA__.props.pageProps.serverResponse.data))
    }
    return null
}

export const conversationChoiceSelector = '.flex.justify-center span.flex-grow'

export function getConversationChoice() {
    // parse x from `< x / y >` to get the index of the selected response
    const conversationChoices: Array<number | null> = Array.from(document.querySelectorAll('main .group'))
        .map(group => group.querySelector(conversationChoiceSelector))
        // non-existing element will produce null here, which will point to the last child
        // just in case the selector changed
        .map(span => Number.parseInt(span?.textContent?.trim().split(' / ')[0] ?? '0') - 1)
        .map(x => x === -1 ? null : x)

    return conversationChoices
}

const defaultAvatar = 'data:image/svg+xml,%3Csvg%20stroke%3D%22currentColor%22%20fill%3D%22none%22%20stroke-width%3D%221.5%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20style%3D%22color%3A%20white%3B%20background%3A%20%23ab68ff%3B%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2021v-2a4%204%200%200%200-4-4H8a4%204%200%200%200-4%204v2%22%3E%3C%2Fpath%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%227%22%20r%3D%224%22%3E%3C%2Fcircle%3E%3C%2Fsvg%3E'
export async function getUserAvatar(): Promise<string> {
    try {
        const { picture } = getUserProfile()
        if (picture) return await getBase64FromImageUrl(picture)
    }
    catch (e) {
        console.error(e)
    }

    try {
        const avatars = Array.from(document.querySelectorAll<HTMLImageElement>('img[alt]:not([aria-hidden])'))
        // starts with data: means it's not (lazy)loaded yet
        const avatar = avatars.find(avatar => !avatar.src.startsWith('data:'))
        if (avatar) return getBase64FromImg(avatar)
    }
    catch (e) {
        console.error(e)
    }

    return defaultAvatar
}

export function checkIfConversationStarted() {
    return !!document.querySelector('main .group')
}
