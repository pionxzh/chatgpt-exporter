import { GM_deleteValue, GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'

/**
 * Greasemonkey storage API
 * @see https://www.tampermonkey.net/documentation.php#api:GM_setValue
 * @see https://www.tampermonkey.net/documentation.php#api:GM_setValue
 */
class GMStorage {
    static get<T>(key: string): T | null {
        const item = GM_getValue<string>(key, '')
        if (item) {
            try {
                return JSON.parse(item)
            }
            catch {
                return null
            }
        }
        return null
    }

    static set<T>(key: string, value: T): void {
        const item = JSON.stringify(value)
        GM_setValue(key, item)
    }

    static delete(key: string): void {
        GM_deleteValue(key)
    }
}

class LocalStorage {
    static get<T>(key: string): T | null {
        const item = localStorage.getItem(key)
        if (item) {
            try {
                return JSON.parse(item)
            }
            catch {
                return null
            }
        }
        return null
    }

    static set<T>(key: string, value: T): void {
        const item = JSON.stringify(value)
        localStorage.setItem(key, item)
    }

    static delete(key: string): void {
        localStorage.removeItem(key)
    }
}

class MemoryStorage {
    private static map = new Map<string, any>()

    static get<T>(key: string): T | null {
        const item = this.map.get(key)
        if (!item) return null
        return item
    }

    static set<T>(key: string, value: T): void {
        this.map.set(key, value)
    }

    static delete(key: string): void {
        this.map.delete(key)
    }
}

export class ScriptStorage {
    static get<T>(key: string): T | null {
        try {
            return GMStorage.get<T>(key)
        }
        catch {
            try {
                return LocalStorage.get<T>(key)
            }
            catch {
                return MemoryStorage.get<T>(key)
            }
        }
    }

    static set<T>(key: string, value: T): void {
        try {
            return GMStorage.set<T>(key, value)
        }
        catch {
            try {
                return LocalStorage.set<T>(key, value)
            }
            catch {
                return MemoryStorage.set<T>(key, value)
            }
        }
    }

    static delete(key: string): void {
        try {
            return GMStorage.delete(key)
        }
        catch {
            try {
                return LocalStorage.delete(key)
            }
            catch {
                return MemoryStorage.delete(key)
            }
        }
    }
}
