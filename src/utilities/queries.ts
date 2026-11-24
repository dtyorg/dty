import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = () => getPayload({ config: configPromise })

export const getGlobal = <T extends 'header' | 'footer' | 'site-settings'>(slug: T, depth = 1) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      // Links only need slug + title: keeps every page's HTML/RSC payload small
      const linkFields = { slug: true, title: true } as const
      return payload.findGlobal({
        slug,
        depth,
        populate: { pages: linkFields, recipes: linkFields, categories: linkFields },
      })
    },
    [`global_${slug}`],
    { tags: [`global_${slug}`] },
  )()

export const getPageBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ?? null
})

export const getRecipeBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'recipes',
    depth: 1,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] ?? null
})

export const getCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'categories', depth: 1, limit: 100, pagination: false, sort: 'order' })
    return res.docs
  },
  ['categories'],
  { tags: ['categories'] },
)

export const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

type RecipeQuery = {
  categoryId?: string
  /** Match any of these categories (e.g. a section and all its sub-categories). */
  categoryIds?: string[]
  search?: string
  featured?: boolean
  excludeId?: string
  ids?: string[]
  limit?: number
}

export const getRecipes = async ({ categoryId, categoryIds, search, featured, excludeId, ids, limit = 24 }: RecipeQuery = {}) => {
  const payload = await getPayloadClient()
  const and: import('payload').Where[] = [{ _status: { equals: 'published' } }]
  if (categoryId) and.push({ categories: { in: [categoryId] } })
  if (categoryIds?.length) and.push({ categories: { in: categoryIds } })
  if (search) {
    and.push({
      or: [
        { title: { like: search } },
        { description: { like: search } },
        { 'ingredients.name': { like: search } },
      ],
    })
  }
  if (featured) and.push({ featured: { equals: true } })
  if (excludeId) and.push({ id: { not_equals: excludeId } })
  if (ids) and.push({ id: { in: ids } })
  const res = await payload.find({
    collection: 'recipes',
    depth: 1,
    limit,
    sort: '-publishedAt',
    where: { and },
    select: { title: true, slug: true, description: true, image: true, categories: true, details: true, publishedAt: true },
    populate: { categories: { title: true, slug: true, icon: true } },
  })
  return res.docs
}
