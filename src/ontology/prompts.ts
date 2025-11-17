/**
 * SAREC Prompt Templates
 *
 * Structured Assessment with Routing and Evidence Collection
 * These prompts are designed to extract structured insights from conversation chunks
 * while maintaining ground truth references (evidence).
 */

import type { ConversationChunk } from './chunker'

/**
 * System prompt for all analysis tasks
 */
export const SYSTEM_PROMPT = `You are an expert conversation analyst specializing in extracting structured insights from human-AI dialogues.

Your task is to analyze conversation chunks and extract specific types of events, insights, and patterns while ALWAYS providing evidence (exact quotes) from the source conversation.

Key principles:
1. **Evidence-based**: Every insight must be grounded in actual conversation text
2. **Precise quotes**: Include exact quotes with turn numbers
3. **Contextual**: Understand the flow and progression of ideas
4. **Structured output**: Always return valid JSON matching the requested schema
5. **Conservative**: Only extract insights you're confident about (confidence > 0.7)

When analyzing:
- Pay attention to discovery moments ("aha!", "I see", "oh!")
- Track assumptions ("I assume", "probably", "should")
- Identify decisions ("let's do", "we'll use", "I'll go with")
- Note questions (especially unanswered ones)
- Detect problem-solution pairs
- Recognize creative prompts and ideation

Remember: The conversation might be a chunk from a larger discussion. Consider context from turn numbers and timestamps.`

/**
 * Prompt for extracting all event types from a chunk
 */
export function createEventExtractionPrompt(chunk: ConversationChunk): string {
    return `Analyze the following conversation chunk and extract ALL significant events.

For each event, provide:
- **type**: The event type (aha_moment, question_asked, decision_made, assumption_stated, problem_identified, solution_proposed, creative_prompt, uncertainty, discovery, etc.)
- **turn_number**: Which turn it occurred in
- **speaker**: "user" or "assistant"
- **content**: Brief description of the insight/event
- **quote**: EXACT quote from the conversation (2-3 sentences max)
- **context**: Surrounding context that makes this significant
- **confidence**: 0.0-1.0 how confident you are in this extraction
- **tags**: Relevant tags (e.g., ["technical", "decision"], ["creative", "ideation"])

Event types to look for:
- **aha_moment**: Sudden realization, "I see!", breakthrough moments
- **question_asked**: User asks a question (especially open/unanswered)
- **question_answered**: A previous question gets answered
- **decision_made**: A choice or direction is decided
- **assumption_stated**: User or assistant states an assumption
- **assumption_challenge**: An assumption is questioned or invalidated
- **problem_identified**: A problem/challenge is recognized
- **solution_proposed**: A solution is suggested
- **creative_prompt**: Generative thinking, "what if", brainstorming
- **uncertainty**: Expressions of uncertainty, doubt, "I'm not sure"
- **discovery**: Learning something new, realizations

Return a JSON object with this structure:
\`\`\`json
{
  "events": [
    {
      "type": "aha_moment",
      "turn_number": 5,
      "speaker": "user",
      "content": "Input/output ratio reveals conversation depth",
      "quote": "I think the ones where i write more are more interesting",
      "context": "User realized that conversations with higher user input are more valuable",
      "confidence": 0.95,
      "tags": ["discovery", "metrics", "insight"]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Analyze this chunk and extract all events in the JSON format specified above.`
}

/**
 * Prompt for extracting concepts mentioned in a chunk
 */
export function createConceptExtractionPrompt(chunk: ConversationChunk): string {
    return `Analyze the following conversation chunk and identify all significant CONCEPTS discussed.

A concept is a recurring idea, topic, technique, or theme. Examples:
- Technical concepts: "chunking", "rate limiting", "memory management"
- Domain concepts: "Theory of Mind", "conversation analysis", "knowledge graphs"
- Abstract concepts: "discovery", "optimization", "user experience"

For each concept mentioned, provide:
- **label**: The concept name (concise, 1-3 words)
- **turn_numbers**: Which turns mention this concept
- **context**: How it's being discussed (exploration/implementation/etc.)
- **quotes**: 1-2 representative quotes
- **confidence**: 0.0-1.0

Return JSON:
\`\`\`json
{
  "concepts": [
    {
      "label": "chunking",
      "alt_labels": ["batching", "segmentation"],
      "turn_numbers": [3, 5, 8],
      "context": "Used to prevent memory overflow when exporting large datasets",
      "quotes": [
        "we need to process in chunks to avoid freezing the browser"
      ],
      "confidence": 0.95
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract all concepts:`
}

