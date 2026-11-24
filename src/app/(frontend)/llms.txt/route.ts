import type { Category } from '@/payload-types'
import { llmsHeader, markdownResponse } from '@/utilities/markdown'
import { getCategories, getPayloadClient } from '@/utilities/queries'
import { absoluteURL, getSiteSettings } from '@/utilities/seo'

/** https://llmstxt.org — a concise, link-rich map of the site for AI assistants. */
export const revalidate = 3600

export async function GET() {
  const [settings, categories, payload] = await Promise.all([getSiteSettings(), getCategories(), getPayloadClient()])
  const [recipes, pages] = await Promise.all([
    payload.find({
      collection: 'recipes',
      where: { _status: { equals: 'published' } },
      limit: 5000,
      pagination: false,
      depth: 1,
      sort: 'title',
      select: { title: true, slug: true, description: true, categories: true },
      populate: { categories: { title: true, slug: true, parent: true } },
    }),
    payload.find({
      collection: 'pages',
      where: { and: [{ _status: { equals: 'published' } }, { slug: { not_in: ['home', 'privacy'] } }] },
      limit: 100,
      pagination: false,
      depth: 0,
      select: { title: true, slug: true, hero: true },
    }),
  ])

  const sections = categories.filter((c) => !c.parent)
  const sectionOf = (r: (typeof recipes.docs)[number]) =>
    (r.categories ?? []).find((c): c is Category => typeof c === 'object' && !c.parent)?.id

  const out: string[] = [llmsHeader(settings)]

  out.push(
    '## Key pages',
    [
      `- [All recipes](${absoluteURL('/recipes')}): every recipe on the site`,
      ...pages.docs.map((p) => `- [${p.title}](${absoluteURL(`/${p.slug}`)})${p.hero?.subhead ? `: ${p.hero.subhead}` : ''}`),
      ...sections.map((c) => `- [${c.title}](${absoluteURL(`/categories/${c.slug}`)})${c.description ? `: ${c.description}` : ''}`),
    ].join('\n'),
  )

  for (const section of sections) {
    const list = recipes.docs.filter((r) => sectionOf(r) === section.id)
    if (!list.length) continue
    out.push(
      `## ${section.title.replace(/s$/i, '')} recipes`,
      list.map((r) => `- [${r.title}](${absoluteURL(`/recipes/${r.slug}.md`)})${r.description ? `: ${r.description}` : ''}`).join('\n'),
    )
  }

  out.push(
    '## Optional',
    [
      `- [Full text of every recipe](${absoluteURL('/llms-full.txt')}): ingredients and methods in one Markdown file`,
      `- [Sitemap](${absoluteURL('/sitemap.xml')})`,
    ].join('\n'),
  )

  return markdownResponse(out.join('\n\n'))
}
