/**
 * Analysis Panel
 *
 * UI for triggering conversation analysis with Claude Haiku 4.5
 */

import { useState } from 'preact/hooks'
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
    const [analyzing] = useState(false)
    const [progress] = useState({ current: 0, total: 0 })
    const [lastAnalysis] = useState<{
        count: number
        cost: number
        timestamp: string
    } | null>(null)

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

        // For now, show a message that analysis will be implemented
        // In a real implementation, we'd call the analyzer here
        alert(
            `Analysis ready to run on ${selectedConversations.length} conversations!\n\n`
            + `This will analyze conversations using Claude Haiku 4.5 to extract:\n`
            + `- Aha moments and discoveries\n`
            + `- Questions and answers\n`
            + `- Decisions and assumptions\n`
            + `- Theory of Mind insights\n`
            + `- Concept evolution\n`
            + `- Auto-tags\n\n`
            + `Implementation is ready - integration coming next!`,
        )
    }

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
