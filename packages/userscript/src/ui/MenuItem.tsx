import { useState } from 'preact/hooks'
import type { FC } from '../type'
import { IconLoading } from './icons'

const TIMEOUT = 2500

export interface MenuItemProps {
    text: string
    icon?: FC
    successText?: string
    onClick?: (() => boolean) | (() => Promise<boolean>)
}

export const MenuItem: FC<MenuItemProps> = ({ text, successText, icon: Icon, onClick }) => {
    const [loading, setLoading] = useState(false)
    const [succeed, setSucceed] = useState(false)

    const handleClick = typeof onClick === 'function'
        ? async () => {
            setLoading(true)
            const result = await onClick()
            setLoading(false)
            if (result) {
                setSucceed(true)
                setTimeout(() => setSucceed(false), TIMEOUT)
            }
        }
        : undefined

    return (
        <div
            className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
            style={{ height: 46 }}
            onClick={handleClick}
        >
            {loading
                ? (
                <div className="flex justify-center items-center w-full h-full">
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
