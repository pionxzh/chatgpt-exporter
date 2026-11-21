import { describe, expect, it } from 'vitest'
import { dropRemoteFontFaces } from '../src/utils/fontFaces'

describe('dropRemoteFontFaces', () => {
    it('drops a face that only has remote sources', () => {
        const css = '@font-face { font-family: Math; src: url("https://cdn.example.com/math.woff2") format("woff2"); }'
        expect(dropRemoteFontFaces(css)).toBe('')
    })

    it('keeps a face with an inlined source', () => {
        const css = '@font-face { font-family: Math; src: url(data:font/woff2;base64,AAAA) format("woff2"), url("https://cdn.example.com/math.woff") format("woff"); }'
        expect(dropRemoteFontFaces(css)).toBe(css)
    })

    it('keeps local and blob faces', () => {
        const local = '@font-face { font-family: Cjk; src: local("PingFangTC-Regular"); }'
        const blob = '@font-face { font-family: Math; src: url("blob:https://example.com/1"); }'
        expect(dropRemoteFontFaces(local + blob)).toBe(local + blob)
    })

    it('keeps the inlined copy when the same face is also declared remotely', () => {
        const inlined = '@font-face { font-family: Math; font-weight: 400; src: url(data:font/woff2;base64,AAAA) format("woff2"); }'
        const remote = '@font-face { font-family: Math; font-weight: 400; src: url("https://cdn.example.com/math.woff2") format("woff2"); }'
        expect(dropRemoteFontFaces(`${inlined}\n${remote}\nbody { color: red }`)).toBe(`${inlined}\n\nbody { color: red }`)
    })
})
