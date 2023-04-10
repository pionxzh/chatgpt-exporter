import * as Dialog from '@radix-ui/react-dialog'
import sanitize from 'sanitize-filename'
import { baseUrl } from '../constants'
import { useTitle } from '../hooks/useTitle'
import { getChatIdFromUrl } from '../page'
import { getFileNameWithFormat } from '../utils/download'
import { timestamp as _timestamp, dateStr } from '../utils/utils'
import { IconCross, IconTrash } from './Icons'
import { useSettingContext } from './SettingContext'
import { Toggle } from './Toggle'
import type { FC } from '../type'

const Variable = ({ name, title }: { name: string; title: string }) => (
    <strong className="cursor-help select-all whitespace-nowrap" title={title}>{name}</strong>
)

interface SettingDialogProps {
    open: boolean
    onOpenChange: (value: boolean) => void
}

export const SettingDialog: FC<SettingDialogProps> = ({
    open,
    onOpenChange,
    children,
}) => {
    const {
        format, setFormat,
        enableTimestamp, setEnableTimestamp,
        timeStamp24H, setTimeStamp24H,
        enableMeta, setEnableMeta,
        exportMetaList, setExportMetaList,
    } = useSettingContext()
    const _title = useTitle()
    const date = dateStr()
    const timestamp = _timestamp()
    const title = sanitize(_title).replace(/\s+/g, '_')
    const chatId = getChatIdFromUrl() || 'this-is-a-mock-chat-id'
    const createTime = Math.floor((new Date()).getTime() / 1000)
    const updateTime = createTime
    const preview = getFileNameWithFormat(format, '{ext}', { title, chatId, createTime, updateTime })

    const source = `${baseUrl}/${chatId}`

    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Exporter Setting</Dialog.Title>

                    <dl className="space-y-6">
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    File Name
                                </dt>
                                <dd>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Available variables:{' '}
                                        <Variable name="{title}" title={title} />
                                        ,{' '}
                                        <Variable name="{date}" title={date} />
                                        ,{' '}
                                        <Variable name="{timestamp}" title={timestamp} />
                                        ,{' '}
                                        <Variable name="{chat_id}" title={chatId} />
                                        ,{' '}
                                        <Variable name="{create_time}" title={createTime} />
                                        ,{' '}
                                        <Variable name="{update_time}" title={updateTime} />
                                    </p>
                                    <input className="Input mt-4" id="filename" value={format} onChange={e => setFormat(e.currentTarget.value)} />
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                        Preview:{' '}
                                        <span className="select-all" style={{ 'text-decoration': 'underline', 'text-underline-offset': 4 }}>{preview}</span>
                                    </p>
                                </dd>
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    Conversation Timestamp
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300">
                                    Will show on the page and HTML files.
                                    {enableTimestamp && (
                                        <div className="mt-2">
                                            <Toggle
                                                label="Use 24-hour format (eg. 23:59)"
                                                checked={timeStamp24H}
                                                onCheckedUpdate={setTimeStamp24H}
                                            />
                                        </div>
                                    )}
                                </dd>
                            </div>
                            <div className="absolute right-4">
                                <Toggle label="" checked={enableTimestamp} onCheckedUpdate={setEnableTimestamp} />
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    Export Metadata
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300">
                                    Add metadata to exported Markdown and HTML files.

                                    {enableMeta && (
                                        <>
                                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                Available variables:{' '}
                                                <Variable name="{title}" title={title} />
                                                ,{' '}
                                                <Variable name="{date}" title={date} />
                                                ,{' '}
                                                <Variable name="{timestamp}" title={timestamp} />
                                                ,{' '}
                                                <Variable name="{source}" title={source} />
                                                ,{' '}
                                                <Variable name="{model}" title={'ChatGPT-3.5'} />
                                                ,{' '}
                                                <Variable name="{model_name}" title={'text-davinci-002-render-sha'} />
                                                ,{' '}
                                                <Variable name="{create_time}" title={'2023-04-10T21:45:35.027Z'} />
                                                ,{' '}
                                                <Variable name="{update_time}" title={'2023-04-10T21:45:35.027Z'} />
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
                            <div className="absolute right-4">
                                <Toggle label="" checked={enableMeta} onCheckedUpdate={setEnableMeta} />
                            </div>
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
