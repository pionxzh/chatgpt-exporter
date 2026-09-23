import { describe, expect, it } from 'vitest'
import { transformContentReferences } from '../src/utils/citations'
import type { ConversationNodeMessage } from '../src/api'

// Shape of shopping answers: products carry `safe_urls: ['']` and links without a URL.
const productList = 'products{"selections":[["turn0product1","Product A"],["turn0product2","Product B"]]}'
const productA = 'product_entity["turn0product1","Product A"]'

const metadata = {
    content_references: [
        {
            type: 'products',
            matched_text: productList,
            start_idx: 0,
            end_idx: 0,
            safe_urls: [''],
            refs: [],
            alt: '### [Product A]()\n*$10.00*\n\n### [Product B]()\n*$20.00*',
        },
        {
            type: 'product_entity',
            matched_text: productA,
            start_idx: 0,
            end_idx: 0,
            safe_urls: [''],
            refs: [],
            alt: '[Product A]()',
        },
    ],
} as ConversationNodeMessage['metadata']

const input = `${productList}\n\n- **${productA}** - Reliable choice.`
const expected = '### Product A\n*$10.00*\n\n### Product B\n*$20.00*\n\n- **Product A** - Reliable choice.'

describe('transformContentReferences', () => {
    it('keeps product names in markdown', () => {
        expect(transformContentReferences(input, metadata)).toBe(expected)
    })

    it('keeps product names in text', () => {
        expect(transformContentReferences(input, metadata, { output: 'text', inlineReferenceMode: 'alt', includeSourceList: false }))
            .toBe(expected)
    })
})

describe('file citations', () => {
    const file = (line: string, name: string) => ({
        type: 'file',
        matched_text: `fileciteturn1file0${line}`,
        start_idx: 0,
        end_idx: 0,
        name,
    })
    const hidden = {
        type: 'hidden',
        matched_text: 'fileciteturn2file0L2-L2',
        start_idx: 0,
        end_idx: 0,
        invalid: true,
    }
    const metadata = {
        content_references: [file('L1-L4', 'notes.md'), file('L9-L12', 'notes.md'), file('L20-L21', 'cost$&.md'), hidden],
    } as unknown as ConversationNodeMessage['metadata']
    const [first, second, dollar] = metadata!.content_references!.map(ref => ref.matched_text)

    it('shows the file name once for adjacent citations of the same file', () => {
        expect(transformContentReferences(`A claim. ${first} ${second}\n\nNext.`, metadata))
            .toBe('A claim. (notes.md)\n\nNext.')
    })

    it('inserts file names verbatim and drops hidden citations', () => {
        expect(transformContentReferences(`A. ${dollar} B. ${hidden.matched_text}`, metadata))
            .toBe('A. (cost$&.md) B. ')
    })
})

describe('image search results', () => {
    const group = {
        type: 'image_group',
        matched_text: 'image_group{"query":["a"]}',
        start_idx: 0,
        end_idx: 0,
        safe_urls: ['https://cdn.example/a.jpg', 'https://cdn.example/b.jpg'],
        alt: '![Image](https://cdn.example/a.jpg)\n\n![Image](https://cdn.example/b.jpg)',
        images: [
            { image_result: { title: 'Page [A]', url: 'https://a.example/', content_url: 'https://cdn.example/a.jpg' } },
            { image_result: { title: 'Page B', content_url: 'https://cdn.example/b.jpg' } },
        ],
    }
    const single = {
        type: 'image_v2',
        matched_text: 'iturn0image0',
        start_idx: 0,
        end_idx: 0,
        safe_urls: ['https://cdn.example/c.jpg'],
        alt: '[![Page C](https://cdn.example/thumb.jpg)](https://c.example/)',
        images: [{ title: 'Page C', url: 'https://c.example/', content_url: 'https://cdn.example/c.jpg' }],
    }
    const withoutImages = { ...group, matched_text: 'image_group{"query":["b"]}', images: [] }
    const metadata = { content_references: [group, single, withoutImages] } as unknown as ConversationNodeMessage['metadata']

    it('links each image to its page, titled by the page', () => {
        expect(transformContentReferences(group.matched_text, metadata)).toBe(
            '[![Page \\[A\\]](<https://cdn.example/a.jpg>)](<https://a.example/>)\n\n![Page B](<https://cdn.example/b.jpg>)',
        )
        expect(transformContentReferences(single.matched_text, metadata))
            .toBe('[![Page C](<https://cdn.example/c.jpg>)](<https://c.example/>)')
    })

    it('falls back to the alt text', () => {
        expect(transformContentReferences(withoutImages.matched_text, metadata)).toBe(group.alt)
        expect(transformContentReferences(group.matched_text, metadata, { output: 'text', inlineReferenceMode: 'alt' })).toBe(group.alt)
    })
})
