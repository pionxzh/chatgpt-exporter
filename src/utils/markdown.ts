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

export function toMarkdown(ast: Content | Root): string {
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
        extensions: [gfmToMarkdown()],
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
