import { dateStr, timestamp, unixTimestampToISOString } from '../utils/utils'
import type { ConversationResult } from '../api'
import type { ExportMeta } from '../ui/SettingContext'

export function getMetaVariables(
    { title, model, modelSlug, createTime, updateTime }: ConversationResult,
    source: string,
    date = dateStr(),
): Record<string, string> {
    return {
        title,
        date,
        timestamp: timestamp(),
        source,
        model,
        model_name: modelSlug,
        create_time: unixTimestampToISOString(createTime),
        update_time: unixTimestampToISOString(updateTime),
    }
}

/**
 * Replace every `{name}` in each meta value in a single pass, so values
 * containing `$&` or another `{name}` are inserted verbatim.
 * Unknown variables are left untouched.
 */
export function resolveMetaList(metaList: ExportMeta[] | undefined, variables: Record<string, string>) {
    return metaList
        ?.filter(x => !!x.name)
        .map(({ name, value }) => {
            const val = value.replace(/\{(\w+)\}/g, (match, key: string) => {
                return Object.hasOwn(variables, key) ? variables[key] : match
            })
            return [name, val] as const
        })
        ?? []
}
