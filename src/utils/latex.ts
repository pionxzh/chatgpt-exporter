// Fenced code blocks and inline code keep their backslashes and dollar signs.
const CodeRegex = /(```[\s\S]*?(?:```|$)|`[^`\n]+`)/

// ChatGPT writes display math as `\[ ... \]` and inline math as `\( ... \)`.
// Display math on its own lines becomes a `$$` block, which every markdown
// editor supports; `$$` inside a sentence and `$` inline math are kept as is.
const MathRegex = new RegExp([
    /(?<blockStart>^|\n)(?<indent>[ \t]*)\\\[(?<block>[\s\S]+?)\\\][ \t]*(?=\n|$)/.source,
    /\\\[(?<display>[\s\S]+?)\\\]/.source,
    /\\\((?<inline>[\s\S]+?)\\\)/.source,
    /(?<dollarBlock>\$\$[\s\S]+?\$\$)/.source,
    /(?<=^|\s)(?<dollarInline>\$[^\s$][^$\n]*\$)(?=\s|$)/.source,
].join('|'), 'g')

/**
 * Convert math to `$` delimiters and swap it for placeholders, so a markdown
 * round trip does not escape it. `restore` puts the formulas back, passed
 * through `escape` when the output is HTML.
 */
export function protectMath(input: string): { text: string, restore: (text: string, escape?: (formula: string) => string) => string } {
    const formulas: string[] = []
    const placeholder = (formula: string) => `╬${formulas.push(formula) - 1}╬`

    const text = input.split(CodeRegex).map((part, index) => {
        if (index % 2 === 1) return part

        return part.replace(MathRegex, (...args) => {
            const groups: Record<string, string | undefined> = args.at(-1)
            if (groups.block != null) {
                const { blockStart = '', indent = '' } = groups
                return `${blockStart}${indent}${placeholder(`$$\n${groups.block.trim()}\n${indent}$$`)}`
            }
            if (groups.display != null) return placeholder(`$$${groups.display.trim()}$$`)
            if (groups.inline != null) return placeholder(`$${groups.inline.trim()}$`)
            return placeholder(groups.dollarBlock ?? groups.dollarInline ?? '')
        })
    }).join('')

    const restore = (output: string, escape = (formula: string) => formula) => output.replace(/╬(\d+)╬/g, (match, index: string) => {
        const formula = formulas[Number(index)]
        return formula == null ? match : escape(formula)
    })
    return { text, restore }
}
