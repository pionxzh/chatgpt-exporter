import type { ApiConversationItem, ApiConversations } from '../api'

type FetchPage = (offset: number, limit: number) => Promise<ApiConversations>

/**
 * Fetches the conversations that changed since `cached` was loaded, newest
 * first. Merge them into the list with `applyHead`.
 *
 * The API orders the list by `update_time`, newest first, and new messages
 * and renames both bump it. So every conversation that changed since the
 * cached load sits before the first item that is still unchanged: paging
 * stops there, and the rest of the cached list is kept as is. Conversations
 * deleted or archived elsewhere are not detected.
 */
export async function refreshConversationList(
    cached: ApiConversationItem[],
    fetchPage: FetchPage,
    pageSize: number,
    maxItems: number,
): Promise<{ head: ApiConversationItem[], total: number | null }> {
    const known = new Map(cached.map(c => [c.id, c.update_time]))
    const fresh: ApiConversationItem[] = []
    let total: number | null = null
    let offset = 0

    while (offset < maxItems) {
        const page = await fetchPage(offset, pageSize)
        const items = page.items ?? []
        total = page.total

        const firstUnchanged = items.findIndex(c => known.has(c.id) && known.get(c.id) === c.update_time)
        if (firstUnchanged !== -1) {
            fresh.push(...items.slice(0, firstUnchanged))
            break
        }
        fresh.push(...items)
        if (items.length < pageSize) break
        offset += pageSize
    }

    return { head: fresh, total }
}

/** Puts the changed conversations on top and drops their old positions */
export function applyHead(head: ApiConversationItem[], items: ApiConversationItem[]): ApiConversationItem[] {
    if (head.length === 0) return items
    const headIds = new Set(head.map(c => c.id))
    return [...head, ...items.filter(c => !headIds.has(c.id))]
}
