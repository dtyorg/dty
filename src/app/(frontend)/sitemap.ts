import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/utilities/queries'
import { absoluteURL, getSiteSettings, mediaOf } from '@/utilities/seo'

export const revalidate = 3600

const PRIVATE_PAGES = new Set(['privacy'])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const settings = await getSiteSettings()
    if (settings.noindex) return []
    const payload = await getPayloadClient()
    const published = { _status: { equals: 'published' } } as const

    const [pages, recipes, categories] = await Promise.all([
      payload.find({ collection: 'pages', where: published, limit: 1000, pagination: false, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'recipes', where: published, limit: 5000, pagination: false, depth: 1, select: { slug: true, updatedAt: true, image: true } }),
      payload.find({ collection: 'categories', limit: 500, pagination: false, depth: 0, select: { slug: true, updatedAt: true, parent: true } }),
    ])

    const latestRecipe = recipes.docs.reduce((a, r) => (r.updatedAt > a ? r.updatedAt : a), '')

    return [
      ...pages.docs.map((p) => ({
        url: absoluteURL(p.slug === 'home' ? '/' : `/${p.slug}`),
        lastModified: p.updatedAt,
        changeFrequency: p.slug === 'home' ? ('daily' as const) : ('monthly' as const),
        priority: p.slug === 'home' ? 1 : PRIVATE_PAGES.has(p.slug ?? '') ? 0.2 : 0.6,
      })),
      { url: absoluteURL('/recipes'), lastModified: latestRecipe || undefined, changeFrequency: 'daily' as const, priority: 0.9 },
      ...categories.docs.map((c) => ({
        url: absoluteURL(`/categories/${c.slug}`),
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: c.parent ? 0.7 : 0.9,
      })),
      ...recipes.docs.map((r) => {
        const img = mediaOf(r.image)
        return {
          url: absoluteURL(`/recipes/${r.slug}`),
          lastModified: r.updatedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
          ...(img ? { images: [absoluteURL(img.url!)] } : {}),
        }
      }),
    ]
  } catch {
    return [{ url: absoluteURL('/'), priority: 1 }]
  }
}
