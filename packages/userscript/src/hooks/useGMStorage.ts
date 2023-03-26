import { useState } from 'preact/hooks'
import { GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'

/**
 * ref: https://usehooks.com/useLocalStorage/
 * Hook to use GM storage with fallback to localStorage
 */
export function useGMStorage(key: string, initialValue: string): [string, (value: string) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            // Get from GM storage by key
            return GM_getValue(key, initialValue)
        }
        catch (error) {
            try {
                // Get from local storage by key
                const item = window.localStorage.getItem(key)
                // Parse stored json or if none return initialValue
                return item ?? initialValue
            }
            catch (error) {
                // If error also return initialValue
                console.error(error)
                return initialValue
            }
        }
    })
    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = (value: string) => {
        // Save state
        setStoredValue(value)

        try {
            // Save to GM storage
            GM_setValue(key, value)
        }
        catch (error) {
            try {
                // Save to local storage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(value))
                }
            }
            catch (error) {
                console.error(error)
            }
        }
    }
    return [storedValue, setValue]
}
