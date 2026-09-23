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
