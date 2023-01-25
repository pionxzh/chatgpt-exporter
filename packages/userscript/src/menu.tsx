import type { FunctionComponent } from 'preact'
import type { JSXInternal } from 'preact/src/jsx'
import { exportToText } from './exporter/text'
import { exportToPng } from './exporter/image'
import { exportToMarkdown } from './exporter/markdown'
import { exportToHtml } from './exporter/html'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconMarkdown } from './icons'
import { useGMStorage } from './useGMStorage'

import './style.css'

type FC<P = {}> = FunctionComponent<P>

interface MenuItemProps {
    onClick?: () => void
}
const MenuItem: FC<MenuItemProps> = ({ children, onClick }) => {
    return (
        <div
            className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
            onClick={onClick}
        >
            {children}
        </div>
    )
}

const Dropdown: FC = ({ children }) => {
    return (
        <div className="dropdown-menu bg-gray-900">
            {children}
        </div>
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

    return (
        <div id="exporter-menu" className="pt-1 relative">
            <MenuItem>
                <IconArrowRightFromBracket />
                Export
            </MenuItem>
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

                <MenuItem onClick={exportToText}>
                    <IconCopy />
                    Copy Text
                </MenuItem>
                <MenuItem onClick={() => exportToPng(format)}>
                    <IconCamera />
                    Screenshot
                </MenuItem>
                <MenuItem onClick={() => exportToMarkdown(format)}>
                    <IconMarkdown />
                    Markdown
                </MenuItem>
                <MenuItem onClick={() => exportToHtml(format)}>
                    <FileCode />
                    WebPage (HTML)
                </MenuItem>
            </Dropdown>
            <Divider />
        </div>
    )
}
