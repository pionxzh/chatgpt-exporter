import * as HoverCard from '@radix-ui/react-hover-card'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { exportToHtml } from '../exporter/html'
import { exportToPng } from '../exporter/image'
import { exportToJson } from '../exporter/json'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToText } from '../exporter/text'
import { useWindowResize } from '../hooks/useWindowResize'
import { getHistoryDisabled } from '../page'
import { Divider } from './Divider'
import { ExportDialog } from './ExportDialog'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconJSON, IconMarkdown, IconSetting, IconZip } from './Icons'
import { MenuItem } from './MenuItem'
import { SettingProvider, useSettingContext } from './SettingContext'
import { SettingDialog } from './SettingDialog'

import '../style.css'
import './Dialog.css'

function MenuInner({ container }: { container: HTMLDivElement }) {
    const { t } = useTranslation()
    const disabled = getHistoryDisabled()

    const [open, setOpen] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)
    const [settingOpen, setSettingOpen] = useState(false)

    const {
        format,
        exportOfficialJsonFormat,
        enableTimestamp,
        timeStamp24H,
        enableMeta,
        exportMetaList,
    } = useSettingContext()

    useEffect(() => {
        if (enableTimestamp) {
            document.body.setAttribute('data-time-format', timeStamp24H ? '24' : '12')
        }
        else {
            document.body.removeAttribute('data-time-format')
        }
    }, [enableTimestamp, timeStamp24H])

    const metaList = useMemo(() => enableMeta ? exportMetaList : [], [enableMeta, exportMetaList])

    const onClickText = useCallback(() => exportToText(), [])
    const onClickPng = useCallback(() => exportToPng(format), [format])
    const onClickMarkdown = useCallback(() => exportToMarkdown(format, metaList), [format, metaList])
    const onClickHtml = useCallback(() => exportToHtml(format, metaList), [format, metaList])
    const onClickJSON = useCallback(() => exportToJson(format, { officialFormat: exportOfficialJsonFormat }), [format, exportOfficialJsonFormat])

    const width = useWindowResize(() => window.innerWidth)
    const isMobile = width < 768
    const Portal = isMobile ? 'div' : HoverCard.Portal

    if (disabled) {
        return (
            <MenuItem
                className="mt-1"
                text="Chat History disabled"
                icon={IconArrowRightFromBracket}
                disabled={true}
            />
        )
    }

    return (
        <>
            {isMobile && open && (
                <div
                    className="dropdown-backdrop animate-fadeIn"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            <HoverCard.Root
                openDelay={0}
                closeDelay={300}
                open={open}
                onOpenChange={setOpen}
            >
                <HoverCard.Trigger>
                    <MenuItem
                        className="mt-1"
                        text={t('ExportHelper')}
                        icon={IconArrowRightFromBracket}
                        onClick={() => {
                            setOpen(true)
                            return true
                        }}
                    />
                </HoverCard.Trigger>
                <Portal
                    container={isMobile ? container : document.body}
                    forceMount={open || settingOpen || exportOpen}
                >
                    <HoverCard.Content
                        className={isMobile
                            ? 'fixed grid grid-cols-2 gap-x-1 px-1.5 pt-2 rounded bg-gray-900 shadow-md transition-opacity duration-200 animate-slideUp'
                            : 'grid grid-cols-2 gap-x-1 px-1.5 py-2 pb-0 rounded-md bg-gray-900 shadow-md transition-opacity duration-200 animate-fadeIn'}
                        style={{
                            width: isMobile ? 316 : 268,
                            left: -6,
                            bottom: 0,
                        }}
                        sideOffset={8}
                        side={isMobile ? 'bottom' : 'right'}
                        align="start"
                        alignOffset={isMobile ? 0 : -64}
                        collisionPadding={isMobile ? 0 : 8}
                    >
                        <SettingDialog
                            open={settingOpen}
                            onOpenChange={setSettingOpen}
                        >
                            <div className="row-full">
                                <MenuItem text={t('Setting')} icon={IconSetting} />
                            </div>
                        </SettingDialog>

                        <MenuItem
                            text={t('Copy Text')}
                            successText={t('Copied!')}
                            icon={() => <IconCopy className="w-4 h-4" />}
                            className="row-full"
                            onClick={onClickText}
                        />
                        <MenuItem
                            text={t('Screenshot')}
                            icon={IconCamera}
                            className="row-half"
                            onClick={onClickPng}
                        />
                        <MenuItem
                            text={t('Markdown')}
                            icon={IconMarkdown}
                            className="row-half"
                            onClick={onClickMarkdown}
                        />
                        <MenuItem
                            text={t('HTML')}
                            icon={FileCode}
                            className="row-half"
                            onClick={onClickHtml}
                        />
                        <MenuItem
                            text={t('JSON')}
                            icon={IconJSON}
                            className="row-half"
                            onClick={onClickJSON}
                        />
                        <ExportDialog
                            format={format}
                            open={exportOpen}
                            onOpenChange={setExportOpen}
                        >
                            <div className="row-full">
                                <MenuItem
                                    text={t('Export All')}
                                    icon={IconZip}
                                />
                            </div>
                        </ExportDialog>

                        {!isMobile && <HoverCard.Arrow width="16" height="8" className="text-gray-900 fill-current" />}
                    </HoverCard.Content>
                </Portal>
            </HoverCard.Root>
            <Divider />
        </>
    )
}

export function Menu({ container }: { container: HTMLDivElement }) {
    return (
        <SettingProvider>
            <MenuInner container={container} />
        </SettingProvider>
    )
}
