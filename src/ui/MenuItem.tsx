import { useState } from 'preact/hooks'
import type { FC } from '../type'
import { IconLoading } from './Icons'

const TIMEOUT = 2500

export interface MenuItemProps {
    text: string
    icon?: FC
    successText?: string
    disabled?: boolean
    title?: string
    ariaLabel?: string
    className?: string
    onClick?: (() => boolean) | (() => Promise<boolean>)
}

export const MenuItem: FC<MenuItemProps> = ({ text, successText, disabled = false, title, ariaLabel, icon: Icon, onClick, className }) => {
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

    // Items are divs so they fit ChatGPT's menu styles. Expose them as
    // buttons and let Enter and Space click them, which also reaches the
    // dialog triggers that wrap some of them.
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        const item = e.currentTarget as HTMLElement
        item.click()
    }

    return (
        <div
            className={`
            menu-item
            __menu-item hoverable
            flex flex-shrink-0 m-0 items-center gap-3 rounded-lg
            transition-colors duration-200
            cursor-pointer
            border border-menu ${className}`}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={handleClick}
            onTouchStart={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            aria-busy={loading || undefined}
            aria-label={ariaLabel}
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
                            <span className="ce-menu-item-text">
                                {(succeed && successText) ? successText : text}
                            </span>
                        </>
                    )}
        </div>
    )
}
