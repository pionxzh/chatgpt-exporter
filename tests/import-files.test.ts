import { describe, expect, it } from 'vitest'
import { collectConversations } from '../src/utils/importFiles'

const conversation = (id: string, update_time = 1) => ({ id, conversation_id: id, title: id, update_time, mapping: {} })

describe('collectConversations', () => {
    it('joins the conversations of a split export', () => {
        const result = collectConversations([[conversation('a'), conversation('b')], [conversation('c')]])

        expect(result.map(c => c.id)).toEqual(['a', 'b', 'c'])
    })

    it('skips files and items that are not conversations', () => {
        const result = collectConversations([
            { name: 'user.json' },
            [{ file_name: 'library item' }],
            null,
            [conversation('a')],
        ])

        expect(result.map(c => c.id)).toEqual(['a'])
    })

    it('keeps the latest version of a conversation found twice', () => {
        const result = collectConversations([[conversation('a', 5)], [conversation('a', 9), conversation('b')], [conversation('a', 7)]])

        expect(result.map(c => [c.id, c.update_time])).toEqual([['a', 9], ['b', 1]])
    })

    it('uses conversation_id when id is missing', () => {
        const { id: _, ...withoutId } = conversation('a')

        expect(collectConversations([[withoutId]]).map(c => c.id)).toEqual(['a'])
    })
})
