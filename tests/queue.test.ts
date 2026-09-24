import { describe, expect, it, vi } from 'vitest'

// The queue only needs the RateLimitError class; skip the real api module and its page globals.
vi.mock('../src/api', () => ({ RateLimitError: class extends Error {} }))

const { RequestQueue } = await import('../src/utils/queue')

async function failing(): Promise<string> {
    throw new Error('500')
}

function run<T>(queue: InstanceType<typeof RequestQueue<T>>) {
    return new Promise<T[]>((resolve) => {
        queue.on('done', resolve)
        queue.start()
    })
}

describe('requestQueue skipped requests', () => {
    it('reports requests dropped after exhausting retries', async () => {
        const queue = new RequestQueue<string>(0, 0)
        queue.add({ name: 'ok-1', request: async () => 'a' })
        queue.add({ name: 'broken', request: failing })
        queue.add({ name: 'ok-2', request: async () => 'b' })

        const results = await run(queue)

        expect(results).toEqual(['a', 'b'])
        expect(queue.getSkipped()).toEqual(['broken'])
    })

    it('does not skip a request that succeeds on retry', async () => {
        const queue = new RequestQueue<string>(0, 0)
        let attempts = 0
        queue.add({
            name: 'flaky',
            request: async () => {
                if (++attempts < 3) throw new Error('500')
                return 'ok'
            },
        })

        expect(await run(queue)).toEqual(['ok'])
        expect(queue.getSkipped()).toEqual([])
    })

    it('clear() resets the skipped list for the next batch', async () => {
        const queue = new RequestQueue<string>(0, 0)
        queue.add({ name: 'broken', request: failing })
        await run(queue)
        expect(queue.getSkipped()).toEqual(['broken'])

        queue.clear()
        expect(queue.getSkipped()).toEqual([])
    })
})
