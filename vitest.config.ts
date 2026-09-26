import preact from '@preact/preset-vite'
import { defineConfig } from 'vitest/config'

// Standalone config: the tests do not need vite-plugin-monkey from
// vite.config.ts. The preact plugin is here for the component tests' JSX; the
// plain-module tests do not go through it. Those component tests ask for a DOM
// with a `@vitest-environment happy-dom` docblock, so everything else keeps the
// default node environment.
export default defineConfig({
    plugins: [preact({ devToolsEnabled: false, devtoolsInProd: false })],
    test: {
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    },
})
