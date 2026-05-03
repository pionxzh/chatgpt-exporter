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
// Filter chip system types & constants
// ---------------------------------------------------------------------------

/** Sentinel string used to encode a null origin value in picker selection arrays */
const NULL_ORIGIN_ID = '__web_app__'

type DateFilterField = 'create_time' | 'update_time'
type ChipMode = 'include' | 'exclude'

/** Which "page" the picker popover is on */
type PickerView = 'root' | 'chat_class' | 'origin' | 'project' | 'status'

/**
 * Each chip is one filter constraint.
 * Multi-value chips (chat_class, origin, project, status) accept arrays of values
 * and match if ANY value matches (OR within chip, AND/OR across chips).
 * The `date` chip is always AND-combined with everything else.
 */
type FilterChipDef =
    | { type: 'chat_class'; values: ('regular' | 'gpt' | 'project')[]; mode: ChipMode }
    | { type: 'origin'; values: (string | null)[]; mode: ChipMode }
    | { type: 'project'; projectIds: string[]; mode: ChipMode }
    | { type: 'status'; values: ('starred' | 'temporary' | 'pinned')[]; mode: ChipMode }
    | { type: 'duration_gte'; days: number; mode: ChipMode }
    | { type: 'recency_lte'; days: number; mode: ChipMode }
    | { type: 'date'; field: DateFilterField; from: string; to: string }

/** Static sub-options for the Chat class picker stage */
const CHAT_CLASS_SUB_OPTIONS = [
    { id: 'regular', label: '💬 Regular', desc: 'Standard chats with no GPT or Project' },
    { id: 'gpt', label: '🤖 GPT', desc: 'Used a GPT Store AI' },
    { id: 'project', label: '📂 Project', desc: 'Any conversation in a Project' },
]

/** Static sub-options for the Status picker stage */
const STATUS_SUB_OPTIONS = [
    { id: 'starred', label: '⭐ Starred', desc: 'Starred conversations' },
    { id: 'temporary', label: '💬 Temporary', desc: 'Temporary chats not saved to history' },
    { id: 'pinned', label: '📌 Pinned', desc: 'Pinned conversations' },
]

/** Date chip preset definitions */
const DATE_PRESETS = [
    { days: 7, label: '7d' },
    { days: 30, label: '30d' },
    { days: 90, label: '90d' },
    { days: 365, label: 'Year' },
]

/** Root picker entries — each becomes one chip type */
const ROOT_PICKER_ITEMS = [
    { id: 'chat_class' as const, label: '💬 Chat class', desc: 'Regular, GPT, or Project chats', hasSubView: true },
    { id: 'origin' as const, label: '🌐 Origin', desc: 'How the conversation was started', hasSubView: true },
    { id: 'project' as const, label: '📂 Project', desc: 'Filter by specific project', hasSubView: true },
    { id: 'status' as const, label: '⭐ Status', desc: 'Starred, Temporary, or Pinned', hasSubView: true },
    { id: 'duration_gte' as const, label: '⏱ Duration', desc: 'Long conversation (≥ N days)', hasSubView: false },
    { id: 'recency_lte' as const, label: '📅 Recency', desc: 'Recently updated (< N days)', hasSubView: false },
    { id: 'date' as const, label: '📅 Date range', desc: 'Filter by created or updated date', hasSubView: false },
]

// ---------------------------------------------------------------------------
// Filter chip helpers
// ---------------------------------------------------------------------------

/** Only one chip of each type is allowed */
function isChipDuplicate(chips: FilterChipDef[], candidate: FilterChipDef): boolean {
    return chips.some(c => c.type === candidate.type)
}

/** Return the picker selection IDs (encoded strings) for an existing chip */
function getChipEncodedSelections(chip: FilterChipDef): string[] {
    switch (chip.type) {
        case 'chat_class': return chip.values
        case 'origin': return chip.values.map(v => v === null ? NULL_ORIGIN_ID : v)
        case 'project': return chip.projectIds
        case 'status': return chip.values
        default: return []
    }
}

