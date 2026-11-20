import { micromark } from 'micromark'
import { fromMarkdown as fm } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toMarkdown as tm } from 'mdast-util-to-markdown'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import type { Content, Heading, Parent, Root } from 'mdast'
import type { HtmlExtension } from 'micromark-extension-gfm'
import type { Node } from 'unist'
import { protectMath } from './latex'

// ref: https://github.com/rxliuli/mdbook/blob/master/libs/markdown-util

export function fromMarkdown(content: string): Root {
    return fm(content, {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()],
    })
}

const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const WIDE = /[\p{Extended_Pictographic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u3000-\u303F\uFF01-\uFF60\uFFE0-\uFFE6]/u

/** Width in a monospace font, so tables line up with CJK text and emoji. */
function displayWidth(value: string): number {
    let width = 0
    for (const { segment } of graphemes.segment(value)) width += WIDE.test(segment) ? 2 : 1
    return width
}

/**
 * Re-serializes a tree parsed from `source` in one consistent style: ATX
 * headings, `*` emphasis, backtick fences, `---` rules and aligned tables.
 *
 * Text and line breaks are copied from `source` as written. The default
 * handlers would escape characters like `_` and `[`, decode entities, and
 * turn trailing-space line breaks into backslashes.
 */
export function toMarkdown(ast: Content | Root, source: string): string {
    const slice = (node: Node) => {
        const start = node.position!.start.offset!
        let end = node.position!.end.offset!
        // from-markdown 1.x ends a text node before the `;` of a trailing character reference
        if (source[end] === ';' && /&(?:#x?[\da-f]+|\w+)$/i.test(source.slice(start, end))) end++
        return source.slice(start, end)
    }
    return tm(ast, {
        bullet: '-',
        bulletOther: '*',
        bulletOrdered: '.',
        emphasis: '*',
        fence: '`',
        fences: true,
        listItemIndent: 'one',
        resourceLink: false,
        rule: '-',
        ruleRepetition: 3,
        ruleSpaces: false,
        strong: '*',
        extensions: [gfmToMarkdown({ stringLength: displayWidth })],
        handlers: {
            // Continuation lines hold the container prefix (`> `, list indent),
            // which the container handlers add back. A paragraph line never
            // starts with whitespace or `>`, so strip those.
            text: node => node.position
                ? slice(node).split('\n').map((line, i) => i ? line.replace(/^[ \t>]*/, '') : line).join('\n')
                : node.value,
            break: node => node.position ? slice(node) : '  \n',
        },
    })
}

/**
 * Moves every heading down by the same number of levels so the highest one
 * is at `depth`, for a tree placed under a heading of its own. Levels past 6
 * stay at 6. Headings already at `depth` or below are left as they are.
 */
export function nestHeadings(tree: Root, depth: number): void {
    const headings = collectHeadings(tree)
    const shift = depth - Math.min(...headings.map(heading => heading.depth))
    if (shift <= 0) return
    for (const heading of headings) {
        heading.depth = Math.min(heading.depth + shift, 6) as Heading['depth']
    }
}

/**
 * Like `nestHeadings`, for Markdown that is not re-serialized, such as a
 * prompt or the thinking process: only the heading markers change, and the
 * rest of `source` stays as written. A setext heading becomes ATX.
 */
export function nestHeadingsInSource(source: string, depth: number): string {
    // A `=` line inside a `$$` block would read as a setext underline
    const { text: markdown, restoreSource } = protectMath(source)
    const headings = collectHeadings(fromMarkdown(markdown))
    const shift = depth - Math.min(...headings.map(heading => heading.depth))
    if (shift <= 0) return source

    let output = markdown
    // From the end, so the offsets of earlier headings stay valid
    for (const heading of headings.reverse()) {
        const start = heading.position!.start.offset!
        const end = heading.position!.end.offset!
        const marker = '#'.repeat(Math.min(heading.depth + shift, 6))
        const atx = /^[ \t]*(#{1,6})/.exec(markdown.slice(start, end))
        if (atx) {
            const markerStart = start + atx[0].length - atx[1].length
            output = output.slice(0, markerStart) + marker + output.slice(start + atx[0].length)
        }
        else {
            // Setext: the text lines, then a `===` or `---` underline
            const lines = markdown.slice(start, end).split(/\r?\n/).slice(0, -1)
            const text = lines.map((line, i) => i ? line.replace(/^[ \t>]*/, '') : line).join(' ')
            output = `${output.slice(0, start)}${marker} ${text}${output.slice(end)}`
        }
    }
    return restoreSource(output)
}

function collectHeadings(tree: Root): Heading[] {
    const headings: Heading[] = []
    const collect = (node: Content | Root) => {
        if (node.type === 'heading') headings.push(node)
        if ('children' in node) (node.children as Content[]).forEach(collect)
    }
    collect(tree)
    return headings
}

const words = new Intl.Segmenter(undefined, { granularity: 'word' })
const PROMPT_TITLE_WORDS = 10
const PROMPT_TITLE_LENGTH = 80

/** The text a reader sees, without Markdown syntax. HTML stays as written. */
function toPlainText(node: Content | Root): string {
    switch (node.type) {
        case 'code':
        case 'image':
        case 'imageReference':
            return ''
        case 'break':
            return '\n'
    }
    if ('value' in node) return node.value
    if ('children' in node) return (node.children as Content[]).map(toPlainText).join('')
    return ''
}

/** Cuts `text` to the graphemes that fit in `length` UTF-16 units. */
function sliceGraphemes(text: string, length: number): string {
    let end = 0
    for (const { segment, index } of graphemes.segment(text)) {
        if (index + segment.length > length) break
        end = index + segment.length
    }
    return text.slice(0, end)
}

// A formula swapped out by `protectMath`
const MATH_PLACEHOLDER = /╬\d+╬/g

/**
 * The first line of `text` that has something to read, with whitespace
 * collapsed. A line that is only math, such as a display formula, is
 * skipped.
 */
function firstTextLine(text: string): string {
    for (const raw of text.split(/\r\n?|\n/)) {
        const line = raw.replace(/\s+/g, ' ').trim()
        if (line.replace(MATH_PLACEHOLDER, '').trim()) return line
    }
    return ''
}

/**
 * A short title for a prompt, like ChatGPT's prompt navigation: the first
 * line with text, without Markdown syntax, cut after about ten words. Code
 * and math blocks, rules, and HTML tags are skipped, so a prompt that starts
 * with code is titled by the text after it, and a prompt that is only code
 * by its first line of code. Words are found with `Intl.Segmenter`, so text
 * without spaces, such as Chinese, is cut too.
 *
 * Returns an empty string when the prompt has no text or code.
 */
export function getPromptTitle(prompt: string): string {
    let codeLine = ''
    // The first line with text, in document order, including inside quotes and lists
    const visit = (node: Content | Root): string => {
        switch (node.type) {
            case 'code':
                codeLine ||= firstTextLine(node.value)
                return ''
            case 'html':
                return firstTextLine(node.value.replace(/<!--[\s\S]*?(?:-->|$)|<[^>]*>/g, '\n'))
            case 'table':
                return firstTextLine(node.children[0]?.children.map(toPlainText).join(' | ') ?? '')
            case 'paragraph':
            case 'heading':
                return firstTextLine(toPlainText(node))
            case 'thematicBreak':
            case 'definition':
                return ''
        }
        if ('children' in node) {
            for (const child of node.children as Content[]) {
                const line = visit(child)
                if (line) return line
            }
        }
        return ''
    }
    // The parser has no math syntax, so keep formulas out of it
    const { text, restoreSource } = protectMath(prompt)
    const title = restoreSource(visit(fromMarkdown(text)) || codeLine)
    return title ? shortenTitle(title) : ''
}

/** Cuts `text` after about ten words, marking the cut with `…`. */
function shortenTitle(text: string): string {
    let count = 0
    // End of the last word that fits
    let end = 0
    for (const { segment, index, isWordLike } of words.segment(text)) {
        if (!isWordLike) continue
        if (++count > PROMPT_TITLE_WORDS || index + segment.length > PROMPT_TITLE_LENGTH) break
        end = index + segment.length
    }
    if (count <= PROMPT_TITLE_WORDS && text.length <= PROMPT_TITLE_LENGTH) return text

    // Cut after the last word that fits, or mid-word when the first word is
    // already too long, such as a long identifier
    return `${end > 0 ? text.slice(0, end) : sliceGraphemes(text, PROMPT_TITLE_LENGTH)}…`
}

/**
 * Escapes plain text for one line of Markdown, such as a heading, so it
 * shows as written instead of as emphasis, code, links or HTML.
 */
export function escapeMarkdownText(text: string): string {
    return text
        // `_` inside a word, as in snake_case, cannot start emphasis
        .replace(/[\\`*[<~]|(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])/gu, '\\$&')
        .replace(/&(?=#?\w+;)/g, '\\&')
        // A trailing run of `#` after a space would close an ATX heading
        .replace(/(^|\s)(#+)$/, '$1\\$2')
}

// Drop raw HTML in the markdown, as mdast-util-to-hast did, instead of
// micromark's default of showing it escaped. ChatGPT writes <br> in tables.
const dropRawHtml: HtmlExtension = {
    exit: {
        htmlFlowData() {},
        htmlTextData() {},
    },
}

/**
 * Compiles markdown straight to HTML, without building a syntax tree.
 * URLs with protocols other than http(s), mailto, irc and xmpp are dropped.
 */
export function toHtml(markdown: string): string {
    return micromark(markdown, {
        extensions: [gfm()],
        htmlExtensions: [gfmHtml(), dropRawHtml],
    })
}

export function flatMap<T extends Node>(
    tree: T,
    fn: (node: Node, i: number, parent?: Parent) => Node[],
): T {
    function transform(node: Node, i: number, parent?: Parent): Node[] {
        if ('children' in node) {
            const p = node as unknown as Parent
            p.children = p.children.flatMap((item, i) => transform(item, i, p)) as any
        }
        return fn(node, i, parent)
    }
    return transform(tree, 0, undefined)[0] as T
}
