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
// The redesigned navigation rail keeps the help and profile menus in its footer.
const MESSAGE_UNIT_SELECTOR = '[data-chatgpt-conversation-selection-target] [data-chatgpt-search-message-ids]'
const RAIL_MENU_BUTTON_SELECTOR = '[data-app-navigation-rail] button[aria-haspopup="menu"]'

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
        for (const selector of [PROFILE_BUTTON_SELECTOR, SIDEBAR_SCROLL_SELECTOR, RAIL_MENU_BUTTON_SELECTOR, AUTOMATIONS_SELECTOR]) {
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
            // Share pages carry a share id, not a conversation id, so the
            // conversation API below would 404 on them.
            if (isSharePage()) return

            const currentChatId = getChatIdFromUrl()
            if (!currentChatId || currentChatId === chatId) return
            chatId = currentChatId

            const rawConversation = await fetchConversation(chatId)
            const { conversationNodes } = processConversation(rawConversation)

            const threadContents = Array.from(document.querySelectorAll('main [data-testid^="conversation-turn-"] [data-message-id]'))
            if (threadContents.length === 0) return

            threadContents.forEach((thread, index) => {
                const createTime = conversationNodes[index]?.message?.create_time
                if (!createTime) return

                thread.append(createTimestamp(createTime))
            })
        })

        watchMessageTimestamps()
    })
}

/**
 * The redesigned thread tags each message block with the ids it renders and
 * virtualizes off-screen turns, so stamp every block as it mounts.
 */
function watchMessageTimestamps() {
    let chatId = ''
    let createTimes: Promise<Map<string, number>> = Promise.resolve(new Map())
    // Ids that were missing after a refetch, so they do not refetch again.
    const missingIds = new Set<string>()

    const loadCreateTimes = async (id: string) => {
        const conversation = await fetchConversation(id)
        const times = new Map<string, number>()
        Object.values(conversation.mapping).forEach(({ message }) => {
            if (message?.create_time) times.set(message.id, message.create_time)
        })
        return times
    }

    const findCreateTime = (times: Map<string, number>, ids: string[]) => {
        // A block can merge several messages. Use the last one, the reply
        // the user actually sees.
        for (let i = ids.length - 1; i >= 0; i--) {
            const time = times.get(ids[i])
            if (time) return time
        }
        return null
    }

    sentinel.on(MESSAGE_UNIT_SELECTOR, async (unit) => {
        if (isSharePage()) return
        // Stamp the outermost block only.
        if (unit.parentElement?.closest('[data-chatgpt-search-message-ids]')) return

        const currentChatId = getChatIdFromUrl()
        if (!currentChatId) return
        if (currentChatId !== chatId) {
            chatId = currentChatId
            missingIds.clear()
            createTimes = loadCreateTimes(chatId).catch(() => new Map())
        }

        const ids = unit.getAttribute('data-chatgpt-search-message-ids')?.split(/\s+/).filter(Boolean) ?? []
        if (ids.length === 0) return

        let createTime = findCreateTime(await createTimes, ids)
        // Messages sent after the first fetch are not in it yet.
        if (!createTime && ids.some(id => !missingIds.has(id)) && currentChatId === chatId) {
            ids.forEach(id => missingIds.add(id))
            createTimes = loadCreateTimes(chatId).catch(() => new Map())
            createTime = findCreateTime(await createTimes, ids)
        }

        if (!createTime || !unit.isConnected || unit.querySelector(':scope > time[data-ce-timestamp]')) return
        unit.append(createTimestamp(createTime))
    })
}

function createTimestamp(createTime: number) {
    const date = new Date(createTime * 1000)

    const timestamp = document.createElement('time')
    timestamp.className = 'ce-timestamp w-full text-sm text-right'
    timestamp.setAttribute('data-ce-timestamp', '')
    timestamp.dateTime = date.toISOString()
    timestamp.title = date.toLocaleString()

    const hour12 = document.createElement('span')
    hour12.setAttribute('data-time-format', '12')
    hour12.textContent = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const hour24 = document.createElement('span')
    hour24.setAttribute('data-time-format', '24')
    hour24.textContent = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    timestamp.append(hour12, hour24)
    return timestamp
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

    // Place the menu above the first footer menu, which is the help menu.
    const railMenuButton = document.querySelector(RAIL_MENU_BUTTON_SELECTOR)
    if (railMenuButton) {
        return [{
            target: railMenuButton,
            insert: container => getNavMenuInsertionTarget(railMenuButton).before(container),
        }]
    }

    return Array.from(document.querySelectorAll(AUTOMATIONS_SELECTOR)).map(target => ({
        target,
        insert: container => getNavMenuInsertionTarget(target).before(container),
    }))
}
