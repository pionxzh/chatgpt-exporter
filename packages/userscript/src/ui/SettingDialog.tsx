import * as Dialog from '@radix-ui/react-dialog'
import sanitize from 'sanitize-filename'
import { baseUrl } from '../constants'
import { useTitle } from '../hooks/useTitle'
import { getChatIdFromUrl } from '../page'
import { getFileNameWithFormat } from '../utils/download'
import { timestamp as _timestamp, dateStr } from '../utils/utils'
import { CheckBox } from './CheckBox'
import { useFormatContext } from './FormatContext'
import { IconCross, IconTrash } from './Icons'
import { useMetaDataContext } from './MetaContext'
import type { FC } from '../type'

export const SettingDialog: FC = ({ children }) => {
    const { format, setFormat } = useFormatContext()
    const { enableMeta, setEnableMeta, exportMetaList, setExportMetaList } = useMetaDataContext()

    const _title = useTitle()
    const date = dateStr()
    const timestamp = _timestamp()
    const title = sanitize(_title).replace(/\s+/g, '_')
    const preview = getFileNameWithFormat(format, '{ext}', { title })

    const chatId = getChatIdFromUrl() || 'xxx'
    const source = `${baseUrl}/${chatId}`

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Exporter Setting</Dialog.Title>

                    <dl className="space-y-6">
                        <div>
                            <dt>
                                <label className="text-sm font-medium text-gray-800 dark:text-white" htmlFor="filename">
                                    File Name
                                </label>
                            </dt>
                            <dd>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    Available variables:&nbsp;
                                    <strong className="cursor-help select-all" title={title}>{'{title}'}</strong>
                                    ,&nbsp;
                                    <strong className="cursor-help select-all" title={date}>{'{date}'}</strong>
                                    ,&nbsp;
                                    <strong className="cursor-help select-all" title={timestamp}>{'{timestamp}'}</strong>
                                </p>
                                <input className="Input mt-1" id="filename" value={format} onChange={e => setFormat(e.currentTarget.value)} />
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                    Preview:&nbsp;
                                    <span className="select-all" style={{ 'text-decoration': 'underline', 'text-underline-offset': 4 }}>{preview}</span>
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <div className="text-sm font-medium text-gray-800 dark:text-white">
                                    Export Metadata
                                </div>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                    Add metadata to exported Markdown and HTML files.
                                </p>
                            </dt>
                            <dd>
                                <CheckBox label="Enable" className="mt-2" checked={enableMeta} onCheckedChange={setEnableMeta} />

                                {enableMeta && (
                                    <>
                                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                            Available variables:&nbsp;
                                            <strong className="cursor-help select-all" title={title}>{'{title}'}</strong>
                                            ,&nbsp;
                                            <strong className="cursor-help select-all" title={date}>{'{date}'}</strong>
                                            ,&nbsp;
                                            <strong className="cursor-help select-all" title={timestamp}>{'{timestamp}'}</strong>
                                            ,&nbsp;
                                            <strong className="cursor-help select-all" title={source}>{'{source}'}</strong>
                                        </p>
                                        {exportMetaList.map((meta, i) => (
                                            <div className="flex items-center mt-2" key={i}>
                                                <input
                                                    className="Input"
                                                    value={meta.name}
                                                    onChange={(e) => {
                                                        const list = [...exportMetaList]
                                                        list[i] = { ...list[i], name: e.currentTarget.value }
                                                        setExportMetaList(list)
                                                    }}
                                                />
                                                <span className="mx-2">→</span>
                                                <input
                                                    className="Input"
                                                    value={meta.value}
                                                    onChange={(e) => {
                                                        const list = [...exportMetaList]
                                                        list[i] = { ...list[i], value: e.currentTarget.value }
                                                        setExportMetaList(list)
                                                    }}
                                                />
                                                <button
                                                    className="ml-2 rounded-full p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
                                                    aria-label="Remove"
                                                    onClick={() => setExportMetaList(exportMetaList.filter((_, j) => j !== i))}
                                                >
                                                    <IconTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex justify-center items-center mt-2 pr-8">
                                            <button
                                                className="w-full border border-[#6f6e77] dark:border-gray-[#86858d] rounded-md py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out duration-150"
                                                aria-label="Add"
                                                onClick={() => setExportMetaList([...exportMetaList, { name: '', value: '' }])}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </>
                                )}
                            </dd>
                        </div>
                    </dl>
                    <div className="flex mt-6" style={{ justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <button className="Button green">Save</button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="IconButton CloseButton" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
