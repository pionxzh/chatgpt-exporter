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
            // Wrapping the provider value in useMemo is a runtime change;
            // keep it visible without failing lint until it is done deliberately.
            'react/no-unstable-context-value': 'warn',
        },
    },
)
