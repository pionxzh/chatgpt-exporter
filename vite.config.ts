import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    // https://github.com/lisonge/vite-plugin-monkey/issues/10#issuecomment-1207264978
    esbuild: {
        charset: 'utf8',
    },
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
                    'https://chat.openai.com/?model=*',
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
                    'https://chatgpt.com/?model=*',
                    'https://chatgpt.com/c/*',
                    'https://chatgpt.com/g/*',
                    'https://chatgpt.com/gpts',
                    'https://chatgpt.com/gpts/*',
                    'https://chatgpt.com/share/*',
                    'https://chatgpt.com/share/*/continue',

                    'https://new.oaifree.com/',
                    'https://new.oaifree.com/?model=*',
                    'https://new.oaifree.com/c/*',
                    'https://new.oaifree.com/g/*',
                    'https://new.oaifree.com/gpts',
                    'https://new.oaifree.com/gpts/*',
                    'https://new.oaifree.com/share/*',
                    'https://new.oaifree.com/share/*/continue',
                ],
                'icon': 'https://chat.openai.com/favicon.ico',
                'run-at': 'document-end',
            },
            build: {
                fileName: 'chatgpt.user.js',
                externalGlobals: [
                    ['jszip', cdn.jsdelivr('JSZip', 'dist/jszip.min.js')],
                    ['html2canvas', cdn.jsdelivr('html2canvas', 'dist/html2canvas.min.js')],
                ],
                cssSideEffects() {
                    return (e) => {
                        const o = document.createElement('style')
                        o.textContent = e
                        document.head.append(o)
                        setInterval(() => {
                            if (o.isConnected) return
                            document.head.append(o)
                        }, 300)
                    }
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
