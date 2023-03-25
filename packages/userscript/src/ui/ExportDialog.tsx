import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { type ApiConversationItem, fetchAllConversations } from '../api'
import { exportAllToHtml } from '../exporter/html'
import { exportAllToJson } from '../exporter/json'
import { exportAllToMarkdown } from '../exporter/markdown'
import type { FC } from '../type'
import { CheckBox } from './CheckBox'
import { IconCross } from './icons'

const exportAllOptions = [
    { label: 'Markdown', callback: exportAllToMarkdown },
    { label: 'JSON', callback: exportAllToJson },
    { label: 'HTML', callback: exportAllToHtml },
]

export const ExportDialog: FC<{ format: string }> = ({ format, children }) => {
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
