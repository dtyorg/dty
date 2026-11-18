// Minimal helpers to build Lexical rich-text JSON for seeding.
type Node = Record<string, unknown>

export const text = (t: string, format = 0): Node => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra,
})
export const p = (...parts: (string | Node)[]) =>
  block('paragraph', parts.map((x) => (typeof x === 'string' ? text(x) : x)), { textFormat: 0, textStyle: '' })
export const bold = (t: string) => text(t, 1)
export const h = (tag: 'h2' | 'h3', t: string) => block('heading', [text(t)], { tag })
export const ul = (items: string[]) =>
  block('list', items.map((t, i) => block('listitem', [text(t)], { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })
export const ol = (items: string[]) =>
  block('list', items.map((t, i) => block('listitem', [text(t)], { value: i + 1 })), { listType: 'number', start: 1, tag: 'ol' })
export const quote = (t: string) => block('quote', [text(t)])
export const doc = (...children: Node[]) =>
  ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }) as never
