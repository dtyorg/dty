import type { Category, Page, Recipe, SiteSetting } from '@/payload-types'
import { absoluteURL, mediaOf } from './seo'

/** Clean Markdown renderings of content for LLMs (/llms.txt, /llms-full.txt, /recipes/<slug>.md). */

type LexNode = { type?: string; text?: string; tag?: string; listType?: string; format?: number; children?: LexNode[]; fields?: { url?: string } }

const inline = (nodes: LexNode[] = []): string =>
  nodes
    .map((n) => {
      if (n.type === 'text') {
        let t = n.text ?? ''
        if (n.format && n.format & 1) t = `**${t}**`
        if (n.format && n.format & 2) t = `*${t}*`
        return t
      }
      if (n.type === 'link' || n.type === 'autolink') return `[${inline(n.children)}](${n.fields?.url ?? ''})`
      if (n.type === 'linebreak') return '\n'
      return inline(n.children)
    })
    .join('')

/** Minimal Lexical → Markdown (paragraphs, headings, lists, quotes, links, bold/italic). */
export const lexicalToMarkdown = (data: unknown): string => {
  const root = (data as { root?: LexNode } | null)?.root
  if (!root?.children) return ''
  return root.children
    .map((n) => {
      switch (n.type) {
        case 'heading':
          return `${'#'.repeat(Math.min(6, Number(n.tag?.slice(1) || 2) + 1))} ${inline(n.children)}`
        case 'list':
          return (n.children ?? []).map((li, i) => `${n.listType === 'number' ? `${i + 1}.` : '-'} ${inline(li.children)}`).join('\n')
        case 'quote':
          return `> ${inline(n.children)}`
        case 'horizontalrule':
          return '---'
        default:
          return inline(n.children)
      }
    })
    .filter(Boolean)
    .join('\n\n')
}

const unit = (u?: string | null) => (u ? ` ${u.replace('-', ' ')}` : '')
const cats = (r: Recipe) => (r.categories ?? []).filter((c): c is Category => typeof c === 'object')

export const recipeToMarkdown = (r: Recipe, opts: { headingLevel?: number } = {}) => {
  const h = '#'.repeat(opts.headingLevel ?? 1)
  const d = r.details
  const img = mediaOf(r.image)
  const facts = [
    d?.difficulty && `Difficulty: ${d.difficulty}`,
    d?.prepMinutes && `Prep time: ${d.prepMinutes} min`,
    d?.servings && `Serves: ${d.servings}`,
    d?.method && `Method: ${d.method}`,
    d?.glass && `Glass: ${d.glass}`,
    d?.garnish && `Garnish: ${d.garnish}`,
    d?.alcoholFree && 'Alcohol-free: yes',
  ].filter(Boolean)

  return [
    `${h} ${r.title}`,
    r.description ? `> ${r.description}` : '',
    `URL: ${absoluteURL(`/recipes/${r.slug}`)}`,
    cats(r).length ? `Categories: ${cats(r).map((c) => c.title).join(', ')}` : '',
    facts.length ? facts.map((f) => `- ${f}`).join('\n') : '',
    img ? `![${img.alt}](${absoluteURL(img.url!)})` : '',
    `${h}# Ingredients`,
    (r.ingredients ?? []).map((i) => `- ${[i.amount, unit(i.unit).trim()].filter(Boolean).join(' ')}${i.amount || i.unit ? ' ' : ''}${i.name}${i.note ? ` (${i.note})` : ''}`).join('\n'),
    `${h}# Method`,
    (r.steps ?? []).map((s, i) => `${i + 1}. ${s.instruction}`).join('\n'),
    r.notes ? `${h}# Notes\n\n${lexicalToMarkdown(r.notes)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

/** Text content of a block-built page (rich text, card grids, features, CTAs). */
export const pageToMarkdown = (p: Page, headingLevel = 1) => {
  const h = '#'.repeat(headingLevel)
  const parts: string[] = [`${h} ${p.hero?.headline || p.title}`, `URL: ${absoluteURL(p.slug === 'home' ? '/' : `/${p.slug}`)}`]
  if (p.hero?.subhead) parts.push(p.hero.subhead)
  for (const b of p.layout ?? []) {
    if (b.blockType === 'content') parts.push(lexicalToMarkdown(b.richText))
    if (b.blockType === 'cardGrid') {
      if (b.heading) parts.push(`${h}# ${b.heading}`)
      parts.push((b.cards ?? []).map((c) => `- **${c.title}**${c.description ? `: ${c.description}` : ''}`).join('\n'))
    }
    if (b.blockType === 'feature' || b.blockType === 'cta') {
      const heading = 'heading' in b ? b.heading : ''
      const body = 'body' in b ? b.body : ''
      if (heading) parts.push(`${h}# ${heading}${body ? `\n\n${body}` : ''}`)
    }
  }
  return parts.filter(Boolean).join('\n\n')
}

export const llmsHeader = (s: SiteSetting) =>
  [
    `# ${s.siteName}`,
    `> ${s.llmsSummary || s.defaultDescription || ''}`.trim(),
    s.llmsNotes || '',
  ]
    .filter((x) => x && x !== '>')
    .join('\n\n')

export const markdownResponse = (body: string) =>
  new Response(body.trim() + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Readable by AI assistants, but kept out of the search index (the HTML page is canonical)
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
