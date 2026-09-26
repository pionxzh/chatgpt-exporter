import { render } from 'preact'
import sentinel from 'sentinel-js'
import { fetchConversation, processConversation } from './api'
import { getChatIdFromUrl, isSharePage } from './page'
import { watchTemporaryChatId } from './temporaryChat'
import { Menu } from './ui/Menu'
import { onloadSafe } from './utils/utils'

import './i18n'

// ChatGPT A/B tests its layout, so users can get different variants at the
// same time. Each injection point notes the date it was added. Keep it for at
// least 30 days, then remove it once no variant renders it anymore.

// Added 2026-05-03.
const PROFILE_BUTTON_SELECTOR = '[data-testid="accounts-profile-button"]'
// Added 2026-09-20. Footer after the nav: 2026-09-26.
const SIDEBAR_SCROLL_SELECTOR = '[data-app-action-sidebar-scroll]'
// Added 2026-09-20.
const AUTOMATIONS_SELECTOR = '[data-sidebar-destination="builtin:automations"]'
// Added 2026-09-24.
const MESSAGE_UNIT_SELECTOR = '[data-chatgpt-conversation-selection-target] [data-chatgpt-search-message-ids]'
// Added 2026-09-25. The rail keeps the help and profile menus in its footer.
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

        // Support for share page. Added 2024-09-07.
        if (isSharePage()) {
            sentinel.on(`div[role="presentation"] > .w-full > div >.flex.w-full`, (target) => {
                target.prepend(getMenuContainer())
            })
        }

        /** Insert timestamp to the bottom right of each message. Added 2023-11-13. */
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
    timestamp.className = 'ce-timestamp'
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
    container.className = 'ce-root'
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

    // The redesigned shell keeps the expanded sidebar and the collapsed rail
    // mounted together and hides one with `inert`, so mount a menu in each.
    const mounts: NavMenuMount[] = []

    Array.from(document.querySelectorAll(SIDEBAR_SCROLL_SELECTOR)).forEach((scrollRoot) => {
        // The profile footer follows either the scroll root or its wrapping nav.
        const footer = [scrollRoot.nextElementSibling, scrollRoot.parentElement?.nextElementSibling]
            .find(el => el?.querySelector('button[aria-haspopup="menu"]'))
        if (footer) {
            mounts.push({
                target: footer,
                insert: (container) => {
                    // Line up with the sidebar rows, which the footer insets, and
                    // keep a gap from the chat list that ends right above it.
                    Object.assign((container as HTMLElement).style, {
                        paddingInline: 'var(--padding-row-x)',
                        paddingTop: '8px',
                    })
                    footer.prepend(container)
                },
            })
        }
    })

    // Place the menu in its own row above the first footer menu of the rail.
    const railMenuButton = document.querySelector(RAIL_MENU_BUTTON_SELECTOR)
    const rail = railMenuButton?.closest('[data-app-navigation-rail]')
    const railRow = rail && Array.from(rail.children).find(row => row.contains(railMenuButton))
    if (railMenuButton && railRow) {
        mounts.push({
            target: railMenuButton,
            insert: (container) => {
                // The rail itself ignores pointer events and each row opts back in.
                (container as HTMLElement).style.pointerEvents = 'auto'
                railRow.before(container)
            },
        })
    }

    if (mounts.length > 0) return mounts

    return Array.from(document.querySelectorAll(AUTOMATIONS_SELECTOR)).map(target => ({
        target,
        insert: container => getNavMenuInsertionTarget(target).before(container),
    }))
}
