import { useSyncExternalStore } from 'preact/compat'

export function useWindowSize<T>(selector: () => T) {
    return useSyncExternalStore(subscribe, selector)
}

function subscribe(callback: () => void) {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
}
