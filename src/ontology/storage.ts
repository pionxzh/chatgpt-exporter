/**
 * Ontology Storage Layer
 *
 * Manages persistence of the knowledge base to localStorage
 * and provides import/export functionality.
 */

import type {
    Concept,
    ConversationAnalysisResult,
    Entity,
    EntityId,
    Event,
    KnowledgeBase,
    Relationship,
    TemporalChain,
} from './types'

const STORAGE_KEY = 'chatgpt_insights_kb'
const STORAGE_VERSION = '1.0.0'

/**
 * Knowledge Base Manager
 */
export class KnowledgeBaseManager {
    private kb: KnowledgeBase

    constructor() {
        this.kb = this.loadFromStorage() || this.createEmpty()
    }

    /**
     * Create an empty knowledge base
     */
    private createEmpty(): KnowledgeBase {
        return {
            meta: {
                version: STORAGE_VERSION,
                namespace: 'chatgpt-insights',
                last_updated: new Date().toISOString(),
                conversations_analyzed: 0,
                total_entities: 0,
                total_events: 0,
            },
            entities: {},
            relationships: [],
            temporal_chains: [],
            indexes: {
                by_type: {} as any,
                by_conversation: {},
                by_date: {},
                by_tag: {},
                by_concept: {},
            },
        }
    }

