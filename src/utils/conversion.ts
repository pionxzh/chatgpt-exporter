interface Message {
    parent?: string
    message?: {
        author: {
            role: string
        }
        create_time: number
        content: {
            parts: string[]
        }
    }
}

interface MessageMapping {
    [key: string]: Message
}

interface ConversationData {
    current_node: string
    mapping: MessageMapping
}

interface TavernMessage {
    name: string
    is_user: boolean
    is_name: boolean
    send_date: number
    mes: string
    swipes: string[]
    swipe_id: number
}

interface NameMessage {
    user_name: string
    character_name: string
}

interface OobaData {
    internal: [string, string][]
    visible: [string, string][]
}

function extractConversation(data: ConversationData): Message[] {
    const currentNode = data.current_node
    const mapping = data.mapping

    const messagesReversed: Message[] = []
    let nodeId: string | undefined = currentNode

    while (nodeId !== null && nodeId !== undefined) {
        const currentMessage: Message = mapping[nodeId]
        messagesReversed.push(currentMessage)
        nodeId = currentMessage.parent
    }

    return messagesReversed.reverse()
}

function convertMessageToTavern(messageData: Message): TavernMessage | null {
    if (!messageData.message) {
        return null
    }

    const senderRole: string = messageData.message.author.role
    if (senderRole === 'system') {
        return null
    }

    const isAssistant = senderRole === 'assistant'
    const createTime: number = messageData.message.create_time
    const text: string = messageData.message.content.parts[0]

    return {
        name: isAssistant ? 'Assistant' : 'You',
        is_user: !isAssistant,
        is_name: isAssistant,
        send_date: createTime,
        mes: text,
        swipes: [text],
        swipe_id: 0,
    }
}

function jsonlStringify(messageArray: any[]): string {
    return messageArray.map((msg: any) => JSON.stringify(msg)).join('\n')
}

export function getTavernString(jsonData: ConversationData): string {
    // Takes the OAI JSON data as input, outputs the JSONL string
    const conversation = extractConversation(jsonData)

    const convertedConvo: (TavernMessage | NameMessage)[] = [{
        user_name: 'You',
        character_name: 'Assistant',
    }]

    conversation.forEach((message) => {
        const convertedMsg = convertMessageToTavern(message)
        if (convertedMsg !== null) {
            convertedConvo.push(convertedMsg)
        }
    })
    // This _has_ to be stringified without adding any indentation, due to the JSONL format.
    return jsonlStringify(convertedConvo)
}

export function getOobaString(jsonData: ConversationData): string {
    // Takes the OAI JSON data as input, outputs the serialized JSON
    const messages = extractConversation(jsonData)
    const pairs: any[] = []
    let idx = 0

    while (idx < messages.length - 1) {
        const message = messages[idx]
        const nextMessage = messages[idx + 1]
        let role: string, text: string, nextRole: string, nextText: string

        if (!message.message || !nextMessage.message) {
            idx += 1
            continue
        }

        try {
            role = message.message.author.role
            text = message.message.content.parts[0]
            nextRole = nextMessage.message.author.role
            nextText = nextMessage.message.content.parts[0]
        }
        catch (error) {
            idx += 1
            continue
        }

        if (role === 'system') {
            if (text !== '') {
                pairs.push(['<|BEGIN-VISIBLE-CHAT|>', text])
            }
            idx += 1
            continue
        }

        if (role === 'user') {
            if (nextRole === 'assistant') {
                pairs.push([text, nextText])
                idx += 2
                continue
            }
            else if (nextRole === 'user') {
                pairs.push([text, ''])
                idx += 1
                continue
            }
        }

        if (role === 'assistant') {
            pairs.push(['', text])
            idx += 1
        }
    }
    const oobaData: OobaData = {
        internal: pairs,
        visible: JSON.parse(JSON.stringify(pairs)),
    }

    if (oobaData.visible[0] && oobaData.visible[0][0] === '<|BEGIN-VISIBLE-CHAT|>') {
        oobaData.visible[0][0] = ''
    }

    return JSON.stringify(oobaData, null, 2)
}
