import { KEY_EXPORTED_UPDATE_TIMES, KEY_EXPORTED_UPDATE_TIMES_BY_FORMAT } from '../constants'
import { ScriptStorage } from './storage'

/** Conversation id → the `update_time` it had when last exported, in ms */
type ExportedTimes = Record<string, number>

export type ExportStatus = 'all' | 'not_exported' | 'updated' | 'not_exported_or_updated'

interface ExportedConversation {
    id: string
    update_time?: number | string
}

/**
 * Normalise create_time / update_time to milliseconds regardless of whether
 * the API returned an ISO 8601 string (current) or a Unix-seconds number (legacy).
 */
export function toMs(time: number | string | undefined): number {
    if (time == null) return 0
    if (typeof time === 'number') return time * 1000
    return new Date(time).getTime()
}

/**
 * Exports are recorded per format, such as `Markdown` or `HTML`, so exporting
 * one format does not hide the same conversations from the next one.
 *
 * Records from before the split have no format. They stay as they are and
 * seed each format until that format is first exported.
 */
export function getExportedTimes(format: string): ExportedTimes {
    const byFormat = ScriptStorage.get<Record<string, ExportedTimes>>(KEY_EXPORTED_UPDATE_TIMES_BY_FORMAT)
    const times = byFormat?.[format]
    if (times && typeof times === 'object') return times

    const legacy = ScriptStorage.get<ExportedTimes>(KEY_EXPORTED_UPDATE_TIMES)
    return legacy && typeof legacy === 'object' ? legacy : {}
}

/** Record conversations that were exported successfully in `format` */
export function markExported(format: string, conversations: ExportedConversation[]): void {
    if (conversations.length === 0) return
    const times = { ...getExportedTimes(format) }
    for (const conversation of conversations) {
        const ms = toMs(conversation.update_time)
        if (ms > (times[conversation.id] ?? 0)) times[conversation.id] = ms
    }
    const byFormat = ScriptStorage.get<Record<string, ExportedTimes>>(KEY_EXPORTED_UPDATE_TIMES_BY_FORMAT) ?? {}
    ScriptStorage.set(KEY_EXPORTED_UPDATE_TIMES_BY_FORMAT, { ...byFormat, [format]: times })
}

export function filterByExportStatus<T extends ExportedConversation>(conversations: T[], status: ExportStatus, format: string): T[] {
    if (status === 'all') return conversations

    const times = getExportedTimes(format)
    const isNew = (c: T) => !(c.id in times)
    const isUpdated = (c: T) => c.id in times && times[c.id] < toMs(c.update_time)
    if (status === 'not_exported') return conversations.filter(isNew)
    if (status === 'updated') return conversations.filter(isUpdated)
    return conversations.filter(c => isNew(c) || isUpdated(c))
}
