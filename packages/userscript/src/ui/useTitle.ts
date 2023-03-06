import { useSyncExternalStore } from 'preact/compat'
import { noop } from '../utils/utils'

export function useTitle() {
    const title = useSyncExternalStore(subscribe, getSnapshot)
    return title
}

function subscribe(callback: () => void) {
    const target = document.querySelector('title')
    if (!target) return noop

    const observer = new MutationObserver(callback)

    const config = { subtree: true, characterData: true, childList: true }
    observer.observe(target, config)

    return () => observer.disconnect()
}

function getSnapshot(): string {
    return document.title
}
