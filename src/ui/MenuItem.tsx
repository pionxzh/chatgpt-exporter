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
        ? async (e: Event) => {
            e.preventDefault()
            if (loading) return

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
            className={`
            menu-item
            flex flex-shrink-0 py-3 px-3 items-center gap-3 rounded-lg mb-2
            bg-menu hover:bg-gray-500/10
            transition-colors duration-200
            text-menu text-sm
            cursor-pointer
            border border-menu ${className}`}
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
