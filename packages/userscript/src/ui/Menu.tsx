import { useCallback, useMemo } from 'preact/hooks'
import { exportToHtml } from '../exporter/html'
import { exportToPng } from '../exporter/image'
import { exportToJson } from '../exporter/json'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToText } from '../exporter/text'
import { getHistoryDisabled } from '../page'
import { Divider } from './Divider'
import { Dropdown } from './Dropdown'
import { ExportDialog } from './ExportDialog'
import { FormatProvider, useFormatContext } from './FormatContext'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconJSON, IconMarkdown, IconSetting, IconZip } from './Icons'
import { MenuItem } from './MenuItem'
import { MetaDataProvider, useMetaDataContext } from './MetaContext'
import { SettingDialog } from './SettingDialog'

import '../style.css'
import './Dialog.css'

function MenuInner() {
    const disabled = getHistoryDisabled()
    const menuText = disabled ? 'Exporter unavailable' : 'Export'
    const menuTitle = disabled
        ? `Exporter is relying on the History API.
But History feature is disabled by OpenAI temporarily.
We all have to wait for them to bring it back.`
        : ''

    const { format } = useFormatContext()
    const { enableMeta, exportMetaList } = useMetaDataContext()
    const metaList = useMemo(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList])

    const onClickText = useCallback(() => exportToText(), [])
    const onClickPng = useCallback(() => exportToPng(format), [format])
    const onClickMarkdown = useCallback(() => exportToMarkdown(format, metaList), [format, metaList])
    const onClickHtml = useCallback(() => exportToHtml(format, metaList), [format, metaList])
    const onClickJSON = useCallback(() => exportToJson(format), [format])

    return (
        <div id="exporter-menu" className="pt-1 relative" disabled={disabled} title={menuTitle}>
            <MenuItem
                text={menuText}
                icon={IconArrowRightFromBracket}
                disabled={disabled}
            />
            <Dropdown>
                <SettingDialog>
                    <div className="row-full">
                        <MenuItem text="Setting" icon={IconSetting} />
                    </div>
                </SettingDialog>

                <MenuItem
                    text="Copy Text"
                    successText="Copied!"
                    icon={() => <IconCopy className="w-4 h-4" />}
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

export function Menu() {
    return (
        <FormatProvider>
            <MetaDataProvider>
                <MenuInner />
            </MetaDataProvider>
        </FormatProvider>
    )
}
