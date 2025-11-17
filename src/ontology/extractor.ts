/**
 * Event Extractor
 *
 * Orchestrates the extraction of events and insights from conversation chunks
 * using the Anthropic API and SAREC methodology.
 */

import {
    createAssumptionTrackingPrompt,
    createAutoTaggingPrompt,
    createConceptExtractionPrompt,
    createDecisionTreePrompt,
    createEventExtractionPrompt,
    createIdeaArchaeologyPrompt,
    createToMPrompt,
} from './prompts'
import type { AnthropicClient } from './anthropic-client'
import type { ConversationChunk } from './chunker'
import type {
    ChunkAnalysisResult,
    ConversationAnalysisResult,
    Event,
    EventSubtype,
    Evidence,
} from './types'

// ============================================================================
// RESPONSE SCHEMAS (what we expect from LLM)
// ============================================================================

interface ExtractedEvent {
    type: EventSubtype
    turn_number: number
    speaker: 'user' | 'assistant'
    content: string
    quote: string
    context: string
    confidence: number
    tags: string[]
}

interface ExtractedConcept {
    label: string
    alt_labels?: string[]
    turn_numbers: number[]
    context: string
    quotes: string[]
    confidence: number
}

interface ExtractedDecision {
    turn_number: number
    decision: string
    options_considered: string[]
    reasoning: string
    evidence: string
    confidence: number
    supersedes: string | null
}

interface ExtractedAssumption {
    turn_number: number
    assumption: string
    evidence: string
    type: 'explicit' | 'implicit'
    challenged: boolean
    challenged_at_turn?: number
    challenge_evidence?: string
    outcome?: 'active' | 'invalidated' | 'validated'
    confidence: number
}

interface MentalState {
    turn_number: number
    state_type: 'realization' | 'frustration' | 'excitement' | 'uncertainty' | 'confidence'
    description: string
    evidence: string
    confidence: number
}

interface UserGoal {
    goal: string
    evidence_turns: number[]
    confidence: number
}

interface CognitivePattern {
    pattern: string
    evidence: string
    confidence: number
}

interface IdeaEvolutionStage {
    turn_number: number
    stage: 'seed' | 'refinement' | 'implementation' | 'pivot'
    description: string
    quote: string
}

interface IdeaEvolution {
    concept: string
    stages: IdeaEvolutionStage[]
}

interface Tags {
    tags: string[]
    primary_topic: string
    activity_type: string
    complexity: string
}

// ============================================================================
// EVENT EXTRACTOR
// ============================================================================

export class EventExtractor {
    private client: AnthropicClient

    constructor(client: AnthropicClient) {
        this.client = client
    }

