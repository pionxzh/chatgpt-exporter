import { createContext, useContext } from 'preact/compat'
import { useCallback } from 'preact/hooks'
import {
    KEY_EXPORT_ALL_LIMIT,
    KEY_FILENAME_FORMAT,
    KEY_LAST_EXPORT_AUTO_SELECT,
    KEY_LAST_EXPORT_TIME_FIELD,
    KEY_META_ENABLED,
    KEY_META_LIST,
    KEY_THINKING_ENABLED,
    KEY_TIMESTAMP_24H,
    KEY_TIMESTAMP_ENABLED,
    KEY_TIMESTAMP_HTML,
    KEY_TIMESTAMP_MARKDOWN,
} from '../constants'
import { useGMStorage } from '../hooks/useGMStorage'
import type { FC } from 'preact/compat'

const defaultFormat = 'ChatGPT-{title}'
const defaultExportAllLimit = 1000
const defaultLastExportAutoSelect = false
const defaultLastExportTimeField: LastExportTimeField = 'create_time'

export type LastExportTimeField = 'create_time' | 'update_time'

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
    exportAllLimit: defaultExportAllLimit,
    setExportAllLimit: (_: number) => {},

    lastExportAutoSelect: defaultLastExportAutoSelect,
    setLastExportAutoSelect: (_: boolean) => {},

    lastExportTimeField: defaultLastExportTimeField as LastExportTimeField,
    setLastExportTimeField: (_: LastExportTimeField) => {},

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
    const [exportAllLimit, setExportAllLimit] = useGMStorage(KEY_EXPORT_ALL_LIMIT, defaultExportAllLimit)
    const [lastExportAutoSelect, setLastExportAutoSelect] = useGMStorage(KEY_LAST_EXPORT_AUTO_SELECT, defaultLastExportAutoSelect)
    const [lastExportTimeField, setLastExportTimeField] = useGMStorage<LastExportTimeField>(KEY_LAST_EXPORT_TIME_FIELD, defaultLastExportTimeField)

    const resetDefault = useCallback(() => {
        setFormat(defaultFormat)
        setEnableTimestamp(false)
        setEnableMeta(false)
        setExportMetaList(defaultExportMetaList)
        setEnableThinking(false)
        setExportAllLimit(defaultExportAllLimit)
        setLastExportAutoSelect(defaultLastExportAutoSelect)
        setLastExportTimeField(defaultLastExportTimeField)
    }, [
        setFormat,
        setEnableTimestamp,
        setEnableMeta,
        setExportMetaList,
        setEnableThinking,
        setExportAllLimit,
        setLastExportAutoSelect,
        setLastExportTimeField,
    ])

    return (
        <SettingContext.Provider
            value={{
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

                exportAllLimit,
                setExportAllLimit,

                lastExportAutoSelect,
                setLastExportAutoSelect,

                lastExportTimeField,
                setLastExportTimeField,

                resetDefault,
            }}
        >
            {children}
        </SettingContext.Provider>
    )
}

export const useSettingContext = () => useContext(SettingContext)
