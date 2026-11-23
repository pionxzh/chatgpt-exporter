import type { ConversationNode, ConversationNodeMessage } from '../api'
import { escapeMarkdownText } from './markdown'

/**
 * Canvas, the document panel ChatGPT offered until May 2026.
 *
 * The model creates a document by sending JSON to `canmore.create_textdoc` and
 * edits it through `canmore.update_textdoc`. Each tool reply carries
 * `metadata.canvas` with the document's id and version. Only the edits are
 * stored, so every version is rebuilt by replaying them in order.
 */

/** `metadata.canvas` of a Canvas tool reply */
export interface CanvasToolMeta {
    textdoc_id?: string
    /** `document`, or `code/<language>` such as `code/python` */
    textdoc_type?: string
    version?: number
    /** The version the edit started from. A gap means the user edited the panel by hand. */
    from_version?: number
    title?: string
    is_failure?: boolean
    error_type?: string
}

export interface CanvasUpdate {
    pattern: string
    multiple?: boolean
    replacement: string
}

interface CanvasDocument {
    title: string
    type: string
    version?: number
    /** Unknown once an edit could not be replayed */
    content?: string
}

/** Exports pass `i18n.t`. It is not imported here, `api.ts` must stay free of the userscript storage it reads. */
export type CanvasLabels = (key: 'Canvas Created' | 'Canvas Updated' | 'Canvas Edit Unavailable', options?: { title: string }) => string

const CREATE = 'canmore.create_textdoc'
const UPDATE = 'canmore.update_textdoc'
const COMMENT = 'canmore.comment_textdoc'

/** Patterns that select the whole document, as in the rewrite every code canvas uses */
const FULL_REWRITE_PATTERNS = ['.*', '(?s).*', '^.*$', '(?s)^.*$', '[\\s\\S]*', '^[\\s\\S]*$']

/**
 * Turn each successful Canvas tool reply on the branch ending at `startNodeId`
 * into an assistant reply that shows the document version it produced, so
 * exports show every version where it appeared in the conversation.
 *
 * Returns the mapping unchanged when the branch has no Canvas. Changed nodes
 * are copies, the raw mapping is left intact.
 */
export function replayCanvases(mapping: Record<string, ConversationNode>, startNodeId: string, labels: CanvasLabels): Record<string, ConversationNode> {
    const branch: string[] = []
    for (let id: string | undefined = startNodeId; id && mapping[id]; id = mapping[id].parent) branch.unshift(id)

    let result = mapping
    const documents = new Map<string, CanvasDocument>()
    for (const id of branch) {
        const node = mapping[id]
        const reply = node.message
        const name: string | undefined = reply?.author.role === 'tool' ? reply.author.name : undefined
        if (!reply || (name !== CREATE && name !== UPDATE && name !== COMMENT)) continue

        // The tool reply follows the call it answers
        const call = node.parent ? mapping[node.parent]?.message : undefined
        const recipient: string | null | undefined = call?.recipient
        const meta = reply.metadata?.canvas
        if (!call || recipient !== name || !meta || meta.is_failure || !meta.textdoc_id) continue

        const block = replayStep(name, call, meta, meta.textdoc_id, documents, labels)
        if (!block) continue

        if (result === mapping) result = { ...mapping }
        result[id] = {
            ...node,
            message: {
                ...reply,
                author: { role: 'assistant', metadata: {} },
                recipient: 'all',
                channel: call.channel,
                content: { content_type: 'text', parts: [block] },
                metadata: { is_canvas_block: true },
            },
        }
    }
    return result
}

