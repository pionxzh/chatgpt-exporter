import { defineConfig } from 'vitest/config'

// Standalone config: the tests target plain modules and do not need the
// preact / vite-plugin-monkey plugin chain from vite.config.ts.
export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
    },
})
