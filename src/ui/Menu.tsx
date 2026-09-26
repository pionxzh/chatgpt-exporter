import * as Dialog from '@radix-ui/react-dialog'
import * as HoverCard from '@radix-ui/react-hover-card'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { useTranslation } from '../i18n'
import { exportToHtml } from '../exporter/html'
import { exportToPng } from '../exporter/image'
import { exportToJson, exportToOoba, exportToTavern } from '../exporter/json'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToText } from '../exporter/text'
import { useWindowResize } from '../hooks/useWindowResize'
import { Divider } from './Divider'
import { ExportDialog } from './ExportDialog'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconJSON, IconMarkdown, IconSetting, IconZip } from './Icons'
import { MenuItem } from './MenuItem'
import { SettingProvider, useSettingContext } from './SettingContext'
import { SettingDialog } from './SettingDialog'

import './theme.css'
import '../style.css'
import './Dialog.css'

function useCollapsedSidebar(container: HTMLDivElement, isMobile: boolean) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(false)
            return
        }

        let frame = 0
        const observed = new Set<Element>()
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)

        function sidebarElement() {
            return container.closest('nav, aside, [aria-label="Sidebar"], [data-testid="sidebar"]')
                ?? container.parentElement
        }

        function observe(element: Element | null | undefined) {
            if (!observer || !element || observed.has(element)) return
            observer.observe(element)
            observed.add(element)
        }

        function update() {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const parentWidth = container.parentElement?.getBoundingClientRect().width ?? 0
                const sidebarWidth = sidebarElement()?.getBoundingClientRect().width ?? parentWidth
                const nextCollapsed = (parentWidth > 0 && parentWidth < 96)
                    || (sidebarWidth > 0 && sidebarWidth < 96)

                setIsCollapsed(nextCollapsed)
                container.toggleAttribute('data-ce-sidebar-collapsed', nextCollapsed)
                observe(container.parentElement)
                observe(sidebarElement())
            })
        }

        observe(container.parentElement)
        observe(sidebarElement())
        update()

        window.addEventListener('resize', update)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', update)
            observer?.disconnect()
            container.removeAttribute('data-ce-sidebar-collapsed')
        }
    }, [container, isMobile])

    return isCollapsed
}

function MenuInner({ container }: { container: HTMLDivElement }) {
    const { t } = useTranslation()

    const [open, setOpen] = useState(false)
    const [jsonOpen, setJsonOpen] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)
    const [settingOpen, setSettingOpen] = useState(false)

    const {
        format,
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
    const onClickJSON = useCallback(() => {
        setJsonOpen(true)
        return true
    }, [])
    const onClickOfficialJSON = useCallback(() => exportToJson(format), [format])
    const onClickTavern = useCallback(() => exportToTavern(format), [format])
    const onClickOoba = useCallback(() => exportToOoba(format), [format])

    const width = useWindowResize(() => window.innerWidth)
    const isMobile = width < 768
    const isCollapsedSidebar = useCollapsedSidebar(container, isMobile)
    const Portal = isMobile ? 'div' : HoverCard.Portal

    return (
        <>
            {isMobile && open && (
                <div
                    className="ce-backdrop"
                    onClick={() => setOpen(false)}
                >
                </div>
            )}

            <HoverCard.Root
                openDelay={0}
                closeDelay={300}
                open={open}
                onOpenChange={setOpen}
            >
                <HoverCard.Trigger>
                    <MenuItem
                        className={isCollapsedSidebar
                            ? 'ce-nav-trigger ce-nav-trigger-collapsed'
                            : 'ce-nav-trigger ce-nav-trigger-expanded'}
                        text={t('ExportHelper')}
                        ariaLabel={t('ExportHelper')}
                        icon={IconArrowRightFromBracket}
                        onClick={() => {
                            setOpen(true)
                            return true
                        }}
                    />
                </HoverCard.Trigger>
                <Portal
                    container={isMobile ? container : document.body}
                    forceMount={open || jsonOpen || settingOpen || exportOpen}
                >
                    <HoverCard.Content
                        className={`ce-root ce-card${isMobile ? ' ce-card-mobile' : ''}`}
                        style={{
                            width: isMobile ? 316 : 268,
                            left: -6,
                            bottom: 0,
                        }}
                        sideOffset={isMobile ? 0 : 8}
                        side={isMobile ? 'bottom' : 'right'}
                        align="start"
                        alignOffset={isMobile ? 0 : -64}
                        collisionPadding={isMobile ? 0 : 8}
                    >
                        <SettingDialog
                            open={settingOpen}
                            onOpenChange={setSettingOpen}
                        >
                            <div className="ce-row-full">
                                <MenuItem text={t('Setting')} icon={IconSetting} />
                            </div>
                        </SettingDialog>

                        <MenuItem
                            text={t('Copy Text')}
                            successText={t('Copied!')}
                            icon={IconCopy}
                            className="ce-row-full"
                            onClick={onClickText}
                        />
                        <MenuItem
                            text={t('Screenshot')}
                            icon={IconCamera}
                            className="ce-row-half"
                            onClick={onClickPng}
                        />
                        <MenuItem
                            text={t('Markdown')}
                            icon={IconMarkdown}
                            className="ce-row-half"
                            onClick={onClickMarkdown}
                        />
                        <MenuItem
                            text={t('HTML')}
                            icon={FileCode}
                            className="ce-row-half"
                            onClick={onClickHtml}
                        />
                        <Dialog.Root
                            open={jsonOpen}
                            onOpenChange={setJsonOpen}
                        >
                            <Dialog.Trigger asChild>
                                <MenuItem
                                    text={t('JSON')}
                                    icon={IconJSON}
                                    className="ce-row-half"
                                    onClick={onClickJSON}
                                />
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="ce-root ce-dialog-overlay" />
                                <Dialog.Content className="ce-root ce-dialog" style={{ width: '320px' }}>
                                    <Dialog.Title className="ce-dialog-title">{t('JSON')}</Dialog.Title>
                                    <MenuItem
                                        text={t('OpenAI Official Format')}
                                        icon={IconCopy}
                                        className="ce-row-full"
                                        onClick={onClickOfficialJSON}
                                    />
                                    <MenuItem
                                        text="JSONL (TavernAI, SillyTavern)"
                                        icon={IconCopy}
                                        className="ce-row-full"
                                        onClick={onClickTavern}
                                    />
                                    <MenuItem
                                        text="Ooba (text-generation-webui)"
                                        icon={IconCopy}
                                        className="ce-row-full"
                                        onClick={onClickOoba}
                                    />
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                        <ExportDialog
                            format={format}
                            open={exportOpen}
                            onOpenChange={setExportOpen}
                        >
                            <div className="ce-row-full">
                                <MenuItem
                                    text={t('Export All')}
                                    icon={IconZip}
                                />
                            </div>
                        </ExportDialog>

                        {!isMobile && (
                            <HoverCard.Arrow
                                width="16"
                                height="8"
                                style={{
                                    'fill': 'var(--ce-menu-arrow)',
                                    'stroke': 'var(--ce-menu-border)',
                                    'stoke-width': '2px',
                                }}
                            />
                        )}
                    </HoverCard.Content>
                </Portal>
            </HoverCard.Root>
            {!isCollapsedSidebar && <Divider />}
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
