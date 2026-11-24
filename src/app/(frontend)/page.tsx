import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { PageView } from '@/components/PageView'
import { JsonLd } from '@/components/JsonLd'
import { pageMetadata } from '@/utilities/metadata'
import { getSiteSettings } from '@/utilities/seo'
import { graph, organizationLd, webPageLd, websiteLd } from '@/utilities/structuredData'
import { getGlobal, getPageBySlug } from '@/utilities/queries'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPageBySlug('home'), '/')
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug('home')

  if (!page) {
    return (
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow md-label-large">Payload · Next.js · Material 3</p>
          <h1 className="hero__headline md-display-large">Your site is ready.</h1>
          <p className="hero__subhead md-body-large">
            Create a page with the slug <code>home</code> in the admin panel, or run <code>pnpm seed</code>{' '}
            to load demo content.
          </p>
          <div className="actions">
            <Link className="md-button md-button--filled md-state" href="/admin">
              Open admin panel
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const [settings, footer] = await Promise.all([getSiteSettings(), getGlobal('footer')])
  return (
    <>
      <JsonLd
        data={graph(
          organizationLd(settings, footer),
          websiteLd(settings),
          webPageLd({ name: page.meta?.title || settings.siteName, path: '/', description: page.meta?.description || page.hero?.subhead }),
        )}
      />
      <PageView draft={draft} page={page} />
    </>
  )
}
