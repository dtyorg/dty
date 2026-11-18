import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { PageView } from '@/components/PageView'
import { docMetadata } from '@/utilities/metadata'
import { getPageBySlug } from '@/utilities/queries'

export async function generateMetadata(): Promise<Metadata> {
  return docMetadata(await getPageBySlug('home'), '/')
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

  return <PageView draft={draft} page={page} />
}
