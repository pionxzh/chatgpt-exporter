import { useEffect, useState } from 'preact/hooks'
import './CheckBox.css'
import { IconCheckBox, IconCheckBoxChecked } from './Icons'

export interface CheckBoxProps {
    className?: string
    checked?: boolean
    disabled?: boolean
    label: string
    onCheckedChange?: (checked: boolean) => void
}

export const CheckBox: React.FC<CheckBoxProps> = ({
    className,
    checked = false,
    disabled,
    label,
    onCheckedChange,
}) => {
    const [isChecked, setChecked] = useState(checked)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.checked
        setChecked(newValue)
        onCheckedChange?.(newValue)
    }
    useEffect(() => {
        setChecked(checked)
    }, [checked])
    return (
        <label className={`CheckBoxLabel ${className ?? ''} ${disabled ? 'disabled' : ''}`}>
            <span className="IconWrapper">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={onChange}
                    disabled={disabled}
                />
                {isChecked ? <IconCheckBoxChecked /> : <IconCheckBox />}
            </span>
            <span className="LabelText">{label}</span>
        </label>
    )
}
