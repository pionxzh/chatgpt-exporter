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
export function protectMath(input: string): {
    text: string
    restore: (text: string, escape?: (formula: string) => string) => string
    /** Puts the formulas back as they were written in `input`, without converting the delimiters */
    restoreSource: (text: string) => string
} {
    const formulas: string[] = []
    const sources: string[] = []
    const placeholder = (formula: string, source: string) => {
        sources.push(source)
        return `╬${formulas.push(formula) - 1}╬`
    }

    const text = input.split(CodeRegex).map((part, index) => {
        if (index % 2 === 1) return part

        return part.replace(MathRegex, (...args) => {
            const match: string = args[0]
            const groups: Record<string, string | undefined> = args.at(-1)
            if (groups.block != null) {
                const { blockStart = '', indent = '' } = groups
                const prefix = `${blockStart}${indent}`
                return `${prefix}${placeholder(`$$\n${groups.block.trim()}\n${indent}$$`, match.slice(prefix.length))}`
            }
            if (groups.display != null) return placeholder(`$$${groups.display.trim()}$$`, match)
            if (groups.inline != null) return placeholder(`$${groups.inline.trim()}$`, match)
            return placeholder(groups.dollarBlock ?? groups.dollarInline ?? '', match)
        })
    }).join('')

    const replace = (output: string, values: string[], escape = (value: string) => value) => output.replace(/╬(\d+)╬/g, (match, index: string) => {
        const value = values[Number(index)]
        return value == null ? match : escape(value)
    })
    return {
        text,
        restore: (output, escape) => replace(output, formulas, escape),
        restoreSource: output => replace(output, sources),
    }
}

/**
 * Rewrite a formula from `protectMath` with `\( \)` or `\[ \]` delimiters.
 * The HTML export only renders those, so a `$` in plain text, such as a
 * price, is not taken for math.
 */
export function toBracketDelimiters(formula: string): string {
    const display = /^\$\$([\s\S]*)\$\$$/.exec(formula)
    if (display) return `\\[${display[1]}\\]`
    return `\\(${formula.slice(1, -1)}\\)`
}