/** Applies one successful tool call to `documents` and returns the Markdown to show, if any */
function replayStep(
    name: string,
    call: ConversationNodeMessage,
    meta: CanvasToolMeta,
    id: string,
    documents: Map<string, CanvasDocument>,
    labels: CanvasLabels,
): string | null {
    const body = parseCanvasJson(getCallText(call))
    const previous = documents.get(id)

    if (name === CREATE) {
        const document: CanvasDocument = {
            title: meta.title || stringField(body, 'name') || 'Canvas',
            type: meta.textdoc_type || stringField(body, 'type') || 'document',
            version: meta.version,
            content: stringField(body, 'content') ?? '',
        }
        documents.set(id, document)
        return formatCanvas(document, labels('Canvas Created', { title: document.title }))
    }

    const document: CanvasDocument = previous ?? {
        title: meta.title || 'Canvas',
        type: meta.textdoc_type || 'document',
    }
    // Hand edits in the panel raise the version without a message, so the text is unknown
    const known = document.content !== undefined
        && (meta.from_version == null || document.version == null || meta.from_version === document.version)
    document.version = meta.version
    documents.set(id, document)

    if (name === COMMENT) {
        // Comments leave the text alone
        if (!known) document.content = undefined
        return null
    }

    const updates = Array.isArray(body?.updates) ? (body.updates as unknown[]).filter(isCanvasUpdate) : []
    if (updates.length === 0) return null

    let content = known ? document.content : undefined
    for (const update of updates) {
        if (content === undefined) {
            // A full rewrite does not need the earlier text
            content = FULL_REWRITE_PATTERNS.includes(update.pattern)
                ? expandReplacement(update.replacement, ['']) ?? undefined
                : undefined
        }
        else {
            content = applyCanvasUpdate(content, update) ?? undefined
        }
    }
    document.content = content

    if (content !== undefined) return formatCanvas(document, labels('Canvas Updated', { title: document.title }))
    // Group references need the earlier text, so keep those as written
    const replacements = updates.map(update => formatBody(document.type, expandReplacement(update.replacement, ['']) ?? update.replacement))
    return [formatLabel(labels('Canvas Updated', { title: document.title })), labels('Canvas Edit Unavailable'), ...replacements].join('\n\n')
}

/**
 * Applies one edit as ChatGPT did: the pattern is a Python regular expression
 * used with `re.finditer` and `DOTALL`, and the replacement goes through
 * `re.Match.expand`. Returns `null` when nothing matches or either one is
 * not supported, which is when the tool would have failed too.
 */
export function applyCanvasUpdate(content: string, update: CanvasUpdate): string | null {
    const regex = toRegExp(update.pattern, update.multiple === true)
    if (!regex) return null

    const matches = update.multiple === true
        ? [...content.matchAll(regex)]
        : [regex.exec(content)].filter((match): match is RegExpExecArray => match !== null)
    if (matches.length === 0) return null

    let result = ''
    let end = 0
    for (const match of matches) {
        const replacement = expandReplacement(update.replacement, match)
        if (replacement === null) return null
        result += content.slice(end, match.index) + replacement
        end = match.index! + match[0].length
    }
    return result + content.slice(end)
}

/**
 * Converts a Python pattern to a JavaScript one with the same meaning for the
 * syntax the model uses. Python's `$` also matches before a final newline,
 * and inline flags must lead the pattern.
 */
function toRegExp(pattern: string, global: boolean): RegExp | null {
    let flags = 's'
    let source = pattern
    const inline = /^\(\?([aiLmsux]+)\)/.exec(source)
    if (inline) {
        if (inline[1].includes('x') || inline[1].includes('L')) return null
        if (inline[1].includes('i')) flags += 'i'
        if (inline[1].includes('m')) flags += 'm'
        source = source.slice(inline[0].length)
    }
    const multiline = flags.includes('m')

    let converted = ''
    let inClass = false
    for (let i = 0; i < source.length; i++) {
        const char = source[i]
        if (char === '\\') {
            const next = source[i + 1]
            if (!inClass && next === 'A') converted += '(?<![\\s\\S])'
            else if (!inClass && next === 'Z') converted += '(?![\\s\\S])'
            else converted += char + (next ?? '')
            i++
        }
        else if (inClass) {
            if (char === ']') inClass = false
            converted += char
        }
        else if (char === '[') {
            inClass = true
            converted += char
            // A leading `]` (after an optional `^`) is a literal in both
            if (source[i + 1] === '^') converted += source[++i]
            if (source[i + 1] === ']') converted += source[++i]
        }
        else if (source.startsWith('(?P<', i)) {
            converted += '(?<'
            i += 3
        }
        else if (source.startsWith('(?P=', i)) {
            const close = source.indexOf(')', i)
            if (close === -1) return null
            converted += `\\k<${source.slice(i + 4, close)}>`
            i = close
        }
        else if (char === '$' && !multiline) {
            converted += '(?=\\n?(?![\\s\\S]))'
        }
        else {
            converted += char
        }
    }

    try {
        return new RegExp(converted, global ? `${flags}g` : flags)
    }
    catch {
        return null
    }
}

