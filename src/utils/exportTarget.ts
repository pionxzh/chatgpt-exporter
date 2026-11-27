import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import type JSZip from 'jszip'
import { downloadFile } from './download'

/**
 * Where Export All puts its files: one ZIP download, or straight into a
 * folder the user picked, replacing older copies.
 *
 * The folder is picked again for every export. Its handle could only be kept
 * in chatgpt.com's IndexedDB, where the page's own scripts can read it too,
 * and the userscript storage holds JSON only.
 */
export type ExportTarget = { kind: 'zip' } | { kind: 'folder', directory: FileSystemDirectoryHandle }

type DirectoryPicker = (options?: { id?: string, mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>

function getDirectoryPicker(): DirectoryPicker | undefined {
    const page = unsafeWindow as unknown as { showDirectoryPicker?: DirectoryPicker }
    return typeof page?.showDirectoryPicker === 'function' ? page.showDirectoryPicker.bind(unsafeWindow) : undefined
}

/** Only Chromium browsers can write to a folder */
export function canSaveToFolder(): boolean {
    return getDirectoryPicker() !== undefined
}

/**
 * Asks for a folder to write into. Must run from a click. Returns `null` when
 * the user closes the picker.
 */
export async function pickExportFolder(): Promise<FileSystemDirectoryHandle | null> {
    const picker = getDirectoryPicker()
    if (!picker) return null
    try {
        // The id makes the browser open the picker where this export went last time
        return await picker({ id: 'chatgpt-exporter', mode: 'readwrite' })
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return null
        throw error
    }
}

/**
 * File names must not depend on which conversations are in the batch, or
 * writing to a folder would replace another conversation's file. Two chats
 * with the same title get `(1)` only within one batch, so the chat id goes
 * into every name.
 */
export function withChatId(fileNameFormat: string): string {
    return fileNameFormat.includes('{chat_id}') ? fileNameFormat : `${fileNameFormat}-{chat_id}`
}

/** Downloads `zip` as `zipName`, or writes its files into the folder */
export async function saveZip(zip: JSZip, zipName: string, target: ExportTarget = { kind: 'zip' }): Promise<void> {
    if (target.kind === 'folder') {
        await writeZipToFolder(zip, target.directory)
        return
    }

    const blob = await zip.generateAsync({
        type: 'blob',
        // A DOS-made zip makes macOS `unzip` garble non-ASCII file names
        platform: 'UNIX',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9,
        },
    })
    downloadFile(zipName, 'application/zip', blob)
}

async function writeZipToFolder(zip: JSZip, root: FileSystemDirectoryHandle): Promise<void> {
    const files: JSZip.JSZipObject[] = []
    zip.forEach((_, file) => {
        if (!file.dir) files.push(file)
    })

    for (const file of files) {
        const parts = file.name.split('/')
        const name = parts.pop()!
        let directory = root
        for (const part of parts) {
            directory = await directory.getDirectoryHandle(part, { create: true })
        }
        const handle = await directory.getFileHandle(name, { create: true })
        const writable = await handle.createWritable()
        try {
            await writable.write(await file.async('blob'))
            await writable.close()
        }
        catch (error) {
            // Closing would replace the older copy with a partial file
            await writable.abort().catch(() => {})
            throw error
        }
    }
}
