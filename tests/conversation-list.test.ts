import { describe, expect, it, vi } from 'vitest'
import { applyHead, refreshConversationList } from '../src/utils/conversationList'
import type { ApiConversationItem, ApiConversations } from '../src/api'

function item(id: string, update_time: string): ApiConversationItem {
    return { id, title: id, create_time: update_time, update_time }
}

/** Serves `server` (newest first) page by page, like the list endpoint */
function pages(server: ApiConversationItem[]) {
    return vi.fn(async (offset: number, limit: number): Promise<ApiConversations> => ({
        has_missing_conversations: false,
        items: server.slice(offset, offset + limit),
        limit,
        offset,
        total: server.length,
    }))
}

const cached = [item('c', '3'), item('b', '2'), item('a', '1')]

describe('refreshConversationList', () => {
    it('stops at the first unchanged conversation', async () => {
        const fetchPage = pages([item('new', '5'), item('a', '4'), ...cached.slice(0, 2)])

        const { head, total } = await refreshConversationList(cached, fetchPage, 3, 1000)

        expect(head.map(c => c.id)).toEqual(['new', 'a'])
        expect(total).toBe(4)
        expect(fetchPage).toHaveBeenCalledTimes(1)
    })

    it('pages on while every item on a page changed', async () => {
        const fetchPage = pages([item('x', '7'), item('y', '6'), item('z', '5'), ...cached])

        const { head } = await refreshConversationList(cached, fetchPage, 2, 1000)

        expect(head.map(c => c.id)).toEqual(['x', 'y', 'z'])
        expect(fetchPage).toHaveBeenCalledTimes(2)
    })

    it('returns nothing when the list is unchanged', async () => {
        const { head } = await refreshConversationList(cached, pages(cached), 2, 1000)
        expect(head).toEqual([])
    })

    it('does not page past the conversation limit', async () => {
        const server = Array.from({ length: 10 }, (_, i) => item(`n${i}`, String(100 - i)))
        const fetchPage = pages(server)

        await refreshConversationList(cached, fetchPage, 2, 4)

        expect(fetchPage).toHaveBeenCalledTimes(2)
    })
})

describe('applyHead', () => {
    it('moves updated conversations to the top without duplicates', () => {
        const merged = applyHead([item('new', '5'), item('a', '4')], cached)
        expect(merged.map(c => [c.id, c.update_time])).toEqual([['new', '5'], ['a', '4'], ['c', '3'], ['b', '2']])
    })
})
