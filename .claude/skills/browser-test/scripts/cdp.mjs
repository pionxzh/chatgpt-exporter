// Minimal CDP client for the ChatGPT tab of the test Chrome. Needs Node 22+
// for the global WebSocket.

export const CDP_PORT = Number(process.env.CDP_PORT || 9222)

export async function connect({ target = 'page' } = {}) {
    const base = `http://127.0.0.1:${CDP_PORT}`
    let url
    if (target === 'browser') {
        url = (await (await fetch(`${base}/json/version`)).json()).webSocketDebuggerUrl
    }
    else {
        const pages = await (await fetch(`${base}/json/list`)).json()
        const page = pages.find(p => p.type === 'page' && p.url.includes('chatgpt.com'))
        if (!page) throw new Error('No chatgpt.com tab. Run start-chrome.sh and log in first.')
        url = page.webSocketDebuggerUrl
    }

    const ws = new WebSocket(url)
    await new Promise((resolve, reject) => {
        ws.onopen = resolve
        ws.onerror = reject
    })

    let id = 0
    const pending = new Map()
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        pending.get(message.id)?.(message)
        pending.delete(message.id)
    }

    const send = (method, params = {}) => new Promise((resolve) => {
        const messageId = ++id
        pending.set(messageId, resolve)
        ws.send(JSON.stringify({ id: messageId, method, params }))
    })

    /** Evaluate an expression in the page and return its value. Throws on page errors. */
    const evaluate = async (expression) => {
        const { result } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
        if (result.exceptionDetails) {
            const details = result.exceptionDetails
            throw new Error(details.exception?.description || details.text)
        }
        return result.result.value
    }

    /** Run the body of an async function in the page. `return` gives the result. */
    const run = body => evaluate(`(async () => { ${body} })()`)

    return { send, evaluate, run, close: () => ws.close() }
}
