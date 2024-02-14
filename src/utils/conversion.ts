function extractConversation(data: any): any[] {
    const current_node = data.current_node
    const mapping = data.mapping

    const messagesReversed: any[] = []
    let node_id: any = current_node

    while (node_id !== null && node_id !== undefined) {
        const current_message = mapping[node_id]
        messagesReversed.push(current_message)
        node_id = current_message.parent
    }

    return messagesReversed.reverse()
}

function convertMessageToTavern(message_data: any): any | null {
    if (!message_data.message) {
        return null
    }

    const sender_role: string = message_data.message.author.role
    if (sender_role === 'system') {
        return null
    }

    const is_assistant = sender_role === 'assistant'
    const create_time = Number.parseInt(message_data.message.create_time, 10)
    const text: string = message_data.message.content.parts[0]

    return {
        name: is_assistant ? 'Assistant' : 'You',
        is_user: !is_assistant,
        is_name: is_assistant,
        send_date: create_time,
        mes: text,
        swipes: [text],
        swipe_id: 0,
    }
}

export function getTavernString(jsonData: any): string {
    // Takes the OAI JSON data as input, outputs the JSONL string
    const conversation = extractConversation(jsonData)

    const convertedConvo: any[] = [{
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
    return convertedConvo.map(msg => JSON.stringify(msg)).join('\n')
}

export function getOobaString(jsonData: any): string {
    // Takes the OAI JSON data as input, outputs the serialized JSON
    const messages = extractConversation(jsonData)
    const oobaData: any = {}
    const pairs: any[] = []
    let idx = 0

    while (idx < messages.length - 1) {
        const message = messages[idx]
        const nextMessage = messages[idx + 1]
        let role: string, text: string, nextRole: string, nextText: string

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

    oobaData.internal = pairs
    oobaData.visible = JSON.parse(JSON.stringify(pairs))

    if (oobaData.visible[0] && oobaData.visible[0][0] === '<|BEGIN-VISIBLE-CHAT|>') {
        oobaData.visible[0][0] = ''
    }

    return JSON.stringify(oobaData, null, 2)
}
