import { llmsHeader, markdownResponse, pageToMarkdown, recipeToMarkdown } from '@/utilities/markdown'
import { getPayloadClient } from '@/utilities/queries'
import { getSiteSettings } from '@/utilities/seo'

/** Every recipe (and the guide/about pages) as one Markdown document for LLM context windows. */
export const revalidate = 3600

export async function GET() {
  const [settings, payload] = await Promise.all([getSiteSettings(), getPayloadClient()])
  const [recipes, pages] = await Promise.all([
    payload.find({ collection: 'recipes', where: { _status: { equals: 'published' } }, limit: 5000, pagination: false, depth: 1, sort: 'title' }),
    payload.find({
      collection: 'pages',
      where: { and: [{ _status: { equals: 'published' } }, { slug: { in: ['guide', 'about', 'faqs'] } }] },
      limit: 10,
      pagination: false,
      depth: 0,
    }),
  ])

  const body = [
    llmsHeader(settings),
    ...pages.docs.map((p) => pageToMarkdown(p, 2)),
    '## Recipes',
    ...recipes.docs.map((r) => recipeToMarkdown(r, { headingLevel: 3 })),
  ].join('\n\n---\n\n')

  return markdownResponse(body)
}
