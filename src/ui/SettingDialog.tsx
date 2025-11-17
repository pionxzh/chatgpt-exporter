import * as Dialog from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import sanitize from 'sanitize-filename'
import { baseUrl } from '../constants'
import { useTitle } from '../hooks/useTitle'
import { LOCALES } from '../i18n'
import { getChatIdFromUrl } from '../page'
import { getFileNameWithFormat } from '../utils/download'
import { timestamp as _timestamp, dateStr, unixTimestampToISOString } from '../utils/utils'
import { IconCross, IconTrash } from './Icons'
import { useSettingContext } from './SettingContext'
import { Toggle } from './Toggle'
import type { FC } from '../type'

function Variable({ name, title }: { name: string; title: string }) {
    return <strong className="cursor-help select-all whitespace-nowrap" title={title}>{name}</strong>
}

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
        /* eslint-disable pionxzh/consistent-list-newline */
        format, setFormat,
        enableTimestamp, setEnableTimestamp,
        timeStamp24H, setTimeStamp24H,
        enableTimestampHTML, setEnableTimestampHTML,
        enableTimestampMarkdown, setEnableTimestampMarkdown,
        enableMeta, setEnableMeta,
        exportMetaList, setExportMetaList,
        exportAllLimit, setExportAllLimit,
        exportChunkSize, setExportChunkSize,
        /* eslint-enable pionxzh/consistent-list-newline */
    } = useSettingContext()
    const { t, i18n } = useTranslation()
    const _title = useTitle()
    const date = dateStr()
    const timestamp = _timestamp()
    const title = sanitize(_title).replace(/\s+/g, '_')
    const chatId = getChatIdFromUrl() || 'this-is-a-mock-chat-id'
    const now = Date.now() / 1000
    const createTime = now
    const updateTime = now
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
                    <Dialog.Title className="DialogTitle">{t('Exporter Settings')}</Dialog.Title>

                    <dl className="space-y-6">
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    {`${t('Language')} 🌐`}
                                </dt>
                                <dd>
                                    <select
                                        className="Select mt-3"
                                        value={i18n.language}
                                        onChange={e => i18n.changeLanguage(e.currentTarget.value)}
                                    >
                                        {LOCALES.map(({ name, code }) => (
                                            <option key={code} value={code}>{name}</option>
                                        ))}
                                    </select>
                                </dd>
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    {t('File Name')}
                                </dt>
                                <dd>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {t('Available variables')}:{' '}
                                        <Variable name="{title}" title={title} />
                                        ,{' '}
                                        <Variable name="{date}" title={date} />
                                        ,{' '}
                                        <Variable name="{timestamp}" title={timestamp} />
                                        ,{' '}
                                        <Variable name="{chat_id}" title={chatId} />
                                        ,{' '}
                                        <Variable name="{create_time}" title={unixTimestampToISOString(createTime)} />
                                        ,{' '}
                                        <Variable name="{update_time}" title={unixTimestampToISOString(updateTime)} />
                                    </p>
                                    <input className="Input mt-4" id="filename" value={format} onChange={e => setFormat(e.currentTarget.value)} />
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                        {t('Preview')}:{' '}
                                        <span className="select-all" style={{ 'text-decoration': 'underline', 'text-underline-offset': 4 }}>{preview}</span>
                                    </p>
                                </dd>
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    {t('Export All Limit')}{' '}
                                    {/* Add translation key */}
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                    {t('Export All Limit Description')}{' '}
                                    {/* Add translation key */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <input
                                            type="range"
                                            min="100" // Set min value
                                            max="20000" // Set max value (adjust as needed)
                                            step="100" // Set step value
                                            value={exportAllLimit}
                                            onChange={e =>
                                                setExportAllLimit(
                                                    Number.parseInt(
                                                        e.currentTarget.value,
                                                        10,
                                                    ),
                                                )}
                                            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                            id="exportAllLimitSlider"
                                        />
                                        <span className="font-medium text-gray-900 dark:text-gray-300 w-12 text-right">
                                            {exportAllLimit}
                                        </span>
                                    </div>
                                </dd>
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    {t('Export Chunk Size')}{' '}
                                    {/* Add translation key */}
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                    {t('Export Chunk Size Description')}{' '}
                                    {/* Add translation key */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <input
                                            type="range"
                                            min="10" // Set min value
                                            max="500" // Set max value
                                            step="10" // Set step value
                                            value={exportChunkSize}
                                            onChange={e =>
                                                setExportChunkSize(
                                                    Number.parseInt(
                                                        e.currentTarget.value,
                                                        10,
                                                    ),
                                                )}
                                            className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                            id="exportChunkSizeSlider"
                                        />
                                        <span className="font-medium text-gray-900 dark:text-gray-300 w-12 text-right">
                                            {exportChunkSize}
                                        </span>
                                    </div>
                                </dd>
                            </div>
                        </div>
                        <div className="relative flex bg-white dark:bg-white/5 rounded p-4">
                            <div>
                                <dt className="text-md font-medium text-gray-800 dark:text-white">
                                    {t('Conversation Timestamp')}
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300">
                                    {t('Conversation Timestamp Description')}
                                    {enableTimestamp && (
                                        <>
                                            <div className="mt-2">
                                                <Toggle
                                                    label={t('Use 24-hour format')}
                                                    checked={timeStamp24H}
                                                    onCheckedUpdate={setTimeStamp24H}
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <Toggle
                                                    label={t('Enable on HTML')}
                                                    checked={enableTimestampHTML}
                                                    onCheckedUpdate={setEnableTimestampHTML}
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <Toggle
                                                    label={t('Enable on Markdown')}
                                                    checked={enableTimestampMarkdown}
                                                    onCheckedUpdate={setEnableTimestampMarkdown}
                                                />
                                            </div>
                                        </>
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
                                    {t('Export Metadata')}
                                </dt>
                                <dd className="text-sm text-gray-700 dark:text-gray-300">
                                    {t('Export Metadata Description')}

                                    {enableMeta && (
                                        <>
                                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                {t('Available variables')}:{' '}
                                                <Variable name="{title}" title={title} />
                                                ,{' '}
                                                <Variable name="{date}" title={date} />
                                                ,{' '}
                                                <Variable name="{timestamp}" title={timestamp} />
                                                ,{' '}
                                                <Variable name="{source}" title={source} />
                                                ,{' '}
                                                <Variable name="{model}" title="ChatGPT-3.5" />
                                                ,{' '}
                                                <Variable name="{model_name}" title="text-davinci-002-render-sha" />
                                                ,{' '}
                                                <Variable name="{create_time}" title="2023-04-10T21:45:35.027Z" />
                                                ,{' '}
                                                <Variable name="{update_time}" title="2023-04-10T21:45:35.027Z" />
                                            </p>
                                            {/* eslint-disable-next-line pionxzh/consistent-list-newline */}
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
                            <button className="Button green font-bold">{t('Save')}</button>
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
