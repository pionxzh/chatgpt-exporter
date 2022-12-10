import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    // https://github.com/lisonge/vite-plugin-monkey/issues/10#issuecomment-1207264978
    esbuild: {
        charset: 'utf8',
    },
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                'name': packageJson.title,
                'author': packageJson.author,
                'namespace': packageJson.author,
                'description': packageJson.description,
                'license': packageJson.license,
                'match': 'https://chat.openai.com/chat',
                'icon': 'https://chat.openai.com/favicon.ico',
                'run-at': 'document-end',
            },
            build: {
                fileName: 'chatgpt.user.js',
                minifyCss: false,
            },
            server: {
                open: true,
            },
        }),
    ],
})
