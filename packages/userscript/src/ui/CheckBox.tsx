import './CheckBox.css'
import { IconCheckBox, IconCheckBoxChecked } from './icons'

export interface CheckBoxProps {
    checked: boolean
    label: string
    onCheckedChange: (checked: boolean) => void
}

export const CheckBox: React.FC<CheckBoxProps> = ({ checked, label, onCheckedChange }) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange(e.currentTarget.checked)
    }
    return (
        <label className="CheckBoxLabel">
            <span className="IconWrapper">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                {checked ? <IconCheckBoxChecked className="Checked" /> : <IconCheckBox />}
            </span>
            <span className="LabelText">{label}</span>
        </label>
    )
}
