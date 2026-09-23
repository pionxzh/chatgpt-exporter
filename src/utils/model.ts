// Slugs that do not follow the `gpt-<major>[-<minor>]` pattern.
const aliases: Array<[prefix: string, name: string]> = [
    ['text-davinci-002', 'GPT-3.5'],
    ['gpt-4-browsing', 'GPT-4 (Browser)'],
]

/**
 * Map a model slug to its family name. Variants are dropped, the full
 * slug is still exported as `{model_name}`.
 *
 * gpt-5-6-thinking -> GPT-5.6, gpt-6-pro -> GPT-6, gpt-4o-mini -> GPT-4o
 */
export function getModelName(slug: string): string {
    const alias = aliases.find(([prefix]) => slug.startsWith(prefix))
    if (alias) return alias[1]

    const gpt = /^gpt-(\d+)(o)?(?:-(\d)(?=-|$))?/.exec(slug)
    if (gpt) {
        const [, major, omni = '', minor] = gpt
        return `GPT-${major}${minor ? `.${minor}` : ''}${omni}`
    }

    // o1, o3-mini, o4-mini-high
    const reasoning = /^o\d+/.exec(slug)
    if (reasoning) return reasoning[0]

    return ''
}
