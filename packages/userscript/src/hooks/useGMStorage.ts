import { useState } from 'preact/hooks'
import { ScriptStorage } from '../utils/storage'

export function useGMStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => ScriptStorage.get<T>(key) ?? initialValue)
    const setValue = (value: T) => {
        setStoredValue(value)
        ScriptStorage.set<T>(key, value)
    }
    return [storedValue as T, setValue]
}
