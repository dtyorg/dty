import type { MetadataRoute } from 'next'
import { absoluteURL, getSiteSettings } from '@/utilities/seo'

export const revalidate = 3600

// AI crawlers, grouped by purpose (toggles in Payload → Site settings → AI & LLMs)
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User']
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Bytespider']

const PRIVATE = ['/admin', '/api/', '/next/', '/md/', '/search', '/newsletter/']

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSiteSettings().catch(() => null)
  if (s?.noindex) return { rules: { userAgent: '*', disallow: '/' } }

  const allowSearch = s?.allowAiSearch !== false
  const allowTraining = s?.allowAiTraining !== false

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      // AI search bots are explicitly welcomed (or blocked), with llms.txt in reach
      { userAgent: AI_SEARCH_BOTS, ...(allowSearch ? { allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: PRIVATE } : { disallow: '/' }) },
      { userAgent: AI_TRAINING_BOTS, ...(allowTraining ? { allow: '/', disallow: PRIVATE } : { disallow: '/' }) },
    ],
    sitemap: absoluteURL('/sitemap.xml'),
    host: absoluteURL('/'),
  }
}