/** Build a chip from the picker sub-view state (after user selects values) */
function makeChipFromPickerState(
    view: Exclude<PickerView, 'root'>,
    selections: string[],
    mode: ChipMode,
): FilterChipDef {
    switch (view) {
        case 'chat_class':
            return { type: 'chat_class', values: selections as ('regular' | 'gpt' | 'project')[], mode }
        case 'origin':
            return { type: 'origin', values: selections.map(s => s === NULL_ORIGIN_ID ? null : s), mode }
        case 'project':
            return { type: 'project', projectIds: selections, mode }
        case 'status':
            return { type: 'status', values: selections as ('starred' | 'temporary' | 'pinned')[], mode }
    }
}

/** Human-readable summary of a chip's selected values (shown in chip bar) */
function getChipValueLabel(chip: FilterChipDef, projects: ApiProjectInfo[]): string | null {
    switch (chip.type) {
        case 'chat_class': {
            if (chip.values.length === 0) return 'none'
            if (chip.values.length === 3) return 'all types'
            const lbl: Record<string, string> = { regular: '💬 Regular', gpt: '🤖 GPT', project: '📂 Project' }
            return chip.values.map(v => lbl[v]).join(', ')
        }
        case 'origin': {
            if (chip.values.length === 0) return 'none'
            return chip.values
                .map(v => v === null ? 'Web/App' : v.charAt(0).toUpperCase() + v.slice(1))
                .join(', ')
        }
        case 'project': {
            if (chip.projectIds.length === 0) return 'any project'
            return chip.projectIds
                .map(id => projects.find(p => p.id === id)?.display.name ?? id.slice(0, 8))
                .join(', ')
        }
        case 'status': {
            if (chip.values.length === 0) return 'none'
            const lbl: Record<string, string> = { starred: '⭐ Starred', temporary: '💬 Temp', pinned: '📌 Pinned' }
            return chip.values.map(v => lbl[v]).join(', ')
        }
        default:
            return null
    }
}

/** Short prefix label shown before the value in a multi-select chip */
function getChipTypePrefix(type: FilterChipDef['type']): string {
    if (type === 'chat_class') return '💬 Chat'
    if (type === 'origin') return '🌐 Origin'
    if (type === 'project') return '📂 Project'
    if (type === 'status') return '⭐ Status'
    return ''
}

/** Heading text for the picker's sub-view back button */
function getPickerViewTitle(view: PickerView): string {
    if (view === 'chat_class') return 'Chat class'
    if (view === 'origin') return 'Origin'
    if (view === 'project') return 'Project'
    if (view === 'status') return 'Status'
    return ''
}

// ---------------------------------------------------------------------------
// Filtering logic
// ---------------------------------------------------------------------------

function matchDateChip(
    c: ApiConversationItem,
    chip: Extract<FilterChipDef, { type: 'date' }>,
): boolean {
    if (chip.from) {
        const fromMs = new Date(chip.from).getTime()
        if (!Number.isNaN(fromMs) && toMs(c[chip.field]) < fromMs) return false
    }
    if (chip.to) {
        const toEndMs = new Date(`${chip.to}T23:59:59.999`).getTime()
        if (!Number.isNaN(toEndMs) && toMs(c[chip.field]) > toEndMs) return false
    }
    return true
}

function matchFilterChip(
    c: ApiConversationItem,
    chip: Exclude<FilterChipDef, { type: 'date' }>,
    projectIdSet: Set<string>,
): boolean {
    let raw = true
    switch (chip.type) {
        case 'chat_class': {
            if (chip.values.length === 0) break
            const gizmoId = c.gizmo_id ?? null
            const isProject = gizmoId !== null && projectIdSet.has(gizmoId)
            const isGpt = gizmoId !== null && !isProject
            raw = chip.values.some((v) => {
                if (v === 'regular') return gizmoId === null
                if (v === 'project') return isProject
                return isGpt
            })
            break
        }
        case 'origin': {
            if (chip.values.length === 0) break
            raw = chip.values.some((v) => {
                if (v === null) return (c.conversation_origin ?? null) === null
                return c.conversation_origin === v
            })
            break
        }
        case 'project': {
            if (chip.projectIds.length === 0) break
            raw = c.gizmo_id != null && chip.projectIds.includes(c.gizmo_id)
            break
        }
        case 'status': {
            if (chip.values.length === 0) break
            raw = chip.values.some((v) => {
                if (v === 'starred') return c.is_starred === true
                if (v === 'temporary') return c.is_temporary_chat === true
                return c.pinned_time != null
            })
            break
        }
        case 'duration_gte':
            raw = toMs(c.update_time) - toMs(c.create_time) >= chip.days * 86_400_000
            break
        case 'recency_lte':
            raw = Date.now() - toMs(c.update_time) <= chip.days * 86_400_000
            break
    }
    return chip.mode === 'include' ? raw : !raw
}

