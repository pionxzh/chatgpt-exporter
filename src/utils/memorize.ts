const generateKey = (args: any[]) => JSON.stringify(args)

export function memorize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, any>()

    const memorized = (...args: Parameters<T>): ReturnType<T> => {
        const key = generateKey(args)
        if (cache.has(key)) {
            return cache.get(key)
        }
        const result = fn(...args)
        cache.set(key, result)
        return result
    }

    return memorized as T
}
