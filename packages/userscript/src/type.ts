export type ConversationLineNode = |
{ type: 'text'; text: string } |
{ type: 'image'; src: string } |
{ type: 'code'; code: string } |
{ type: 'code-block'; lang: string; code: string } |
{ type: 'link'; text: string; href: string } |
{ type: 'ordered-list-item'; items: string[] } |
{ type: 'unordered-list-item'; items: string[] } |
{ type: 'table'; headers: string[]; rows: string[][] }

export type ConversationLine = ConversationLineNode[]

export interface Conversation {
    author: {
        name: string
        avatar: string
    }
    lines: ConversationLine[]
}
