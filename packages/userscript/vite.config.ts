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
                    'https://chat.openai.com',
                    // support https://chat.openai.com/c?model=gpt-4
                    'https://chat.openai.com/c?*',
                    // support https://chat.openai.com/c/123456789
                    'https://chat.openai.com/c/*',
                ],
                'icon': 'https://chat.openai.com/favicon.ico',
                'run-at': 'document-end',
            },
            build: {
                fileName: 'chatgpt.user.js',
                minifyCss: false,
                externalGlobals: [
                    ['jszip', cdn.jsdelivr('JSZip', 'dist/jszip.min.js')],
                    ['html2canvas', cdn.jsdelivr('html2canvas', 'dist/html2canvas.min.js')],
                ],
            },
            server: {
                open: true,
            },
        }),
    ],
})
