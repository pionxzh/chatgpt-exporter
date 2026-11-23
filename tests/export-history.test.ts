import { beforeEach, describe, expect, it, vi } from 'vitest'

const store = vi.hoisted(() => new Map<string, unknown>())
vi.mock('../src/utils/storage', () => ({
    ScriptStorage: {
        get: (key: string) => store.get(key) ?? null,
        set: (key: string, value: unknown) => store.set(key, structuredClone(value)),
    },
}))

// Constants read `location` at import time.
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })

const { KEY_EXPORTED_UPDATE_TIMES } = await import('../src/constants')
const { filterByExportStatus, markExported } = await import('../src/utils/exportHistory')

// `update_time` as the list API returns it, ISO strings
const exported = { id: 'a', update_time: '2026-01-01T00:00:00Z' }
const changed = { id: 'b', update_time: '2026-01-02T00:00:00Z' }
const fresh = { id: 'c', update_time: '2026-01-03T00:00:00Z' }
const list = [exported, changed, fresh]
const ids = (items: { id: string }[]) => items.map(item => item.id)

describe('export history', () => {
    beforeEach(() => {
        store.clear()
        markExported('Markdown', [exported, { ...changed, update_time: '2026-01-01T00:00:00Z' }])
    })

    it('selects by status', () => {
        expect(ids(filterByExportStatus(list, 'all', 'Markdown'))).toEqual(['a', 'b', 'c'])
        expect(ids(filterByExportStatus(list, 'not_exported', 'Markdown'))).toEqual(['c'])
        expect(ids(filterByExportStatus(list, 'updated', 'Markdown'))).toEqual(['b'])
        expect(ids(filterByExportStatus(list, 'not_exported_or_updated', 'Markdown'))).toEqual(['b', 'c'])
    })

    it('tracks each format on its own', () => {
        expect(ids(filterByExportStatus(list, 'not_exported', 'HTML'))).toEqual(['a', 'b', 'c'])

        markExported('HTML', list)
        expect(ids(filterByExportStatus(list, 'not_exported_or_updated', 'HTML'))).toEqual([])
        expect(ids(filterByExportStatus(list, 'not_exported_or_updated', 'Markdown'))).toEqual(['b', 'c'])
    })

    it('starts each format from the records made before the split', () => {
        store.clear()
        store.set(KEY_EXPORTED_UPDATE_TIMES, { a: Date.parse(exported.update_time) })

        expect(ids(filterByExportStatus(list, 'not_exported', 'HTML'))).toEqual(['b', 'c'])

        markExported('HTML', [fresh])
        expect(ids(filterByExportStatus(list, 'not_exported', 'HTML'))).toEqual(['b'])
        // Other formats still start from the old records
        expect(ids(filterByExportStatus(list, 'not_exported', 'Markdown'))).toEqual(['b', 'c'])
        expect(store.get(KEY_EXPORTED_UPDATE_TIMES)).toEqual({ a: Date.parse(exported.update_time) })
    })
})
