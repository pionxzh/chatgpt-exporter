import * as Dialog from '@radix-ui/react-dialog'
import type { JSXInternal } from 'preact/src/jsx'
import sanitize from 'sanitize-filename'
import type { FC } from '../type'
import { getFileNameWithFormat } from '../utils/download'
import { dateStr, timestamp } from '../utils/utils'
import { IconCross } from './icons'
import { useTitle } from './useTitle'

export const SettingDialog: FC<{ format: string; setFormat: (value: string) => void }> = ({ format, setFormat, children }) => {
    const handleChange: JSXInternal.GenericEventHandler<HTMLInputElement> = (e) => {
        setFormat(e.currentTarget.value)
    }

    const _title = useTitle()
    const title = sanitize(_title).replace(/\s+/g, '_')

    const preview = getFileNameWithFormat(format, '{ext}', { title })

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">Exporter Setting</Dialog.Title>
                    <div className="Description">
                        Available variables:&nbsp;
                        <span className="cursor-help select-all" title={title}>{'{title}'}</span>
                        ,&nbsp;
                        <span className="cursor-help select-all" title={dateStr()}>{'{date}'}</span>
                        ,&nbsp;
                        <span className="cursor-help select-all" title={timestamp()}>{'{timestamp}'}</span>
                    </div>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="filename">
                            File Name
                        </label>
                        <input className="Input" id="filename" value={format} onChange={handleChange} />
                    </fieldset>
                    <div className="Description">
                        Preview:&nbsp;
                        <span className="select-all" style={{ 'text-decoration': 'underline', 'text-underline-offset': 4 }}>{preview}</span>
                    </div>
                    <div className="flex mt-6" style={{ justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <button className="Button green">Save</button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
