import { createContext, useContext } from 'preact/compat'
import { KEY_META_ENABLED, KEY_META_LIST } from '../constants'
import { useGMStorage } from '../hooks/useGMStorage'
import type { FC } from 'preact/compat'

export interface ExportMeta {
    name: string
    value: string
}

const defaultExportMetaList: ExportMeta[] = [
    { name: 'title', value: '{title}' },
    { name: 'source', value: '{source}' },
]

const MetaContext = createContext({
    enableMeta: false,
    setEnableMeta: (_: boolean) => {},
    exportMetaList: defaultExportMetaList,
    setExportMetaList: (_: ExportMeta[]) => {},
})

export const MetaDataProvider: FC = ({ children }) => {
    const [enableMeta, setEnableMeta] = useGMStorage(KEY_META_ENABLED, false)
    const [exportMetaList, setExportMetaList] = useGMStorage(KEY_META_LIST, defaultExportMetaList)

    return (
        <MetaContext.Provider
            value={{
                enableMeta,
                setEnableMeta,
                exportMetaList,
                setExportMetaList,
            }}
        >
            {children}
        </MetaContext.Provider>
    )
}

export const useMetaDataContext = () => useContext(MetaContext)
