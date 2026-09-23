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
