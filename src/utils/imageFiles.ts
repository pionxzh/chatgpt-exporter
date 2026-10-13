import type JSZip from 'jszip'
import { replaceImageSources } from '../api'
import { KEY_IMAGE_MODE } from '../constants'
import type { ApiConversation } from '../api'
import type { ImageMode } from '../ui/SettingContext'
import { ScriptStorage } from './storage'

const ASSETS_DIR = 'assets'

const IMAGE_EXTENSIONS: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
}

export function getImageMode(): ImageMode {
    return ScriptStorage.get<ImageMode>(KEY_IMAGE_MODE) ?? 'embed'
}

/**
 * Returns a copy of the conversation with base64 data uri images moved into
 * `assets`, keyed by file name, and replaced by a relative path to that file.
 * File names are content hashes, so one map can be shared by every
 * conversation in a zip. Other image sources, like pointers that failed to
 * download, are kept.
 */
export async function extractImageFiles<T extends ApiConversation>(conversation: T, assets: Map<string, string>): Promise<T> {
    const copy = structuredClone(conversation)
    await replaceImageSources(copy, async (src) => {
        const match = /^data:([^;,]*)[^,]*;base64,(.*)$/s.exec(src)
        if (!match) return null

        const [, mimeType, base64] = match
        const ext = IMAGE_EXTENSIONS[mimeType.toLowerCase()] ?? 'bin'
        const name = `image-${await hashBase64(base64)}.${ext}`
        assets.set(name, base64)
        return `${ASSETS_DIR}/${name}`
    })
    return copy
}

export function addImageFilesToZip(zip: JSZip, assets: Map<string, string>) {
    assets.forEach((base64, name) => {
        // Images are compressed already
        zip.file(`${ASSETS_DIR}/${name}`, base64, { base64: true, compression: 'STORE' })
    })
}

async function hashBase64(base64: string) {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest).slice(0, 8), b => b.toString(16).padStart(2, '0')).join('')
}
