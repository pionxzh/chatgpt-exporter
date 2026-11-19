import { describe, expect, it } from 'vitest'
import { escapeMarkdownText, fromMarkdown, getPromptTitle, nestHeadings, toMarkdown } from '../src/utils/markdown'

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

describe('getPromptTitle', () => {
    it('uses only the first line', () => {
        expect(getPromptTitle('Explain closures\nin JavaScript')).toBe('Explain closures')
        expect(getPromptTitle('Windows line\r\nendings')).toBe('Windows line')
        expect(getPromptTitle('\n\n   Skip leading blank lines\nnot this')).toBe('Skip leading blank lines')
    })

    it('strips Markdown formatting', () => {
        expect(getPromptTitle('**Fix** the `parse()` bug in [utils](https://example.com) _now_'))
            .toBe('Fix the parse() bug in utils now')
        expect(getPromptTitle('# A heading')).toBe('A heading')
        expect(getPromptTitle('> a quote')).toBe('a quote')
        expect(getPromptTitle('- [ ] a task')).toBe('a task')
        expect(getPromptTitle('~~old~~ new &amp; improved')).toBe('old new & improved')
        expect(getPromptTitle('see ![diagram](a.png) here')).toBe('see here')
    })

    it('keeps snake_case and lone markers as written', () => {
        expect(getPromptTitle('rename my_var to a * b')).toBe('rename my_var to a * b')
    })

    it('keeps HTML as text, the way ChatGPT shows a prompt', () => {
        expect(getPromptTitle('What does <br> do?')).toBe('What does <br> do?')
    })

    it('collapses whitespace', () => {
        expect(getPromptTitle('a\t\tb    c ')).toBe('a b c')
    })

    it('keeps about the first ten words', () => {
        expect(getPromptTitle('one two three four five six seven eight nine ten'))
            .toBe('one two three four five six seven eight nine ten')
        expect(getPromptTitle('one, two, three, four, five, six, seven, eight, nine, ten, eleven twelve'))
            .toBe('one, two, three, four, five, six, seven, eight, nine, ten…')
        expect(getPromptTitle('Is this the end?')).toBe('Is this the end?')
    })

    it('counts words in text without spaces', () => {
        const prompt = '請幫我寫一個能夠自動匯出所有對話紀錄的腳本並且支援多種格式'
        const title = getPromptTitle(prompt)
        expect(title).toMatch(/^請幫我寫.+…$/)
        expect(title.length).toBeLessThan(prompt.length)
    })

    it('caps a very long first line', () => {
        expect(getPromptTitle('a'.repeat(500))).toBe(`${'a'.repeat(80)}…`)
        const words = `${'word'.repeat(15)} ${'more'.repeat(15)} rest`
        expect(getPromptTitle(words)).toBe(`${'word'.repeat(15)}…`)
    })

    it('does not split an emoji at the cap', () => {
        const title = getPromptTitle('👍'.repeat(100))
        expect(title).toBe(`${'👍'.repeat(40)}…`)
    })

    it('returns an empty string when the first line has no text', () => {
        expect(getPromptTitle('')).toBe('')
        expect(getPromptTitle('  \n\t\n ')).toBe('')
        expect(getPromptTitle('```python\nprint("hi")\n```')).toBe('')
        expect(getPromptTitle('---\nAfter a rule')).toBe('')
        expect(getPromptTitle('![](a.png)')).toBe('')
    })
})

describe('escapeMarkdownText', () => {
    it('escapes characters that would format the text', () => {
        expect(escapeMarkdownText('a*b `c` [d] <e> ~f~ \\g'))
            .toBe('a\\*b \\`c\\` \\[d] \\<e> \\~f\\~ \\\\g')
    })

    it('escapes underscores only where they could start emphasis', () => {
        expect(escapeMarkdownText('my_var _x_')).toBe('my_var \\_x\\_')
    })

    it('escapes character references but not a lone ampersand', () => {
        expect(escapeMarkdownText('AT&T &amp; &#42;')).toBe('AT&T \\&amp; \\&#42;')
    })

    it('keeps a trailing # from closing a heading', () => {
        expect(escapeMarkdownText('C# and issue #')).toBe('C# and issue \\#')
        expect(escapeMarkdownText('##')).toBe('\\##')
    })
})

describe('nestHeadings', () => {
    function nest(input: string, depth: number) {
        const tree = fromMarkdown(input)
        nestHeadings(tree, depth)
        return toMarkdown(tree, input)
    }

    it('moves the highest heading to the given level and keeps the others below it', () => {
        expect(nest('# A\n\n## B\n\n> ### C', 3)).toBe('### A\n\n#### B\n\n> ##### C\n')
    })

    it('stops at level 6', () => {
        expect(nest('## A\n\n##### B', 3)).toBe('### A\n\n###### B\n')
    })

    it('leaves headings that are already deep enough', () => {
        expect(nest('### A\n\n#### B', 3)).toBe('### A\n\n#### B\n')
        expect(nest('No headings', 3)).toBe('No headings\n')
    })
})
