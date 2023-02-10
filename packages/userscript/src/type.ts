export interface HrNode { type: 'hr' }
export interface TextNode { type: 'text'; text: string }
export interface BoldNode { type: 'bold'; text: string }
export interface ItalicNode { type: 'italic'; text: string }
export interface HeadingNode { type: 'heading'; level: number; text: string }
export interface QuoteNode { type: 'quote'; text: string }
export interface ImageNode { type: 'image'; src: string }
export interface CodeNode { type: 'code'; code: string }
export interface CodeBlockNode { type: 'code-block'; lang: string; code: string }
export interface LinkNode { type: 'link'; text: string; href: string }
export interface OrderedListNode { type: 'ordered-list-item'; items: string[]; start?: number }
export interface UnorderedListNode { type: 'unordered-list-item'; items: string[] }
export interface TableNode { type: 'table'; headers: string[]; rows: string[][] }

export type ConversationLineNode = |
HrNode |
TextNode |
BoldNode |
ItalicNode |
HeadingNode |
QuoteNode |
ImageNode |
CodeNode |
CodeBlockNode |
LinkNode |
OrderedListNode |
UnorderedListNode |
TableNode

export type ConversationLine = ConversationLineNode[]

export interface Conversation {
    author: {
        name: string
        avatar: string
    }
    lines: ConversationLine[]
}
