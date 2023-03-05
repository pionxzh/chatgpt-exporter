import type { FunctionComponent } from 'preact'
import type { JSXInternal } from 'preact/src/jsx'
import { useCallback, useState } from 'preact/hooks'
import { exportToText } from '../exporter/text'
import { exportToPng } from '../exporter/image'
import { exportToMarkdown } from '../exporter/markdown'
import { exportToHtml } from '../exporter/html'
import { useGMStorage } from '../useGMStorage'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconLoading, IconMarkdown } from './icons'

import '../style.css'

type FC<P = {}> = FunctionComponent<P>

const TIMEOUT = 2500

interface MenuItemProps {
    text: string
    icon?: FC
    successText?: string
    onClick?: (() => boolean) | (() => Promise<boolean>)
}
const MenuItem: FC<MenuItemProps> = ({ text, successText, icon: Icon, onClick }) => {
    const [loading, setLoading] = useState(false)
    const [succeed, setSucceed] = useState(false)

    const handleClick = async () => {
        if (typeof onClick === 'function') {
            setLoading(true)
            const result = await onClick()
            setLoading(false)
            if (result) {
                setSucceed(true)
                setTimeout(() => setSucceed(false), TIMEOUT)
            }
        }
    }

    return (
        <div
            className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
            style={{ height: 46 }}
            onClick={handleClick}
        >
            {loading
                ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <IconLoading />
                </div>
                    )
                : (
                    <>
                        {Icon && <Icon />}
                        {succeed && successText ? successText : text}
                    </>
                    )
            }
        </div>
    )
}

const Dropdown: FC = ({ children }) => {
    return (
        <>
            <div className="dropdown-backdrop"></div>
            <div className="dropdown-menu bg-gray-900">
                {children}
            </div>
        </>
    )
}

const Divider = () => <div className="border-b border-white/20"></div>

const KEY = 'exporter-format'
const defaultFormat = 'ChatGPT-{timestamp}'

export function Menu() {
    const [format, setFormat] = useGMStorage(KEY, defaultFormat)
    const handleChange: JSXInternal.GenericEventHandler<HTMLInputElement> = (e) => {
        setFormat(e.currentTarget.value)
    }

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
                <fieldset className="inputFieldSet mb-2 rounded-md text-white border-white/20 hover:bg-gray-500/10 duration-200">
                    <legend className="inputLabel px-2 text-xs">File Name: {'{title}, {timestamp}' }</legend>
                    <input
                        className="border-none text-sm w-full"
                        type="text"
                        onChange={handleChange}
                        value={format}
                    />
                </fieldset>

                <MenuItem
                    text="Copy Text"
                    successText="Copied!"
                    icon={IconCopy}
                    onClick={onClickText} />
                <MenuItem
                    text="Screenshot"
                    icon={IconCamera}
                    onClick={onClickPng} />
                <MenuItem
                    text="Markdown"
                    icon={IconMarkdown}
                    onClick={onClickMarkdown} />
                <MenuItem
                    text="WebPage (HTML)"
                    icon={FileCode}
                    onClick={onClickHtml} />
            </Dropdown>
            <Divider />
        </div>
    )
}
