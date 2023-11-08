import pionxzh from '@pionxzh/eslint-config'

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
            'ts/ban-types': 'off',
            'node/prefer-global/process': 'off',
        },
    },
)
