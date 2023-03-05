import type { Options as FmOptions } from 'mdast-util-from-markdown'
import { fromMarkdown as fm } from 'mdast-util-from-markdown'
import type { Options as TmOptions } from 'mdast-util-to-markdown'
import { toMarkdown as tm } from 'mdast-util-to-markdown'
import type { Content, Parent, Root } from 'mdast'
import {
    frontmatterFromMarkdown,
    frontmatterToMarkdown,
} from 'mdast-util-frontmatter'
import { frontmatter } from 'micromark-extension-frontmatter'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { toHast } from 'mdast-util-to-hast'
import { toHtml as hastToHtml } from 'hast-util-to-html'
import type { Node } from 'unist'

// ref: https://github.com/rxliuli/mdbook/blob/master/libs/markdown-util

export function fromMarkdown(content: string, options?: FmOptions): Root {
    return fm(content, {
        ...options,
        extensions: [frontmatter(['yaml']), gfm()].concat(options?.extensions ?? []),
        mdastExtensions: [
            frontmatterFromMarkdown(['yaml']),
            gfmFromMarkdown(),
        ].concat(options?.mdastExtensions ?? []),
    })
}

export function toMarkdown(ast: Content | Root, options?: TmOptions): string {
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
        ...options,
        extensions: [frontmatterToMarkdown(['yaml']), gfmToMarkdown()].concat(options?.extensions ?? []),
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
