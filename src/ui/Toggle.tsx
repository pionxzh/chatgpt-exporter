import { Switch } from '@headlessui/react'

interface ToggleProps {
    label?: string
    checked?: boolean
    onCheckedUpdate?: (checked: boolean) => void
}

/**
 * Mimics the style of OpenAI's toggle switches.
 */
export function Toggle({ label, checked = true, onCheckedUpdate }: ToggleProps) {
    return (
        <div className="inline-flex items-center">
            <Switch
                checked={checked}
                onChange={onCheckedUpdate}
                data-state={checked ? 'checked' : 'unchecked'}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token-text-secondary focus-visible:ring-offset-2 focus-visible:radix-state-checked:ring-black focus-visible:dark:ring-token-main-surface-primary focus-visible:dark:radix-state-checked:ring-green-600 cursor-pointer bg-gray-200 radix-state-checked:bg-black dark:border dark:border-token-border-medium dark:bg-transparent relative shrink-0 rounded-full dark:radix-state-checked:border-green-600 dark:radix-state-checked:bg-green-600 h-[20px] w-[32px]"
            >
                <span
                    data-state={checked ? 'checked' : 'unchecked'}
                    className="flex items-center justify-center rounded-full transition-transform duration-100 will-change-transform ltr:translate-x-0.5 rtl:-translate-x-0.5 bg-white h-[16px] w-[16px] ltr:radix-state-checked:translate-x-[14px] rtl:radix-state-checked:translate-x-[-14px]"
                >
                </span>
            </Switch>
            {label && <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>}
        </div>
    )
}
