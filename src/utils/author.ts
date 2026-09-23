import type { ConversationNodeMessage } from '../api'

export function transformAuthor(author: ConversationNodeMessage['author']): string {
    switch (author.role) {
        // Only tool messages with images are exported, such as generated
        // images and charts, which ChatGPT shows as part of its reply.
        case 'assistant':
        case 'tool':
            return 'ChatGPT'
        case 'user':
            return 'You'
        default:
            return author.role
    }
}
