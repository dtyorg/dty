import type { Metadata } from 'next'
import type { Media, SiteSetting } from '@/payload-types'
import { getServerSideURL } from './getURL'
import { getGlobal } from './queries'

export const getSiteSettings = () => getGlobal('site-settings', 1) as Promise<SiteSetting>

/** Absolute URL for a path or a (possibly relative) media URL. */
export const absoluteURL = (pathOrUrl: string) =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${getServerSideURL()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`

export const mediaOf = (m: unknown): Media | null => (m && typeof m === 'object' && 'url' in m && (m as Media).url ? (m as Media) : null)

/** Branded 1200×630 share image generated on demand (see app/(frontend)/og/route.tsx). */
export const ogImageURL = (title: string, eyebrow?: string) =>
  `/og?${new URLSearchParams({ title: title.slice(0, 90), ...(eyebrow ? { eyebrow: eyebrow.slice(0, 40) } : {}) })}`

type BuildArgs = {
  /** Page title (without site suffix) */
  title: string
  /** Explicit full title from the SEO tab — used as-is */
  metaTitle?: string | null
  description?: string | null
  path: string
  images?: unknown[]
  eyebrow?: string
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  section?: string
  tags?: string[]
  noindex?: boolean
  /** Extra <link rel=alternate> types, e.g. a Markdown version for LLMs */
  alternateTypes?: Record<string, string>
}

/** One place that turns content + Site settings into complete Next.js metadata. */
export async function buildMetadata(a: BuildArgs): Promise<Metadata> {
  const s = await getSiteSettings()
  const description = (a.description || s.defaultDescription || '').trim() || undefined
  const image = a.images?.map(mediaOf).find(Boolean) ?? mediaOf(s.defaultImage)
  const images = image
    ? [{ url: absoluteURL(image.sizes?.hero?.url || image.url!), width: image.sizes?.hero?.width || image.width || undefined, height: image.sizes?.hero?.height || image.height || undefined, alt: image.alt }]
    : [{ url: absoluteURL(ogImageURL(a.title, a.eyebrow)), width: 1200, height: 630, alt: a.title }]
  const fullTitle = a.metaTitle || (s.titleTemplate || '%s').replace('%s', a.title)

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: absoluteURL(a.path), ...(a.alternateTypes ? { types: a.alternateTypes } : {}) },
    // Only override robots when needed — otherwise the site-wide googleBot directives apply
    ...(a.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: a.type ?? 'website',
      siteName: s.siteName,
      locale: s.locale || 'en_US',
      url: absoluteURL(a.path),
      title: fullTitle,
      description,
      images,
      ...(a.type === 'article'
        ? {
            publishedTime: a.publishedTime ?? undefined,
            modifiedTime: a.modifiedTime ?? undefined,
            section: a.section,
            tags: a.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: s.twitterHandle || undefined,
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  }
}

/** Site-wide <head> defaults, used by the root layout. */
export async function rootMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const name = s.siteName || 'D3TY'
  return {
    metadataBase: new URL(getServerSideURL()),
    applicationName: name,
    title: { default: name, template: s.titleTemplate || `%s — ${name}` },
    description: s.defaultDescription || undefined,
    robots: s.noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    verification: {
      google: s.googleVerification || undefined,
      other: {
        ...(s.bingVerification ? { 'msvalidate.01': s.bingVerification } : {}),
        ...(s.facebookDomainVerification ? { 'facebook-domain-verification': s.facebookDomainVerification } : {}),
      },
    },
    openGraph: { siteName: name, locale: s.locale || 'en_US', type: 'website' },
    twitter: { card: 'summary_large_image', site: s.twitterHandle || undefined },
    formatDetection: { telephone: false },
  }
}
