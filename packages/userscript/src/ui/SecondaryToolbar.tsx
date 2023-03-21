import { useState } from 'preact/hooks'
import { exportToTextFromIndex } from '../exporter/text'
import { IconCheck, IconCopy, IconLoading } from './icons'

import './SecondaryToolbar.css'

const TIMEOUT = 2500

export const SecondaryToolbar = ({ index }: { index: number }) => {
    const [loading, setLoading] = useState(false)
    const [succeed, setSucceed] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)
            const result = await exportToTextFromIndex(index)
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

    return (
        <div className="flex w-full ml-4 mt-2 absolute lg:translate-x-full lg:right-0 lg:pl-2 lg:mt-0 lg:top-8">
            { loading
                ? <IconLoading className="w-6 h-6 text-gray-500 dark:text-gray-400" style={{ padding: 5 }} />
                : succeed
                    ? <IconCheck className="w-6 h-6 text-gray-500 dark:text-gray-400" style={{ padding: 3 }} />
                    : (
                        <button
                            onClick={handleClick}
                            className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
                            <IconCopy />
                        </button>
                        )
            }
        </div>
    )
}
