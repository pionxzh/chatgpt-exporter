import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { deleteConversation, fetchAllConversations, fetchConversation } from '../api'
import { exportAllToHtml } from '../exporter/html'
import { exportAllToJson } from '../exporter/json'
import { exportAllToMarkdown } from '../exporter/markdown'
import { RequestQueue } from '../utils/queue'
import { CheckBox } from './CheckBox'
import { IconCross } from './Icons'
import { useSettingContext } from './SettingContext'
import type { ApiConversationItem, ApiConversationWithId } from '../api'
import type { FC } from '../type'

const exportAllOptions = [
    { label: 'Markdown', callback: exportAllToMarkdown },
    { label: 'JSON', callback: exportAllToJson },
    { label: 'HTML', callback: exportAllToHtml },
]

interface ConversationSelectProps {
    conversations: ApiConversationItem[]
    selected: ApiConversationItem[]
    setSelected: (selected: ApiConversationItem[]) => void
    disabled: boolean
    loading: boolean
    error: string
}

const ConversationSelect: FC<ConversationSelectProps> = ({
    conversations,
    selected,
    setSelected,
    disabled,
    loading,
    error,
}) => {
    const { t } = useTranslation()

    return (
        <>
            <div className="SelectToolbar">
                <CheckBox
                    label={t('Select All')}
                    disabled={disabled}
                    checked={selected.length === conversations.length}
                    onCheckedChange={(checked) => {
                        setSelected(checked ? conversations : [])
                    }}
                />
            </div>
            <ul className="SelectList">
                {loading && <li className="SelectItem">{t('Loading')}...</li>}
                {error && <li className="SelectItem">{t('Error')}: {error}</li>}
                {conversations.map(c => (
                    <li className="SelectItem" key={c.id}>
                        <CheckBox
                            label={c.title}
                            disabled={disabled}
                            checked={selected.some(x => x.id === c.id)}
                            onCheckedChange={(checked) => {
                                setSelected(checked
                                    ? [...selected, c]
                                    : selected.filter(x => x.id !== c.id),
                                )
                            }}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}

interface ExportDialogProps {
    format: string
    open: boolean
    onOpenChange: (value: boolean) => void
}

export const ExportDialog: FC<ExportDialogProps> = ({ format, open, onOpenChange, children }) => {
    const { t } = useTranslation()
    const { enableMeta, exportMetaList } = useSettingContext()
    const metaList = useMemo(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList])

    const [conversations, setConversations] = useState<ApiConversationItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [processing, setProcessing] = useState(false)

    const [selected, setSelected] = useState<ApiConversationItem[]>([])
    const [exportType, setExportType] = useState(exportAllOptions[0].label)
    const disabled = loading || processing || !!error || selected.length === 0

    const requestQueue = useMemo(() => new RequestQueue<ApiConversationWithId>(200, 1600), [])
    const deleteQueue = useMemo(() => new RequestQueue<boolean>(200, 1600), [])
    const [progress, setProgress] = useState({
        total: 0,
        completed: 0,
        currentName: '',
        currentStatus: '',
    })

    useEffect(() => {
        const off = requestQueue.on('progress', (progress) => {
            setProcessing(true)
            setProgress(progress)
        })

        return () => off()
    }, [requestQueue])

    useEffect(() => {
        const off = deleteQueue.on('progress', (progress) => {
            setProcessing(true)
            setProgress(progress)
        })

        return () => off()
    }, [deleteQueue])

    useEffect(() => {
        const off = requestQueue.on('done', (results) => {
            setProcessing(false)
            const callback = exportAllOptions.find(o => o.label === exportType)?.callback
            if (callback) callback(format, results, metaList)
        })
        return () => off()
    }, [requestQueue, exportType, format, metaList])

    useEffect(() => {
        const off = deleteQueue.on('done', () => {
            setProcessing(false)
            setConversations(conversations.filter(c => !selected.some(s => s.id === c.id)))
            setSelected([])
            alert(t('Conversation Deleted Message'))
        })
        return () => off()
    }, [deleteQueue, conversations, selected, t])

    const exportAll = useCallback(() => {
        if (disabled) return

        requestQueue.clear()

        selected.forEach(({ id, title }) => {
            requestQueue.add({
                name: title,
                request: () => fetchConversation(id),
            })
        })

        requestQueue.start()
    }, [disabled, selected, requestQueue])

    const deleteAll = useCallback(() => {
        if (disabled) return

        const result = confirm(t('Conversation Delete Alert'))
        if (!result) return

        deleteQueue.clear()

        selected.forEach(({ id, title }) => {
            deleteQueue.add({
                name: title,
                request: () => deleteConversation(id),
            })
        })

        deleteQueue.start()
    }, [disabled, selected, deleteQueue, t])

    useEffect(() => {
        setLoading(true)
        fetchAllConversations()
            .then(setConversations)
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])

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
                    <Dialog.Title className="DialogTitle">{t('Export Dialog Title')}</Dialog.Title>

                    <ConversationSelect
                        conversations={conversations}
                        selected={selected}
                        setSelected={setSelected}
                        disabled={processing}
                        loading={loading}
                        error={error}
                    />
                    <div className="flex mt-6" style={{ justifyContent: 'space-between' }}>
                        <select className="Select" disabled={processing} value={exportType} onChange={e => setExportType(e.currentTarget.value)}>
                            {exportAllOptions.map(({ label }) => (
                                <option key={t(label)} value={label}>{label}</option>
                            ))}
                        </select>
                        <div className="flex flex-grow"></div>
                        <button className="Button red" disabled={disabled} onClick={deleteAll}>
                            {t('Delete')}
                        </button>
                        <button className="Button green ml-4" disabled={disabled} onClick={exportAll}>
                            {t('Export')}
                        </button>
                    </div>
                    {processing && (
                        <>
                            <div className="mt-2 mb-1 justify-between flex">
                                <span className="truncate mr-8">{progress.currentName}</span>
                                <span>{`${progress.completed}/${progress.total}`}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.completed / progress.total * 100}%` }} />
                            </div>
                        </>
                    )}
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
