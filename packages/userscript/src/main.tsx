import sentinel from 'sentinel-js'
import { render } from 'preact'
import { Menu } from './menu'
import { onloadSafe } from './utils/utils'

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
    })
}
