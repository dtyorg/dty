import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import { PageView } from '@/components/PageView'
import { docMetadata } from '@/utilities/metadata'
import { getPageBySlug, getPayloadClient } from '@/utilities/queries'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
      pagination: false,
      select: { slug: true },
      where: { slug: { not_equals: 'home' } },
    })
    return pages.docs.filter((d) => d.slug).map(({ slug }) => ({ slug: slug as string }))
  } catch {
    // Database not reachable at build time — pages will render on demand.
    return []
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  return docMetadata(await getPageBySlug(decodeURIComponent(slug)), `/${slug}`)
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  if (slug === 'home') redirect('/')
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug(decodeURIComponent(slug))
  if (!page) notFound()
  return <PageView draft={draft} page={page} />
}
