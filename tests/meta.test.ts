import { describe, expect, it } from 'vitest'
import { getMetaVariables, resolveMetaList } from '../src/exporter/meta'
import type { ConversationResult } from '../src/api'

const conversation = {
    id: 'chat-id',
    title: 'Metadata test',
    model: 'GPT-5',
    modelSlug: 'gpt-5-2',
    createTime: 1,
    updateTime: 0,
    conversationNodes: [],
} as unknown as ConversationResult

const variables = getMetaVariables(conversation, 'https://chatgpt.com/c/chat-id', '2026-09-23')

describe('getMetaVariables', () => {
    it('exposes every variable listed in the settings dialog', () => {
        expect(variables).toMatchObject({
            title: 'Metadata test',
            date: '2026-09-23',
            source: 'https://chatgpt.com/c/chat-id',
            model: 'GPT-5',
            model_name: 'gpt-5-2',
            create_time: '1970-01-01T00:00:01.000Z',
            update_time: '',
        })
        expect(variables.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/)
    })
})

describe('resolveMetaList', () => {
    it('replaces model_name with the model slug', () => {
        expect(resolveMetaList([{ name: 'model', value: '{model} ({model_name})' }], variables))
            .toEqual([['model', 'GPT-5 (gpt-5-2)']])
    })

    it('replaces repeated variables', () => {
        expect(resolveMetaList([{ name: 'x', value: '{title} / {title}' }], variables))
            .toEqual([['x', 'Metadata test / Metadata test']])
    })

    it('inserts values verbatim', () => {
        const vars = { ...variables, title: 'Cost $& {date}' }
        expect(resolveMetaList([{ name: 'x', value: '{title}' }], vars))
            .toEqual([['x', 'Cost $& {date}']])
    })

    it('keeps unknown variables and drops entries without a name', () => {
        expect(resolveMetaList([
            { name: 'x', value: '{unknown} {constructor}' },
            { name: '', value: '{title}' },
        ], variables)).toEqual([['x', '{unknown} {constructor}']])
    })

    it('returns an empty list when metaList is undefined', () => {
        expect(resolveMetaList(undefined, variables)).toEqual([])
    })
})
