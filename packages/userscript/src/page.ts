import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { getBase64FromImageUrl, getBase64FromImg } from './utils/dom'

declare global {
    interface Window {
        __NEXT_DATA__?: {
            props: {
                pageProps: {
                    // This seems to be removed on 2023/03/08
                    accessToken?: string
                    features: string[]
                    geoOk: boolean
                    isUserInCanPayGroup: boolean
                    shouldDisableHistory: boolean
                    shouldShowPaidAnnouncement: boolean
                    showcasePlusUpdate: boolean
                    user: {
                        email: string
                        id: string
                        image: string
                        name: string
                        picture: string
                    }
                }
            }
        }
    }
}

export function getPageAccessToken(): string | null {
    return unsafeWindow?.__NEXT_DATA__?.props?.pageProps?.accessToken ?? null
}

export function getHistoryDisabled(): boolean {
    return unsafeWindow?.__NEXT_DATA__?.props?.pageProps?.shouldDisableHistory ?? false
}

function getUserProfile() {
    const user = unsafeWindow?.__NEXT_DATA__?.props?.pageProps?.user
    if (!user) throw new Error('No user found.')
    return user
}

export function getConversationChoice() {
    // parse x from `< x / y >` to get the index of the selected response
    const conversationChoices: Array<number | null> = Array.from(document.querySelectorAll('main .group'))
        .map(group => group.querySelector('.flex.justify-center span.flex-grow'))
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
