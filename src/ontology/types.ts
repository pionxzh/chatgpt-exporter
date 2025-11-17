/**
 * Ontology Type Definitions
 *
 * This file defines the complete type system for the conversation knowledge graph,
 * inspired by RDF, SKOS, PROV, and Zettelkasten methodologies.
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type EntityId = string // Format: "{type}_{randomId}"
export type ConversationId = string // ChatGPT conversation ID
export type TurnNumber = number // 0-indexed turn position in conversation
export type Timestamp = string // ISO 8601 format

// ============================================================================
// ENTITY TYPES
// ============================================================================

export type EntityType =
    | 'event'
    | 'concept'
    | 'question'
    | 'decision'
    | 'assumption'
    | 'problem'
    | 'solution'
    | 'artifact'
    | 'person'
    | 'relationship'
    | 'theme'
    | 'hypothesis'
    | 'experiment'
    | 'metric'
    | 'context'
    | 'pattern'

export type EventSubtype =
    | 'aha_moment'
    | 'concept_mention'
    | 'decision_made'
    | 'assumption_stated'
    | 'assumption_challenge'
    | 'question_asked'
    | 'question_answered'
    | 'problem_identified'
    | 'solution_proposed'
    | 'discovery'
    | 'uncertainty'
    | 'creative_prompt'
    | 'problem_framing'

// ============================================================================
// EVIDENCE & PROVENANCE (SAREC)
// ============================================================================

/**
 * Evidence represents the ground truth - the actual conversation text
 * that supports an extracted insight. This is the "E" in SAREC.
 */
export interface Evidence {
    /** Exact quote from the conversation */
    quote: string
    /** Who said it */
    speaker: 'user' | 'assistant'
    /** Position in conversation */
    turn_number: TurnNumber
    /** When it was said */
    turn_timestamp: Timestamp
    /** Conversation it came from */
    conversation_id: ConversationId
    /** Optional: character offset in message */
    char_offset?: [number, number]
}

// ============================================================================
// ENTITIES
// ============================================================================

/** Base interface for all entities */
export interface BaseEntity {
    id: EntityId
    type: EntityType
    created_at: Timestamp
    /** Tags for categorization */
    tags: string[]
    /** Confidence score 0-1 (for LLM-extracted entities) */
    confidence?: number
}

/** Events are temporal occurrences in conversations */
export interface Event extends BaseEntity {
    type: 'event'
    subtype: EventSubtype
    /** The conversation this event occurred in */
    conversation_id: ConversationId
    conversation_title: string
    /** Position in conversation */
    turn_number: TurnNumber
    /** When this message was sent */
    turn_timestamp: Timestamp
    /** The insight/content extracted */
    content: string
    /** Ground truth: actual conversation text */
    evidence: Evidence[]
    /** Related entities */
    related_entities: EntityId[]
}

/** Concepts are recurring ideas/topics across conversations */
export interface Concept extends BaseEntity {
    type: 'concept'
    /** Primary name */
    label: string
    /** Alternative names/synonyms */
    alt_labels: string[]
    /** Brief description */
    description: string
    /** Broader concepts (hierarchical) */
    broader: EntityId[]
    /** Narrower concepts (hierarchical) */
    narrower: EntityId[]
    /** Related concepts (associative) */
    related: EntityId[]
    /** When first mentioned */
    first_mentioned: Timestamp
    /** When last mentioned */
    last_mentioned: Timestamp
    /** Number of mentions */
    mention_count: number
    /** Conversations where this concept appears */
    conversations: ConversationId[]
    /** Timeline of how concept evolved */
    timeline: ConceptTimelineEntry[]
    /** Evolution narrative (LLM-generated) */
    evolution?: string
}

export interface ConceptTimelineEntry {
    event_id: EntityId
    timestamp: Timestamp
    context: string
    phase: 'exploration' | 'implementation' | 'refinement' | 'mastery'
}

