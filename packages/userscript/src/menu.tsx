import type { FunctionComponent } from 'preact'
import { exportToText } from './exporter/text'
import { exportToPng } from './exporter/image'
import { exportToMarkdown } from './exporter/markdown'
import { exportToHtml } from './exporter/html'
import { FileCode, IconArrowRightFromBracket, IconCamera, IconCopy, IconMarkdown } from './icons'
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

export function Menu() {
    return (
        <div id="exporter-menu" className="pt-1 relative">
            <MenuItem>
                <IconArrowRightFromBracket />
                Export
            </MenuItem>
            <Dropdown>
                <MenuItem onClick={exportToText}>
                    <IconCopy />
                    Copy Text
                </MenuItem>
                <MenuItem onClick={exportToPng}>
                    <IconCamera />
                    Screenshot
                </MenuItem>
                <MenuItem onClick={exportToMarkdown}>
                    <IconMarkdown />
                    Markdown
                </MenuItem>
                <MenuItem onClick={exportToHtml}>
                    <FileCode />
                    WebPage (HTML)
                </MenuItem>
            </Dropdown>
            <Divider />
        </div>
    )
}
