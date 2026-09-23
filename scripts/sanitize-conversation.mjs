#!/usr/bin/env node
/**
 * Turn a real ChatGPT conversation into a test fixture with no real content.
 *
 *   node scripts/sanitize-conversation.mjs <export.json> <fixture.json> [index]
 *
 * The input is an API conversation, or a batch `JSON` export (an array),
 * where `index` picks the conversation (default 0).
 *
 * Keeps the tree, roles, content types, channels, recipients and the
 * metadata the exporter reads. Every text is replaced by a placeholder
 * numbered in order of appearance, and identical originals share one, so
 * dedup behavior is preserved. Node and message ids are renumbered, image
 * pointers become `sediment://file_N`, and tool names that are not well
 * known become `internal_tool`. Content references are dropped.
 *
 * Only the fixture may be committed. The input is someone's private chat.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const KNOWN_TOOLS = ['web.run', 'web', 'python', 'api_tool', 'api_tool.call_tool', 'container.exec', 'container.download']
const KEEP_META = ['model_slug', 'is_thinking_preamble_message', 'is_visually_hidden_from_conversation', 'finished_duration_sec', 'reasoning_title']

const [input, output, index = '0'] = process.argv.slice(2)
if (!input || !output) {
    console.error('Usage: node scripts/sanitize-conversation.mjs <export.json> <fixture.json> [index]')
    process.exit(1)
}

const data = JSON.parse(readFileSync(input, 'utf8'))
const conversation = Array.isArray(data) ? data[Number(index)] : data
const { mapping } = conversation

// Number nodes breadth-first from the root, so ids follow the tree.
const root = Object.keys(mapping).find(id => !mapping[id].parent)
const order = []
for (const queue = [root]; queue.length > 0;) {
    const id = queue.shift()
    order.push(id)
    queue.push(...(mapping[id].children ?? []))
}
const ids = new Map(order.map((id, i) => [id, `n${i}`]))

const placeholders = new Map()
const counts = new Map()
function placeholder(kind, text) {
    if (!text) return text
    const key = `${kind}\0${text}`
    if (!placeholders.has(key)) {
        const count = (counts.get(kind) ?? 0) + 1
        counts.set(kind, count)
        placeholders.set(key, `${kind} ${count}`)
    }
    return placeholders.get(key)
}

const isKnownTool = name => KNOWN_TOOLS.some(tool => name === tool || name.startsWith(`${tool}.`))

function cleanContent(message) {
    const { content, author, channel } = message
    const metadata = message.metadata ?? {}
    const type = content.content_type

    switch (type) {
        case 'thoughts':
            return {
                content_type: type,
                thoughts: content.thoughts.map(thought => ({
                    summary: placeholder('summary', thought.summary ?? ''),
                    content: placeholder('thought', thought.content ?? ''),
                })),
            }
        case 'reasoning_recap':
            return { content_type: type, content: `Thought for ${metadata.finished_duration_sec ?? 0}s` }
        case 'text': {
            const kind = metadata.is_thinking_preamble_message
                ? 'preamble'
                : author.role === 'user'
                    ? 'question'
                    : channel === 'final' ? 'answer' : `${author.role} text`
            return { content_type: type, parts: content.parts.map(part => placeholder(kind, part)) }
        }
        case 'multimodal_text': {
            const kind = author.role === 'user' ? 'question' : `${author.role} text`
            const parts = content.parts.flatMap((part) => {
                if (typeof part === 'string') return [placeholder(kind, part)]
                if (part.content_type !== 'image_asset_pointer') return []
                return [{
                    content_type: part.content_type,
                    asset_pointer: `sediment://${placeholder('file', part.asset_pointer).replace(' ', '_')}`,
                    width: part.width,
                    height: part.height,
                }]
            })
            return { content_type: type, parts }
        }
        case 'code':
            return { content_type: type, language: content.language ?? 'unknown', text: placeholder('code', content.text ?? '') }
        case 'execution_output':
            return { content_type: type, text: placeholder('output', content.text ?? '') }
        default:
            throw new Error(`Unhandled content_type: ${type}`)
    }
}

function cleanMessage(message, nodeId) {
    const metadata = Object.fromEntries(KEEP_META.filter(key => key in (message.metadata ?? {})).map(key => [key, message.metadata[key]]))
    if (metadata.reasoning_title) metadata.reasoning_title = placeholder('activity', metadata.reasoning_title)

    const recipient = message.recipient === 'all' || isKnownTool(message.recipient) ? message.recipient : 'internal_tool'
    const result = {
        id: `m-${nodeId}`,
        author: { role: message.author.role },
        content: cleanContent(message),
        recipient,
    }
    // Tool names can be obfuscated per account
    if (message.author.name) result.author.name = isKnownTool(message.author.name) ? message.author.name : 'internal_tool'
    if (message.channel) result.channel = message.channel
    if (Object.keys(metadata).length > 0) result.metadata = metadata
    return result
}

const fixtureMapping = {}
for (const id of order) {
    const node = mapping[id]
    const nodeId = ids.get(id)
    fixtureMapping[nodeId] = {
        id: nodeId,
        children: (node.children ?? []).map(child => ids.get(child)),
        ...(node.parent ? { parent: ids.get(node.parent) } : {}),
        ...(node.message ? { message: cleanMessage(node.message, nodeId) } : {}),
    }
}

const fixture = {
    id: 'fixture',
    title: 'Fixture',
    create_time: 1,
    update_time: 2,
    current_node: ids.get(conversation.current_node),
    mapping: fixtureMapping,
}
writeFileSync(output, `${JSON.stringify(fixture, null, 2)}\n`)

// Report every string that is not a placeholder or a known value, for a last manual check.
const allowed = /^(?:question|answer|preamble|summary|thought|activity|code|output|user text|assistant text|tool text) \d+$|^Thought for \d+s$|^sediment:\/\/file_\d+$|^m?-?n\d+$/
const known = new Set(['fixture', 'Fixture', 'all', 'internal_tool', 'unknown', 'final', 'commentary', 'user', 'assistant', 'tool', 'system', ...KNOWN_TOOLS])
const leftovers = new Set()
JSON.stringify(fixture, (key, value) => {
    if (typeof value !== 'string' || !value || ['content_type', 'model_slug', 'language'].includes(key)) return value
    if (!allowed.test(value) && !known.has(value) && !isKnownTool(value)) leftovers.add(value)
    return value
})
if (leftovers.size > 0) {
    console.warn(`Check these strings before committing:\n${[...leftovers].map(s => `  ${JSON.stringify(s)}`).join('\n')}`)
}
console.log(`Wrote ${output} (${order.length} nodes)`)
