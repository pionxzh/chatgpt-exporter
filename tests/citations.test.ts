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
