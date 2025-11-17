// Local analysis - no API calls, pure JavaScript metrics

import type { AnalysisResult, ConversationMetrics, ConversationType, FilterCriteria } from './types'
import type { ApiConversationWithId, ConversationNode, ConversationNodeMessage } from '../api'

// Regex patterns for content detection
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g
// const INLINE_CODE_REGEX = /`[^`]+`/g // Reserved for future use
const MATH_BLOCK_REGEX = /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]/g
// const INLINE_MATH_REGEX = /\$[^$]+\$/g // Reserved for future use
const LINK_REGEX = /https?:\/\/[^\s]+/g
const IMAGE_MARKDOWN_REGEX = /!\[.*?\]\(.*?\)/g

// Cognitive marker patterns
const UNCERTAINTY_WORDS = /\b(maybe|perhaps|possibly|not sure|I think|seems like|might be|could be|uncertain)\b/gi
const CERTAINTY_WORDS = /\b(definitely|clearly|obviously|exactly|certainly|surely|absolutely|precisely)\b/gi
const DISCOVERY_WORDS = /\b(aha|oh!|I see|wait|interesting|got it|makes sense|eureka)\b/gi

/**
 * Analyze a conversation and extract all metrics
 */
export function analyzeConversation(conversation: ApiConversationWithId): ConversationMetrics {
    const nodes = Object.values(conversation.mapping)
    const messages = nodes.filter(n => n.message && n.message.author.role !== 'system')

    // Separate user and AI messages
    const userMessages = messages.filter(n => n.message?.author.role === 'user')
    const aiMessages = messages.filter(n => n.message?.author.role === 'assistant')

    // Calculate character counts
    const userCharCount = userMessages.reduce((sum, n) => sum + getMessageText(n.message!).length, 0)
    const aiCharCount = aiMessages.reduce((sum, n) => sum + getMessageText(n.message!).length, 0)
    const totalCharCount = userCharCount + aiCharCount

    // Input/output ratio (key metric!)
    const inputOutputRatio = aiCharCount > 0 ? userCharCount / aiCharCount : 0

    // Content type detection
    const allText = messages.map(n => getMessageText(n.message!)).join('\n')
    const codeBlockCount = (allText.match(CODE_BLOCK_REGEX) || []).length
    const mathBlockCount = (allText.match(MATH_BLOCK_REGEX) || []).length
    const linkCount = (allText.match(LINK_REGEX) || []).length
    const imageCount = (allText.match(IMAGE_MARKDOWN_REGEX) || []).length
                       + countMultimodalImages(messages)

    // Cognitive markers (user messages only)
    const userText = userMessages.map(n => getMessageText(n.message!)).join('\n')
    const uncertaintyMarkers = (userText.match(UNCERTAINTY_WORDS) || []).length
    const certaintyMarkers = (userText.match(CERTAINTY_WORDS) || []).length
    const discoveryMarkers = (userText.match(DISCOVERY_WORDS) || []).length
    const questionCount = (userText.match(/\?/g) || []).length
    const exclamationCount = (userText.match(/!/g) || []).length

    // Temporal info
    const createTime = conversation.create_time
    const updateTime = conversation.update_time
    const createDate = new Date(createTime * 1000)
    const hourOfDay = createDate.getHours()
    const dayOfWeek = createDate.getDay()

    return {
        id: conversation.id,
        title: conversation.title,
        totalTurns: messages.length,
        userMessageCount: userMessages.length,
        aiMessageCount: aiMessages.length,
        userCharCount,
        aiCharCount,
        totalCharCount,
        inputOutputRatio,
        avgUserMessageLength: userMessages.length > 0 ? userCharCount / userMessages.length : 0,
        avgAiMessageLength: aiMessages.length > 0 ? aiCharCount / aiMessages.length : 0,
        depth: calculateDepth(conversation.mapping),
        hasCode: codeBlockCount > 0,
        codeBlockCount,
        hasMath: mathBlockCount > 0,
        mathBlockCount,
        hasImages: imageCount > 0,
        imageCount,
        hasLinks: linkCount > 0,
        linkCount,
        questionCount,
        exclamationCount,
        uncertaintyMarkers,
        certaintyMarkers,
        discoveryMarkers,
        createTime,
        updateTime,
        hourOfDay,
        dayOfWeek,
    }
}

/**
 * Generate a full analysis result with interest scoring and tags
 */
export function generateAnalysisResult(conversation: ApiConversationWithId): AnalysisResult {
    const metrics = analyzeConversation(conversation)
    const interestingScore = calculateInterestScore(metrics)
    const tags = generateTags(metrics)

    return {
        metrics,
        interestingScore,
        tags,
    }
}

/**
 * Calculate how "interesting" a conversation is (0-10)
 * Prioritizes: high input ratio, deep dives, discovery moments
 */
function calculateInterestScore(metrics: ConversationMetrics): number {
    let score = 5 // baseline

    // High input ratio = you wrote a lot = interesting
    if (metrics.inputOutputRatio > 0.8) score += 2
    else if (metrics.inputOutputRatio > 0.5) score += 1

    // Deep conversations are interesting
    if (metrics.totalTurns > 20) score += 1
    if (metrics.totalTurns > 50) score += 1

    // Discovery markers = aha moments
    if (metrics.discoveryMarkers > 3) score += 1

    // Long user messages = thinking deeply
    if (metrics.avgUserMessageLength > 500) score += 1

    // Question-heavy = exploring
    if (metrics.questionCount > 10) score += 0.5

    // Code/math = technical depth
    if (metrics.codeBlockCount > 5) score += 0.5
    if (metrics.mathBlockCount > 3) score += 0.5

    return Math.min(10, Math.max(0, score))
}

/**
 * Generate auto-tags based on metrics
 */
