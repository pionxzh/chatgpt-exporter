import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { fillTemplate, metaDetailsHtml } from '../src/exporter/htmlTemplate'

describe('fillTemplate', () => {
    it('inserts values verbatim', () => {
        expect(fillTemplate('<p>{{content}}</p>', { content: 'E = $$mc^2$$, sed "s/x/$&/", echo $$' }))
            .toBe('<p>E = $$mc^2$$, sed "s/x/$&/", echo $$</p>')
    })

    it('does not fill placeholders that come from a value', () => {
        expect(fillTemplate('{{title}}: {{content}}', { title: 'T', content: 'Handlebars uses {{title}}' }))
            .toBe('T: Handlebars uses {{title}}')
    })

    it('fills every placeholder in the HTML template', () => {
        const template = readFileSync(new URL('../src/template.html', import.meta.url), 'utf8')
        const names = ['title', 'date', 'time', 'source', 'lang', 'theme', 'avatar', 'details', 'content']
        const html = fillTemplate(template, Object.fromEntries(names.map(name => [name, `<${name}>`])))
        expect(html).not.toMatch(/\{\{\w+\}\}/)
    })
})

describe('metaDetailsHtml', () => {
    it('escapes names and values', () => {
        const html = metaDetailsHtml([['<b>title</b>', 'Fix <Draft> & "notes"'], ['source', 'https://chatgpt.com/c/1?a=1&b=2']])
        expect(html).toContain('<div>&lt;b&gt;title&lt;/b&gt;</div><div>Fix &lt;Draft&gt; &amp; &quot;notes&quot;</div>')
        expect(html).toContain('<div>https://chatgpt.com/c/1?a=1&amp;b=2</div>')
        expect(html).not.toContain('<Draft>')
    })

    it('renders nothing without metadata', () => {
        expect(metaDetailsHtml([])).toBe('')
    })
})
