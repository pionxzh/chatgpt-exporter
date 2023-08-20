import { render } from 'preact'
import sentinel from 'sentinel-js'
import { GM_deleteValue, GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'
import { fetchConversation, processConversation } from './api'
import { KEY_FILENAME_FORMAT, LEGACY_KEY_FILENAME_FORMAT } from './constants'
import { getChatIdFromUrl, getConversationChoice, isSharePage } from './page'
import { Menu } from './ui/Menu'
import { onloadSafe } from './utils/utils'

import './i18n'
import './styles/missing-tailwind.css'

/**
 * Migrate legacy filename format
 */
try {
    const legacyFormat = GM_getValue?.(LEGACY_KEY_FILENAME_FORMAT, '')
    const localLegacyFormat = localStorage.getItem(LEGACY_KEY_FILENAME_FORMAT)
    if (legacyFormat) {
        GM_deleteValue?.(LEGACY_KEY_FILENAME_FORMAT)
        GM_setValue?.(KEY_FILENAME_FORMAT, JSON.stringify(legacyFormat))
    }
    else if (localLegacyFormat) {
        localStorage.removeItem(LEGACY_KEY_FILENAME_FORMAT)
        localStorage.setItem(KEY_FILENAME_FORMAT, JSON.stringify(localLegacyFormat))
    }
}
catch (error) {
    console.error('Failed to migrate legacy filename format', error)
}

main()

function main() {
    onloadSafe(() => {
        const container = document.createElement('div')
        render(<Menu container={container} />, container)

        const styleEl = document.createElement('style')
        styleEl.id = 'sentinel-css'
        document.head.append(styleEl)

        sentinel.on('nav', (nav) => {
            const chatList = document.querySelector('nav > div.overflow-y-auto, nav > div.overflow-y-hidden')
            if (chatList) {
                chatList.after(container)
            }
            else {
                // fallback to the bottom of the nav
                nav.append(container)
            }
        })

        // Support for share page
        if (isSharePage()) {
            const continueUrl = `${location.href}/continue`
            sentinel.on(`a[href="${continueUrl}"]`, (link) => {
                link.after(container)
            })
        }

        // dirty fix for unstable image url from unsplash
        const imageMap = new Map<string, string>()

        sentinel.on('img', (img: HTMLImageElement) => {
            const src = img.src
            if (src.startsWith('https://source.unsplash.com/')) {
                if (imageMap.has(src)) {
                    img.src = imageMap.get(src)!
                    return
                }

                const xhr = new XMLHttpRequest()
                xhr.open('HEAD', src, true)
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const finalUrl = xhr.responseURL
                        img.src = finalUrl
                        // @ts-expect-error private field
                        img.originalSrc = src
                        imageMap.set(src, finalUrl)
                    }
                }
                xhr.send()
            }
        })

        /** Insert timestamp to the bottom right of each message */
        let chatId = ''
        sentinel.on('main .group', async () => {
            const threadContents = Array.from(document.querySelectorAll('main .group > .text-base > .relative:nth-child(2)'))

            const currentChatId = getChatIdFromUrl()
            if (!currentChatId || currentChatId === chatId) return
            chatId = currentChatId

            const rawConversation = await fetchConversation(chatId)
            const conversationChoices = getConversationChoice()
            const { conversationNodes } = processConversation(rawConversation, conversationChoices)

            threadContents.forEach((thread, index) => {
                const createTime = conversationNodes[index]?.message?.create_time
                if (!createTime) return

                const date = new Date(createTime * 1000)

                const timestamp = document.createElement('time')
                timestamp.className = 'text-gray-500 dark:text-gray-400 text-sm text-right'
                timestamp.dateTime = date.toISOString()
                timestamp.title = date.toLocaleString()

                const hour12 = document.createElement('span')
                hour12.setAttribute('data-time-format', '12')
                hour12.textContent = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                const hour24 = document.createElement('span')
                hour24.setAttribute('data-time-format', '24')
                hour24.textContent = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                timestamp.append(hour12, hour24)
                thread.append(timestamp)
            })
        })
    })
}