/** Questions (both asked and answered) */
export interface Question extends BaseEntity {
    type: 'question'
    /** The question text */
    question: string
    /** Context around the question */
    context: string
    /** Where it was asked */
    conversation_id: ConversationId
    turn_number: TurnNumber
    /** When it was asked */
    timestamp: Timestamp
    /** Current status */
    status: 'open' | 'answered' | 'partially_answered' | 'obsolete'
    /** Reference to answer (if answered) */
    answered_by?: EntityId
    /** Evidence for the question */
    evidence: Evidence[]
    /** Related concepts */
    related_concepts: EntityId[]
}

/** Decisions made during conversations */
export interface Decision extends BaseEntity {
    type: 'decision'
    /** The decision made */
    decision: string
    /** Context and reasoning */
    reasoning: string
    /** Options that were considered */
    options_considered: string[]
    /** Where it was made */
    conversation_id: ConversationId
    turn_number: TurnNumber
    /** When it was made */
    timestamp: Timestamp
    /** Current status */
    status: 'active' | 'superseded' | 'reverted'
    /** If superseded, which decision replaced it */
    supersedes?: EntityId
    superseded_by?: EntityId
    /** Evidence supporting this decision */
    evidence: Evidence[]
    /** What assumptions underlie this decision */
    based_on_assumptions: EntityId[]
}

/** Assumptions (beliefs that can be challenged) */
export interface Assumption extends BaseEntity {
    type: 'assumption'
    /** The assumption statement */
    assumption: string
    /** Context where it was stated */
    context: string
    /** Where it was stated */
    conversation_id: ConversationId
    turn_number: TurnNumber
    /** When it was stated */
    timestamp: Timestamp
    /** Current status */
    status: 'active' | 'challenged' | 'invalidated' | 'validated'
    /** If challenged/invalidated, the event that did it */
    challenged_by?: EntityId
    /** Evidence for the assumption */
    evidence: Evidence[]
}

/** Problems/challenges identified */
export interface Problem extends BaseEntity {
    type: 'problem'
    /** Problem description */
    problem: string
    /** Context */
    context: string
    /** Where identified */
    conversation_id: ConversationId
    turn_number: TurnNumber
    timestamp: Timestamp
    /** Status */
    status: 'open' | 'solved' | 'mitigated' | 'abandoned'
    /** Solutions attempted */
    solutions: EntityId[]
    /** Evidence */
    evidence: Evidence[]
}

/** Solutions/approaches */
export interface Solution extends BaseEntity {
    type: 'solution'
    /** Solution description */
    solution: string
    /** How it works */
    description: string
    /** Where proposed */
    conversation_id: ConversationId
    turn_number: TurnNumber
    timestamp: Timestamp
    /** What problem(s) it solves */
    solves_problems: EntityId[]
    /** Outcome */
    outcome: 'success' | 'failure' | 'partial' | 'unknown'
    /** Evidence */
    evidence: Evidence[]
}

/** Artifacts created (code, docs, designs) */
export interface Artifact extends BaseEntity {
    type: 'artifact'
    /** Artifact name */
    name: string
    /** Type of artifact */
    artifact_type: 'code' | 'document' | 'design' | 'data' | 'other'
    /** Description */
    description: string
    /** Where created */
    conversation_id: ConversationId
    turn_number: TurnNumber
    timestamp: Timestamp
    /** Created by whom */
    created_by: EntityId
    /** Based on what decision */
    generated_by?: EntityId
    /** Derived from what other artifact */
    derived_from?: EntityId
    /** Evidence */
    evidence: Evidence[]
}

/** People/agents mentioned or involved */
export interface Person extends BaseEntity {
    type: 'person'
    /** Name */
    name: string
    /** Role */
    role: 'user' | 'assistant' | 'third_party'
    /** Description */
    description?: string
}

// ============================================================================
// RELATIONSHIPS
// ============================================================================

