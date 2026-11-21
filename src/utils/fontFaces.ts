/**
 * Remove `@font-face` rules that an SVG image cannot load: those whose only
 * sources are remote URLs. Rules with a `data:` or `blob:` source, or a
 * `local()` one, are kept.
 */
export function dropRemoteFontFaces(css: string): string {
    return css.replace(/@font-face\s*\{[^}]*\}/g, (rule) => {
        const urls = rule.match(/url\([^)]*\)/g) ?? []
        if (urls.length === 0 || /local\(/.test(rule)) return rule
        const loadable = urls.some(url => /^url\(\s*["']?(?:data|blob):/.test(url))
        return loadable ? rule : ''
    })
}
