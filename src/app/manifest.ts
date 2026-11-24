import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/utilities/seo'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings().catch(() => null)
  return {
    name: s?.siteName || 'D3TY',
    short_name: s?.siteName || 'D3TY',
    description: s?.defaultDescription || undefined,
    start_url: '/',
    display: 'standalone',
    background_color: '#12140d',
    theme_color: '#536525',
  }
}
