import type { Metadata } from 'next'
import type { Page } from '@/payload-types'
import { buildMetadata } from './seo'

export const pageMetadata = (page: Page | null, path: string): Promise<Metadata> | Metadata =>
  page
    ? buildMetadata({
        title: page.hero?.headline && page.slug === 'home' ? page.hero.headline : page.title,
        metaTitle: page.meta?.title,
        description: page.meta?.description || page.hero?.subhead,
        path,
        images: [page.meta?.image, page.hero?.media],
        eyebrow: page.hero?.eyebrow ?? undefined,
      })
    : {}