function applyChips(
    conversations: ApiConversationItem[],
    chips: FilterChipDef[],
    logic: 'AND' | 'OR',
    projects: ApiProjectInfo[],
): ApiConversationItem[] {
    if (chips.length === 0) return conversations
    const projectIdSet = new Set(projects.map(p => p.id))
    type NonDate = Exclude<FilterChipDef, { type: 'date' }>
    const dateChip = chips.find((c): c is Extract<FilterChipDef, { type: 'date' }> => c.type === 'date')
    const other = chips.filter((c): c is NonDate => c.type !== 'date')
    let result = conversations
    if (dateChip) result = result.filter(c => matchDateChip(c, dateChip))
    if (other.length === 0) return result
    return logic === 'AND'
        ? result.filter(c => other.every(chip => matchFilterChip(c, chip, projectIdSet)))
        : result.filter(c => other.some(chip => matchFilterChip(c, chip, projectIdSet)))
}

// ---------------------------------------------------------------------------
// ConversationSelect component
// ---------------------------------------------------------------------------

interface ConversationSelectProps {
    conversations: ApiConversationItem[]
    projects: ApiProjectInfo[]
    selected: ApiConversationItem[]
    setSelected: (selected: ApiConversationItem[]) => void
    disabled: boolean
    loading: boolean
    error: string
}

