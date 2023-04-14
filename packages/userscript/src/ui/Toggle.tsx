import { Switch } from '@headlessui/react'

interface ToggleProps {
    label?: string
    checked?: boolean
    onCheckedUpdate?: (checked: boolean) => void
}

/**
 * Mimics the style of OpenAI's
 */
export const Toggle = ({ label, checked = true, onCheckedUpdate }: ToggleProps) => {
    return (
        <div className="inline-flex items-center">
            <Switch
                checked={checked}
                onChange={onCheckedUpdate}
                className={`${
                    checked ? 'bg-green-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 h-6 w-11`}
            >
                <span className="sr-only">Use setting</span>
                <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out h-5 w-5`}>
                    <span className="opacity-0 duration-100 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true"></span>
                    <span className="opacity-100 duration-200 ease-in absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true"></span>
                </span>
            </Switch>
            {label && <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>}
        </div>
    )
}
