import { unsafeWindow } from 'vite-plugin-monkey/dist/client'
import { isTemporaryChat } from './page'

/** The endpoint that streams a message exchange back to the page. */
const CONVERSATION_STREAM_PATH = '/backend-api/f/conversation'
const DATA_PREFIX = 'data:'
/** Give up if the id has not shown up in the first chunks of the stream. */
const MAX_SCAN_LENGTH = 200_000

let temporaryChatId: string | null = null

export function getTemporaryChatId() {
    return temporaryChatId
}

/**
 * Mirrors `checkIfConversationStarted`: a temporary chat can only be exported
 * once its id has been observed.
 */
export function checkIfTemporaryChatIsExportable() {
    return !isTemporaryChat() || temporaryChatId !== null
}

declare const exportFunction: (func: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, context: any) => (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

/**
 * Temporary chats are hidden from the conversation list and their id never
 * reaches the URL, so there is no way to ask for one by name. They are served
 * by the regular conversation endpoint once the id is known, and the server
 * announces that id in the response that streams the reply back to the page,
 * so record it as it goes past.
 */
export function watchTemporaryChatId() {
    const originalFetch = unsafeWindow.fetch

    const patchedFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        // `fetch` needs its original receiver, or Chrome throws on invocation.
        const response = originalFetch.call(unsafeWindow, input, init)

        if (isTemporaryChat()) {
            response.then((response) => {
                if (!response.body) return response
                const url = typeof input === 'string'
                    ? input
                    : input instanceof URL ? input.href : input.url
                if (!url.includes(CONVERSATION_STREAM_PATH)) return response

                // Read a copy so the page still receives the untouched stream.
                readConversationId(response.clone())

                return response
            })
        }

        return response
    }

    // Workaround for Firefox sandboxing breaking ChatGPT's native fetch calls
    unsafeWindow.fetch = typeof exportFunction === 'function'
        ? exportFunction(patchedFetch, unsafeWindow)
        : patchedFetch
}

async function readConversationId(response: Response) {
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''
    let scanned = 0

    try {
        while (scanned < MAX_SCAN_LENGTH) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            scanned += chunk.length
            buffer += chunk

            // Hold back the trailing partial line until the next chunk.
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            const conversationId = findConversationId(lines)
            if (conversationId) {
                temporaryChatId = conversationId
                break
            }
        }
    }
    catch (error) {
        console.error('[Exporter] Failed to read the temporary chat id', error)
    }
    finally {
        // Release the copy. Cancelling one branch of a teed stream leaves the
        // branch the page is reading alone.
        reader.cancel().catch(() => {})
    }
}

/**
 * Read the id off the stream's own events. Only the `conversation_id` field is
 * taken; the message content the events carry is never inspected or kept.
 */
function findConversationId(lines: string[]): string | null {
    for (const line of lines) {
        if (!line.startsWith(DATA_PREFIX)) continue

        const payload = line.slice(DATA_PREFIX.length).trim()
        if (!payload || payload === '[DONE]') continue

        try {
            const { conversation_id: conversationId } = JSON.parse(payload)
            if (typeof conversationId === 'string') return conversationId
        }
        catch {
            // Not every event in the stream carries a JSON payload.
        }
    }

    return null
}
