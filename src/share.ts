import type { ApiConversation } from './api'

export async function loadShareConversation(
    embedded: ApiConversation | null,
    fetchFallback: () => Promise<ApiConversation>,
): Promise<ApiConversation> {
    const conversation = embedded?.mapping && embedded.current_node ? embedded : await fetchFallback()
    if (!conversation?.mapping || !conversation.current_node) {
        throw new Error('Failed to load shared conversation data.')
    }
    return conversation
}
