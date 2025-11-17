import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { archiveConversation, deleteConversation, fetchAllConversations, fetchConversation, fetchProjects } from '../api'
import { exportAllToHtml } from '../exporter/html'
import { exportAllToJson, exportAllToOfficialJson } from '../exporter/json'
import { exportAllToMarkdown } from '../exporter/markdown'
import { RequestQueue } from '../utils/queue'
import { CheckBox } from './CheckBox'
import { IconCross, IconUpload } from './Icons'
import { useSettingContext } from './SettingContext'
import type { ApiConversationItem, ApiConversationWithId, ApiProjectInfo } from '../api'
import type { FC } from '../type'
import type { ChangeEvent } from 'preact/compat'

interface ProjectSelectProps {
    projects: ApiProjectInfo[]
    selected: ApiProjectInfo | null
    setSelected: (selected: ApiProjectInfo | null) => void
    disabled: boolean
}

const ProjectSelect: FC<ProjectSelectProps> = ({ projects, selected, setSelected, disabled }) => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center text-gray-600 dark:text-gray-300 flex justify-between mb-3">
            {t('Select Project')}
            <select
                disabled={disabled}
                className="Select"
                value={selected?.id || ''}
                onChange={(e) => {
                    const projectId = e.currentTarget.value
                    const project = projects.find(p => p.id === projectId)
                    setSelected(project || null)
                }}
            >
                <option value="">{t('(no project)')}</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.display.name}</option>
                ))}
            </select>
        </div>
    )
}

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
                {!loading && !error
                && conversations.map(c => (
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

type ExportSource = 'API' | 'Local'

interface DialogContentProps {
    format: string
}

const DialogContent: FC<DialogContentProps> = ({ format }) => {
    const { t } = useTranslation()
    const { enableMeta, exportMetaList, exportAllLimit, exportChunkSize } = useSettingContext()
    const metaList = useMemo(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList])

    const exportAllOptions = useMemo(() => [
        { label: 'Markdown', callback: exportAllToMarkdown },
        { label: 'HTML', callback: exportAllToHtml },
        { label: 'JSON', callback: exportAllToOfficialJson },
        { label: 'JSON (ZIP)', callback: exportAllToJson },
    ], [])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [exportSource, setExportSource] = useState<ExportSource>('API')
    const [apiConversations, setApiConversations] = useState<ApiConversationItem[]>([])
    const [localConversations, setLocalConversations] = useState<ApiConversationWithId[]>([])
    const conversations = exportSource === 'API' ? apiConversations : localConversations
    const [projects, setProjects] = useState<ApiProjectInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [processing, setProcessing] = useState(false)
    const [selectedProject, setSelectedProject] = useState<ApiProjectInfo | null>(null)

    const [selected, setSelected] = useState<ApiConversationItem[]>([])
    const [exportType, setExportType] = useState(exportAllOptions[0].label)
    const disabled = loading || processing || !!error || selected.length === 0

    const requestQueue = useMemo(() => new RequestQueue<ApiConversationWithId>(200, 1600, exportChunkSize), [exportChunkSize])
    const archiveQueue = useMemo(() => new RequestQueue<boolean>(200, 1600), [])
    const deleteQueue = useMemo(() => new RequestQueue<boolean>(200, 1600), [])
    const [progress, setProgress] = useState({
        total: 0,
        completed: 0,
        currentName: '',
        currentStatus: '',
    })
    const [chunkProgress, setChunkProgress] = useState({
        currentChunk: 0,
        totalChunks: 0,
    })

    const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement)?.files?.[0]
        if (!file) return

        const fileReader = new FileReader()
        fileReader.onload = () => {
            const data = JSON.parse(fileReader.result as string)
            if (!Array.isArray(data)) {
                alert(t('Invalid File Format'))
                return
            }
            setSelected([])
            setExportSource('Local')
            setLocalConversations(data)
        }
        fileReader.readAsText(file)
    }, [t, setExportSource, setLocalConversations])

    useEffect(() => {
        const off = requestQueue.on('progress', (progress) => {
            setProcessing(true)
            setProgress(progress)
        })

        return () => off()
    }, [requestQueue])

    useEffect(() => {
        const off = requestQueue.on('chunkComplete', ({ chunk, chunkIndex, totalChunks }) => {
            setChunkProgress({
                currentChunk: chunkIndex + 1,
                totalChunks,
            })
            // Process chunk immediately
            const callback = exportAllOptions.find(o => o.label === exportType)?.callback
            if (callback) callback(format, chunk, metaList, chunkIndex, totalChunks)
        })

        return () => off()
    }, [requestQueue, exportAllOptions, exportType, format, metaList])

    useEffect(() => {
        const off = archiveQueue.on('progress', (progress) => {
            setProcessing(true)
            setProgress(progress)
        })

        return () => off()
    }, [archiveQueue])

    useEffect(() => {
        const off = deleteQueue.on('progress', (progress) => {
            setProcessing(true)
            setProgress(progress)
        })

        return () => off()
    }, [deleteQueue])

    useEffect(() => {
        const off = requestQueue.on('done', () => {
            setProcessing(false)
            // Reset chunk progress
            setChunkProgress({
                currentChunk: 0,
                totalChunks: 0,
            })
        })
        return () => off()
    }, [requestQueue])

    useEffect(() => {
        const off = archiveQueue.on('done', () => {
            setProcessing(false)
            setApiConversations(apiConversations.filter(c => !selected.some(s => s.id === c.id)))
            setSelected([])
            alert(t('Conversation Archived Message'))
        })
        return () => off()
    }, [archiveQueue, apiConversations, selected, t])

    useEffect(() => {
        const off = deleteQueue.on('done', () => {
            setProcessing(false)
            setApiConversations(apiConversations.filter(c => !selected.some(s => s.id === c.id)))
            setSelected([])
            alert(t('Conversation Deleted Message'))
        })
        return () => off()
    }, [deleteQueue, apiConversations, selected, t])

    const exportAllFromApi = useCallback(() => {
        if (disabled) return

        requestQueue.clear()

        selected.forEach(({ id, title }) => {
            requestQueue.add({
                name: title,
                request: () => fetchConversation(id, exportType !== 'JSON'),
            })
        })

        requestQueue.start()
    }, [disabled, selected, requestQueue, exportType])

    const exportAllFromLocal = useCallback(() => {
        if (disabled) return

        const results = localConversations.filter(c => selected.some(s => s.id === c.id))
        const callback = exportAllOptions.find(o => o.label === exportType)?.callback
        if (callback) callback(format, results, metaList)
    }, [
        disabled,
        selected,
        localConversations,
        exportAllOptions,
        exportType,
        format,
        metaList,
    ])

    const exportAll = useMemo(() => {
        return exportSource === 'API' ? exportAllFromApi : exportAllFromLocal
    }, [exportSource, exportAllFromApi, exportAllFromLocal])

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

    const archiveAll = useCallback(() => {
        if (disabled) return

        const result = confirm(t('Conversation Archive Alert'))
        if (!result) return

        archiveQueue.clear()

        selected.forEach(({ id, title }) => {
            archiveQueue.add({
                name: title,
                request: () => archiveConversation(id),
            })
        })

        archiveQueue.start()
    }, [disabled, selected, archiveQueue, t])

    useEffect(() => {
        fetchProjects()
            .then(setProjects)
            .catch(err => setError(err.toString()))
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchAllConversations(selectedProject?.id, exportAllLimit)
            .then(setApiConversations)
            .catch((err) => {
                console.error('Error fetching conversations:', err)
                setError(err.message || 'Failed to load conversations')
            })
            .finally(() => setLoading(false))
    }, [selectedProject, exportAllLimit])

    return (
        <>
            <Dialog.Title className="DialogTitle">{t('Export Dialog Title')}</Dialog.Title>
            <div className="flex items-center text-gray-600 dark:text-gray-300 flex justify-between border-b-[1px] pb-3 mb-3 dark:border-gray-700">
                {t('Export from official export file')} (conversations.json)&nbsp;
                {exportSource === 'API' && (
                    <button className="btn relative btn-neutral" onClick={() => fileInputRef.current?.click()}>
                        <IconUpload className="w-4 h-4" />
                    </button>
                )}
            </div>
            <input
                type="file"
                accept="application/json"
                className="hidden"
                ref={fileInputRef}
                onChange={onUpload}
            />
            {exportSource === 'API' && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 flex justify-between mb-3">
                    {t('Export from API')}
                </div>
            )}
            <ProjectSelect projects={projects} selected={selectedProject} setSelected={setSelectedProject} disabled={processing || loading} />
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
                <button className="Button red" disabled={disabled || exportSource === 'Local'} onClick={archiveAll}>
                    {t('Archive')}
                </button>
                <button className="Button red ml-4" disabled={disabled || exportSource === 'Local'} onClick={deleteAll}>
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
                    {chunkProgress.totalChunks > 1 && (
                        <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                            {t('Processing chunk')} {chunkProgress.currentChunk} {t('of')} {chunkProgress.totalChunks}
                        </div>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
                    </div>
                </>
            )}
            <Dialog.Close asChild>
                <button className="IconButton CloseButton" aria-label="Close">
                    <IconCross />
                </button>
            </Dialog.Close>
        </>
    )
}

interface ExportDialogProps {
    format: string
    open: boolean
    onOpenChange: (value: boolean) => void
}

export const ExportDialog: FC<ExportDialogProps> = ({ format, open, onOpenChange, children }) => {
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
                    {open && <DialogContent format={format} />}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
