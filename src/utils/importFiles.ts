import type { ApiConversationWithId } from '../api'

/**
 * Collect the conversations from parsed JSON files. A large official data
 * export splits them across `conversations-000.json`, `conversations-001.json`
 * and so on, next to other JSON files such as `library_files.json`. Items
 * without a `mapping` are not conversations and are skipped. A conversation
 * found more than once, such as in an older and a newer export, keeps its
 * latest version.
 */
export function collectConversations(files: unknown[]): ApiConversationWithId[] {
    const conversations = new Map<string, ApiConversationWithId>()
    for (const data of files) {
        if (!Array.isArray(data)) continue

        for (const item of data) {
            if (!item || typeof item !== 'object' || !item.mapping || typeof item.mapping !== 'object') continue

            const id = item.id ?? item.conversation_id
            if (typeof id !== 'string') continue

            const existing = conversations.get(id)
            if (existing && (existing.update_time ?? 0) >= (item.update_time ?? 0)) continue
            conversations.set(id, { ...item, id })
        }
    }
    return [...conversations.values()]
}
