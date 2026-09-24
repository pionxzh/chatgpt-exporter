/**
 * Persistent cache of downloaded image assets, keyed by their asset pointer
 * (e.g. `sediment://file_xxx`). Stored in IndexedDB so exports across
 * reloads and conversations skip the two requests each image costs.
 *
 * Every operation fails soft: without IndexedDB (private mode, blocked
 * storage) the cache is just always empty.
 */

const DB_NAME = 'chatgpt-exporter'
const STORE_NAME = 'images'
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000

interface CachedImage {
    dataUrl: string
    savedAt: number
}

let dbPromise: Promise<IDBDatabase | null> | null = null

function promisify<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

function openDb(): Promise<IDBDatabase | null> {
    dbPromise ??= new Promise<IDBDatabase | null>((resolve) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME).createIndex('savedAt', 'savedAt')
        }
        request.onsuccess = () => {
            pruneExpired(request.result)
            resolve(request.result)
        }
        request.onerror = () => resolve(null)
    }).catch(() => null)
    return dbPromise
}

/** Drops expired entries once per page load so the store does not grow forever */
function pruneExpired(db: IDBDatabase) {
    try {
        const index = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).index('savedAt')
        const cursorRequest = index.openCursor(IDBKeyRange.upperBound(Date.now() - EXPIRY_MS))
        cursorRequest.onsuccess = () => {
            const cursor = cursorRequest.result
            if (!cursor) return
            cursor.delete()
            cursor.continue()
        }
    }
    catch (error) {
        console.warn('[Exporter] Failed to prune image cache', error)
    }
}

export async function getCachedImage(pointer: string): Promise<string | null> {
    try {
        const db = await openDb()
        if (!db) return null
        const entry = await promisify<CachedImage | undefined>(
            db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(pointer),
        )
        if (!entry || Date.now() - entry.savedAt > EXPIRY_MS) return null
        return entry.dataUrl
    }
    catch {
        return null
    }
}

export async function setCachedImage(pointer: string, dataUrl: string): Promise<void> {
    try {
        const db = await openDb()
        if (!db) return
        const entry: CachedImage = { dataUrl, savedAt: Date.now() }
        await promisify(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(entry, pointer))
    }
    catch (error) {
        console.warn('[Exporter] Failed to cache image', error)
    }
}