const ConversationSelect: FC<ConversationSelectProps> = ({
    conversations,
    projects,
    selected,
    setSelected,
    disabled,
    loading,
    error,
}) => {
    const { t } = useTranslation()
    const [query, setQuery] = useState('')
    const [chips, setChips] = useState<FilterChipDef[]>([])
    const [chipLogic, setChipLogic] = useState<'AND' | 'OR'>('AND')
    const [showPopover, setShowPopover] = useState(false)
    const [pickerView, setPickerView] = useState<PickerView>('root')
    const [pickerSelections, setPickerSelections] = useState<string[]>([])
    const [editingChipIndex, setEditingChipIndex] = useState<number | null>(null)
    const lastClickedIndex = useRef<number>(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)
    /** Set to true before clicking a chip-edit button to prevent blur from closing the picker */
    const skipNextBlur = useRef(false)
    /** Offset for the "Next 100 from #N" resume control */
    const [skipFirst, setSkipFirst] = useState(0)
    /** Column the list is currently sorted by */
    const [sortField, setSortField] = useState<'title' | 'create_time' | 'update_time'>('create_time')
    /** Sort direction for the active column */
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

    // ── Dynamic sub-options ──

    /** Origin values discovered from loaded conversations */
    const originSubOptions = useMemo(() => {
        const map = new Map<string, string>()
        for (const c of conversations) {
            const val = c.conversation_origin ?? null
            const id = val === null ? NULL_ORIGIN_ID : val
            if (!map.has(id)) {
                const label = val === null ? 'Web / App' : val.charAt(0).toUpperCase() + val.slice(1)
                map.set(id, label)
            }
        }
        return [...map.entries()].map(([id, label]) => ({
            id,
            label: `🌐 ${label}`,
            desc: id === NULL_ORIGIN_ID ? 'Web app or mobile app' : `Started via ${label}`,
        }))
    }, [conversations])

    /** Project names from the fetched project list */
    const projectSubOptions = useMemo(
        () => projects.map(p => ({ id: p.id, label: `📂 ${p.display.name}`, desc: '' })),
        [projects],
    )

    /** Sub-options for the currently active picker stage */
    const currentSubOptions = useMemo(() => {
        if (pickerView === 'chat_class') return CHAT_CLASS_SUB_OPTIONS
        if (pickerView === 'origin') return originSubOptions
        if (pickerView === 'project') return projectSubOptions
        if (pickerView === 'status') return STATUS_SUB_OPTIONS
        return []
    }, [pickerView, originSubOptions, projectSubOptions])

    /** Root options filtered to hide chip types already added */
    const rootOptions = useMemo(
        () => ROOT_PICKER_ITEMS.filter(opt => !chips.some(c => c.type === opt.id)),
        [chips],
    )

    // ── Filtering ──

    const filtered = useMemo(() => {
        let result = conversations
        const q = query.trim().replace(/#$/, '').trim()
        if (q) result = result.filter(c => textSearch(c.title, q))
        result = applyChips(result, chips, chipLogic, projects)
        // Apply user-chosen sort
        const dir = sortDir === 'asc' ? 1 : -1
        return [...result].sort((a, b) => {
            if (sortField === 'title') {
                return dir * (a.title ?? '').localeCompare(b.title ?? '')
            }
            const aMs = toMs(sortField === 'update_time' ? a.update_time : a.create_time)
            const bMs = toMs(sortField === 'update_time' ? b.update_time : b.create_time)
            return dir * (aMs - bMs)
        })
    }, [conversations, query, chips, chipLogic, projects, sortField, sortDir])

    const allFilteredSelected = filtered.length > 0 && filtered.every(c => selected.some(x => x.id === c.id))

    /** Chips that participate in AND/OR logic (excludes the date chip) */
    const nonDateChips = useMemo(() => chips.filter(c => c.type !== 'date'), [chips])

    // ── Chip callbacks ──

    const updateChip = useCallback((index: number, updated: FilterChipDef) => {
        setChips(prev => prev.map((c, i) => i === index ? updated : c))
    }, [])

    const removeChip = useCallback((index: number) => {
        setChips(prev => prev.filter((_, i) => i !== index))
    }, [])

    const toggleChipMode = useCallback((index: number) => {
        setChips(prev => prev.map((c, i) => {
            if (i !== index || c.type === 'date') return c
            return { ...c, mode: c.mode === 'include' ? 'exclude' : 'include' } as FilterChipDef
        }))
    }, [])

    // ── Date chip helpers ──

    const dateChip = useMemo(
        () => chips.find((c): c is Extract<FilterChipDef, { type: 'date' }> => c.type === 'date'),
        [chips],
    )

    const updateDateChip = useCallback((updates: Partial<{ field: DateFilterField; from: string; to: string }>) => {
        setChips(prev => prev.map((c) => {
            if (c.type !== 'date') return c
            return { ...c, ...updates }
        }))
    }, [])

    const setDatePreset = useCallback((days: number) => {
        const d = new Date()
        const from = new Date(d.getTime() - days * 86_400_000).toISOString().slice(0, 10)
        const to = d.toISOString().slice(0, 10)
        setChips(prev => prev.map((c) => {
            if (c.type !== 'date') return c
            return { ...c, from, to }
        }))
    }, [])

    const removeDateChip = useCallback(() => {
        setChips(prev => prev.filter(c => c.type !== 'date'))
    }, [])

    // ── Picker callbacks ──

    const closePicker = useCallback(() => {
        setShowPopover(false)
        setPickerView('root')
        setPickerSelections([])
        setEditingChipIndex(null)
    }, [])

    const togglePickerSelection = useCallback((id: string) => {
        setPickerSelections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
        )
    }, [])

    const applyPickerSelections = useCallback(() => {
        if (pickerView === 'root') return
        let mode: ChipMode = 'include'
        if (editingChipIndex !== null) {
            const existing = chips[editingChipIndex]
            if (existing && existing.type !== 'date') mode = existing.mode
        }
        const newChip = makeChipFromPickerState(pickerView, pickerSelections, mode)
        if (editingChipIndex !== null) {
            updateChip(editingChipIndex, newChip)
        }
        else if (!isChipDuplicate(chips, newChip)) {
            setChips(prev => [...prev, newChip])
        }
        setQuery(q => q.endsWith('#') ? q.slice(0, -1) : q)
        closePicker()
    }, [pickerView, pickerSelections, editingChipIndex, chips, updateChip, closePicker])

    /**
     * Open the picker sub-view for an existing chip, pre-populated with its current values.
     * Call `searchInputRef.current?.focus()` after to keep the input focused.
     */
    const openPickerForEdit = useCallback((index: number) => {
        const chip = chips[index]
        if (!chip) return
        if (chip.type === 'date' || chip.type === 'duration_gte' || chip.type === 'recency_lte') return
        setPickerSelections(getChipEncodedSelections(chip))
        setPickerView(chip.type as Exclude<PickerView, 'root'>)
        setEditingChipIndex(index)
        setShowPopover(true)
    }, [chips])

    /** Add a simple chip (no sub-view required) directly from the root picker */
    const addImmediateChip = useCallback((type: 'duration_gte' | 'recency_lte' | 'date') => {
        let chip: FilterChipDef
        if (type === 'duration_gte') {
            chip = { type: 'duration_gte', days: 7, mode: 'include' }
        }
        else if (type === 'recency_lte') {
            chip = { type: 'recency_lte', days: 30, mode: 'include' }
        }
        else {
            chip = { type: 'date', field: 'create_time', from: '', to: '' }
        }
        if (!isChipDuplicate(chips, chip)) {
            setChips(prev => [...prev, chip])
        }
        setQuery(q => q.endsWith('#') ? q.slice(0, -1) : q)
        closePicker()
    }, [chips, closePicker])

    const handleSearchBlur = useCallback(() => {
        setTimeout(() => {
            if (skipNextBlur.current) {
                skipNextBlur.current = false
                return
            }
            closePicker()
        }, 200)
    }, [closePicker])

    /** Back button in picker sub-view: cancel edit or return to root */
    const handlePickerBack = useCallback(() => {
        if (editingChipIndex !== null) {
            closePicker()
        }
        else {
            setPickerView('root')
            setPickerSelections([])
        }
    }, [editingChipIndex, closePicker])

    return (
        <>
            {/* ── Chip bar ── */}
            {chips.length > 0 && (
                <div className="SelectChips">
                    {/* AND / OR toggle — shown when ≥2 non-date chips */}
                    {nonDateChips.length > 1 && (
                        <button
                            className={`SelectChipLogic${chipLogic === 'OR' ? ' SelectChipLogicOr' : ''}`}
                            title="Toggle AND / OR logic between filters"
                            onClick={() => setChipLogic(l => l === 'AND' ? 'OR' : 'AND')}
                        >
                            {chipLogic === 'AND' ? t('Chip logic and') : t('Chip logic or')}
                        </button>
                    )}

                    {chips.map((chip, i) => {
                        if (chip.type === 'date') return null
                        const isExclude = chip.mode === 'exclude'
                        const chipClass = `SelectChip${isExclude ? ' SelectChipExclude' : ''}`
                        const modeClass = `SelectChipMode${isExclude ? ' SelectChipModeExclude' : ''}`
                        const modeLabel = isExclude ? t('Chip mode exclude') : t('Chip mode include')

                        if (chip.type === 'duration_gte') {
                            return (
                                <span key={i} className={chipClass}>
                                    {t('Chip duration prefix')}&nbsp;
                                    <input
                                        type="number"
                                        min="1"
                                        value={chip.days}
                                        onChange={e => updateChip(i, {
                                            type: 'duration_gte',
                                            days: Math.max(1, Number(e.currentTarget.value)),
                                            mode: chip.mode,
                                        })}
                                    />
                                    {t('Chip duration suffix')}
                                    <button
                                        className={modeClass}
                                        title="Toggle include/exclude"
                                        onClick={() => toggleChipMode(i)}
                                    >
                                        {modeLabel}
                                    </button>
                                    <button className="SelectChipRemove" onClick={() => removeChip(i)}>×</button>
                                </span>
                            )
                        }

                        if (chip.type === 'recency_lte') {
                            return (
                                <span key={i} className={chipClass}>
                                    {t('Chip recency prefix')}&nbsp;
                                    <input
                                        type="number"
                                        min="1"
                                        value={chip.days}
                                        onChange={e => updateChip(i, {
                                            type: 'recency_lte',
                                            days: Math.max(1, Number(e.currentTarget.value)),
                                            mode: chip.mode,
                                        })}
                                    />
                                    {t('Chip recency suffix')}
                                    <button
                                        className={modeClass}
                                        title="Toggle include/exclude"
                                        onClick={() => toggleChipMode(i)}
                                    >
                                        {modeLabel}
                                    </button>
                                    <button className="SelectChipRemove" onClick={() => removeChip(i)}>×</button>
                                </span>
                            )
                        }

                        // Multi-select chip — chip type label + clickable value label
                        const prefix = getChipTypePrefix(chip.type)
                        const valueLabel = getChipValueLabel(chip, projects) ?? ''
                        return (
                            <span key={i} className={chipClass}>
                                <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>{prefix}:</span>&nbsp;
                                <button
                                    className="SelectChipValueBtn"
                                    title="Click to edit values"
                                    onMouseDown={() => { skipNextBlur.current = true }}
                                    onClick={() => {
                                        openPickerForEdit(i)
                                        searchInputRef.current?.focus()
                                    }}
                                >
                                    {valueLabel}
                                </button>
                                <button
                                    className={modeClass}
                                    title="Toggle include/exclude"
                                    onClick={() => toggleChipMode(i)}
                                >
                                    {modeLabel}
                                </button>
                                <button className="SelectChipRemove" onClick={() => removeChip(i)}>×</button>
                            </span>
                        )
                    })}

                    {/* Date chip — always rendered as a full-width row */}
                    {dateChip && (
                        <div className="SelectChipDateRow">
                            <span>📅</span>
                            <select
                                value={dateChip.field}
                                onChange={e => updateDateChip({ field: e.currentTarget.value as DateFilterField })}
                            >
                                <option value="create_time">{t('Date Filter Field Created')}</option>
                                <option value="update_time">{t('Date Filter Field Updated')}</option>
                            </select>
                            <input
                                type="date"
                                value={dateChip.from}
                                onChange={e => updateDateChip({ from: e.currentTarget.value })}
                            />
                            <span>–</span>
                            <input
                                type="date"
                                value={dateChip.to}
                                onChange={e => updateDateChip({ to: e.currentTarget.value })}
                            />
                            <div className="SelectChipDatePresets">
                                {DATE_PRESETS.map(p => (
                                    <button
                                        key={p.days}
                                        onMouseDown={(e) => { e.preventDefault() }}
                                        onClick={() => setDatePreset(p.days)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                                {(dateChip.from || dateChip.to) && (
                                    <button
                                        onMouseDown={(e) => { e.preventDefault() }}
                                        onClick={() => updateDateChip({ from: '', to: '' })}
                                    >
                                        {t('Clear filter')}
                                    </button>
                                )}
                            </div>
                            <button
                                className="SelectChipRemove"
                                style={{ marginLeft: 'auto' }}
                                onClick={removeDateChip}
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Search input + Picker popover ── */}
            <div className="relative">
                <input
                    ref={searchInputRef}
                    type="search"
                    className="SelectSearch"
                    style={chips.length > 0 ? { borderRadius: 0 } : undefined}
                    placeholder={chips.length > 0 ? t('Search') : `${t('Search')} — ${t('Filters hint')}`}
                    value={query}
                    disabled={disabled}
                    onInput={(e) => {
                        const val = (e.currentTarget as HTMLInputElement).value
                        lastClickedIndex.current = -1
                        setQuery(val)
                        if (val.endsWith('#') && rootOptions.length > 0) {
                            setShowPopover(true)
                            setPickerView('root')
                            setPickerSelections([])
                            setEditingChipIndex(null)
                        }
                        else if (!val.includes('#')) {
                            setShowPopover(false)
                        }
                    }}
                    onBlur={handleSearchBlur}
                />

                {/* Root picker: list of chip categories */}
                {showPopover && pickerView === 'root' && (
                    <div className="SelectFilterPopover">
                        {rootOptions.map(opt => (
                            <button
                                key={opt.id}
                                className="SelectFilterOption"
                                onMouseDown={(e) => { e.preventDefault() }}
                                onClick={() => {
                                    if (opt.hasSubView) {
                                        setPickerView(opt.id as PickerView)
                                        setPickerSelections([])
                                    }
                                    else {
                                        addImmediateChip(opt.id as 'duration_gte' | 'recency_lte' | 'date')
                                    }
                                }}
                            >
                                <strong>{opt.label}</strong>
                                <small>{opt.desc}</small>
                            </button>
                        ))}
                    </div>
                )}

                {/* Sub-view picker: checkboxes + apply button */}
                {showPopover && pickerView !== 'root' && (
                    <div className="SelectFilterPopover">
                        <button
                            className="SelectFilterBack"
                            onMouseDown={(e) => { e.preventDefault() }}
                            onClick={handlePickerBack}
                        >
                            ← {getPickerViewTitle(pickerView)}
                        </button>
                        {currentSubOptions.length === 0 && pickerView === 'project' && (
                            <div
                                className="SelectFilterOption"
                                style={{ color: '#9ca3af', cursor: 'default' }}
                            >
                                {t('Loading')}...
                            </div>
                        )}
                        {currentSubOptions.map((opt) => {
                            const isSelected = pickerSelections.includes(opt.id)
                            return (
                                <button
                                    key={opt.id}
                                    className={`SelectFilterCheckboxBtn${isSelected ? ' SelectFilterCheckboxBtnChecked' : ''}`}
                                    onMouseDown={(e) => { e.preventDefault() }}
                                    onClick={() => togglePickerSelection(opt.id)}
                                >
                                    <span className="SelectFilterCheckIcon">
                                        {isSelected ? '●' : '○'}
                                    </span>
                                    <div>
                                        <strong>{opt.label}</strong>
                                        {opt.desc && (
                                            <small style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af' }}>
                                                {opt.desc}
                                            </small>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                        <button
                            className="SelectFilterApplyBtn"
                            disabled={pickerSelections.length === 0}
                            onMouseDown={(e) => { e.preventDefault() }}
                            onClick={applyPickerSelections}
                        >
                            {editingChipIndex !== null ? 'Update filter' : 'Add filter'}
                        </button>
                    </div>
                )}
            </div>

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
                await callback(format, results, metaList, undefined, partIndex, totalBatches)
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
    }, [requestQueue, exportAllOptions, exportType, format, metaList, startApiBatch])

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
            await callback(format, chunks[i], metaList, undefined, i + 1, chunks.length)
            if (i < chunks.length - 1) await sleep(400)
        }
        setProcessing(false)
    }, [disabled, selected, localConversations, exportAllOptions, exportType, format, metaList])

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

    // Fetch projects for chat-class chip resolution
    useEffect(() => {
        fetchProjects()
            .then(setProjects)
            .catch(err => console.error('Failed to fetch projects:', err))
    }, [])

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

    // Auto-load conversations on dialog open
    useEffect(() => {
        const gen = ++fetchGenRef.current
        const alive = () => gen === fetchGenRef.current
        setSelected([])
        setApiConversations([])
        setHasMore(false)
        setTotalAvailable(null)
        setLoading(true)
        fetchAllConversations(
            null,
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
    }, [exportAllLimit])

    const loadMore = useCallback(async () => {
        if (loadingMore) return
        setLoadingMore(true)
        try {
            const page = await fetchConversationsPage(null, apiConversations.length, EXPORT_OPERATION_BATCH)
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
    }, [loadingMore, apiConversations.length])

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
            <ConversationSelect
                conversations={conversations}
                projects={projects}
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
