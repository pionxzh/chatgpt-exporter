import { useCallback } from 'preact/hooks'
import { exportToText } from '../exporter/text'
import { exportToPng } from '../exporter/image'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToHtml } from '../exporter/html'
import { exportToJson } from '../exporter/json'
import { useGMStorage } from '../hooks/useGMStorage'
import { getHistoryDisabled } from '../page'
import { Divider } from './Divider'
import { Dropdown } from './Dropdown'
import { MenuItem } from './MenuItem'
import { ExportDialog } from './ExportDialog'
import { SettingDialog } from './SettingDialog'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconJSON, IconMarkdown, IconSetting, IconZip } from './Icons'

import '../style.css'
import './Dialog.css'

const KEY = 'exporter-format'
const defaultFormat = 'ChatGPT-{title}'

export function Menu() {
    const disabled = getHistoryDisabled()
    const menuText = disabled ? 'Exporter unavailable' : 'Export'
    const menuTitle = disabled
        ? `Exporter is relying on the History API.
But History feature is disabled by OpenAI temporarily.
We all have to wait for them to bring it back.`
        : ''

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
                        />
                    </div>
                </ExportDialog>
            </Dropdown>
            <Divider />
        </div>
    )
}
