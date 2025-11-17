// Preset filters for quick discovery

import type { FilterCriteria } from './types'

export const PRESET_FILTERS: Record<string, FilterCriteria> = {
    'deep-dives': {
        minInputOutputRatio: 0.7,
        minTurns: 15,
    },
    'quick-questions': {
        maxTurns: 5,
        maxInputOutputRatio: 0.3,
    },
    'code-heavy': {
        hasCode: true,
    },
    'discovery-moments': {
        hasDiscoveryMarkers: true,
    },
    'exploratory': {
        hasHighUncertainty: true,
        isQuestionHeavy: true,
    },
    'marathons': {
        minTurns: 30,
    },
    'balanced': {
        minInputOutputRatio: 0.4,
        maxInputOutputRatio: 0.6,
    },
}

export const PRESET_LABELS: Record<string, string> = {
    'deep-dives': 'Deep Dives (You wrote a lot)',
    'quick-questions': 'Quick Questions',
    'code-heavy': 'Code Heavy',
    'discovery-moments': 'Discovery Moments (Aha!)',
    'exploratory': 'Exploratory (Uncertain)',
    'marathons': 'Marathon Conversations (30+ turns)',
    'balanced': 'Balanced Discussions',
}
