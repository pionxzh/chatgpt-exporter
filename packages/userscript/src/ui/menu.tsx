import type { JSXInternal } from 'preact/src/jsx'
import { useCallback, useEffect, useState } from 'preact/hooks'
import * as Dialog from '@radix-ui/react-dialog'
import sanitize from 'sanitize-filename'
import type { FC } from '../type'
import { exportToText } from '../exporter/text'
import { exportToPng } from '../exporter/image'
import { exportAllToMarkdown, exportToMarkdown } from '../exporter/markdown'
import { exportAllToHtml, exportToHtml } from '../exporter/html'
import { exportAllToJson, exportToJson } from '../exporter/json'
import { useGMStorage } from '../useGMStorage'
import { dateStr, timestamp } from '../utils/utils'
import { getFileNameWithFormat } from '../utils/download'
import { getHistoryDisabled } from '../page'
import { type ApiConversationItem, fetchAllConversations } from '../api'
import { Divider } from './Divider'
import { Dropdown } from './Dropdown'
import { MenuItem } from './MenuItem'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconCross, IconJSON, IconMarkdown, IconSetting, IconZip } from './icons'
import { useTitle } from './useTitle'
import { CheckBox } from './CheckBox'

import './missing-tailwind.css'
import '../style.css'
import './dialog.css'

const KEY = 'exporter-format'
const defaultFormat = 'ChatGPT-{title}'

const SettingDialog: FC<{ format: string; setFormat: (value: string) => void }> = ({ format, setFormat, children }) => {
    const handleChange: JSXInternal.GenericEventHandler<HTMLInputElement> = (e) => {
        setFormat(e.currentTarget.value)
    }

    const _title = useTitle()
    const title = sanitize(_title).replace(/\s+/g, '_')

    const preview = getFileNameWithFormat(format, '{ext}', { title })

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Exporter Setting</Dialog.Title>
                    <div className="Description">
                        Available variables:&nbsp;
                        <span className="cursor-help select-all" title={title}>{'{title}'}</span>
                        ,&nbsp;
                        <span className="cursor-help select-all" title={dateStr()}>{'{date}'}</span>
                        ,&nbsp;
                        <span className="cursor-help select-all" title={timestamp()}>{'{timestamp}'}</span>
                    </div>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="filename">
                            File Name
                        </label>
                        <input className="Input" id="filename" value={format} onChange={handleChange} />
                    </fieldset>
                    <div className="Description">
                        Preview:&nbsp;
                        <span className="select-all" style={{ 'text-decoration': 'underline', 'text-underline-offset': 4 }}>{preview}</span>
                    </div>
                    <div className="flex mt-6" style={{ justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <button className="Button green">Save</button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

const exportAllOptions = [
    { label: 'Markdown', callback: exportAllToMarkdown },
    { label: 'JSON', callback: exportAllToJson },
    { label: 'HTML', callback: exportAllToHtml },
]
const ExportDialog: FC<{ format: string }> = ({ format, children }) => {
    const [conversations, setConversations] = useState<ApiConversationItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [selected, setSelected] = useState<string[]>([])
    const [exportType, setExportType] = useState(exportAllOptions[0].label)
    const disabled = loading || !!error || selected.length === 0

    const exportAll = useCallback(() => {
        if (disabled) return

        const callback = exportAllOptions.find(o => o.label === exportType)?.callback
        if (callback) callback(format, selected)
    }, [disabled, exportType, format, selected])

    useEffect(() => {
        setLoading(true)
        fetchAllConversations()
            .then(setConversations)
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Export Conversations</Dialog.Title>
                    <div className="SelectToolbar">
                        <CheckBox
                            label="Select All"
                            checked={selected.length === conversations.length}
                            onCheckedChange={(checked) => {
                                setSelected(checked ? conversations.map(c => c.id) : [])
                            }}
                        />
                    </div>
                    <ul className="SelectList">
                        {loading && <li className="SelectItem">Loading...</li>}
                        {error && <li className="SelectItem">Error: {error}</li>}
                        {conversations.map(c => (
                            <li className="SelectItem" key={c.id}>
                                <CheckBox
                                    label={c.title}
                                    checked={selected.includes(c.id)}
                                    onCheckedChange={(checked) => {
                                        setSelected(checked
                                            ? [...selected, c.id]
                                            : selected.filter(id => id !== c.id),
                                        )
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                    <div className="flex mt-6" style={{ justifyContent: 'space-between' }}>
                        <select className="Select" value={exportType} onChange={e => setExportType(e.currentTarget.value)}>
                            {exportAllOptions.map(({ label }) => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <button className="Button green" disabled={disabled} onClick={exportAll}>
                            Export
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export function Menu() {
    const disabled = getHistoryDisabled()
    const menuText = disabled ? 'Exporter unavailable' : 'Export'
    const menuTitle = disabled ? 'Exporter is relying on the History API.\nBut History feature is disabled by OpenAI temporarily.\nWe all have to wait for them to bring it back.' : ''

    const [format, setFormat] = useGMStorage(KEY, defaultFormat)

    const onClickText = useCallback(() => exportToText(), [])
    const onClickPng = useCallback(() => exportToPng(format), [format])
    const onClickMarkdown = useCallback(() => exportToMarkdown(format), [format])
    const onClickHtml = useCallback(() => exportToHtml(format), [format])
    const onClickJSON = useCallback(() => exportToJson(format), [format])

    return (
        <div id="exporter-menu" className="pt-1 relative" disabled={disabled} title={menuTitle}>
            <MenuItem
                text={menuText}
                icon={IconArrowRightFromBracket}
                disabled={disabled}
            />
            <Dropdown>
                <SettingDialog format={format} setFormat={setFormat}>
                    <div className="row-full">
                        <MenuItem text="Setting" icon={IconSetting} />
                    </div>
                </SettingDialog>

                <MenuItem
                    text="Copy Text"
                    successText="Copied!"
                    icon={IconCopy}
                    className="row-full"
                    onClick={onClickText}
                />
                <MenuItem
                    text="Screenshot"
                    icon={IconCamera}
                    className="row-half"
                    onClick={onClickPng}
                />
                <MenuItem
                    text="Markdown"
                    icon={IconMarkdown}
                    className="row-half"
                    onClick={onClickMarkdown}
                />
                <MenuItem
                    text="HTML"
                    icon={FileCode}
                    className="row-half"
                    onClick={onClickHtml}
                />
                <MenuItem
                    text="JSON"
                    icon={IconJSON}
                    className="row-half"
                    onClick={onClickJSON}
                />
                <ExportDialog format={format}>
                    <div className="row-full">
                        <MenuItem
                            text="Export All"
                            icon={IconZip}
                            className="row-full"
                        />
                    </div>
                </ExportDialog>
            </Dropdown>
            <Divider />
        </div>
    )
}
