import { render } from 'preact'
import sentinel from 'sentinel-js'
import { GM_deleteValue, GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'
import { KEY_FILENAME_FORMAT, LEGACY_KEY_FILENAME_FORMAT } from './constants'
import { Menu } from './ui/Menu'
import { SecondaryToolbar } from './ui/SecondaryToolbar'
import { onloadSafe } from './utils/utils'

import './styles/missing-tailwind.css'

/**
 * Migrate legacy filename format
 */
const legacyFormat = GM_getValue(LEGACY_KEY_FILENAME_FORMAT, '')
const localLegacyFormat = localStorage.getItem(LEGACY_KEY_FILENAME_FORMAT)
if (legacyFormat) {
    GM_deleteValue(LEGACY_KEY_FILENAME_FORMAT)
    GM_setValue(KEY_FILENAME_FORMAT, JSON.stringify(legacyFormat))
}
else if (localLegacyFormat) {
    localStorage.removeItem(LEGACY_KEY_FILENAME_FORMAT)
    localStorage.setItem(KEY_FILENAME_FORMAT, JSON.stringify(localLegacyFormat))
}

main()

function main() {
    onloadSafe(() => {
        const container = document.createElement('div')
        render(<Menu />, container)

        sentinel.on('nav', (nav) => {
            const chatList = document.querySelector('nav > div.overflow-y-auto')
            if (chatList) {
                chatList.after(container)
            }
            else {
                // fallback to the bottom of the nav
                nav.append(container)
            }
        })

        // dirty fix for unstable image url from unsplash
        const imageMap = new Map<string, string>()

        sentinel.on('img', (img: HTMLImageElement) => {
            const src = img.src
            if (src.startsWith('https://source.unsplash.com/')) {
                if (imageMap.has(src)) {
                    img.src = imageMap.get(src)!
                    return
                }

                const xhr = new XMLHttpRequest()
                xhr.open('HEAD', src, true)
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const finalUrl = xhr.responseURL
                        img.src = finalUrl
                        // @ts-expect-error private field
                        img.originalSrc = src
                        imageMap.set(src, finalUrl)
                    }
                }
                xhr.send()
            }
        })

        sentinel.on('.flex.justify-between', (node) => {
            if (!node.querySelector('button')) return
            // ignore codeblock
            if (node.closest('pre')) return

            const secondaryToolbar = document.createElement('div')
            secondaryToolbar.className = 'w-full secondary-toolbar'
            const threads = Array.from(document.querySelectorAll('main .group'))
            const index = threads.indexOf(node.closest('.group')!)
            render(<SecondaryToolbar index={index} />, secondaryToolbar)
            node.append(secondaryToolbar)
        })
    })
}
