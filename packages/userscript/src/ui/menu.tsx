import type { JSXInternal } from 'preact/src/jsx'
import { useCallback } from 'preact/hooks'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import sanitize from 'sanitize-filename'
import type { FC } from '../type'
import { exportToText } from '../exporter/text'
import { exportToPng } from '../exporter/image'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToHtml } from '../exporter/html'
import { useGMStorage } from '../useGMStorage'
import { dateStr, timestamp } from '../utils/utils'
import { getFileNameWithFormat } from '../utils/download'
import { MenuItem } from './MenuItem'
import { Divider } from './Divider'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconMarkdown, IconSetting } from './icons'
import { Dropdown } from './Dropdown'
import { useTitle } from './useTitle'

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
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export function Menu() {
    const [format, setFormat] = useGMStorage(KEY, defaultFormat)

    const onClickText = useCallback(() => exportToText(), [])
    const onClickPng = useCallback(() => exportToPng(format), [format])
    const onClickMarkdown = useCallback(() => exportToMarkdown(format), [format])
    const onClickHtml = useCallback(() => exportToHtml(format), [format])

    return (
        <div id="exporter-menu" className="pt-1 relative">
            <MenuItem
                text="Export"
                icon={IconArrowRightFromBracket}
            />
            <Dropdown>
                <SettingDialog format={format} setFormat={setFormat}>
                    <div><MenuItem text="Setting" icon={IconSetting} /></div>
                </SettingDialog>

                <MenuItem
                    text="Copy Text"
                    successText="Copied!"
                    icon={IconCopy}
                    onClick={onClickText}
                />
                <MenuItem
                    text="Screenshot"
                    icon={IconCamera}
                    onClick={onClickPng}
                />
                <MenuItem
                    text="Markdown"
                    icon={IconMarkdown}
                    onClick={onClickMarkdown}
                />
                <MenuItem
                    text="WebPage (HTML)"
                    icon={FileCode}
                    onClick={onClickHtml}
                />
            </Dropdown>
            <Divider />
        </div>
    )
}
