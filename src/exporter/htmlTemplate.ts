/**
 * Replace every `{{name}}` in the template in a single pass. Values are
 * inserted verbatim, so `$$` math and `{{name}}` inside the conversation
 * stay as they are. Unknown names are left untouched.
 */
export function fillTemplate(template: string, values: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
        return Object.hasOwn(values, key) ? values[key] : match
    })
}

export function escapeHtml(html: string) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

/** Metadata is plain text, a title such as `<Draft>` must not become markup. */
export function metaDetailsHtml(metaList: ReadonlyArray<readonly [name: string, value: string]>): string {
    if (metaList.length === 0) return ''

    return `<details>
    <summary>Metadata</summary>
    <div class="metadata_container">
        ${metaList.map(([name, value]) => `<div class="metadata_item"><div>${escapeHtml(name)}</div><div>${escapeHtml(value)}</div></div>`).join('\n')}
    </div>
</details>`
}