const TEMPLATE_ESCAPES: Record<string, string> = {
    'n': '\n',
    't': '\t',
    'r': '\r',
    'f': '\f',
    'v': '\v',
    'a': '\x07',
    'b': '\b',
    '\\': '\\',
}

/**
 * Python's `re.Match.expand`: `\1` and `\g<name>` insert groups, `\n` and
 * friends insert characters, and other escapes of ASCII letters are errors.
 * Returns `null` on an error.
 */
export function expandReplacement(template: string, match: RegExpMatchArray | string[]): string | null {
    const groups = 'groups' in match ? match.groups : undefined
    let result = ''
    for (let i = 0; i < template.length; i++) {
        const char = template[i]
        if (char !== '\\') {
            result += char
            continue
        }
        const next = template[++i]
        if (next === undefined) return null

        if (next === 'g') {
            const reference = /^<([^>]+)>/.exec(template.slice(i + 1))
            if (!reference) return null
            const key = reference[1]
            if (/^\d+$/.test(key)) {
                if (Number(key) >= match.length) return null
                result += match[Number(key)] ?? ''
            }
            else {
                if (!groups || !(key in groups)) return null
                result += groups[key] ?? ''
            }
            i += reference[0].length
        }
        else if (next === '0') {
            // An octal escape of up to three digits
            const octal = /^[0-7]{0,2}/.exec(template.slice(i + 1))![0]
            result += String.fromCharCode(Number.parseInt(`0${octal}`, 8))
            i += octal.length
        }
        else if (/\d/.test(next)) {
            const digits = /^\d/.test(template[i + 1] ?? '') ? next + template[i + 1] : next
            const number = Number(digits)
            if (number >= match.length) return null
            result += match[number] ?? ''
            i += digits.length - 1
        }
        else if (next in TEMPLATE_ESCAPES) {
            result += TEMPLATE_ESCAPES[next]
        }
        else if (/[A-Za-z]/.test(next)) {
            return null
        }
        else {
            result += char + next
        }
    }
    return result
}

/**
 * Calls from 2024 are `text` with the JSON in `parts`. Later ones, such as
 * in 2026, are `code` with the JSON in `text`.
 */
function getCallText(call: ConversationNodeMessage): string {
    if (call.content.content_type === 'text') return call.content.parts.join('')
    if (call.content.content_type === 'code') return call.content.text
    return ''
}

/**
 * The model writes the call as JSON. Python's parser accepts raw line breaks
 * and tabs inside strings, JSON.parse does not, so escape them and retry.
 */
function parseCanvasJson(text: string): Record<string, unknown> | null {
    for (const candidate of [text, escapeControlCharactersInStrings(text)]) {
        try {
            const value = JSON.parse(candidate)
            if (value && typeof value === 'object' && !Array.isArray(value)) return value
        }
        catch {}
    }
    return null
}

function escapeControlCharactersInStrings(text: string): string {
    let result = ''
    let inString = false
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (inString && char === '\\') {
            result += char + (text[++i] ?? '')
            continue
        }
        if (char === '"') inString = !inString
        if (inString && char === '\n') result += '\\n'
        else if (inString && char === '\r') result += '\\r'
        else if (inString && char === '\t') result += '\\t'
        else result += char
    }
    return result
}

function stringField(body: Record<string, unknown> | null, key: string): string | undefined {
    const value = body?.[key]
    return typeof value === 'string' ? value : undefined
}

function isCanvasUpdate(value: unknown): value is CanvasUpdate {
    if (!value || typeof value !== 'object') return false
    const { pattern, replacement } = value as Record<string, unknown>
    return typeof pattern === 'string' && typeof replacement === 'string'
}

function formatLabel(label: string): string {
    return `**${escapeMarkdownText(label)}**`
}

function formatCanvas(document: CanvasDocument, label: string): string {
    return `${formatLabel(label)}\n\n${formatBody(document.type, document.content ?? '')}`
}

/** A code canvas becomes a fenced block in its language, a document stays Markdown */
function formatBody(type: string, content: string): string {
    if (!type.startsWith('code/')) return content

    const language = type.slice('code/'.length)
    const fence = '`'.repeat(Math.max(3, ...[...content.matchAll(/`+/g)].map(run => run[0].length + 1)))
    return `${fence}${language === 'react' ? 'jsx' : language}\n${content}\n${fence}`
}
