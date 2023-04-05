import { useState } from 'preact/hooks'
import { IconLoading } from './Icons'
import type { FC } from '../type'

const TIMEOUT = 2500

export interface MenuItemProps {
    text: string
    icon?: FC
    successText?: string
    disabled?: boolean
    title?: string
    className?: string
    onClick?: (() => boolean) | (() => Promise<boolean>)
}

export const MenuItem: FC<MenuItemProps> = ({ text, successText, disabled = false, title, icon: Icon, onClick, className }) => {
    const [loading, setLoading] = useState(false)
    const [succeed, setSucceed] = useState(false)

    const handleClick = typeof onClick === 'function'
        ? async () => {
            try {
                setLoading(true)
                const result = await onClick()
                if (result) {
                    setSucceed(true)
                    setTimeout(() => setSucceed(false), TIMEOUT)
                }
            }
            catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        }
        : undefined

    return (
        <div
            className={`menu-item flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 ${className}`}
            onClick={handleClick}
            onTouchStart={handleClick}
            disabled={disabled}
            title={title}
        >
            {loading
                ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <IconLoading className="w-4 h-4" />
                    </div>
                    )
                : (
                    <>
                        {Icon && <Icon />}
                        {(succeed && successText) ? successText : text}
                    </>
                    )}
        </div>
    )
}
