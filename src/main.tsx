import { render } from 'preact'
import sentinel from 'sentinel-js'
import { fetchConversation, processConversation } from './api'
import { getChatIdFromUrl, isSharePage } from './page'
import { Menu } from './ui/Menu'
import { onloadSafe } from './utils/utils'

import './i18n'
import './styles/missing-tailwind.css'

main()

function main() {
    onloadSafe(() => {
        const container = document.createElement('div')
        // to overlap on the list section
        container.style.zIndex = '20'
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

        /** Insert timestamp to the bottom right of each message */
        let chatId = ''
        sentinel.on('[role="presentation"]', async () => {
            const threadContents = Array.from(document.querySelectorAll('main [data-testid^="conversation-turn-"] [data-message-id]'))

            const currentChatId = getChatIdFromUrl()
            if (!currentChatId || currentChatId === chatId) return
            chatId = currentChatId

            const rawConversation = await fetchConversation(chatId, false)
            const { conversationNodes } = processConversation(rawConversation)

            threadContents.forEach((thread, index) => {
                const createTime = conversationNodes[index]?.message?.create_time
                if (!createTime) return

                const date = new Date(createTime * 1000)

                const timestamp = document.createElement('time')
                timestamp.className = 'w-full text-gray-500 dark:text-gray-400 text-sm text-right'
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
