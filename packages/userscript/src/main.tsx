import sentinel from 'sentinel-js'
import { render } from 'preact'
import { Menu } from './ui/Menu'
import { onloadSafe } from './utils/utils'
import { SecondaryToolbar } from './ui/SecondaryToolbar'

import './styles/missing-tailwind.css'

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