function generateTags(metrics: ConversationMetrics): string[] {
    const tags: string[] = []

    // Conversation type
    if (metrics.inputOutputRatio > 0.8) tags.push('deep-dive')
    if (metrics.totalTurns <= 3) tags.push('quick-question')
    if (metrics.totalTurns > 30) tags.push('marathon')

    // Content type
    if (metrics.codeBlockCount > 5) tags.push('code-heavy')
    if (metrics.mathBlockCount > 3) tags.push('math-heavy')
    if (metrics.hasImages) tags.push('visual')

    // Cognitive markers
    if (metrics.discoveryMarkers > 3) tags.push('breakthrough')
    if (metrics.uncertaintyMarkers > 5) tags.push('exploratory')
    if (metrics.questionCount > 15) tags.push('curious')

    // Balance
    const ratio = metrics.inputOutputRatio
    if (ratio > 0.4 && ratio < 0.6) tags.push('balanced')

    return tags
}

/**
 * Classify conversation type
 */
export function classifyConversationType(metrics: ConversationMetrics): ConversationType {
    // Quick question: short, low input ratio
    if (metrics.totalTurns <= 3 && metrics.inputOutputRatio < 0.3) {
        return 'quick-question'
    }

    // Code-heavy: lots of code blocks
    if (metrics.codeBlockCount > 5) {
        return 'code-heavy'
    }

    // Research: many questions, learning
    if (metrics.questionCount > 15 && metrics.inputOutputRatio < 0.5) {
        return 'research-session'
    }

    // Brainstorm: balanced, discovery markers
    if (metrics.discoveryMarkers > 3 && metrics.inputOutputRatio > 0.4) {
        return 'brainstorm'
    }

    // Deep dive: high input ratio, long conversation
    if (metrics.inputOutputRatio > 0.7 || (metrics.totalTurns > 20 && metrics.inputOutputRatio > 0.5)) {
        return 'deep-dive'
    }

    // Balanced discussion
    if (metrics.inputOutputRatio > 0.4 && metrics.inputOutputRatio < 0.6) {
        return 'balanced-discussion'
    }

    // Problem-solving: iterative, uncertainty markers
    if (metrics.uncertaintyMarkers > 5 && metrics.totalTurns > 10) {
        return 'problem-solving'
    }

    return 'other'
}

/**
 * Filter conversations based on criteria
 */
export function filterConversations(
    conversations: ApiConversationWithId[],
    criteria: FilterCriteria,
): ApiConversationWithId[] {
    return conversations.filter((conv) => {
        const metrics = analyzeConversation(conv)

        // Input/output ratio
        if (criteria.minInputOutputRatio !== undefined && metrics.inputOutputRatio < criteria.minInputOutputRatio) {
            return false
        }
        if (criteria.maxInputOutputRatio !== undefined && metrics.inputOutputRatio > criteria.maxInputOutputRatio) {
            return false
        }

        // Turn count
        if (criteria.minTurns !== undefined && metrics.totalTurns < criteria.minTurns) {
            return false
        }
        if (criteria.maxTurns !== undefined && metrics.totalTurns > criteria.maxTurns) {
            return false
        }

        // Content type
        if (criteria.hasCode !== undefined && metrics.hasCode !== criteria.hasCode) {
            return false
        }
        if (criteria.hasMath !== undefined && metrics.hasMath !== criteria.hasMath) {
            return false
        }
        if (criteria.hasImages !== undefined && metrics.hasImages !== criteria.hasImages) {
            return false
        }

        // Cognitive markers
        if (criteria.hasDiscoveryMarkers && metrics.discoveryMarkers === 0) {
            return false
        }
        if (criteria.hasHighUncertainty && metrics.uncertaintyMarkers < 5) {
            return false
        }
        if (criteria.isQuestionHeavy && metrics.questionCount < 10) {
            return false
        }

        // Date range
        if (criteria.startDate !== undefined && metrics.createTime < criteria.startDate) {
            return false
        }
        if (criteria.endDate !== undefined && metrics.createTime > criteria.endDate) {
            return false
        }

        // Search term (in title)
        if (criteria.searchTerm) {
            const searchLower = criteria.searchTerm.toLowerCase()
            if (!metrics.title.toLowerCase().includes(searchLower)) {
                return false
            }
        }

        return true
    })
}

// Helper functions

function getMessageText(message: ConversationNodeMessage): string {
    if (!message.content) return ''

    switch (message.content.content_type) {
        case 'text':
            return message.content.parts?.join('\n') || ''
        case 'code':
            return message.content.text || ''
        case 'execution_output':
            return message.content.text || ''
        case 'multimodal_text':
            return message.content.parts
                ?.filter(p => typeof p === 'string')
                .join('\n') || ''
        default:
            return ''
    }
}

function countMultimodalImages(messages: ConversationNode[]): number {
    let count = 0
    messages.forEach((node) => {
        if (!node.message) return
        const content = node.message.content
        if (content.content_type === 'multimodal_text' && Array.isArray(content.parts)) {
            count += content.parts.filter(p =>
                typeof p === 'object' && p !== null && 'content_type' in p
                && p.content_type === 'image_asset_pointer',
            ).length
        }
    })
    return count
}

function calculateDepth(mapping: Record<string, ConversationNode>): number {
    let maxDepth = 0

    function traverse(nodeId: string, depth: number) {
        maxDepth = Math.max(maxDepth, depth)
        const node = mapping[nodeId]
        if (node && node.children) {
            node.children.forEach(childId => traverse(childId, depth + 1))
        }
    }

    // Find root nodes (no parent)
    Object.keys(mapping).forEach((id) => {
        if (!mapping[id].parent) {
            traverse(id, 0)
        }
    })

    return maxDepth
}
