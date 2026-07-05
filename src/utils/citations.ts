import type { ContentReference, ContentReferenceSource, ConversationNodeMessage } from '../api'

type CitationOutput = 'markdown' | 'text'

interface TransformContentReferenceOptions {
    output?: CitationOutput
    inlineReferenceMode?: 'expanded' | 'alt'
    includeSourceList?: boolean
    sourceListLabel?: string
}

const CitationMarkerRegex = /\uE200cite(?:\uE202[^\uE200\uE201]*)+\uE201/gu

export function normalizeCitationText(input: string): string {
    return input
        .replaceAll(/[\u00A0\u202F\u2007\u2060]/gu, ' ')
        .replaceAll(/[\u2010-\u2015\u2212]/gu, '-')
        .replaceAll(/[\uE203\uE204]/gu, '')
}

export function transformContentReferences(
    input: string,
    metadata: ConversationNodeMessage['metadata'],
    options: TransformContentReferenceOptions = {},
): string {
    const outputType = options.output ?? 'markdown'
    const inlineReferenceMode = options.inlineReferenceMode ?? 'expanded'
    const contentRefs = metadata?.content_references ?? []
    let output = normalizeCitationText(input)

    const sortedRefs = [...contentRefs]
        .filter(ref => ref.type !== 'sources_footnote')
        .sort((a, b) => (b.matched_text?.length || 0) - (a.matched_text?.length || 0))

    for (const ref of sortedRefs) {
        if (!ref.matched_text) continue

        const matchedText = normalizeCitationText(ref.matched_text)
        if (!matchedText) continue

        const replacement = formatInlineReference(ref, outputType, inlineReferenceMode)
        output = output.replaceAll(matchedText, replacement)
    }

    output = output.replace(CitationMarkerRegex, '')

    if (options.includeSourceList !== false) {
        const sources = getSourcesFootnoteSources(contentRefs)
        if (sources.length > 0) {
            output = appendSourcesSection(output, sources, outputType, options.sourceListLabel ?? 'Sources')
        }
    }

    return output
}

export function formatCitationSource(source: ContentReferenceSource, output: CitationOutput): string {
    const label = getSourceLabel(source)
    const url = source.url?.trim()

    if (!url) return output === 'markdown' ? escapeMarkdownText(label) : label

    if (output === 'text') {
        return `${label}: ${url}`
    }

    return `[${escapeMarkdownText(label)}](<${escapeMarkdownUrl(url)}>)`
}

function formatInlineReference(ref: ContentReference, output: CitationOutput, mode: 'expanded' | 'alt'): string {
    if (mode === 'alt') return ref.alt || ''

    const sources = getInlineSources(ref)

    if (sources.length > 0) {
        const separator = output === 'markdown' ? ', ' : '; '
        return `(${sources.map(source => formatCitationSource(source, output)).join(separator)})`
    }

    if (ref.alt) return ref.alt

    return ''
}

function getInlineSources(ref: ContentReference): ContentReferenceSource[] {
    const sources: ContentReferenceSource[] = []

    for (const item of ref.items ?? []) {
        sources.push(item)
        sources.push(...(item.supporting_websites ?? []))
    }

    sources.push(...(ref.fallback_items ?? []))

    if (sources.length === 0 && (ref.url || ref.title || ref.attribution)) {
        sources.push(ref)
    }

    if (sources.length === 0 && ref.safe_urls?.length) {
        sources.push(...ref.safe_urls.map(url => ({ title: url, url })))
    }

    return dedupeSources(sources)
}

function getSourcesFootnoteSources(contentRefs: ContentReference[]): ContentReferenceSource[] {
    const sources = contentRefs
        .filter(ref => ref.type === 'sources_footnote')
        .flatMap((ref) => {
            if (ref.sources?.length) return ref.sources
            if (ref.items?.length) return ref.items
            if (ref.fallback_items?.length) return ref.fallback_items
            if (ref.safe_urls?.length) return ref.safe_urls.map(url => ({ title: url, url }))
            return []
        })

    return dedupeSources(sources)
}

function appendSourcesSection(input: string, sources: ContentReferenceSource[], output: CitationOutput, label: string): string {
    const trimmed = input.trimEnd()
    const sourceList = output === 'markdown'
        ? [
                `**${escapeMarkdownText(label)}:**`,
                '',
                ...sources.map(source => `- ${formatCitationSource(source, output)}`),
            ].join('\n')
        : [
                `${label}:`,
                ...sources.map((source, index) => `${index + 1}. ${formatCitationSource(source, output)}`),
            ].join('\n')

    return trimmed ? `${trimmed}\n\n${sourceList}` : sourceList
}

function dedupeSources(sources: ContentReferenceSource[]): ContentReferenceSource[] {
    const seen = new Set<string>()
    const result: ContentReferenceSource[] = []

    for (const source of sources) {
        const key = source.url?.trim() || getSourceLabel(source)
        if (!key || seen.has(key)) continue
        seen.add(key)
        result.push(source)
    }

    return result
}

function getSourceLabel(source: ContentReferenceSource): string {
    return source.attribution?.trim()
        || source.title?.trim()
        || source.url?.trim()
        || 'Source'
}

function escapeMarkdownText(input: string): string {
    return input
        .replaceAll('\\', '\\\\')
        .replaceAll('[', '\\[')
        .replaceAll(']', '\\]')
        .replaceAll('\n', ' ')
}

function escapeMarkdownUrl(input: string): string {
    return input
        .replaceAll('<', '%3C')
        .replaceAll('>', '%3E')
        .replaceAll('\n', '')
}