/**
 * Prompt for Theory of Mind analysis
 */
export function createToMPrompt(chunk: ConversationChunk): string {
    return `Analyze the following conversation chunk using Theory of Mind reasoning.

Theory of Mind (ToM) is the ability to understand mental states - beliefs, desires, intentions, emotions.

For this conversation chunk, reconstruct:
1. **User's mental state evolution**: What were they thinking/feeling at key moments?
2. **Goals and motivations**: What is the user trying to achieve?
3. **Cognitive patterns**: How does the user approach problems?
4. **Emotional markers**: Frustration, excitement, uncertainty, confidence
5. **Perspective shifts**: Moments when understanding changed

Return JSON:
\`\`\`json
{
  "mental_states": [
    {
      "turn_number": 5,
      "state_type": "realization",
      "description": "User realized that input/output ratio is a key metric for conversation quality",
      "evidence": "I think the ones where i write more are more interesting",
      "confidence": 0.9
    }
  ],
  "user_goals": [
    {
      "goal": "Build a system to discover and organize insights from past conversations",
      "evidence_turns": [1, 3, 7],
      "confidence": 0.95
    }
  ],
  "cognitive_patterns": [
    {
      "pattern": "Iterative refinement - prefers building in phases",
      "evidence": "Let's do it in phases and be sure the first parts work",
      "confidence": 0.9
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Perform ToM analysis:`
}

/**
 * Prompt for decision tree extraction
 */
export function createDecisionTreePrompt(chunk: ConversationChunk): string {
    return `Analyze this conversation chunk for DECISIONS and the reasoning behind them.

For each decision, extract:
- What was decided
- What options were considered
- The reasoning/tradeoffs
- Evidence (exact quotes)

Also identify:
- **Overruled decisions**: Decisions that were changed later
- **Decision chains**: How one decision led to another

Return JSON:
\`\`\`json
{
  "decisions": [
    {
      "turn_number": 20,
      "decision": "Use JSON as primary storage format",
      "options_considered": ["YAML", "CSV", "JSON"],
      "reasoning": "Better for temporal tracking with timestamps",
      "evidence": "maybe json is best and then we can export extract from it later",
      "confidence": 0.95,
      "supersedes": null
    }
  ],
  "decision_chains": [
    {
      "sequence": [
        {
          "decision": "Need cross-conversation insights",
          "leads_to": "Design storage format for insights"
        },
        {
          "decision": "Use JSON for storage",
          "leads_to": "Build ontology with temporal tracking"
        }
      ]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract decisions and chains:`
}

/**
 * Prompt for assumption tracking
 */
export function createAssumptionTrackingPrompt(chunk: ConversationChunk): string {
    return `Analyze this conversation chunk for ASSUMPTIONS and whether they were challenged.

An assumption is a belief or premise stated without full verification.
Look for:
- Explicit assumptions ("I assume...", "probably...", "should be...")
- Implicit assumptions (unstated premises)
- Challenged assumptions (when evidence contradicts)

Return JSON:
\`\`\`json
{
  "assumptions": [
    {
      "turn_number": 3,
      "assumption": "Users have < 1000 conversations",
      "evidence": "we can load all conversations at once",
      "type": "explicit",
      "challenged": true,
      "challenged_at_turn": 5,
      "challenge_evidence": "my ALL is a lot and it sort of freezes",
      "outcome": "invalidated",
      "confidence": 0.9
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract assumptions:`
}

/**
 * Prompt for idea archaeology (how ideas evolved)
 */