export type RelationshipPredicate =
    | 'solves'
    | 'challenges'
    | 'supports'
    | 'contradicts'
    | 'derives_from'
    | 'leads_to'
    | 'answers'
    | 'broader_than'
    | 'narrower_than'
    | 'related_to'
    | 'mentions'
    | 'creates'

export interface Relationship extends BaseEntity {
    type: 'relationship'
    /** Subject entity */
    subject: EntityId
    /** Predicate (verb) */
    predicate: RelationshipPredicate
    /** Object entity */
    object: EntityId
    /** Evidence for this relationship */
    evidence: Evidence[]
    /** Confidence in relationship (0-1) */
    confidence: number
    /** When relationship was established */
    timestamp: Timestamp
}

// ============================================================================
// TEMPORAL & META STRUCTURES
// ============================================================================

/** Temporal chain - ordered sequence of related events */
export interface TemporalChain {
    id: EntityId
    type: 'concept_evolution' | 'problem_solution' | 'decision_chain' | 'learning_path'
    /** What this chain tracks */
    name: string
    /** For concept evolution, the concept */
    concept?: EntityId
    /** For problem solution, the problem */
    problem?: EntityId
    /** Ordered sequence of events */
    sequence: EntityId[]
    /** Narrative summary */
    narrative?: string
    /** Start time */
    start_time: Timestamp
    /** End time */
    end_time: Timestamp
}

/** Pattern - recurring structure across conversations */
export interface Pattern extends BaseEntity {
    type: 'pattern'
    /** Pattern name */
    name: string
    /** Description */
    description: string
    /** Type of pattern */
    pattern_type: 'cognitive' | 'conversational' | 'problem_solving' | 'creative'
    /** Evidence (examples where pattern appears) */
    evidence: Evidence[]
    /** Frequency of occurrence */
    frequency: number
}

// ============================================================================
// INDEXES
// ============================================================================

export interface Indexes {
    by_type: Record<EntityType, EntityId[]>
    by_conversation: Record<ConversationId, EntityId[]>
    by_date: Record<string, EntityId[]> // YYYY-MM-DD
    by_tag: Record<string, EntityId[]>
    by_concept: Record<EntityId, EntityId[]> // Concept -> Events mentioning it
}

// ============================================================================
// KNOWLEDGE BASE (TOP-LEVEL STRUCTURE)
// ============================================================================

export interface KnowledgeBase {
    /** Metadata */
    meta: {
        version: string
        namespace: string
        last_updated: Timestamp
        conversations_analyzed: number
        total_entities: number
        total_events: number
    }

    /** All entities by ID */
    entities: Record<EntityId, Entity>

    /** All relationships */
    relationships: Relationship[]

    /** Temporal chains */
    temporal_chains: TemporalChain[]

    /** Indexes for fast lookup */
    indexes: Indexes
}

/** Union type of all entity types */
export type Entity =
    | Event
    | Concept
    | Question
    | Decision
    | Assumption
    | Problem
    | Solution
    | Artifact
    | Person
    | Pattern

// ============================================================================
// ANALYSIS RESULTS
// ============================================================================

/** Result of analyzing a single conversation chunk */
export interface ChunkAnalysisResult {
    conversation_id: ConversationId
    chunk_index: number
    turn_range: [number, number]
    events: Event[]
    /** Concepts mentioned in this chunk */
    concept_mentions: Array<{
        concept_label: string
        turn_number: number
        context: string
    }>
    /** Processing metadata */
    metadata: {
        analyzed_at: Timestamp
        model: string
        tokens_used: number
        cost_usd: number
    }
}

/** Result of full conversation analysis */
export interface ConversationAnalysisResult {
    conversation_id: ConversationId
    conversation_title: string
    chunks: ChunkAnalysisResult[]
    /** Summary statistics */
    summary: {
        total_events: number
        event_types: Record<EventSubtype, number>
        concepts_mentioned: number
        questions_asked: number
        decisions_made: number
    }
    /** Total cost */
    total_cost_usd: number
}
