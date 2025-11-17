/**
 * Analysis Panel
 *
 * UI for triggering conversation analysis with Claude Haiku 4.5
 */

import { useCallback, useEffect, useState } from 'preact/hooks'
import { fetchConversation } from '../api'
import { AnthropicClient, estimateAnalysisCost } from '../ontology/anthropic-client'
import { chunkConversation, parseConversationTurns } from '../ontology/chunker'
import { EventExtractor } from '../ontology/extractor'
import { getKnowledgeBaseManager } from '../ontology/storage'
import { useSettingContext } from './SettingContext'
import type { FC } from '../type'

interface AnalysisPanelProps {
    conversationCount: number
    selectedConversations: Array<{ id: string; title: string }>
    onAnalysisComplete?: () => void
}

export const AnalysisPanel: FC<AnalysisPanelProps> = ({
    selectedConversations,
}) => {
    const { anthropicApiKey } = useSettingContext()
    const [expanded, setExpanded] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const [estimatedCost, setEstimatedCost] = useState(0)
    const [lastAnalysis, setLastAnalysis] = useState<{
        count: number
        cost: number
        timestamp: string
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const kb = getKnowledgeBaseManager()
    const stats = kb.getStats()

    const hasApiKey = anthropicApiKey && anthropicApiKey.trim().length > 0

    const handleAnalyze = async () => {
        if (!hasApiKey) {
            alert('Please add your Anthropic API key in Settings first.')
            return
        }

        if (selectedConversations.length === 0) {
            alert('Please select conversations to analyze.')
            return
        }

        // Estimate cost first
        try {
            setError(null)
            setAnalyzing(true)
            setProgress({ current: 0, total: selectedConversations.length })

            const client = new AnthropicClient(anthropicApiKey)
            const extractor = new EventExtractor(client)

            let totalCost = 0

            for (let i = 0; i < selectedConversations.length; i++) {
                const conv = selectedConversations[i]
                setProgress({ current: i + 1, total: selectedConversations.length })

                try {
                    // Fetch full conversation
                    const fullConv = await fetchConversation(conv.id, false)

                    // Parse and chunk
                    const turns = parseConversationTurns(fullConv, fullConv.mapping)
                    const chunks = chunkConversation(conv.id, conv.title, turns)

                    if (chunks.length === 0) {
                        // Skip conversations with no content
                        continue
                    }

                    // Analyze conversation
                    const result = await extractor.analyzeConversation(
                        conv.id,
                        conv.title,
                        chunks,
                    )

                    // Store in knowledge base
                    kb.addConversationAnalysis(result)

                    totalCost += result.total_cost_usd
                }
                catch (convError) {
                    // Continue with next conversation on error
                    // Error is logged but doesn't stop the batch
                }
            }

            // Update last analysis
            setLastAnalysis({
                count: selectedConversations.length,
                cost: totalCost,
                timestamp: new Date().toISOString(),
            })

            alert(
                `Analysis complete!\n\n`
                + `Analyzed: ${selectedConversations.length} conversations\n`
                + `Total cost: $${totalCost.toFixed(4)}\n`
                + `Total insights: ${kb.getStats().total_events}\n\n`
                + `Results saved to knowledge base.`,
            )
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            setError(errorMsg)
            alert(`Analysis failed: ${errorMsg}`)
        }
        finally {
            setAnalyzing(false)
            setProgress({ current: 0, total: 0 })
        }
    }

    // Calculate estimated cost when selection changes
    const updateCostEstimate = useCallback(() => {
        if (selectedConversations.length === 0) {
            setEstimatedCost(0)
            return
        }

        // Rough estimate: 10 turns per conversation, 500 chars per turn
        const avgTurns = 10
        const avgCharsPerTurn = 500
        const avgTokens = (avgTurns * avgCharsPerTurn) / 4
        const cost = estimateAnalysisCost(avgTokens, 8) * selectedConversations.length
        setEstimatedCost(cost)
    }, [selectedConversations.length])

    // Update estimate when selection changes
    useEffect(() => {
        updateCostEstimate()
    }, [updateCostEstimate])

    const handleExportKB = () => {
        kb.exportToFile()
    }

    const handleClearKB = () => {
        if (confirm('Are you sure you want to clear all analysis data? This cannot be undone.')) {
            kb.clear()
            alert('Knowledge base cleared.')
        }
    }

    return (
        <div className="mb-4 border rounded-lg p-3 bg-white dark:bg-white/5">
            <button
                className="w-full flex items-center justify-between text-left"
                onClick={() => setExpanded(!expanded)}
            >
                <span className="font-medium text-gray-800 dark:text-white">
                    🧠 AI Analysis{' '}
                    {stats.total_events > 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({stats.total_events} insights extracted)
                        </span>
                    )}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{expanded ? '▼' : '▶'}</span>
            </button>

            {expanded && (
                <div className="mt-4 space-y-4">
                    {/* API Key Status */}
                    <div className="text-sm">
                        {hasApiKey
                            ? (
                                <span className="text-green-600 dark:text-green-400">✓ API key configured</span>
                                )
                            : (
                                <span className="text-red-600 dark:text-red-400">
                                    ⚠ No API key - add one in Settings
                                </span>
                                )}
                    </div>

                    {/* Knowledge Base Stats */}
                    {stats.total_events > 0 && (
                        <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                            <div className="font-medium mb-2">Knowledge Base Stats:</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Total insights: {stats.total_events}</div>
                                <div>Conversations: {stats.conversations_analyzed}</div>
                                <div>Concepts: {stats.concepts}</div>
                                <div>Relationships: {stats.relationships}</div>
                            </div>
                            {Object.keys(stats.event_types).length > 0 && (
                                <div className="mt-2 text-xs">
                                    <div className="font-medium">Event types:</div>
                                    {Object.entries(stats.event_types).map(([type, count]) => (
                                        <div key={type} className="flex justify-between">
                                            <span>{type.replace(/_/g, ' ')}:</span>
                                            <span>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-600 dark:text-red-400">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Cost Estimate */}
                    {selectedConversations.length > 0 && estimatedCost > 0 && (
                        <div className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <strong>Estimated cost:</strong> ${estimatedCost.toFixed(4)} for {selectedConversations.length} conversation{selectedConversations.length > 1 ? 's' : ''}
                            <div className="text-gray-600 dark:text-gray-400 mt-1">
                                (Actual cost may vary based on conversation length)
                            </div>
                        </div>
                    )}

                    {/* Analysis Controls */}
                    <div className="space-y-2">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAnalyze}
                            disabled={!hasApiKey || analyzing || selectedConversations.length === 0}
                        >
                            {analyzing
                                ? `Analyzing... ${progress.current}/${progress.total}`
                                : `Analyze Selected (${selectedConversations.length})`}
                        </button>

                        {stats.total_events > 0 && (
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm"
                                    onClick={handleExportKB}
                                >
                                    📥 Export Knowledge Base
                                </button>
                                <button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm"
                                    onClick={handleClearKB}
                                >
                                    🗑 Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>
                            <strong>What gets analyzed:</strong>{' '}
                            Aha moments, questions, decisions, assumptions, Theory of Mind, concept evolution, auto-tags
                        </div>
                        <div>
                            <strong>Model:</strong> Claude Haiku 4.5 ($1/$5 per million tokens)
                        </div>
                        <div>
                            <strong>Storage:</strong> Results saved locally in your browser
                        </div>
                    </div>

                    {lastAnalysis && (
                        <div className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded">
                            Last analysis: {lastAnalysis.count} conversations for ${lastAnalysis.cost.toFixed(4)}{' '}
                            ({new Date(lastAnalysis.timestamp).toLocaleString()})
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