    /**
     * Load from localStorage
     */
    private loadFromStorage(): KnowledgeBase | null {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (!stored) return null

            const kb = JSON.parse(stored) as KnowledgeBase
            // Validate version
            if (kb.meta.version !== STORAGE_VERSION) {
                console.warn('Knowledge base version mismatch, creating new')
                return null
            }

            return kb
        }
        catch (error) {
            console.error('Failed to load knowledge base:', error)
            return null
        }
    }

    /**
     * Save to localStorage
     */
    save(): void {
        try {
            this.kb.meta.last_updated = new Date().toISOString()
            const json = JSON.stringify(this.kb)
            localStorage.setItem(STORAGE_KEY, json)
        }
        catch (error) {
            console.error('Failed to save knowledge base:', error)
            throw error
        }
    }

    /**
     * Get the entire knowledge base
     */
    getKnowledgeBase(): KnowledgeBase {
        return this.kb
    }

    /**
     * Add events from a conversation analysis
     */
    addConversationAnalysis(analysis: ConversationAnalysisResult): void {
        // Extract all events from chunks
        const events: Event[] = []
        for (const chunk of analysis.chunks) {
            events.push(...chunk.events)
        }

        // Add each event
        for (const event of events) {
            this.addEntity(event)
        }

        // Update conversation count
        this.kb.meta.conversations_analyzed++

        // Build concepts from event mentions
        this.buildConceptsFromEvents(events)

        // Save
        this.save()
    }

    /**
     * Add an entity to the knowledge base
     */
    addEntity(entity: Entity): void {
        this.kb.entities[entity.id] = entity

        // Update indexes
        this.updateIndexes(entity)

        // Update totals
        this.kb.meta.total_entities = Object.keys(this.kb.entities).length
        if (entity.type === 'event') {
            this.kb.meta.total_events++
        }
    }

    /**
     * Update indexes for an entity
     */
    private updateIndexes(entity: Entity): void {
        // By type
        if (!this.kb.indexes.by_type[entity.type]) {
            this.kb.indexes.by_type[entity.type] = []
        }
        if (!this.kb.indexes.by_type[entity.type].includes(entity.id)) {
            this.kb.indexes.by_type[entity.type].push(entity.id)
        }

        // By conversation (for events)
        if (entity.type === 'event') {
            const event = entity as Event
            if (!this.kb.indexes.by_conversation[event.conversation_id]) {
                this.kb.indexes.by_conversation[event.conversation_id] = []
            }
            if (!this.kb.indexes.by_conversation[event.conversation_id].includes(entity.id)) {
                this.kb.indexes.by_conversation[event.conversation_id].push(entity.id)
            }

            // By date
            const date = event.turn_timestamp.split('T')[0]
            if (!this.kb.indexes.by_date[date]) {
                this.kb.indexes.by_date[date] = []
            }
            if (!this.kb.indexes.by_date[date].includes(entity.id)) {
                this.kb.indexes.by_date[date].push(entity.id)
            }
        }

        // By tag
        for (const tag of entity.tags) {
            if (!this.kb.indexes.by_tag[tag]) {
                this.kb.indexes.by_tag[tag] = []
            }
            if (!this.kb.indexes.by_tag[tag].includes(entity.id)) {
                this.kb.indexes.by_tag[tag].push(entity.id)
            }
        }
    }

    /**
     * Build concept entities from event mentions
     */
    private buildConceptsFromEvents(_events: Event[]): void {
        // For now, this is a placeholder - in full implementation,
        // we'd aggregate concept mentions across events and create Concept entities
        // For simplicity, we'll defer this to the aggregator
    }

    /**
     * Add a relationship
     */
    addRelationship(relationship: Relationship): void {
        this.kb.relationships.push(relationship)
        this.save()
    }

    /**
     * Add a temporal chain
     */
    addTemporalChain(chain: TemporalChain): void {
        this.kb.temporal_chains.push(chain)
        this.save()
    }

    /**
     * Query entities by type
     */
    getEntitiesByType<T extends Entity>(type: Entity['type']): T[] {
        const ids = this.kb.indexes.by_type[type] || []
        return ids.map(id => this.kb.entities[id] as T)
    }

    /**
     * Query entities by conversation
     */
    getEntitiesByConversation(conversationId: string): Entity[] {
        const ids = this.kb.indexes.by_conversation[conversationId] || []
        return ids.map(id => this.kb.entities[id])
    }

    /**
     * Query entities by date range
     */
    getEntitiesByDateRange(startDate: string, endDate: string): Entity[] {
        const ids: EntityId[] = []
        const dates = Object.keys(this.kb.indexes.by_date).filter(
            date => date >= startDate && date <= endDate,
        )

        for (const date of dates) {
            ids.push(...this.kb.indexes.by_date[date])
        }

        // Deduplicate
        const uniqueIds = Array.from(new Set(ids))
        return uniqueIds.map(id => this.kb.entities[id])
    }

    /**
     * Query entities by tag
     */
    getEntitiesByTag(tag: string): Entity[] {
        const ids = this.kb.indexes.by_tag[tag] || []
        return ids.map(id => this.kb.entities[id])
    }

    /**
     * Get all concepts
     */
    getConcepts(): Concept[] {
        return this.getEntitiesByType<Concept>('concept')
    }

    /**
     * Get all events
     */
    getEvents(): Event[] {
        return this.getEntitiesByType<Event>('event')
    }

    /**
     * Get statistics
     */
    getStats() {
        const events = this.getEvents()
        const eventTypes: Record<string, number> = {}

        for (const event of events) {
            eventTypes[event.subtype] = (eventTypes[event.subtype] || 0) + 1
        }

        return {
            total_entities: this.kb.meta.total_entities,
            total_events: this.kb.meta.total_events,
            conversations_analyzed: this.kb.meta.conversations_analyzed,
            event_types: eventTypes,
            concepts: this.getConcepts().length,
            relationships: this.kb.relationships.length,
            temporal_chains: this.kb.temporal_chains.length,
        }
    }

    /**
     * Export knowledge base as JSON
     */
    exportJSON(): string {
        return JSON.stringify(this.kb, null, 2)
    }

    /**
     * Export as downloadable file
     */
    exportToFile(): void {
        const json = this.exportJSON()
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `chatgpt-insights-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    /**
     * Import from JSON
     */
    importJSON(json: string): void {
        try {
            const imported = JSON.parse(json) as KnowledgeBase
            // Validate structure
            if (!imported.meta || !imported.entities) {
                throw new Error('Invalid knowledge base format')
            }

            // Merge with existing
            // For simplicity, we replace for now
            // In production, you'd want smarter merging
            this.kb = imported
            this.save()
        }
        catch (error) {
            console.error('Failed to import knowledge base:', error)
            throw error
        }
    }

    /**
     * Clear all data
     */
    clear(): void {
        this.kb = this.createEmpty()
        this.save()
    }

    /**
     * Get storage size (approximate)
     */
    getStorageSize(): number {
        const json = this.exportJSON()
        return new Blob([json]).size
    }
}

/**
 * Singleton instance
 */
let instance: KnowledgeBaseManager | null = null

export function getKnowledgeBaseManager(): KnowledgeBaseManager {
    if (!instance) {
        instance = new KnowledgeBaseManager()
    }
    return instance
}
