import * as Dialog from '@radix-ui/react-dialog'
import sanitize from 'sanitize-filename'
import { baseUrl } from '../constants'
import { useTitle } from '../hooks/useTitle'
import { LOCALES, useTranslation } from '../i18n'
import { getChatIdFromUrl } from '../page'
import { getFileNameWithFormat } from '../utils/download'
import { timestamp as _timestamp, dateStr, unixTimestampToISOString } from '../utils/utils'
import type { FC } from '../type'
import { IconCross, IconTrash } from './Icons'
import { useSettingContext } from './SettingContext'
import { Toggle } from './Toggle'
import './SettingDialog.css'

function Variable({ name, title }: { name: string, title: string }) {
    return <strong className="ce-variable" title={title}>{name}</strong>
}

interface SettingDialogProps {
    open: boolean
    onOpenChange: (value: boolean) => void
}

export const SettingDialog: FC<SettingDialogProps> = ({
    open,
    onOpenChange,
    children,
}) => {
    const {
        /* eslint-disable antfu/consistent-list-newline */
        format, setFormat,
        enableTimestamp, setEnableTimestamp,
        timeStamp24H, setTimeStamp24H,
        enableTimestampHTML, setEnableTimestampHTML,
        enableTimestampMarkdown, setEnableTimestampMarkdown,
        enableMeta, setEnableMeta,
        exportMetaList, setExportMetaList,
        enableThinking, setEnableThinking,
        enableSources, setEnableSources,
        exportAllLimit, setExportAllLimit,
        /* eslint-enable antfu/consistent-list-newline */
    } = useSettingContext()
    const { t, i18n } = useTranslation()
    const _title = useTitle()
    const date = dateStr()
    const timestamp = _timestamp()
    const title = sanitize(_title).replace(/\s+/g, '_')
    const chatId = getChatIdFromUrl() || 'this-is-a-mock-chat-id'
    const now = Date.now() / 1000
    const createTime = now
    const updateTime = now
    const preview = getFileNameWithFormat(format, '{ext}', { title, chatId, createTime, updateTime })

    const source = `${baseUrl}/${chatId}`

    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="ce-root ce-dialog-overlay" />
                <Dialog.Content className="ce-root ce-dialog">
                    <Dialog.Title className="ce-dialog-title">{t('Exporter Settings')}</Dialog.Title>
                    <div className="ce-dialog-body">
                        <dl className="ce-setting-list">
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {`${t('Language')} 🌐`}
                                    </dt>
                                    <dd>
                                        <select
                                            className="ce-select ce-setting-select"
                                            value={i18n.language}
                                            onChange={e => i18n.changeLanguage(e.currentTarget.value)}
                                        >
                                            {LOCALES.map(({ name, code }) => (
                                                <option key={code} value={code}>{name}</option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('File Name')}
                                    </dt>
                                    <dd>
                                        <p className="ce-setting-desc">
                                            {t('Available variables')}:{' '}
                                            <Variable name="{title}" title={title} />
                                            ,{' '}
                                            <Variable name="{date}" title={date} />
                                            ,{' '}
                                            <Variable name="{timestamp}" title={timestamp} />
                                            ,{' '}
                                            <Variable name="{chat_id}" title={chatId} />
                                            ,{' '}
                                            <Variable name="{create_time}" title={unixTimestampToISOString(createTime)} />
                                            ,{' '}
                                            <Variable name="{update_time}" title={unixTimestampToISOString(updateTime)} />
                                        </p>
                                        <input className="ce-input ce-setting-filename" id="filename" value={format} onChange={e => setFormat(e.currentTarget.value)} />
                                        <p className="ce-setting-desc ce-setting-preview-line">
                                            {t('Preview')}:{' '}
                                            <span className="ce-preview">{preview}</span>
                                        </p>
                                    </dd>
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('Export Thinking Process')}
                                    </dt>
                                    <dd className="ce-setting-desc">
                                        {t('Export Thinking Process Description')}
                                    </dd>
                                </div>
                                <div className="ce-setting-control">
                                    <Toggle label="" checked={enableThinking} onCheckedUpdate={setEnableThinking} />
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('Export Sources')}
                                    </dt>
                                    <dd className="ce-setting-desc">
                                        {t('Export Sources Description')}
                                    </dd>
                                </div>
                                <div className="ce-setting-control">
                                    <Toggle label="" checked={enableSources} onCheckedUpdate={setEnableSources} />
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('Export All Limit')}{' '}
                                        {/* Add translation key */}
                                    </dt>
                                    <dd className="ce-setting-desc ce-mt-2">
                                        {t('Export All Limit Description')}{' '}
                                        {/* Add translation key */}
                                        <div className="ce-range-row">
                                            <input
                                                type="range"
                                                min="100" // Set min value
                                                max="20000" // Set max value (adjust as needed)
                                                step="100" // Set step value
                                                value={exportAllLimit}
                                                onChange={e =>
                                                    setExportAllLimit(
                                                        Number.parseInt(
                                                            e.currentTarget.value,
                                                            10,
                                                        ),
                                                    )}
                                                className="ce-range"
                                                id="exportAllLimitSlider"
                                            />
                                            <span className="ce-range-value">
                                                {exportAllLimit}
                                            </span>
                                        </div>
                                    </dd>
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('Conversation Timestamp')}
                                    </dt>
                                    <dd className="ce-setting-desc">
                                        {t('Conversation Timestamp Description')}
                                        {enableTimestamp && (
                                            <>
                                                <div className="ce-mt-2">
                                                    <Toggle
                                                        label={t('Use 24-hour format')}
                                                        checked={timeStamp24H}
                                                        onCheckedUpdate={setTimeStamp24H}
                                                    />
                                                </div>
                                                <div className="ce-mt-2">
                                                    <Toggle
                                                        label={t('Enable on HTML')}
                                                        checked={enableTimestampHTML}
                                                        onCheckedUpdate={setEnableTimestampHTML}
                                                    />
                                                </div>
                                                <div className="ce-mt-2">
                                                    <Toggle
                                                        label={t('Enable on Markdown')}
                                                        checked={enableTimestampMarkdown}
                                                        onCheckedUpdate={setEnableTimestampMarkdown}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </dd>
                                </div>
                                <div className="ce-setting-control">
                                    <Toggle label="" checked={enableTimestamp} onCheckedUpdate={setEnableTimestamp} />
                                </div>
                            </div>
                            <div className="ce-setting-card">
                                <div>
                                    <dt className="ce-setting-title">
                                        {t('Export Metadata')}
                                    </dt>
                                    <dd className="ce-setting-desc">
                                        {t('Export Metadata Description')}

                                        {enableMeta && (
                                            <>
                                                <p className="ce-setting-desc ce-mt-2">
                                                    {t('Available variables')}:{' '}
                                                    <Variable name="{title}" title={title} />
                                                    ,{' '}
                                                    <Variable name="{date}" title={date} />
                                                    ,{' '}
                                                    <Variable name="{timestamp}" title={timestamp} />
                                                    ,{' '}
                                                    <Variable name="{source}" title={source} />
                                                    ,{' '}
                                                    <Variable name="{model}" title="ChatGPT-3.5" />
                                                    ,{' '}
                                                    <Variable name="{model_name}" title="text-davinci-002-render-sha" />
                                                    ,{' '}
                                                    <Variable name="{create_time}" title="2023-04-10T21:45:35.027Z" />
                                                    ,{' '}
                                                    <Variable name="{update_time}" title="2023-04-10T21:45:35.027Z" />
                                                </p>
                                                {exportMetaList.map((meta, i) => (
                                                    // Rows have no stable id; keying by index keeps the input focused while typing.
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <div className="ce-meta-row" key={i}>
                                                        <input
                                                            className="ce-input"
                                                            value={meta.name}
                                                            onChange={(e) => {
                                                                const list = [...exportMetaList]
                                                                list[i] = { ...list[i], name: e.currentTarget.value }
                                                                setExportMetaList(list)
                                                            }}
                                                        />
                                                        <span className="ce-meta-arrow">→</span>
                                                        <input
                                                            className="ce-input"
                                                            value={meta.value}
                                                            onChange={(e) => {
                                                                const list = [...exportMetaList]
                                                                list[i] = { ...list[i], value: e.currentTarget.value }
                                                                setExportMetaList(list)
                                                            }}
                                                        />
                                                        <button
                                                            className="ce-meta-remove"
                                                            aria-label="Remove"
                                                            onClick={() => setExportMetaList(exportMetaList.filter((_, j) => j !== i))}
                                                        >
                                                            <IconTrash className="ce-icon" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="ce-meta-add-row">
                                                    <button
                                                        className="ce-meta-add"
                                                        aria-label="Add"
                                                        onClick={() => setExportMetaList([...exportMetaList, { name: '', value: '' }])}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </dd>
                                </div>
                                <div className="ce-setting-control">
                                    <Toggle label="" checked={enableMeta} onCheckedUpdate={setEnableMeta} />
                                </div>
                            </div>
                        </dl>
                    </div>
                    {/* Outside DialogBody so it stays pinned while the settings scroll */}
                    <div className="ce-dialog-footer">
                        <Dialog.Close asChild>
                            <button className="ce-button ce-button-green ce-button-strong">{t('Save')}</button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className="ce-icon-button ce-close-button" aria-label="Close">
                            <IconCross />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
