import { markdownResponse, recipeToMarkdown } from '@/utilities/markdown'
import { getPayloadClient } from '@/utilities/queries'

/** Served publicly at /recipes/<slug>.md (rewrite in next.config.ts). */
export const revalidate = 3600

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'recipes',
    where: { and: [{ slug: { equals: decodeURIComponent(slug) } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  const recipe = res.docs[0]
  if (!recipe) return new Response('Not found', { status: 404 })
  return markdownResponse(recipeToMarkdown(recipe))
}
