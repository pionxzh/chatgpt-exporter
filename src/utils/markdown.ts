import { toHtml as hastToHtml } from 'hast-util-to-html'
import { fromMarkdown as fm } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toHast } from 'mdast-util-to-hast'
import { toMarkdown as tm } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import type { Content, Parent, Root } from 'mdast'
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

export function toHtml(node: Root): string {
    return hastToHtml(toHast(node)!)
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
