module.exports = {
    root: true,
    extends: [
        '@pionxzh/eslint-config-ts',
    ],
    rules: {
        'no-console': 'off',
        'no-alert': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
}
