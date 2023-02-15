module.exports = {
    root: true,
    extends: [
        '@pionxzh/eslint-config-react',
    ],
    rules: {
        'no-console': 'off',
        'no-alert': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
    overrides: [
        {
            files: ['template.html'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
}
