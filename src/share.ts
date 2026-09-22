import type { ApiConversation } from './api'

function isCompleteConversation(conversation: ApiConversation | null | undefined): conversation is ApiConversation {
    return !!conversation?.mapping && !!conversation.current_node
}

/**
 * Share pages usually embed the conversation in the React Router loader data.
 * Nested share routes (e.g. Team/Enterprise `/share/e/<id>`) may not, so fall
 * back to the share API when the embedded payload is missing or incomplete.
 */
export async function loadShareConversation(
    embedded: ApiConversation | null,
    fetchFallback: () => Promise<ApiConversation>,
): Promise<ApiConversation> {
    const conversation = isCompleteConversation(embedded) ? embedded : await fetchFallback()
    if (!isCompleteConversation(conversation)) {
        throw new Error('Failed to load shared conversation data.')
    }
    return conversation
}
