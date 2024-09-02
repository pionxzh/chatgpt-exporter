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
        const container = document.createElement("div");
        container.style.zIndex = "20";
        (Menu, { container }), container);

        const styleEl = document.createElement("style");
        styleEl.id = "sentinel-css";
        document.head.append(styleEl);

        // Variable to store the interval ID
        let menuInjectionInterval = null;

        /** Inject menu to the right of the profile button */
        function injectMenu() {
            const headerDiv = document.querySelector('div[class^="sticky top-0 p-3 mb-1.5 flex items-center justify-between"]');
            if (!headerDiv) return;

            const profileButtonDiv = headerDiv.querySelector('div[class^="flex items-center gap-2 pr-1 leading-[0]"]');
            const menuExists = profileButtonDiv.contains(container);

            if (profileButtonDiv && !menuExists) {
                profileButtonDiv.insertBefore(container, profileButtonDiv.firstChild);

                if (menuInjectionInterval) {
                    clearInterval(menuInjectionInterval);
                    menuInjectionInterval = null;
                }
            }
        }

        // Initial injection
        injectMenu();

        // Watch for changes using sentinel
        sentinel.on('div[class^="sticky top-0 p-3 mb-1.5 flex items-center justify-between"]', () => {
            injectMenu();
        });

        // Start the periodic check using setInterval
        menuInjectionInterval = setInterval(() => {
            injectMenu();
        }, 500);

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
            const currentChatId = getChatIdFromUrl()
            if (!currentChatId || currentChatId === chatId) return
            chatId = currentChatId

            const rawConversation = await fetchConversation(chatId, false)
            const { conversationNodes } = processConversation(rawConversation)

            const threadContents = Array.from(document.querySelectorAll('main [data-testid^="conversation-turn-"] [data-message-id]'))
            if (threadContents.length === 0) return

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
