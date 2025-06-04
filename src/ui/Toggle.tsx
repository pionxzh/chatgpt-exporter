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
                className="toggle-switch"
            >
                <span
                    data-state={checked ? 'checked' : 'unchecked'}
                    className="toggle-switch-handle"
                >
                </span>
            </Switch>
            {label && <span className="toggle-switch-label">{label}</span>}
        </div>
    )
}
