import { describe, expect, it } from 'vitest'
import { transformAuthor } from '../src/utils/author'

describe('transformAuthor', () => {
    it.each([
        [{ role: 'user' }, 'You'],
        [{ role: 'assistant' }, 'ChatGPT'],
        // Image generation reports as a tool with an obfuscated name
        [{ role: 'tool', name: 't2uay3k.sj1i4kz' }, 'ChatGPT'],
        [{ role: 'tool', name: 'python' }, 'ChatGPT'],
        [{ role: 'system' }, 'system'],
    ] as const)('%o -> %s', (author, label) => {
        expect(transformAuthor(author as any)).toBe(label)
    })
})
