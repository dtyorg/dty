import type { GlobalConfig, TextFieldSingleValidation } from 'payload'
import { revalidateGlobal } from '@/hooks/revalidate'

/** Only allow the exact ID format each vendor uses — these values are injected into scripts. */
const pattern =
  (re: RegExp, example: string): TextFieldSingleValidation =>
  (value) =>
    !value || re.test(value) || `Invalid format — expected something like ${example}`

export const ID_PATTERNS = {
  ga4: /^G-[A-Z0-9]{4,20}$/,
  gtm: /^GTM-[A-Z0-9]{4,12}$/,
  metaPixel: /^\d{10,20}$/,
  bingUet: /^\d{4,12}$/,
  clarity: /^[a-z0-9]{6,20}$/,
  verification: /^[A-Za-z0-9_-]{6,128}$/,
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { description: 'SEO defaults, search-engine verification and analytics / tracking pixels.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('site-settings', true)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO defaults',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'D3TY' },
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s — D3TY',
              admin: { description: '“%s” is replaced by the page title.' },
              validate: (v: string | null | undefined) => !v || v.includes('%s') || 'Must contain %s',
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              maxLength: 170,
              admin: { description: 'Used when a page has no meta description (aim for 120–160 characters).' },
            },
            {
              name: 'defaultImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Default social share image (1200×630). If empty, a branded image is generated.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'locale', type: 'text', defaultValue: 'en_US', admin: { width: '50%' } },
                {
                  name: 'twitterHandle',
                  type: 'text',
                  admin: { width: '50%', placeholder: '@d3ty' },
                  validate: pattern(/^@[A-Za-z0-9_]{1,15}$/, '@d3ty'),
                },
              ],
            },
            {
              name: 'noindex',
              type: 'checkbox',
              label: 'Hide the whole site from search engines',
              admin: { description: 'Use on staging / before launch. Sets noindex and blocks crawling in robots.txt.' },
            },
          ],
        },
        {
          label: 'Organization',
          description: 'Shown to search engines as structured data (Organization).',
          fields: [
            { name: 'organizationName', type: 'text', admin: { description: 'Defaults to the site name.' } },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Square logo, at least 112×112.' } },
            { name: 'contactEmail', type: 'email' },
          ],
        },
        {
          label: 'Verification',
          description: 'Paste only the content value of each verification meta tag.',
          fields: [
            {
              name: 'googleVerification',
              type: 'text',
              label: 'Google Search Console',
              validate: pattern(ID_PATTERNS.verification, 'AbC123…'),
            },
            {
              name: 'bingVerification',
              type: 'text',
              label: 'Bing Webmaster Tools (msvalidate.01)',
              validate: pattern(ID_PATTERNS.verification, '1A2B3C…'),
            },
            {
              name: 'facebookDomainVerification',
              type: 'text',
              label: 'Facebook / Meta domain verification',
              validate: pattern(ID_PATTERNS.verification, 'abc123xyz…'),
            },
          ],
        },
        {
          label: 'Tracking',
          description:
            'Scripts load after the page has fully loaded, so they never slow down the first paint. Leave a field empty to disable that tool.',
          fields: [
            {
              name: 'requireConsent',
              type: 'checkbox',
              defaultValue: true,
              label: 'Ask for cookie consent before loading any tracking',
              admin: { description: 'Required for visitors from the EU/UK (GDPR). Recommended to keep on.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ga4Id',
                  type: 'text',
                  label: 'Google Analytics 4 — Measurement ID',
                  admin: { width: '50%', placeholder: 'G-XXXXXXXXXX' },
                  validate: pattern(ID_PATTERNS.ga4, 'G-ABC123XYZ'),
                },
                {
                  name: 'gtmId',
                  type: 'text',
                  label: 'Google Tag Manager — Container ID',
                  admin: { width: '50%', placeholder: 'GTM-XXXXXXX', description: 'Optional. Use GA4 or GTM, not both for the same GA property.' },
                  validate: pattern(ID_PATTERNS.gtm, 'GTM-ABC123'),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'metaPixelId',
                  type: 'text',
                  label: 'Meta (Facebook) Pixel ID',
                  admin: { width: '50%', placeholder: '123456789012345' },
                  validate: pattern(ID_PATTERNS.metaPixel, '123456789012345'),
                },
                {
                  name: 'bingUetId',
                  type: 'text',
                  label: 'Microsoft Advertising (Bing) UET tag ID',
                  admin: { width: '50%', placeholder: '12345678' },
                  validate: pattern(ID_PATTERNS.bingUet, '12345678'),
                },
              ],
            },
            {
              name: 'clarityId',
              type: 'text',
              label: 'Microsoft Clarity project ID',
              admin: { placeholder: 'abcd1234ef', description: 'Free heatmaps & session recordings from Microsoft.' },
              validate: pattern(ID_PATTERNS.clarity, 'abcd1234ef'),
            },
          ],
        },
        {
          label: 'AI & LLMs',
          description:
            'How AI assistants (ChatGPT, Claude, Perplexity, Gemini…) can read and cite the site. Powers /llms.txt, /llms-full.txt, Markdown recipe pages and the AI rules in robots.txt.',
          fields: [
            {
              name: 'allowAiSearch',
              type: 'checkbox',
              defaultValue: true,
              label: 'Allow AI search & answer engines to read and cite the site',
              admin: { description: 'OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User. Recommended: on.' },
            },
            {
              name: 'allowAiTraining',
              type: 'checkbox',
              defaultValue: true,
              label: 'Allow AI model training crawlers',
              admin: { description: 'GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent. Turn off to opt out of training while staying visible in AI search.' },
            },
            {
              name: 'llmsSummary',
              type: 'textarea',
              maxLength: 600,
              admin: { description: 'Short introduction shown at the top of /llms.txt (what the site is and who it is for).' },
            },
            {
              name: 'llmsNotes',
              type: 'textarea',
              admin: { description: 'Optional extra guidance for AI assistants (e.g. measurement conventions, how to attribute).' },
            },
          ],
        },
      ],
    },
  ],
}
