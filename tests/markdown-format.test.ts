import { describe, expect, it } from 'vitest'
import { fromMarkdown, toMarkdown } from '../src/utils/markdown'

function format(input: string) {
    return toMarkdown(fromMarkdown(input), input)
}

describe('markdown re-serialization', () => {
    it('normalizes block syntax', () => {
        expect(format('Title\n=====\n\n_a_ and __b__\n\n***\n\n~~~\ncode\n~~~'))
            .toBe('# Title\n\n*a* and **b**\n\n---\n\n```\ncode\n```\n')
    })

    it('keeps text as written instead of escaping it', () => {
        expect(format('snake_case and [brackets] and 1 * 2 and #tag'))
            .toBe('snake_case and [brackets] and 1 * 2 and #tag\n')
    })

    it('keeps character references', () => {
        expect(format('&lt;div&gt; &amp; &copy;')).toBe('&lt;div&gt; &amp; &copy;\n')
    })

    it('keeps trailing-space line breaks (#300)', () => {
        expect(format('one  \ntwo')).toBe('one  \ntwo\n')
    })

    it('does not repeat container prefixes on continuation lines', () => {
        expect(format('> first line\n> second line')).toBe('> first line\n> second line\n')
        expect(format('- item\n  continued')).toBe('- item\n  continued\n')
    })

    it('aligns tables by display width', () => {
        expect(format('| 名稱 | n |\n| --- | --- |\n| 蘋果 | 1 |\n| apple | 2 |'))
            .toBe('| 名稱  | n |\n| ----- | - |\n| 蘋果  | 1 |\n| apple | 2 |\n')
    })
})
