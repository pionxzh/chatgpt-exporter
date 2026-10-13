import { createContext, useContext } from 'preact/compat'
import { useCallback, useMemo } from 'preact/hooks'
import type { FC } from 'preact/compat'
import {
    KEY_EXPORT_ALL_LIMIT,
    KEY_FILENAME_FORMAT,
    KEY_IMAGE_MODE,
    KEY_META_ENABLED,
    KEY_META_LIST,
    KEY_SOURCES_ENABLED,
    KEY_THINKING_ENABLED,
    KEY_TIMESTAMP_24H,
    KEY_TIMESTAMP_ENABLED,
    KEY_TIMESTAMP_HTML,
    KEY_TIMESTAMP_MARKDOWN,
} from '../constants'
import { useGMStorage } from '../hooks/useGMStorage'

const defaultFormat = 'ChatGPT-{title}'
const defaultExportAllLimit = 200

/**
 * How Markdown and JSON (ZIP) exports carry images: inline data uris, left
 * out, or files in an `assets/` folder next to the export
 */
export type ImageMode = 'embed' | 'omit' | 'files'
export const defaultImageMode: ImageMode = 'embed'

export interface ExportMeta {
    name: string
    value: string
}

const defaultExportMetaList: ExportMeta[] = [
    { name: 'title', value: '{title}' },
    { name: 'source', value: '{source}' },
]

const SettingContext = createContext({
    format: defaultFormat,
    setFormat: (_: string) => {},

    enableTimestamp: false,
    setEnableTimestamp: (_: boolean) => {},
    timeStamp24H: false,
    setTimeStamp24H: (_: boolean) => {},
    enableTimestampHTML: false,
    setEnableTimestampHTML: (_: boolean) => {},
    enableTimestampMarkdown: false,
    setEnableTimestampMarkdown: (_: boolean) => {},

    enableMeta: false,
    setEnableMeta: (_: boolean) => {},
    exportMetaList: defaultExportMetaList,
    setExportMetaList: (_: ExportMeta[]) => {},
    enableThinking: false,
    setEnableThinking: (_: boolean) => {},
    enableSources: true,
    setEnableSources: (_: boolean) => {},
    imageMode: defaultImageMode as ImageMode,
    setImageMode: (_: ImageMode) => {},
    exportAllLimit: defaultExportAllLimit,
    setExportAllLimit: (_: number) => {},
    resetDefault: () => {},
})

export const SettingProvider: FC = ({ children }) => {
    const [format, setFormat] = useGMStorage(KEY_FILENAME_FORMAT, defaultFormat)

    const [enableTimestamp, setEnableTimestamp] = useGMStorage(KEY_TIMESTAMP_ENABLED, false)
    const [timeStamp24H, setTimeStamp24H] = useGMStorage(KEY_TIMESTAMP_24H, false)
    const [enableTimestampHTML, setEnableTimestampHTML] = useGMStorage(KEY_TIMESTAMP_HTML, false)
    const [enableTimestampMarkdown, setEnableTimestampMarkdown] = useGMStorage(KEY_TIMESTAMP_MARKDOWN, false)

    const [enableMeta, setEnableMeta] = useGMStorage(KEY_META_ENABLED, false)

    const [exportMetaList, setExportMetaList] = useGMStorage(KEY_META_LIST, defaultExportMetaList)
    const [enableThinking, setEnableThinking] = useGMStorage(KEY_THINKING_ENABLED, false)
    const [enableSources, setEnableSources] = useGMStorage(KEY_SOURCES_ENABLED, true)
    const [imageMode, setImageMode] = useGMStorage<ImageMode>(KEY_IMAGE_MODE, defaultImageMode)
    const [exportAllLimit, setExportAllLimit] = useGMStorage(KEY_EXPORT_ALL_LIMIT, defaultExportAllLimit)

    const resetDefault = useCallback(() => {
        setFormat(defaultFormat)
        setEnableTimestamp(false)
        setEnableMeta(false)
        setExportMetaList(defaultExportMetaList)
        setEnableThinking(false)
        setEnableSources(true)
        setImageMode(defaultImageMode)
        setExportAllLimit(defaultExportAllLimit)
    }, [
        setFormat,
        setEnableTimestamp,
        setEnableMeta,
        setExportMetaList,
        setEnableThinking,
        setEnableSources,
        setImageMode,
        setExportAllLimit,
    ])

    const value = useMemo(() => ({
        format,
        setFormat,

        enableTimestamp,
        setEnableTimestamp,
        timeStamp24H,
        setTimeStamp24H,
        enableTimestampHTML,
        setEnableTimestampHTML,
        enableTimestampMarkdown,
        setEnableTimestampMarkdown,

        enableMeta,
        setEnableMeta,
        exportMetaList,
        setExportMetaList,

        enableThinking,
        setEnableThinking,
        enableSources,
        setEnableSources,
        imageMode,
        setImageMode,

        exportAllLimit,
        setExportAllLimit,

        resetDefault,
    }), [
        format,
        setFormat,
        enableTimestamp,
        setEnableTimestamp,
        timeStamp24H,
        setTimeStamp24H,
        enableTimestampHTML,
        setEnableTimestampHTML,
        enableTimestampMarkdown,
        setEnableTimestampMarkdown,
        enableMeta,
        setEnableMeta,
        exportMetaList,
        setExportMetaList,
        enableThinking,
        setEnableThinking,
        enableSources,
        setEnableSources,
        imageMode,
        setImageMode,
        exportAllLimit,
        setExportAllLimit,
        resetDefault,
    ])

    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSettingContext = () => useContext(SettingContext)
