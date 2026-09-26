import { Switch } from '@headlessui/react'
import './Toggle.css'

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
        <div className="ce-toggle">
            <Switch
                checked={checked}
                onChange={onCheckedUpdate}
                data-state={checked ? 'checked' : 'unchecked'}
                className="ce-toggle-switch"
            >
                <span
                    data-state={checked ? 'checked' : 'unchecked'}
                    className="ce-toggle-handle"
                >
                </span>
            </Switch>
            {label && <span className="ce-toggle-label">{label}</span>}
        </div>
    )
}
