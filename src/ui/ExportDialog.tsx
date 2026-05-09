import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { archiveConversation, deleteConversation, fetchAllConversations, fetchConversation, fetchConversationsPage, fetchProjects, probeApi } from '../api'
import { EXPORT_OPERATION_BATCH } from '../constants'
import { exportAllToHtml } from '../exporter/html'
import { exportAllToJson, exportAllToOfficialJson } from '../exporter/json'
import { exportAllToMarkdown } from '../exporter/markdown'
import { RequestQueue } from '../utils/queue'
import { sleep } from '../utils/utils'
import { CheckBox } from './CheckBox'
import { IconCross, IconLoading, IconUpload } from './Icons'
import { useSettingContext } from './SettingContext'
import type { ApiConversationItem, ApiConversationWithId, ApiProjectInfo } from '../api'
import type { FC } from '../type'
import type { ChangeEvent } from 'preact/compat'

/**
 * Module-level flag shared between ExportDialog (parent) and DialogContent (child).
 * Lets the parent gate ESC / outside-click dismissal without lifting state.
 */
const exportingRef = { current: false }

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Normalise create_time / update_time to milliseconds regardless of whether
 * the API returned an ISO 8601 string (current) or a Unix-seconds number (legacy).
 */
function toMs(time: number | string | undefined): number {
    if (time == null) return 0
    if (typeof time === 'number') return time * 1000
    return new Date(time).getTime()
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
    }
    return result
}

