import { pionxzh } from '@pionxzh/eslint-config'

export default pionxzh(
    {
        typescript: true,
        react: true,
        vue: false,
        yaml: false,
        ignores: ['*.md', '.release-please-manifest.json'],
    },
    {
        rules: {
            'no-alert': 'off',
            'ts/no-empty-object-type': 'off',
            'node/prefer-global/process': 'off',
            // Splitting JSX text into separate children changes the emitted
            // bundle for no runtime benefit.
            'style/jsx-one-expression-per-line': 'off',
            // Buttons here never live inside a <form>, so the implicit submit
            // type is harmless.
            'react-dom/no-missing-button-type': 'off',
            // Userscript bundle, no fast refresh.
            'react-refresh/only-export-components': 'off',
        },
    },
)
