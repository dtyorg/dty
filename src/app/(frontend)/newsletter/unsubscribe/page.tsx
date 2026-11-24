import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getPayloadClient } from '@/utilities/queries'

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } }

type Args = { searchParams: Promise<{ token?: string }> }

export default async function UnsubscribePage({ searchParams }: Args) {
  const token = (await searchParams).token ?? ''
  let ok = false

  if (/^[a-f0-9]{48}$/.test(token)) {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'subscribers', where: { token: { equals: token } }, limit: 1 })
    const sub = res.docs[0]
    if (sub) {
      if (sub.status !== 'unsubscribed') {
        await payload.update({ collection: 'subscribers', id: sub.id, data: { status: 'unsubscribed' } })
      }
      ok = true
    }
  }

  return (
    <section className="not-found">
      <div className="container container--narrow">
        <h1 className="md-display-small">{ok ? 'You’ve been unsubscribed.' : 'This link isn’t valid.'}</h1>
        <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {ok
            ? 'You won’t receive any more emails from us. Changed your mind? Sign up again any time.'
            : 'It may have expired or been copied incorrectly. Reply to any of our emails and we’ll remove you by hand.'}
        </p>
        <div className="actions">
          <Link className="md-button md-button--filled md-state" href="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
