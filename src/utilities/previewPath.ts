import { getServerSideURL } from './getURL'

/** Payload admin preview/live-preview URL → enables Next.js draft mode, then redirects to the page. */
export const previewURL = (collection: 'pages' | 'recipes', slug?: string | null) => {
  const path = collection === 'recipes' ? `/recipes/${slug ?? ''}` : slug === 'home' || !slug ? '/' : `/${slug}`
  return `${getServerSideURL()}/next/preview?path=${encodeURIComponent(path)}`
}
