import { micromark } from 'micromark'
import { fromMarkdown as fm } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toMarkdown as tm } from 'mdast-util-to-markdown'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import type { Content, Parent, Root } from 'mdast'
import type { HtmlExtension } from 'micromark-extension-gfm'
import type { Node } from 'unist'

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