/** Compact date label — always includes year to avoid ambiguity */
function formatConvDate(time: number | string | undefined): string {
    if (!time) return '—'
    const ms = typeof time === 'number' ? time * 1000 : new Date(time).getTime()
    if (Number.isNaN(ms) || ms === 0) return '—'
    const d = new Date(ms)
    const diffDays = Math.floor((Date.now() - ms) / 86_400_000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    // Always show the year so "Jun 17" vs "Jun 17, 2025" confusion is impossible
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Text search supporting * and ? wildcards. Falls back to substring. */
function textSearch(title: string, query: string): boolean {
    const q = query.trim()
    if (!q) return true
    const lower = q.toLowerCase()
    if (!lower.includes('*') && !lower.includes('?')) {
        return title.toLowerCase().includes(lower)
    }
    const regexStr = lower
        .replace(/[\\\^$.|+()[\]{}]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
    try {
        return new RegExp(regexStr).test(title.toLowerCase())
    }
    catch {
        return title.toLowerCase().includes(lower)
    }
}

// ---------------------------------------------------------------------------
// ProjectSelect component
// ---------------------------------------------------------------------------

interface ProjectSelectProps {
    projects: ApiProjectInfo[]
    selected: string | null
    setSelected: (projectId: string | null) => void
    disabled: boolean
    loading: boolean
}

const ProjectSelect: FC<ProjectSelectProps> = ({ projects, selected, setSelected, disabled, loading }) => {
    const { t } = useTranslation()

    return (
        <div className="ProjectSelect flex items-center text-gray-600 dark:text-gray-300 justify-between mb-3">
            {t('Select Project')}
            <div className="flex items-center gap-2">
                {loading && <IconLoading className="w-3 h-3" />}
                <select
                    disabled={disabled}
                    className="Select"
                    value={selected ?? ''}
                    onChange={(e) => {
                        const val = e.currentTarget.value
                        setSelected(val || null)
                    }}
                >
                    <option value="">{t('All conversations')}</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.display.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// ConversationSelect component
// ---------------------------------------------------------------------------

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
    const [query, setQuery] = useState('')
    const lastClickedIndex = useRef<number>(-1)
    const [skipFirst, setSkipFirst] = useState(0)
    const [sortField, setSortField] = useState<'title' | 'create_time' | 'update_time'>('create_time')
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

    // ── Filtering ──

    const filtered = useMemo(() => {
        let result = conversations
        const q = query.trim()
        if (q) result = result.filter(c => textSearch(c.title, q))
        const dir = sortDir === 'asc' ? 1 : -1
        return [...result].sort((a, b) => {
            if (sortField === 'title') {
                return dir * (a.title ?? '').localeCompare(b.title ?? '')
            }
            const aMs = toMs(sortField === 'update_time' ? a.update_time : a.create_time)
            const bMs = toMs(sortField === 'update_time' ? b.update_time : b.create_time)
            return dir * (aMs - bMs)
        })
    }, [conversations, query, sortField, sortDir])

    const allFilteredSelected = filtered.length > 0 && filtered.every(c => selected.some(x => x.id === c.id))

    return (
        <>
            {/* ── Search input ── */}
            <input
                type="search"
                className="SelectSearch"
                placeholder={t('Search')}
                value={query}
                disabled={disabled}
                onInput={(e) => {
                    const val = (e.currentTarget as HTMLInputElement).value
                    lastClickedIndex.current = -1
                    setQuery(val)
                }}
            />

            {/* ── Toolbar: select-all + last-100 + resume + counter ── */}
            <div className="SelectToolbar">
                <CheckBox
                    label={t('Select All')}
                    disabled={disabled}
                    checked={allFilteredSelected}
                    onCheckedChange={(checked) => {
                        lastClickedIndex.current = -1
                        setSelected(checked ? filtered : [])
                    }}
                />
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                    {loading && conversations.length > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <IconLoading className="w-3 h-3" />
                            {t('Loading')}... ({conversations.length})
                        </span>
                    )}
                    <button
                        className="Button neutral"
                        disabled={disabled || conversations.length === 0}
                        onClick={() => setSelected(filtered.slice(0, EXPORT_OPERATION_BATCH))}
                    >
                        {t('Last 100')}
                    </button>
                    {/* Resume control: select the next 100 starting at a given offset */}
                    <input
                        type="number"
                        min="0"
                        step="100"
                        value={skipFirst}
                        title="Starting position for next batch (e.g. 200 to resume after 2 batches)"
                        disabled={disabled || conversations.length === 0}
                        onChange={e => setSkipFirst(Math.max(0, Math.floor(Number(e.currentTarget.value))))}
                        style={{
                            width: '4rem',
                            fontSize: '0.75rem',
                            padding: '2px 5px',
                            border: '1px solid #9ca3af',
                            borderRadius: '3px',
                            background: 'transparent',
                            color: 'inherit',
                        }}
                    />
                    <button
                        className="Button neutral"
                        title={`Select 100 conversations starting at position #${skipFirst + 1}`}
                        disabled={disabled || conversations.length === 0 || skipFirst >= filtered.length}
                        onClick={() => setSelected(filtered.slice(skipFirst, skipFirst + EXPORT_OPERATION_BATCH))}
                    >
                        → 100
                    </button>
                    <span className="text-sm font-medium tabular-nums text-gray-500 dark:text-gray-400">
                        {selected.length} / {filtered.length}
                    </span>
                </div>
            </div>

            {/* ── Column headers with sort controls ── */}
            <div className="SelectListHeader">
                <button
                    className={`SelectListHeaderCell SelectListHeaderCellTitle${sortField === 'title' ? ' SelectListHeaderCellActive' : ''}`}
                    onClick={() => {
                        if (sortField === 'title') {
                            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
                        }
                        else {
                            setSortField('title')
                            setSortDir('asc')
                        }
                    }}
                >
                    Title {sortField === 'title' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </button>
                <button
                    className={`SelectListHeaderCell${sortField === 'create_time' ? ' SelectListHeaderCellActive' : ''}`}
                    onClick={() => {
                        if (sortField === 'create_time') {
                            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
                        }
                        else {
                            setSortField('create_time')
                            setSortDir('desc')
                        }
                    }}
                >
                    Created {sortField === 'create_time' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </button>
                <button
                    className={`SelectListHeaderCell${sortField === 'update_time' ? ' SelectListHeaderCellActive' : ''}`}
                    onClick={() => {
                        if (sortField === 'update_time') {
                            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
                        }
                        else {
                            setSortField('update_time')
                            setSortDir('desc')
                        }
                    }}
                >
                    Updated {sortField === 'update_time' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </button>
            </div>

            {/* ── Conversation list ── */}
            <ul className="SelectList">
                {loading && conversations.length === 0 && <li className="SelectItem">{t('Loading')}...</li>}
                {error && <li className="SelectItem">{t('Error')}: {error}</li>}
                {filtered.map((c, index) => {
                    const isSelected = selected.some(x => x.id === c.id)
                    return (
                        <li
                            className="SelectItem"
                            key={c.id}
                            onClickCapture={(e: MouseEvent) => {
                                if (disabled) return
                                if (e.shiftKey && lastClickedIndex.current !== -1) {
                                    e.preventDefault()
                                    const start = Math.min(lastClickedIndex.current, index)
                                    const end = Math.max(lastClickedIndex.current, index)
                                    const rangeItems = filtered.slice(start, end + 1)
                                    const newSelected = [...selected]
                                    for (const item of rangeItems) {
                                        if (!newSelected.some(x => x.id === item.id)) newSelected.push(item)
                                    }
                                    setSelected(newSelected)
                                    return
                                }
                                lastClickedIndex.current = index
                            }}
                        >
                            <CheckBox
                                label={c.title}
                                disabled={disabled}
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                    setSelected(checked ? [...selected, c] : selected.filter(x => x.id !== c.id))
                                }}
                            />
                            {c.is_starred && <span title="Starred" style={{ color: '#f59e0b', flexShrink: 0 }}>★</span>}
                            <span
                                className={`SelectItemMeta${sortField === 'create_time' ? ' SelectItemMetaActive' : ''}`}
                                title={`Created: ${c.create_time ?? '—'}`}
                            >
                                {formatConvDate(c.create_time)}
                            </span>
                            <span
                                className={`SelectItemMeta${sortField === 'update_time' ? ' SelectItemMetaActive' : ''}`}
                                title={`Updated: ${c.update_time ?? '—'}`}
                            >
                                {formatConvDate(c.update_time)}
                            </span>
                        </li>
                    )
                })}
                {!loading && !error && filtered.length === 0 && conversations.length > 0 && (
                    <li className="SelectItem text-gray-400 dark:text-gray-500">{t('No results')}</li>
                )}
            </ul>
        </>
    )
}

// ---------------------------------------------------------------------------
// DialogContent component
// ---------------------------------------------------------------------------

type ExportSource = 'API' | 'Local'

interface DialogContentProps {
    format: string
}

const DialogContent: FC<DialogContentProps> = ({ format }) => {
    const { t } = useTranslation()
    const { enableMeta, exportMetaList, exportAllLimit } = useSettingContext()
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
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [projectsLoading, setProjectsLoading] = useState(false)
    const selectedProject = projects.find(p => p.id === selectedProjectId) ?? null

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [processing, setProcessing] = useState(false)

    const [selected, setSelected] = useState<ApiConversationItem[]>([])
    const [exportType, setExportType] = useState(exportAllOptions[0].label)
    const disabled = processing || !!error || selected.length === 0

    // "Load more" state
    const [hasMore, setHasMore] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [totalAvailable, setTotalAvailable] = useState<number | null>(null)

    const requestQueue = useMemo(() => new RequestQueue<ApiConversationWithId>(200, 1600), [])
    const archiveQueue = useMemo(() => new RequestQueue<boolean>(200, 1600), [])
    const deleteQueue = useMemo(() => new RequestQueue<boolean>(200, 1600), [])

    const [progress, setProgress] = useState({
        total: 0,
        completed: 0,
        currentName: '',
        currentStatus: '' as '' | 'processing' | 'retrying' | 'rate_limited',
        rateLimitWaitSecs: undefined as number | undefined,
        batchIndex: 0,
        totalBatches: 0,
    })

    const pendingBatchesRef = useRef<ApiConversationItem[][]>([])
    const batchIndexRef = useRef(0)
    const totalBatchesRef = useRef(0)
    /** Set to true when the user clicks Cancel — prevents the 'done' handler from starting the next batch */
    const cancelledRef = useRef(false)
    /** Incremented on each new fetch; callbacks check this to discard stale results after remount */
    const fetchGenRef = useRef(0)

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
    }, [t])

    const startApiBatch = useCallback((chunk: ApiConversationItem[]) => {
        requestQueue.clear()
        chunk.forEach(({ id, title }) => {
            requestQueue.add({ name: title, request: () => fetchConversation(id, exportType !== 'JSON') })
        })
        requestQueue.start()
    }, [requestQueue, exportType])

    useEffect(() => {
        const off = requestQueue.on('progress', (prog) => {
            setProcessing(true)
            setProgress({
                ...prog,
                rateLimitWaitSecs: prog.rateLimitWaitSecs,
                batchIndex: batchIndexRef.current,
                totalBatches: totalBatchesRef.current,
                completed: batchIndexRef.current * EXPORT_OPERATION_BATCH + prog.completed,
                total: totalBatchesRef.current * EXPORT_OPERATION_BATCH,
            })
        })
        return () => off()
    }, [requestQueue])

    useEffect(() => {
        const off = archiveQueue.on('progress', (prog) => {
            setProcessing(true)
            setProgress({ ...prog, rateLimitWaitSecs: prog.rateLimitWaitSecs, batchIndex: 0, totalBatches: 0 })
        })
        return () => off()
    }, [archiveQueue])

    useEffect(() => {
        const off = deleteQueue.on('progress', (prog) => {
            setProcessing(true)
            setProgress({ ...prog, rateLimitWaitSecs: prog.rateLimitWaitSecs, batchIndex: 0, totalBatches: 0 })
        })
        return () => off()
    }, [deleteQueue])

    useEffect(() => {
        const off = requestQueue.on('done', async (results) => {
            // If the user cancelled, just stop — don't download or start the next batch
            if (cancelledRef.current) {
                cancelledRef.current = false
                setProcessing(false)
                exportingRef.current = false
                return
            }
            const batchIdx = batchIndexRef.current
            const totalBatches = totalBatchesRef.current
            const partIndex = batchIdx + 1
            const callback = exportAllOptions.find(o => o.label === exportType)?.callback
            if (callback) {
                await callback(format, results, metaList, selectedProject?.display.name, partIndex, totalBatches)
            }
            if (partIndex < totalBatches) {
                await sleep(400)
                batchIndexRef.current++
                const nextChunk = pendingBatchesRef.current[batchIndexRef.current]
                if (nextChunk) startApiBatch(nextChunk)
            }
            else {
                setProcessing(false)
            }
        })
        return () => off()
    }, [requestQueue, exportAllOptions, exportType, format, metaList, startApiBatch, selectedProject])

    useEffect(() => {
        const off = archiveQueue.on('done', () => {
            setProcessing(false)
            setApiConversations(prev => prev.filter(c => !selected.some(s => s.id === c.id)))
            setSelected([])
            alert(t('Conversation Archived Message'))
        })
        return () => off()
    }, [archiveQueue, selected, t])

    useEffect(() => {
        const off = deleteQueue.on('done', () => {
            setProcessing(false)
            setApiConversations(prev => prev.filter(c => !selected.some(s => s.id === c.id)))
            setSelected([])
            alert(t('Conversation Deleted Message'))
        })
        return () => off()
    }, [deleteQueue, selected, t])

    const cancelExport = useCallback(() => {
        cancelledRef.current = true
        requestQueue.stop()
        archiveQueue.stop()
        deleteQueue.stop()
    }, [requestQueue, archiveQueue, deleteQueue])

    const exportAllFromApi = useCallback(() => {
        if (disabled) return
        cancelledRef.current = false
        const chunks = chunkArray(selected, EXPORT_OPERATION_BATCH)
        pendingBatchesRef.current = chunks
        batchIndexRef.current = 0
        totalBatchesRef.current = chunks.length
        setProcessing(true)
        setProgress({
            total: selected.length,
            completed: 0,
            currentName: '',
            currentStatus: 'processing',
            rateLimitWaitSecs: undefined,
            batchIndex: 0,
            totalBatches: chunks.length,
        })
        startApiBatch(chunks[0])
    }, [disabled, selected, startApiBatch])

    const exportAllFromLocal = useCallback(async () => {
        if (disabled) return
        const results = localConversations.filter(c => selected.some(s => s.id === c.id))
        const callback = exportAllOptions.find(o => o.label === exportType)?.callback
        if (!callback) return
        const chunks = chunkArray(results, EXPORT_OPERATION_BATCH)
        setProcessing(true)
        for (let i = 0; i < chunks.length; i++) {
            await callback(format, chunks[i], metaList, selectedProject?.display.name, i + 1, chunks.length)
            if (i < chunks.length - 1) await sleep(400)
        }
        setProcessing(false)
    }, [disabled, selected, localConversations, exportAllOptions, exportType, format, metaList, selectedProject])

    const exportAll = useMemo(() => {
        return exportSource === 'API' ? exportAllFromApi : exportAllFromLocal
    }, [exportSource, exportAllFromApi, exportAllFromLocal])

    const deleteAll = useCallback(() => {
        if (disabled) return
        if (!confirm(t('Conversation Delete Alert'))) return
        deleteQueue.clear()
        selected.forEach(({ id, title }) => {
            deleteQueue.add({ name: title, request: () => deleteConversation(id) })
        })
        deleteQueue.start()
    }, [disabled, selected, deleteQueue, t])

    const archiveAll = useCallback(() => {
        if (disabled) return
        if (!confirm(t('Conversation Archive Alert'))) return
        archiveQueue.clear()
        selected.forEach(({ id, title }) => {
            archiveQueue.add({ name: title, request: () => archiveConversation(id) })
        })
        archiveQueue.start()
    }, [disabled, selected, archiveQueue, t])

    // Cancel any in-flight work when the dialog unmounts to avoid stale-state errors
    useEffect(() => {
        const genRef = fetchGenRef
        return () => {
            exportingRef.current = false
            genRef.current++
            requestQueue.clear()
            archiveQueue.clear()
            deleteQueue.clear()
        }
    }, [requestQueue, archiveQueue, deleteQueue])

    // Sync processing flag so ExportDialog can gate ESC / outside-click
    useEffect(() => {
        exportingRef.current = processing
    }, [processing])

    // Fetch projects on mount
    useEffect(() => {
        setProjectsLoading(true)
        fetchProjects()
            .then(setProjects)
            .catch(err => console.error('Error fetching projects:', err))
            .finally(() => setProjectsLoading(false))
    }, [])

    // Auto-load conversations on dialog open (or when project changes)
    useEffect(() => {
        const gen = ++fetchGenRef.current
        const alive = () => gen === fetchGenRef.current
        setSelected([])
        setApiConversations([])
        setHasMore(false)
        setTotalAvailable(null)
        setLoading(true)
        fetchAllConversations(
            selectedProjectId,
            exportAllLimit,
            (batch) => { if (alive()) setApiConversations(prev => [...prev, ...batch]) },
            (hasMore) => { if (alive()) setHasMore(hasMore) },
        )
            .catch((err: Error) => {
                if (!alive()) return
                console.error('Error fetching conversations:', err)
                setError(err.message || 'Failed to load conversations')
            })
            .finally(() => { if (alive()) setLoading(false) })
    }, [exportAllLimit, selectedProjectId])

    const loadMore = useCallback(async () => {
        if (loadingMore) return
        setLoadingMore(true)
        try {
            const page = await fetchConversationsPage(selectedProjectId, apiConversations.length, EXPORT_OPERATION_BATCH)
            setApiConversations(prev => [...prev, ...page.items])
            if (page.total !== null) setTotalAvailable(page.total)
            setHasMore(
                page.items.length >= EXPORT_OPERATION_BATCH
                && (page.total === null || apiConversations.length + page.items.length < page.total),
            )
        }
        catch (err) {
            console.error('loadMore error', err)
        }
        finally {
            setLoadingMore(false)
        }
    }, [loadingMore, apiConversations.length, selectedProjectId])

    const totalBatches = Math.ceil(selected.length / EXPORT_OPERATION_BATCH) || 1

    // ── API health probe ──────────────────────────────────────────────────────
    type ProbeStatus = null | 'testing' | 'ok' | 'rate_limited' | 'error'
    const [probeStatus, setProbeStatus] = useState<ProbeStatus>(null)
    const [probeRetryAfterSecs, setProbeRetryAfterSecs] = useState<number | undefined>()
    const [probeHeaders, setProbeHeaders] = useState<Record<string, string>>({})

    const runProbe = useCallback(async () => {
        setProbeStatus('testing')
        try {
            const result = await probeApi()
            setProbeHeaders(result.rateLimitHeaders)
            if (result.ok) {
                setProbeStatus('ok')
            }
            else {
                setProbeStatus('rate_limited')
                setProbeRetryAfterSecs(result.retryAfterMs != null ? Math.round(result.retryAfterMs / 1000) : undefined)
            }
        }
        catch {
            setProbeStatus('error')
        }
    }, [])

    const probeLabel = probeStatus === 'testing'
        ? '⏳ Testing…'
        : probeStatus === 'ok'
            ? '✅ API ready'
            : probeStatus === 'rate_limited'
                ? `🚫 Rate limited${probeRetryAfterSecs != null ? ` · wait ${probeRetryAfterSecs}s` : ''}`
                : probeStatus === 'error'
                    ? '⚠️ Error'
                    : null

    return (
        <>
            <Dialog.Title className="DialogTitle">{t('Export Dialog Title')}</Dialog.Title>
            <div className="flex items-center text-gray-600 dark:text-gray-300 flex justify-between border-b-[1px] pb-3 mb-3 dark:border-gray-700">
                {t('Export from official export file')} (conversations.json)&nbsp;
                <div className="flex items-center gap-2">
                    {exportSource === 'API' && (
                        <button
                            className="Button neutral"
                            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                            disabled={probeStatus === 'testing' || processing}
                            title={Object.keys(probeHeaders).length > 0
                                ? `Rate-limit headers: ${JSON.stringify(probeHeaders)}`
                                : 'Check if the API is currently rate-limiting requests'}
                            onClick={runProbe}
                        >
                            {probeLabel ?? 'Test API'}
                        </button>
                    )}
                    {exportSource === 'API' && (
                        <button className="btn relative btn-neutral" onClick={() => fileInputRef.current?.click()}>
                            <IconUpload className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <input
                type="file"
                accept="application/json"
                className="hidden"
                ref={fileInputRef}
                onChange={onUpload}
            />
            {exportSource === 'API' && (
                <ProjectSelect
                    projects={projects}
                    selected={selectedProjectId}
                    setSelected={setSelectedProjectId}
                    disabled={processing}
                    loading={projectsLoading}
                />
            )}
            <ConversationSelect
                conversations={conversations}
                selected={selected}
                setSelected={setSelected}
                disabled={processing}
                loading={loading}
                error={error}
            />

            {/* Load-more button */}
            {exportSource === 'API' && !loading && !processing && hasMore && (
                <div className="flex items-center justify-center mt-2 mb-1 gap-2">
                    <button
                        className="Button neutral"
                        style={{ fontSize: '0.8rem', padding: '4px 14px' }}
                        disabled={loadingMore}
                        onClick={loadMore}
                    >
                        {loadingMore
                            ? `${t('Loading')}...`
                            : totalAvailable !== null
                                ? t('Load more conversations remaining', { n: EXPORT_OPERATION_BATCH, remaining: totalAvailable - apiConversations.length })
                                : t('Load more conversations', { n: EXPORT_OPERATION_BATCH })}
                    </button>
                    {totalAvailable !== null && !loadingMore && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                            {apiConversations.length} / {totalAvailable}
                        </span>
                    )}
                </div>
            )}

            <div className="flex mt-3 items-center gap-2">
                <select
                    className="Select shrink-0"
                    disabled={processing}
                    value={exportType}
                    onChange={e => setExportType(e.currentTarget.value)}
                >
                    {exportAllOptions.map(({ label }) => (
                        <option key={t(label)} value={label}>{label}</option>
                    ))}
                </select>
                <div className="flex flex-grow"></div>
                <button className="Button red" disabled={disabled || exportSource === 'Local'} onClick={archiveAll}>
                    {t('Archive')}
                </button>
                <button className="Button red" disabled={disabled || exportSource === 'Local'} onClick={deleteAll}>
                    {t('Delete')}
                </button>
                <button className="Button green" disabled={disabled} onClick={exportAll}>
                    {t('Export')}
                </button>
            </div>
            {totalBatches > 1 && !processing && (
                <p className="mt-1.5 text-xs text-right text-gray-400 dark:text-gray-500">
                    {`${totalBatches} downloads \u00B7 100 conversations each`}
                </p>
            )}
            {processing && (
                <>
                    <div className="mt-2 mb-1 justify-between flex items-center gap-2">
                        <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                            {progress.currentStatus === 'rate_limited'
                                ? `⏳ Rate limited — waiting ${progress.rateLimitWaitSecs ?? '…'}s`
                                : progress.currentName}
                        </span>
                        <span className="shrink-0 tabular-nums text-sm text-gray-500 dark:text-gray-400">
                            {progress.totalBatches > 1
                                ? `${t('Batch progress').replace('{{current}}', String(progress.batchIndex + 1)).replace('{{total}}', String(progress.totalBatches))} \u00B7 ${progress.completed}/${progress.total}`
                                : `${progress.completed}/${progress.total}`}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                        <div
                            className={`h-2.5 rounded-full ${progress.currentStatus === 'rate_limited' ? 'bg-amber-500' : 'bg-blue-600'}`}
                            style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                        />
                    </div>
                </>
            )}
            {processing
                ? (
                    <>
                        <button
                            className="Button"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '40px',
                                fontSize: '0.75rem',
                                padding: '3px 10px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                            title="Stop the export — any batches already downloaded are kept"
                            onClick={cancelExport}
                        >
                            Cancel
                        </button>
                        <button
                            className="IconButton CloseButton"
                            aria-label="Export in progress"
                            title="Click Cancel to stop the export"
                            style={{ cursor: 'not-allowed', opacity: 0.25 }}
                        >
                            <IconCross />
                        </button>
                    </>
                    )
                : (
                    <Dialog.Close asChild>
                        <button className="IconButton CloseButton" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                    )}
        </>
    )
}

// ---------------------------------------------------------------------------
// ExportDialog (root)
// ---------------------------------------------------------------------------

interface ExportDialogProps {
    format: string
    open: boolean
    onOpenChange: (value: boolean) => void
}

export const ExportDialog: FC<ExportDialogProps> = ({ format, open, onOpenChange, children }) => {
    const guardClose = (e: Event) => {
        if (exportingRef.current) e.preventDefault()
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(val: boolean) => {
                if (!val && exportingRef.current) return // block close while exporting
                onOpenChange(val)
            }}
        >
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content
                    className="DialogContent"
                    onEscapeKeyDown={guardClose}
                    onInteractOutside={guardClose}
                >
                    {open && <DialogContent format={format} />}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
