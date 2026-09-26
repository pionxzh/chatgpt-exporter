import { describe, expect, it, vi } from 'vitest'

// The userscript client touches `document`, and the api module's constants read
// `location` at import time.
vi.mock('vite-plugin-monkey/dist/client', () => ({ unsafeWindow: {} }))
vi.stubGlobal('location', { href: 'https://chatgpt.com/' })
vi.stubGlobal('document', { cookie: '' })

const { RateLimitError } = await import('../src/api')

describe('rateLimitError', () => {
    it('takes the wait from Retry-After', () => {
        const error = new RateLimitError('90')

        expect(error.retryAfterMs).toBe(90_000)
        expect(error.retryAfterFromServer).toBe(true)
    })

    it('falls back to a fixed wait, and says that it did', () => {
        for (const header of [null, '', 'soon', '0', '-5']) {
            const error = new RateLimitError(header)

            expect(error.retryAfterMs).toBe(30_000)
            expect(error.retryAfterFromServer).toBe(false)
        }
    })
})
