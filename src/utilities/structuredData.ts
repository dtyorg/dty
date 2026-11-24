import type { Category, Footer, Recipe, SiteSetting } from '@/payload-types'
import { absoluteURL, mediaOf, ogImageURL } from './seo'

/** schema.org JSON-LD builders. Rendered with <JsonLd data={…} />. */

const orgId = () => absoluteURL('/#organization')
const siteId = () => absoluteURL('/#website')

export const organizationLd = (s: SiteSetting, footer?: Footer | null) => {
  const logo = mediaOf(s.logo)
  return {
    '@type': 'Organization',
    '@id': orgId(),
    name: s.organizationName || s.siteName,
    url: absoluteURL('/'),
    ...(logo ? { logo: { '@type': 'ImageObject', url: absoluteURL(logo.url!), width: logo.width, height: logo.height } } : {}),
    ...(s.contactEmail ? { email: s.contactEmail } : {}),
    ...(footer?.socials?.length ? { sameAs: footer.socials.map((x) => x.url) } : {}),
  }
}

export const websiteLd = (s: SiteSetting) => ({
  '@type': 'WebSite',
  '@id': siteId(),
  name: s.siteName,
  url: absoluteURL('/'),
  ...(s.defaultDescription ? { description: s.defaultDescription } : {}),
  inLanguage: (s.locale || 'en_US').replace('_', '-'),
  publisher: { '@id': orgId() },
  // Enables the sitelinks search box
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: absoluteURL('/search?q={search_term_string}') },
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteURL(it.path) })),
})

export const webPageLd = (a: { name: string; path: string; description?: string | null; type?: 'WebPage' | 'CollectionPage' | 'AboutPage' }) => ({
  '@type': a.type ?? 'WebPage',
  '@id': absoluteURL(`${a.path}#webpage`),
  url: absoluteURL(a.path),
  name: a.name,
  ...(a.description ? { description: a.description } : {}),
  isPartOf: { '@id': siteId() },
})

export const itemListLd = (recipes: Partial<Recipe>[]) => ({
  '@type': 'ItemList',
  itemListElement: recipes.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteURL(`/recipes/${r.slug}`), name: r.title })),
})

const unitLabel = (u?: string | null) => (u ? u.replace('-', ' ') : '')
const minutes = (n?: number | null) => (n ? `PT${Math.round(n)}M` : undefined)

/** Google “Recipe” rich result: https://developers.google.com/search/docs/appearance/structured-data/recipe */
export const recipeLd = (r: Recipe, s: SiteSetting) => {
  const cats = (r.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const section = cats.find((c) => !c.parent)
  const img = mediaOf(r.image) ?? mediaOf(r.meta?.image)
  const images = img
    ? [img.sizes?.hero?.url, img.sizes?.card?.url, img.url].filter(Boolean).map((u) => absoluteURL(u!))
    : [absoluteURL(ogImageURL(r.title, section?.title))]
  const d = r.details
  const url = absoluteURL(`/recipes/${r.slug}`)

  return {
    '@type': 'Recipe',
    '@id': `${url}#recipe`,
    name: r.title,
    url,
    description: r.meta?.description || r.description || undefined,
    image: images,
    author: { '@type': 'Organization', name: s.organizationName || s.siteName, '@id': orgId() },
    publisher: { '@id': orgId() },
    datePublished: r.publishedAt || r.createdAt,
    dateModified: r.updatedAt,
    prepTime: minutes(d?.prepMinutes),
    totalTime: minutes(d?.prepMinutes),
    recipeYield: d?.servings ? `${d.servings} ${d.servings === 1 ? 'drink' : 'drinks'}` : undefined,
    recipeCategory: section?.title === 'Wines' ? 'Wine cocktail' : section?.title === 'Spirits' ? 'Drink' : 'Cocktail',
    keywords: [...cats.map((c) => c.title), d?.method, d?.alcoholFree ? 'alcohol-free' : null, d?.glass].filter(Boolean).join(', '),
    recipeIngredient: (r.ingredients ?? []).map((i) =>
      [i.amount, unitLabel(i.unit), i.name].filter(Boolean).join(' ') + (i.note ? `, ${i.note}` : ''),
    ),
    recipeInstructions: (r.steps ?? []).map((st, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: st.instruction,
      url: `${url}#step-${i + 1}`,
    })),
  }
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes })
