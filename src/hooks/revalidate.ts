import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

type Doc = { id: string | number; slug?: string | null; _status?: string | null }

/** Machine-readable feeds that list content: sitemap + LLM files. */
const revalidateFeeds = () => {
  revalidatePath('/sitemap.xml')
  revalidatePath('/llms.txt')
  revalidatePath('/llms-full.txt')
}

const pathFor = (prefix: string, doc: Doc) =>
  prefix === '' && doc.slug === 'home' ? '/' : `${prefix}/${doc.slug}`

/** Revalidates the frontend route of a published document (and its old route if unpublished/renamed). */
export const revalidateDoc =
  (prefix: '' | '/recipes'): CollectionAfterChangeHook<Doc> =>
  ({ doc, previousDoc, req: { context, payload } }) => {
    if (context.disableRevalidate) return doc
    if (doc._status === 'published') {
      const path = pathFor(prefix, doc)
      payload.logger.info(`Revalidating ${path}`)
      revalidatePath(path)
    }
    if (previousDoc?._status === 'published' && (doc._status !== 'published' || previousDoc.slug !== doc.slug)) {
      revalidatePath(pathFor(prefix, previousDoc))
    }
    // Recipe listings (index, category pages, homepage blocks) change when a recipe is (un)published.
    if (doc._status === 'published' || previousDoc?._status === 'published') revalidateFeeds()
    if (prefix === '/recipes' && (doc._status === 'published' || previousDoc?._status === 'published')) {
      revalidatePath('/recipes')
      revalidatePath('/categories/[slug]', 'page')
      revalidatePath('/[slug]', 'page')
      revalidatePath('/')
    }
    return doc
  }

export const revalidateDelete =
  (prefix: '' | '/recipes'): CollectionAfterDeleteHook<Doc> =>
  ({ doc, req: { context } }) => {
    if (!context.disableRevalidate && doc?.slug) {
      revalidateFeeds()
      revalidatePath(pathFor(prefix, doc))
      if (prefix === '/recipes') {
        revalidatePath('/recipes')
        revalidatePath('/categories/[slug]', 'page')
        revalidatePath('/[slug]', 'page')
        revalidatePath('/')
      }
    }
    return doc
  }

export const revalidateGlobal =
  (tag: string, wholeSite = false): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      revalidateTag(`global_${tag}`, 'max')
      // Settings that affect every page's <head> (metadata, tracking) rebuild all routes
      if (wholeSite) revalidatePath('/', 'layout')
    }
    return doc
  }

export const revalidateCategory: CollectionAfterChangeHook<Doc> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/recipes')
    revalidatePath('/categories/[slug]', 'page')
    revalidatePath('/[slug]', 'page')
    revalidatePath('/')
    revalidateTag('categories', 'max')
    revalidateFeeds()
  }
  return doc
}
