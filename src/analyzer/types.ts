// Analysis types for conversation insights

export interface ConversationMetrics {
    // Identifiers
    id: string
    title: string

    // Basic counts
    totalTurns: number
    userMessageCount: number
    aiMessageCount: number

    // Character counts
    userCharCount: number
    aiCharCount: number
    totalCharCount: number

    // Key metric: Input/Output ratio
    inputOutputRatio: number // userChars / aiChars
    avgUserMessageLength: number
    avgAiMessageLength: number

    // Conversation shape
    depth: number // longest chain
    hasCode: boolean
    codeBlockCount: number
    hasMath: boolean
    mathBlockCount: number
    hasImages: boolean
    imageCount: number
    hasLinks: boolean
    linkCount: number

    // Cognitive markers (regex-based)
    questionCount: number // "?" count
    exclamationCount: number // "!" count
    uncertaintyMarkers: number // "maybe", "not sure", "I think"
    certaintyMarkers: number // "definitely", "clearly", "exactly"
    discoveryMarkers: number // "aha", "oh!", "I see", "wait"

    // Temporal
    createTime: number
    updateTime: number
    hourOfDay: number
    dayOfWeek: number
}

export interface FilterCriteria {
    // Input/Output ratio
    minInputOutputRatio?: number
    maxInputOutputRatio?: number

    // Conversation depth
    minTurns?: number
    maxTurns?: number

    // Content type
    hasCode?: boolean
    hasMath?: boolean
    hasImages?: boolean

    // Cognitive markers
    hasDiscoveryMarkers?: boolean // aha moments
    hasHighUncertainty?: boolean // lots of "maybe", "not sure"
    isQuestionHeavy?: boolean // lots of questions

    // Date range
    startDate?: number
    endDate?: number

    // Search term
    searchTerm?: string
}

export interface AnalysisResult {
    metrics: ConversationMetrics
    interestingScore: number // 0-10, calculated composite score
    tags: string[] // auto-generated tags like "deep-dive", "code-heavy", etc.
}

export type ConversationType =
    | 'quick-question' // 1-3 turns, low input ratio
    | 'balanced-discussion' // Balanced back-and-forth
    | 'deep-dive' // High user input, exploring complex topic
    | 'code-heavy' // Lots of code blocks
    | 'research-session' // Many questions, learning mode
    | 'brainstorm' // High discovery markers, creative
    | 'problem-solving' // Iterative, debugging
    | 'other'
