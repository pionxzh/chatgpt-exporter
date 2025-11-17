/**
 * Anthropic API Client
 *
 * Handles communication with Claude API (Haiku 4.5) for conversation analysis.
 * Includes rate limiting, error handling, and cost tracking.
 */

import { SYSTEM_PROMPT } from './prompts'

export interface AnthropicMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface AnthropicRequest {
    model: string
    max_tokens: number
    temperature?: number
    system?: string
    messages: AnthropicMessage[]
}

export interface AnthropicResponse {
    id: string
    type: 'message'
    role: 'assistant'
    content: Array<{
        type: 'text'
        text: string
    }>
    model: string
    stop_reason: string
    usage: {
        input_tokens: number
        output_tokens: number
    }
}

export interface AnthropicError {
    error: {
        type: string
        message: string
    }
}

export interface AnalysisResult<T = any> {
    success: boolean
    data?: T
    raw_response?: string
    error?: string
    usage?: {
        input_tokens: number
        output_tokens: number
        cost_usd: number
    }
}

/**
 * Pricing for Claude Haiku 4.5 (as of 2025)
 */
const HAIKU_4_5_PRICING = {
    input_per_million: 1.0, // $1 per million input tokens
    output_per_million: 5.0, // $5 per million output tokens
}

/**
 * Calculate cost for a request
 */
export function calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * HAIKU_4_5_PRICING.input_per_million
    const outputCost = (outputTokens / 1_000_000) * HAIKU_4_5_PRICING.output_per_million
    return inputCost + outputCost
}

/**
 * Anthropic API Client
 */
export class AnthropicClient {
    private apiKey: string
    private baseUrl = 'https://api.anthropic.com/v1'
    private model = 'claude-haiku-4-5-20250929'
    private apiVersion = '2023-06-01'

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    /**
     * Make a request to Claude API
     */
    async makeRequest(
        userPrompt: string,
        options: {
            systemPrompt?: string
            maxTokens?: number
            temperature?: number
        } = {},
    ): Promise<AnthropicResponse> {
        const {
            systemPrompt = SYSTEM_PROMPT,
            maxTokens = 4096,
            temperature = 0.0, // Low temperature for structured extraction
        } = options

        const request: AnthropicRequest = {
            model: this.model,
            max_tokens: maxTokens,
            temperature,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
        }

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': this.apiVersion,
                // Critical: Enable CORS for browser requests
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify(request),
        })

        if (!response.ok) {
            const error: AnthropicError = await response.json()
            throw new Error(`Anthropic API error: ${error.error.message}`)
        }

        return await response.json()
    }

    /**
     * Analyze with retry logic
     */
    async analyzeWithRetry<T = any>(
        prompt: string,
        parseResponse: (text: string) => T,
        maxRetries = 3,
    ): Promise<AnalysisResult<T>> {
        let lastError: string | undefined

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await this.makeRequest(prompt)

                // Extract text from response
                const text = response.content
                    .filter(c => c.type === 'text')
                    .map(c => c.text)
                    .join('\n')

                // Parse the response
                let data: T
                try {
                    data = parseResponse(text)
                }
                catch (parseError) {
                    lastError = `Failed to parse response: ${parseError}`
                    if (attempt < maxRetries - 1) continue
                    throw parseError
                }

                // Calculate cost
                const cost = calculateCost(response.usage.input_tokens, response.usage.output_tokens)

                return {
                    success: true,
                    data,
                    raw_response: text,
                    usage: {
                        input_tokens: response.usage.input_tokens,
                        output_tokens: response.usage.output_tokens,
                        cost_usd: cost,
                    },
                }
            }
            catch (error) {
                lastError = error instanceof Error ? error.message : String(error)
                if (attempt < maxRetries - 1) {
                    // Exponential backoff: 1s, 2s, 4s
                    await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt))
                    continue
                }
            }
        }

        return {
            success: false,
            error: lastError || 'Unknown error',
        }
    }

    /**
     * Extract structured JSON from response
     */
    async extractJSON<T = any>(prompt: string): Promise<AnalysisResult<T>> {
        return this.analyzeWithRetry<T>(prompt, (text) => {
            // Try to find JSON in the response (might be wrapped in markdown)
            const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error('No JSON found in response')
            }

            const jsonText = jsonMatch[1] || jsonMatch[0]
            return JSON.parse(jsonText)
        })
    }

    /**
     * Extract plain text response
     */
    async extractText(prompt: string): Promise<AnalysisResult<string>> {
        return this.analyzeWithRetry<string>(prompt, (text) => {
            // Remove markdown code blocks if present
            const cleaned = text.replace(/```[\s\S]*?```/g, '').trim()
            return cleaned
        })
    }
}

/**
 * Estimate cost before running analysis
 */
export function estimateAnalysisCost(
    estimatedInputTokens: number,
    analysisTypes: number = 1,
    tokensPerResponse = 1000,
): number {
    const totalInput = estimatedInputTokens * analysisTypes
    const totalOutput = tokensPerResponse * analysisTypes
    return calculateCost(totalInput, totalOutput)
}

/**
 * Batch request handler with rate limiting
 */
export class BatchAnalyzer {
    private client: AnthropicClient
    private requestsPerMinute = 50 // Anthropic tier 1 limit
    private queue: Array<() => Promise<any>> = []
    private processing = false

    constructor(apiKey: string, requestsPerMinute = 50) {
        this.client = new AnthropicClient(apiKey)
        this.requestsPerMinute = requestsPerMinute
    }

    /**
     * Add a request to the queue
     */
    async enqueue<T>(task: (client: AnthropicClient) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task(this.client)
                    resolve(result)
                }
                catch (error) {
                    reject(error)
                }
            })

            // Start processing if not already running
            if (!this.processing) {
                this.processQueue()
            }
        })
    }

    /**
     * Process the queue with rate limiting
     */
    private async processQueue() {
        if (this.processing) return
        this.processing = true

        const delayMs = (60 / this.requestsPerMinute) * 1000

        while (this.queue.length > 0) {
            const task = this.queue.shift()
            if (task) {
                await task()
                // Rate limit delay
                if (this.queue.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, delayMs))
                }
            }
        }

        this.processing = false
    }

    /**
     * Get queue status
     */
    getStatus() {
        return {
            queued: this.queue.length,
            processing: this.processing,
        }
    }
}