export function createIdeaArchaeologyPrompt(chunk: ConversationChunk): string {
    return `Analyze this conversation chunk for IDEA EVOLUTION.

Idea archaeology tracks how ideas develop, morph, and connect over time.

Look for:
- **Seed ideas**: Initial mentions of a concept
- **Refinements**: How ideas get more specific
- **Pivots**: When direction changes
- **Connections**: How ideas link together
- **Emergence**: New ideas arising from combinations

Return JSON:
\`\`\`json
{
  "idea_evolution": [
    {
      "concept": "conversation analysis",
      "stages": [
        {
          "turn_number": 3,
          "stage": "seed",
          "description": "Initial thought about analyzing conversations",
          "quote": "what would be interesting to extract"
        },
        {
          "turn_number": 8,
          "stage": "refinement",
          "description": "Specific focus on input/output ratio",
          "quote": "the ones where i write more are more interesting"
        },
        {
          "turn_number": 12,
          "stage": "implementation",
          "description": "Decision to build filtering system",
          "quote": "extract the preexport analysis and use those insights as filters"
        }
      ]
    }
  ]
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Extract idea evolution:`
}

/**
 * Prompt for generating a summary
 */
export function createSummaryPrompt(chunk: ConversationChunk): string {
    return `Generate a concise summary (1-2 paragraphs) of this conversation chunk.

Focus on:
- Main topics discussed
- Key decisions or insights
- Progression of the conversation
- Important questions asked

Keep it concise but informative.

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Summary:`
}

/**
 * Prompt for auto-tagging
 */
export function createAutoTaggingPrompt(chunk: ConversationChunk): string {
    return `Analyze this conversation chunk and generate semantic tags.

Tags should capture:
- **Topics**: What domains/subjects (e.g., "web development", "machine learning")
- **Activity type**: What's happening (e.g., "debugging", "brainstorming", "learning")
- **Complexity**: "beginner", "intermediate", "advanced"
- **Outcome**: "problem_solved", "question_answered", "exploration", "stuck"
- **Emotion**: "frustrated", "excited", "confused", "confident"
- **Collaboration style**: "directive", "exploratory", "iterative"

Return 5-10 tags.

Return JSON:
\`\`\`json
{
  "tags": [
    "conversation_analysis",
    "brainstorming",
    "advanced",
    "iterative",
    "excited"
  ],
  "primary_topic": "knowledge management",
  "activity_type": "design",
  "complexity": "advanced"
}
\`\`\`

CONVERSATION CHUNK:
${formatChunkForPrompt(chunk)}

Generate tags:`
}

/**
 * Helper: Format chunk for prompts
 */
function formatChunkForPrompt(chunk: ConversationChunk): string {
    let text = ''
    for (const turn of chunk.turns) {
        const speaker = turn.speaker.toUpperCase()
        text += `[Turn ${turn.turn_number}] ${speaker}: ${turn.content}\n\n`
    }
    return text
}

/**
 * Routing: Select which prompts to run based on analysis type
 */
export type AnalysisType =
    | 'events' // Extract all events
    | 'concepts' // Extract concepts
    | 'tom' // Theory of Mind
    | 'decisions' // Decision trees
    | 'assumptions' // Assumption tracking
    | 'idea_evolution' // Idea archaeology
    | 'summary' // Generate summary
    | 'tags' // Auto-tagging
    | 'full' // All of the above

export function getPromptsForAnalysisType(
    type: AnalysisType,
    chunk: ConversationChunk,
): Array<{ type: string; prompt: string }> {
    const prompts: Array<{ type: string; prompt: string }> = []

    if (type === 'events' || type === 'full') {
        prompts.push({ type: 'events', prompt: createEventExtractionPrompt(chunk) })
    }
    if (type === 'concepts' || type === 'full') {
        prompts.push({ type: 'concepts', prompt: createConceptExtractionPrompt(chunk) })
    }
    if (type === 'tom' || type === 'full') {
        prompts.push({ type: 'tom', prompt: createToMPrompt(chunk) })
    }
    if (type === 'decisions' || type === 'full') {
        prompts.push({ type: 'decisions', prompt: createDecisionTreePrompt(chunk) })
    }
    if (type === 'assumptions' || type === 'full') {
        prompts.push({ type: 'assumptions', prompt: createAssumptionTrackingPrompt(chunk) })
    }
    if (type === 'idea_evolution' || type === 'full') {
        prompts.push({ type: 'idea_evolution', prompt: createIdeaArchaeologyPrompt(chunk) })
    }
    if (type === 'summary' || type === 'full') {
        prompts.push({ type: 'summary', prompt: createSummaryPrompt(chunk) })
    }
    if (type === 'tags' || type === 'full') {
        prompts.push({ type: 'tags', prompt: createAutoTaggingPrompt(chunk) })
    }

    return prompts
}