    /**
     * Analyze a single chunk - extract all insights
     */
    async analyzeChunk(chunk: ConversationChunk): Promise<ChunkAnalysisResult> {
        const results: {
            events?: ExtractedEvent[]
            concepts?: ExtractedConcept[]
            decisions?: ExtractedDecision[]
            assumptions?: ExtractedAssumption[]
            mental_states?: MentalState[]
            idea_evolution?: IdeaEvolution[]
            tags?: Tags
            summary?: string
        } = {}

        let totalTokensUsed = 0
        let totalCost = 0

        // 1. Extract events
        const eventsResult = await this.client.extractJSON<{ events: ExtractedEvent[] }>(
            createEventExtractionPrompt(chunk),
        )
        if (eventsResult.success && eventsResult.data) {
            results.events = eventsResult.data.events
            totalTokensUsed += (eventsResult.usage?.input_tokens || 0) + (eventsResult.usage?.output_tokens || 0)
            totalCost += eventsResult.usage?.cost_usd || 0
        }

        // 2. Extract concepts
        const conceptsResult = await this.client.extractJSON<{ concepts: ExtractedConcept[] }>(
            createConceptExtractionPrompt(chunk),
        )
        if (conceptsResult.success && conceptsResult.data) {
            results.concepts = conceptsResult.data.concepts
            totalTokensUsed += (conceptsResult.usage?.input_tokens || 0) + (conceptsResult.usage?.output_tokens || 0)
            totalCost += conceptsResult.usage?.cost_usd || 0
        }

        // 3. Extract decisions
        const decisionsResult = await this.client.extractJSON<{ decisions: ExtractedDecision[] }>(
            createDecisionTreePrompt(chunk),
        )
        if (decisionsResult.success && decisionsResult.data) {
            results.decisions = decisionsResult.data.decisions
            totalTokensUsed += (decisionsResult.usage?.input_tokens || 0) + (decisionsResult.usage?.output_tokens || 0)
            totalCost += decisionsResult.usage?.cost_usd || 0
        }

        // 4. Extract assumptions
        const assumptionsResult = await this.client.extractJSON<{ assumptions: ExtractedAssumption[] }>(
            createAssumptionTrackingPrompt(chunk),
        )
        if (assumptionsResult.success && assumptionsResult.data) {
            results.assumptions = assumptionsResult.data.assumptions
            totalTokensUsed
                += (assumptionsResult.usage?.input_tokens || 0) + (assumptionsResult.usage?.output_tokens || 0)
            totalCost += assumptionsResult.usage?.cost_usd || 0
        }

        // 5. Theory of Mind analysis
        const tomResult = await this.client.extractJSON<{
            mental_states: MentalState[]
            user_goals: UserGoal[]
            cognitive_patterns: CognitivePattern[]
        }>(
            createToMPrompt(chunk),
        )
        if (tomResult.success && tomResult.data) {
            results.mental_states = tomResult.data.mental_states
            totalTokensUsed += (tomResult.usage?.input_tokens || 0) + (tomResult.usage?.output_tokens || 0)
            totalCost += tomResult.usage?.cost_usd || 0
        }

        // 6. Idea evolution
        const ideaEvolutionResult = await this.client.extractJSON<{ idea_evolution: IdeaEvolution[] }>(
            createIdeaArchaeologyPrompt(chunk),
        )
        if (ideaEvolutionResult.success && ideaEvolutionResult.data) {
            results.idea_evolution = ideaEvolutionResult.data.idea_evolution
            totalTokensUsed
                += (ideaEvolutionResult.usage?.input_tokens || 0) + (ideaEvolutionResult.usage?.output_tokens || 0)
            totalCost += ideaEvolutionResult.usage?.cost_usd || 0
        }

        // 7. Auto-tagging
        const tagsResult = await this.client.extractJSON<Tags>(
            createAutoTaggingPrompt(chunk),
        )
        if (tagsResult.success && tagsResult.data) {
            results.tags = tagsResult.data
            totalTokensUsed += (tagsResult.usage?.input_tokens || 0) + (tagsResult.usage?.output_tokens || 0)
            totalCost += tagsResult.usage?.cost_usd || 0
        }

        // Convert extracted events to proper Event objects
        const events: Event[] = (results.events || []).map((e, idx) => {
            const evidence: Evidence[] = [
                {
                    quote: e.quote,
                    speaker: e.speaker,
                    turn_number: e.turn_number,
                    turn_timestamp: chunk.turns[e.turn_number]?.timestamp || new Date().toISOString(),
                    conversation_id: chunk.conversation_id,
                },
            ]

            return {
                id: `evt_${chunk.conversation_id}_${chunk.chunk_index}_${idx}`,
                type: 'event',
                subtype: e.type,
                conversation_id: chunk.conversation_id,
                conversation_title: chunk.conversation_title,
                turn_number: e.turn_number,
                turn_timestamp: chunk.turns[e.turn_number]?.timestamp || new Date().toISOString(),
                content: e.content,
                evidence,
                related_entities: [],
                created_at: new Date().toISOString(),
                tags: e.tags,
                confidence: e.confidence,
            }
        })

        // Build chunk analysis result
        const chunkResult: ChunkAnalysisResult = {
            conversation_id: chunk.conversation_id,
            chunk_index: chunk.chunk_index,
            turn_range: chunk.turn_range,
            events,
            concept_mentions: (results.concepts || []).map(c => ({
                concept_label: c.label,
                turn_number: c.turn_numbers[0] || 0,
                context: c.context,
            })),
            metadata: {
                analyzed_at: new Date().toISOString(),
                model: 'claude-haiku-4-5',
                tokens_used: totalTokensUsed,
                cost_usd: totalCost,
            },
        }

        return chunkResult
    }

    /**
     * Analyze a full conversation (all chunks)
     */
    async analyzeConversation(
        conversationId: string,
        conversationTitle: string,
        chunks: ConversationChunk[],
        onProgress?: (chunkIndex: number, totalChunks: number) => void,
    ): Promise<ConversationAnalysisResult> {
        const chunkResults: ChunkAnalysisResult[] = []

        for (let i = 0; i < chunks.length; i++) {
            if (onProgress) {
                onProgress(i, chunks.length)
            }

            const result = await this.analyzeChunk(chunks[i])
            chunkResults.push(result)
        }

        // Aggregate statistics
        const allEvents = chunkResults.flatMap(r => r.events)
        const eventTypeCounts: Record<EventSubtype, number> = {} as any

        for (const event of allEvents) {
            eventTypeCounts[event.subtype] = (eventTypeCounts[event.subtype] || 0) + 1
        }

        const conceptsSet = new Set<string>()
        for (const chunk of chunkResults) {
            for (const mention of chunk.concept_mentions) {
                conceptsSet.add(mention.concept_label)
            }
        }

        const totalCost = chunkResults.reduce((sum, r) => sum + r.metadata.cost_usd, 0)

        const result: ConversationAnalysisResult = {
            conversation_id: conversationId,
            conversation_title: conversationTitle,
            chunks: chunkResults,
            summary: {
                total_events: allEvents.length,
                event_types: eventTypeCounts,
                concepts_mentioned: conceptsSet.size,
                questions_asked: allEvents.filter(e => e.subtype === 'question_asked').length,
                decisions_made: allEvents.filter(e => e.subtype === 'decision_made').length,
            },
            total_cost_usd: totalCost,
        }

        return result
    }
}
