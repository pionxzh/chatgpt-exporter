/**
 * Conversation Chunker
 *
 * Splits long conversations into analyzable chunks for processing with Haiku 4.5.
 * Uses sliding windows with overlap to maintain context across chunk boundaries.
 */

import type { ApiConversation, ConversationNode } from '../api'

export interface ConversationTurn {
    turn_number: number
    timestamp: string
    speaker: 'user' | 'assistant'
    content: string
    /** Raw message node for reference */
    message_node: any
}

export interface ConversationChunk {
    /** Conversation ID */
    conversation_id: string
    /** Conversation title */
    conversation_title: string
    /** Chunk index (0-based) */
    chunk_index: number
    /** Total number of chunks */
    total_chunks: number
    /** Turn numbers included in this chunk */
    turn_range: [number, number]
    /** The conversation turns */
    turns: ConversationTurn[]
    /** Whether this chunk overlaps with previous */
    has_overlap: boolean
    /** Estimated token count */
    estimated_tokens: number
}

export interface ChunkerConfig {
    /** Number of turns per chunk */
    turns_per_chunk: number
    /** Number of overlapping turns between chunks */
    overlap_turns: number
    /** Maximum tokens per chunk (approx) */
    max_tokens?: number
}

const DEFAULT_CONFIG: ChunkerConfig = {
    turns_per_chunk: 10,
    overlap_turns: 2,
    max_tokens: 8000, // Conservative limit for Haiku input
}

/**
 * Extract message text from various content formats
 */
export function extractMessageText(message: any): string {
    if (!message || !message.content) return ''

    const content = message.content

    // Handle different content formats
    if (typeof content === 'string') {
        return content
    }

    if (Array.isArray(content)) {
        return content
            .filter(part => part?.content_type === 'text')
            .map(part => part?.parts?.join('') || '')
            .join('\n')
    }

    if (content.parts) {
        return Array.isArray(content.parts) ? content.parts.join('') : String(content.parts)
    }

    return String(content)
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 chars)
 */
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
}

/**
 * Parse conversation into turns
 */
export function parseConversationTurns(
    conversation: ApiConversation,
    mapping: Record<string, ConversationNode>,
): ConversationTurn[] {
    const turns: ConversationTurn[] = []

    // Get root node
    const currentNodeId = conversation.current_node
    if (!currentNodeId) return turns

    // Walk backward from current node to build conversation
    const path: string[] = []
    let nodeId: string | null = currentNodeId
    while (nodeId) {
        path.unshift(nodeId)
        const node: ConversationNode | undefined = mapping[nodeId]
        nodeId = node?.parent || null
    }

    // Convert to turns
    let turnNumber = 0
    for (const id of path) {
        const node: ConversationNode | undefined = mapping[id]
        if (!node || !node.message) continue

        const message = node.message
        const content = extractMessageText(message)
        if (!content.trim()) continue

        const role = message.author?.role
        if (role !== 'user' && role !== 'assistant') continue

        turns.push({
            turn_number: turnNumber,
            timestamp: message.create_time
                ? new Date(message.create_time * 1000).toISOString()
                : new Date().toISOString(),
            speaker: role,
            content,
            message_node: node,
        })

        turnNumber++
    }

    return turns
}

/**
 * Chunk a conversation into analyzable pieces
 */
export function chunkConversation(
    conversationId: string,
    conversationTitle: string,
    turns: ConversationTurn[],
    config: Partial<ChunkerConfig> = {},
): ConversationChunk[] {
    const cfg: ChunkerConfig = { ...DEFAULT_CONFIG, ...config }
    const chunks: ConversationChunk[] = []

    if (turns.length === 0) {
        return chunks
    }

    const totalTurns = turns.length
    let chunkIndex = 0
    let startIdx = 0

    while (startIdx < totalTurns) {
        const endIdx = Math.min(startIdx + cfg.turns_per_chunk, totalTurns)
        const chunkTurns = turns.slice(startIdx, endIdx)

        // Calculate estimated tokens
        const text = chunkTurns.map(t => t.content).join('\n')
        const estimatedTokens = estimateTokens(text)

        chunks.push({
            conversation_id: conversationId,
            conversation_title: conversationTitle,
            chunk_index: chunkIndex,
            total_chunks: 0, // Will be set after we know total
            turn_range: [chunkTurns[0].turn_number, chunkTurns[chunkTurns.length - 1].turn_number],
            turns: chunkTurns,
            has_overlap: startIdx > 0,
            estimated_tokens: estimatedTokens,
        })

        // Move to next chunk with overlap
        startIdx += cfg.turns_per_chunk - cfg.overlap_turns
        chunkIndex++

        // Safety: prevent infinite loop
        if (startIdx === (startIdx + cfg.turns_per_chunk - cfg.overlap_turns)) {
            break
        }
    }

    // Set total_chunks for all chunks
    const totalChunks = chunks.length
    chunks.forEach((chunk) => {
        chunk.total_chunks = totalChunks
    })

    return chunks
}

/**
 * Format chunk as text for LLM analysis
 */
export function formatChunkForAnalysis(chunk: ConversationChunk): string {
    let output = `# Conversation: ${chunk.conversation_title}\n\n`
    output += `Chunk ${chunk.chunk_index + 1} of ${chunk.total_chunks}\n`
    output += `Turns ${chunk.turn_range[0]}-${chunk.turn_range[1]}\n\n`
    output += `---\n\n`

    for (const turn of chunk.turns) {
        const speaker = turn.speaker === 'user' ? 'USER' : 'ASSISTANT'
        output += `## Turn ${turn.turn_number} [${speaker}]\n`
        output += `**Timestamp:** ${turn.timestamp}\n\n`
        output += `${turn.content}\n\n`
        output += `---\n\n`
    }

    return output
}

/**
 * Get conversation statistics (useful for cost estimation)
 */
export interface ConversationStats {
    total_turns: number
    user_turns: number
    assistant_turns: number
    total_chars: number
    estimated_tokens: number
    estimated_chunks: number
}

export function getConversationStats(
    turns: ConversationTurn[],
    config: Partial<ChunkerConfig> = {},
): ConversationStats {
    const cfg: ChunkerConfig = { ...DEFAULT_CONFIG, ...config }

    const totalTurns = turns.length
    const userTurns = turns.filter(t => t.speaker === 'user').length
    const assistantTurns = turns.filter(t => t.speaker === 'assistant').length
    const totalChars = turns.reduce((sum, t) => sum + t.content.length, 0)
    const estimatedTokens = estimateTokens(turns.map(t => t.content).join('\n'))

    // Estimate chunks
    const effectiveTurnsPerChunk = cfg.turns_per_chunk - cfg.overlap_turns
    const estimatedChunks = Math.ceil(Math.max(1, totalTurns / effectiveTurnsPerChunk))

    return {
        total_turns: totalTurns,
        user_turns: userTurns,
        assistant_turns: assistantTurns,
        total_chars: totalChars,
        estimated_tokens: estimatedTokens,
        estimated_chunks: estimatedChunks,
    }
}
