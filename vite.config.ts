import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'
import packageJson from './package.json' with { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        preact({
            devToolsEnabled: false,
            devtoolsInProd: false,
        }),
        monkey({
            entry: 'src/main.tsx',
            userscript: {
                'name': {
                    '': packageJson.title,
                    'zh-CN': packageJson['title:zh-CN'],
                    'zh-TW': packageJson['title:zh-TW'],
                },
                'author': packageJson.author,
                'namespace': packageJson.author,
                'description': {
                    '': packageJson.description,
                    'zh-CN': packageJson['description:zh-CN'],
                    'zh-TW': packageJson['description:zh-TW'],
                },
                'license': packageJson.license,
                'match': [
                    'https://chat.openai.com/',
                    // support https://chat.openai.com/?model={model}
                    'https://chat.openai.com/?*',
                    // support https://chat.openai.com/c/123456789
                    'https://chat.openai.com/c/*',
                    // support https://chat.openai.com/g/g-123456789
                    'https://chat.openai.com/g/*',
                    // support https://chat.openai.com/gpts/
                    'https://chat.openai.com/gpts',
                    'https://chat.openai.com/gpts/*',
                    // support https://chat.openai.com/share/123456789
                    'https://chat.openai.com/share/*',
                    // support https://chat.openai.com/share/123456789/continue
                    'https://chat.openai.com/share/*/continue',

                    'https://chatgpt.com/',
                    'https://chatgpt.com/?*',
                    'https://chatgpt.com/c/*',
                    'https://chatgpt.com/g/*',
                    'https://chatgpt.com/gpts',
                    'https://chatgpt.com/gpts/*',
                    'https://chatgpt.com/share/*',
                    'https://chatgpt.com/share/*/continue',
                ],
                'icon': 'https://chatgpt.com/favicon.ico',
                'run-at': 'document-end',
            },
            build: {
                fileName: 'chatgpt.user.js',
                externalGlobals: [
                    // Keep jszip at 3.9.1. From 3.10.0 its setImmediate polyfill
                    // checks `event.source === self`, which never holds in a
                    // userscript sandbox, so generateAsync never resolves.
                    ['jszip', cdn.jsdelivr('JSZip', 'dist/jszip.min.js')],
                    // SnapDOM's IIFE exposes its named export as window.snapdom.
                    ['@zumer/snapdom', cdn.jsdelivr('window', 'dist/snapdom.js')],
                ],
                // Serialized into the bundle and run in the page, so it must be self-contained.
                cssSideEffects: (css: string) => {
                    const style = document.createElement('style')
                    style.textContent = css
                    let head = document.head
                    head.append(style)

                    // Hydration can drop the style from <head>, or swap <head> itself.
                    // Only watch those two levels: a subtree observer would run on
                    // every DOM change while a reply streams in.
                    const observer = new MutationObserver(() => {
                        if (document.head && document.head !== head) {
                            head = document.head
                            observer.observe(head, { childList: true })
                        }
                        if (!style.isConnected) document.head?.append(style)
                    })
                    observer.observe(document.documentElement, { childList: true })
                    observer.observe(head, { childList: true })
                },
            },
            server: {
                open: true,
            },
        }),
    ],
    build: {
        cssMinify: false,
    },
})
