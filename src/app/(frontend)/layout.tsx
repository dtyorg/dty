import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import { Cormorant_Garamond, Roboto_Flex } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Motion } from '@/components/Motion'
import { Analytics } from '@/components/analytics/Analytics'
import { themeInitScript } from '@/providers/Theme'
import { getSiteSettings, rootMetadata } from '@/utilities/seo'

import './theme/tokens.css'
import './theme/m3.css'
import './theme/site.css'

const roboto = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plain',
})

// M3 "brand" typeface (display, headline, title-large): an elegant serif for the bar/lounge mood.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-brand',
})

export const generateMetadata = (): Promise<Metadata> => rootMetadata()

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaee' },
    { media: '(prefers-color-scheme: dark)', color: '#12140d' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode()
  const settings = await getSiteSettings()

  return (
    <html className={`${roboto.variable} ${cormorant.variable}`} lang={(settings.locale || 'en_US').split('_')[0]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a className="md-skip-link md-button md-button--filled" href="#main">
          Skip to content
        </a>
        <div className="site">
          {isDraft && (
            <div className="md-body-small" style={{ background: 'var(--md-sys-color-tertiary-container)', color: 'var(--md-sys-color-on-tertiary-container)', padding: '8px 16px', textAlign: 'center' }}>
              Viewing drafts.{' '}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- route handler, must not be prefetched */}
              <a href="/next/exit-preview">Exit preview</a>
            </div>
          )}
          <Header />
          <main className="site-main" id="main">
            {children}
          </main>
          <Footer />
        </div>
        <Motion />
        {!isDraft && (
          <Analytics
            bingUetId={settings.bingUetId}
            clarityId={settings.clarityId}
            ga4Id={settings.ga4Id}
            gtmId={settings.gtmId}
            metaPixelId={settings.metaPixelId}
            requireConsent={settings.requireConsent !== false}
          />
        )}
      </body>
    </html>
  )
}
