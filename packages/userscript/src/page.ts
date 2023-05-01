import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { getBase64FromImageUrl, getBase64FromImg } from './utils/dom'

declare global {
    interface Window {
        __NEXT_DATA__?: {
            buildId: string
            gssp: boolean
            isFallback: boolean
            page: string
            props: {
                pageProps: {
                    geoOk: boolean
                    isUserInCanPayGroup: boolean
                    serviceAnnouncement: {
                        paid: unknown
                        public: unknown
                    }
                    serviceStatus: {}
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
    const match = location.pathname.match(/^\/c\/([a-z0-9-]+)$/i)
    if (match) return match[1]
    return null
}

export const conversationChoiceSelector = '.flex.justify-center span.flex-grow'

export function getConversationChoice() {
    // parse x from `< x / y >` to get the index of the selected response
    const conversationChoices: Array<number | null> = Array.from(document.querySelectorAll('main .group'))
        .map(group => group.querySelector(conversationChoiceSelector))
        // non-existing element will produce null here, which will point to the last child
        // just in case the selector changed
        .map(span => parseInt(span?.textContent?.trim().split(' / ')[0] ?? '0') - 1)
        .map(x => x === -1 ? null : x)

    return conversationChoices
}

const defaultAvatar = 'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e'
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
