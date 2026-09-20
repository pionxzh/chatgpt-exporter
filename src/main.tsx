import { render } from 'preact'
import sentinel from 'sentinel-js'
import { fetchConversation, processConversation } from './api'
import { getChatIdFromUrl, isSharePage } from './page'
import { watchTemporaryChatId } from './temporaryChat'
import { Menu } from './ui/Menu'
import { onloadSafe } from './utils/utils'

import './i18n'
import './styles/missing-tailwind.css'

const PROFILE_BUTTON_SELECTOR = '[data-testid="accounts-profile-button"]'
const SIDEBAR_SCROLL_SELECTOR = '[data-app-action-sidebar-scroll]'
const AUTOMATIONS_SELECTOR = '[data-sidebar-destination="builtin:automations"]'

interface NavMenuMount {
    target: Element
    insert: (container: Element) => void
}

main()

function main() {
    // Installed before the page is ready so it is in place by the time the
    // user can send the first message of a temporary chat.
    watchTemporaryChatId()

    onloadSafe(() => {
        // eslint-disable-next-line no-console
        console.log('[Exporter] Loaded')

        const styleEl = document.createElement('style')
        styleEl.id = 'sentinel-css'
        document.head.append(styleEl)

        const injectionMap = new Map<Element, Element>()

        const injectNavMenu = ({ target, insert }: NavMenuMount) => {
            if (injectionMap.has(target)) return

            // eslint-disable-next-line no-console
            console.log('[Exporter] Injecting nav', target)

            const container = getMenuContainer()
            injectionMap.set(target, container)
            insert(container)
        }

        const syncNavMenu = () => {
            const mounts = getNavMenuMounts()
            const activeTargets = new Set(mounts.map(({ target }) => target))
            injectionMap.forEach((container, target) => {
                if (!target.isConnected || !container.isConnected || !activeTargets.has(target)) {
                    container.remove()
                    injectionMap.delete(target)
                }
            })

            mounts.forEach(injectNavMenu)
        }

        // Sentinel handles new sidebar nodes immediately. Polling remains as a
        // fallback for UI variants that replace or remove injected siblings.
        for (const selector of [PROFILE_BUTTON_SELECTOR, SIDEBAR_SCROLL_SELECTOR, AUTOMATIONS_SELECTOR]) {
            sentinel.on(selector, syncNavMenu)
        }
        syncNavMenu()
        setInterval(syncNavMenu, 1000)

        // Support for share page
        if (isSharePage()) {
            sentinel.on(`div[role="presentation"] > .w-full > div >.flex.w-full`, (target) => {
                target.prepend(getMenuContainer())
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

function getMenuContainer() {
    const container = document.createElement('div')
    // to overlap on the list section
    container.style.zIndex = '99'
    render(<Menu container={container} />, container)
    return container
}

function getNavMenuInsertionTarget(target: Element) {
    const wrapper = target.parentElement
    if (!wrapper || wrapper.children.length !== 1) return target

    return wrapper
}

function getNavMenuMounts(): NavMenuMount[] {
    const profileButtons = Array.from(document.querySelectorAll(PROFILE_BUTTON_SELECTOR))
    if (profileButtons.length > 0) {
        return profileButtons.map(target => ({
            target,
            insert: container => getNavMenuInsertionTarget(target).before(container),
        }))
    }

    const profileFooters = Array.from(document.querySelectorAll(SIDEBAR_SCROLL_SELECTOR))
        .map(scrollRoot => scrollRoot.nextElementSibling)
        .filter((footer): footer is Element => !!footer?.querySelector('button[aria-haspopup="menu"]'))
    if (profileFooters.length > 0) {
        return profileFooters.map(target => ({
            target,
            insert: container => target.prepend(container),
        }))
    }

    return Array.from(document.querySelectorAll(AUTOMATIONS_SELECTOR)).map(target => ({
        target,
        insert: container => getNavMenuInsertionTarget(target).before(container),
    }))
}
