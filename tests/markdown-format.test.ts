import { describe, expect, it } from 'vitest'
import { escapeMarkdownText, fromMarkdown, getPromptTitle, nestHeadings, nestHeadingsInSource, toMarkdown } from '../src/utils/markdown'

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

    it('skips lines without text, such as a code block, to the first line of text', () => {
        expect(getPromptTitle('```js\nuseEffect(() => {}, [count])\n```\nWhy does this loop?\nMore text'))
            .toBe('Why does this loop?')
        expect(getPromptTitle('~~~\ncode\n~~~\n\nAfter a tilde fence')).toBe('After a tilde fence')
        expect(getPromptTitle('````md\n```\nnot the end\n````\nAfter a longer fence')).toBe('After a longer fence')
        expect(getPromptTitle('---\nAfter a rule')).toBe('After a rule')
        expect(getPromptTitle('![](a.png)\nAfter an image')).toBe('After an image')
    })

    it('skips code, math and HTML that the line by line view would miss', () => {
        expect(getPromptTitle('    indented code\n\nThen text')).toBe('Then text')
        expect(getPromptTitle('> ```\n> quoted code\n> ```\n\nAfter a quoted fence')).toBe('After a quoted fence')
        expect(getPromptTitle('- ```js\n  x = 1\n  ```\n\nAfter a list fence')).toBe('After a list fence')
        expect(getPromptTitle('$$\nE = mc^2\n$$\nWhat is this?')).toBe('What is this?')
        expect(getPromptTitle('$$E = mc^2$$\n\nAnd this?')).toBe('And this?')
        expect(getPromptTitle('\\[\nx^2\n\\]\nBracket math')).toBe('Bracket math')
        expect(getPromptTitle('Why is $x_1 * y_2$ zero?')).toBe('Why is $x_1 * y_2$ zero?')
        expect(getPromptTitle('<!-- note -->\n\nReal question')).toBe('Real question')
        expect(getPromptTitle('<details>\n<summary>Log</summary>\n</details>')).toBe('Log')
    })

    it('uses the header row of a table', () => {
        expect(getPromptTitle('| Name | Price |\n| --- | --- |\n| a | 1 |')).toBe('Name | Price')
    })

    it('stops at a hard line break', () => {
        expect(getPromptTitle('First line  \nsecond line')).toBe('First line')
    })

    it('uses the first line of code when the prompt is only code', () => {
        expect(getPromptTitle('```python\n\n    print("hi")\nprint("bye")\n```')).toBe('print("hi")')
        expect(getPromptTitle('```\nunclosed fence')).toBe('unclosed fence')
        expect(getPromptTitle('```\na\n```\n\n```\nb\n```')).toBe('a')
    })

    it('returns an empty string when the prompt has no text or code', () => {
        expect(getPromptTitle('')).toBe('')
        expect(getPromptTitle('  \n\t\n ')).toBe('')
        expect(getPromptTitle('```\n```')).toBe('')
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

describe('nestHeadingsInSource', () => {
    it('moves only the heading markers and keeps the rest as written', () => {
        expect(nestHeadingsInSource('# My *lib*\n\nUse   it_now.\n\n## Install', 2))
            .toBe('## My *lib*\n\nUse   it_now.\n\n### Install')
    })

    it('handles indented, quoted and listed headings', () => {
        expect(nestHeadingsInSource('  # A\n\n> # B\n\n- # C', 2)).toBe('  ## A\n\n> ## B\n\n- ## C')
    })

    it('keeps Windows line endings', () => {
        expect(nestHeadingsInSource('# A\r\ntext\r\n', 2)).toBe('## A\r\ntext\r\n')
    })

    it('turns setext headings into ATX', () => {
        expect(nestHeadingsInSource('Title\n=====\n\nSub\n---\n\ntext', 2)).toBe('## Title\n\n### Sub\n\ntext')
        expect(nestHeadingsInSource('> Two\n> lines\n> ===', 2)).toBe('> ## Two lines')
    })

    it('does not take a = line in a math block for a heading', () => {
        expect(nestHeadingsInSource('# A\n\n$$\nx\n=\ny\n$$\n\n\\[\na\n=\n\\]', 2))
            .toBe('## A\n\n$$\nx\n=\ny\n$$\n\n\\[\na\n=\n\\]')
        expect(nestHeadingsInSource('$$\nx\n=\ny\n$$', 2)).toBe('$$\nx\n=\ny\n$$')
    })

    it('stops at level 6 and skips code blocks', () => {
        expect(nestHeadingsInSource('# A\n\n###### B\n\n```\n# not a heading\n```', 2))
            .toBe('## A\n\n###### B\n\n```\n# not a heading\n```')
    })

    it('leaves headings that are already deep enough', () => {
        expect(nestHeadingsInSource('## A\n\n### B', 2)).toBe('## A\n\n### B')
        expect(nestHeadingsInSource('No headings', 2)).toBe('No headings')
    })
})
