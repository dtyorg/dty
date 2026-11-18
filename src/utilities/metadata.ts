import type { Metadata } from 'next'
import type { Media, Page, Recipe } from '@/payload-types'

export const docMetadata = (doc: Page | Recipe | null, path: string): Metadata => {
  if (!doc) return {}
  const image = doc.meta?.image && typeof doc.meta.image === 'object' ? (doc.meta.image as Media) : null
  const title = doc.meta?.title || doc.title
  const description = doc.meta?.description || ('description' in doc ? doc.description : undefined) || undefined
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: image?.url ? [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined }] : undefined,
    },
  }
}
