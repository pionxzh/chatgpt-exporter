import { describe, expect, it } from 'vitest'
import { getModelName } from '../src/utils/model'

describe('getModelName', () => {
    it.each<[string, string]>([
        ['gpt-5-6-thinking', 'GPT-5.6'],
        ['gpt-5-6-pro', 'GPT-5.6'],
        ['gpt-6-pro', 'GPT-6'],
        ['gpt-5-4-thinking', 'GPT-5.4'],
        ['gpt-5-4-auto-thinking', 'GPT-5.4'],
        ['gpt-5-2', 'GPT-5.2'],
        ['gpt-5-1-instant', 'GPT-5.1'],
        ['gpt-5-t-mini', 'GPT-5'],
        ['gpt-5', 'GPT-5'],
        ['gpt-4-5', 'GPT-4.5'],
        ['gpt-4-1-mini', 'GPT-4.1'],
        ['gpt-4o', 'GPT-4o'],
        ['gpt-4o-mini', 'GPT-4o'],
        ['gpt-4', 'GPT-4'],
        ['gpt-4-1106-preview', 'GPT-4'],
        ['gpt-4-browsing', 'GPT-4 (Browser)'],
        ['text-davinci-002-render-sha', 'GPT-3.5'],
        ['o3', 'o3'],
        ['o4-mini-high', 'o4'],
        ['research', ''],
        ['', ''],
    ])('%s -> %s', (slug, name) => {
        expect(getModelName(slug)).toBe(name)
    })
})
