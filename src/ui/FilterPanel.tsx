import { useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { PRESET_FILTERS, PRESET_LABELS } from '../analyzer/filters'
import type { FilterCriteria } from '../analyzer/types'
import type { FC } from '../type'

interface FilterPanelProps {
    onFilterChange: (criteria: FilterCriteria) => void
    conversationCount: number
    filteredCount: number
}

export const FilterPanel: FC<FilterPanelProps> = ({
    onFilterChange,
    conversationCount,
    filteredCount,
}) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
    const [selectedPresets, setSelectedPresets] = useState<string[]>([])
    const [customFilters, setCustomFilters] = useState<FilterCriteria>({})

    const handlePresetToggle = (presetKey: string) => {
        const newPresets = selectedPresets.includes(presetKey)
            ? selectedPresets.filter(k => k !== presetKey)
            : [...selectedPresets, presetKey]

        setSelectedPresets(newPresets)

        // Merge all selected preset filters
        const mergedCriteria: FilterCriteria = {}
        newPresets.forEach((key) => {
            Object.assign(mergedCriteria, PRESET_FILTERS[key])
        })

        // Include custom filters
        Object.assign(mergedCriteria, customFilters)

        onFilterChange(mergedCriteria)
    }

    const handleInputRatioChange = (value: number) => {
        const newFilters = { ...customFilters, minInputOutputRatio: value / 100 }
        setCustomFilters(newFilters)

        // Merge with presets
        const mergedCriteria: FilterCriteria = {}
        selectedPresets.forEach((key) => {
            Object.assign(mergedCriteria, PRESET_FILTERS[key])
        })
        Object.assign(mergedCriteria, newFilters)

        onFilterChange(mergedCriteria)
    }

    const handleMinTurnsChange = (value: number) => {
        const newFilters = { ...customFilters, minTurns: value }
        setCustomFilters(newFilters)

        const mergedCriteria: FilterCriteria = {}
        selectedPresets.forEach((key) => {
            Object.assign(mergedCriteria, PRESET_FILTERS[key])
        })
        Object.assign(mergedCriteria, newFilters)

        onFilterChange(mergedCriteria)
    }

    const handleSearchChange = (value: string) => {
        const newFilters = { ...customFilters, searchTerm: value || undefined }
        setCustomFilters(newFilters)

        const mergedCriteria: FilterCriteria = {}
        selectedPresets.forEach((key) => {
            Object.assign(mergedCriteria, PRESET_FILTERS[key])
        })
        Object.assign(mergedCriteria, newFilters)

        onFilterChange(mergedCriteria)
    }

    const handleClearFilters = () => {
        setSelectedPresets([])
        setCustomFilters({})
        onFilterChange({})
    }

    const hasActiveFilters = selectedPresets.length > 0 || Object.keys(customFilters).length > 0

    return (
        <div className="mb-4 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <button
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    onClick={() => setExpanded(!expanded)}
                >
                    🔍 {t('Smart Filters')}
                    <span className="text-xs text-gray-500">
                        ({filteredCount} of {conversationCount})
                    </span>
                </button>
                {hasActiveFilters && (
                    <button
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={handleClearFilters}
                    >
                        {t('Clear All')}
                    </button>
                )}
            </div>

            {expanded && (
                <div className="space-y-3 mt-3">
                    {/* Quick Presets */}
                    <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            {t('Quick Filters')}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(PRESET_FILTERS).map(key => (
                                <button
                                    key={key}
                                    onClick={() => handlePresetToggle(key)}
                                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                        selectedPresets.includes(key)
                                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                    }`}
                                >
                                    {PRESET_LABELS[key]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                            {t('Search in titles')}:
                        </label>
                        <input
                            type="text"
                            placeholder={t('Type to search...')}
                            className="Input w-full text-sm"
                            value={customFilters.searchTerm || ''}
                            onChange={e => handleSearchChange(e.currentTarget.value)}
                        />
                    </div>

                    {/* Input/Output Ratio Slider */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                            {t('Min Input/Output Ratio')}: {((customFilters.minInputOutputRatio || 0) * 100).toFixed(0)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="150"
                            step="10"
                            value={(customFilters.minInputOutputRatio || 0) * 100}
                            onChange={e => handleInputRatioChange(Number.parseInt(e.currentTarget.value, 10))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {(customFilters.minInputOutputRatio || 0) === 0 && 'All conversations'}
                            {(customFilters.minInputOutputRatio || 0) > 0 && (customFilters.minInputOutputRatio || 0) < 0.5 && 'Balanced or higher'}
                            {(customFilters.minInputOutputRatio || 0) >= 0.5 && (customFilters.minInputOutputRatio || 0) < 0.8 && 'You wrote more'}
                            {(customFilters.minInputOutputRatio || 0) >= 0.8 && 'Deep dives - you wrote a lot!'}
                        </div>
                    </div>

                    {/* Min Turns Slider */}
                    <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                            {t('Min Conversation Length')}: {customFilters.minTurns || 0} turns
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="5"
                            value={customFilters.minTurns || 0}
                            onChange={e => handleMinTurnsChange(Number.parseInt(e.currentTarget.value, 10))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
