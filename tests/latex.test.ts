import { describe, expect, it } from 'vitest'
import { protectMath } from '../src/utils/latex'
import { fromMarkdown, toMarkdown } from '../src/utils/markdown'

// Same steps as the markdown exporter
function format(input: string) {
    const { text, restore } = protectMath(input)
    return restore(toMarkdown(fromMarkdown(text)))
}

describe('math in markdown export', () => {
    it('puts display math between `$$` lines (#281)', () => {
        expect(format('Softmax:\n\n\\[\np_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}\n\\]\n\nDone.'))
            .toBe('Softmax:\n\n$$\np_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}\n$$\n\nDone.\n')
        expect(format('\\[ a_1 * b_1 \\]'))
            .toBe('$$\na_1 * b_1\n$$\n')
    })

    it('keeps inline math intact', () => {
        expect(format('Here \\(h_1\\) and \\( z * 2 \\) are vectors, and $$x_1$$ too.'))
            .toBe('Here $h_1$ and $z * 2$ are vectors, and $$x_1$$ too.\n')
    })

    it('leaves code untouched', () => {
        const input = 'Match brackets:\n\n```js\nconst re = /\\[(\\d+)\\]/\n```\n\nor `\\(x\\)` inline, then \\(y_1\\).'
        expect(format(input))
            .toBe('Match brackets:\n\n```js\nconst re = /\\[(\\d+)\\]/\n```\n\nor `\\(x\\)` inline, then $y_1$.\n')
    })

    it('leaves prices alone', () => {
        expect(format('| NT$1,000 | **NT$2,500** |\n| --- | --- |\n| a | b |'))
            .toBe('| NT$1,000 | **NT$2,500** |\n| -------- | ------------ |\n| a        | b            |\n')
    })
})
