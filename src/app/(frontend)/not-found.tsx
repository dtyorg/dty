import Link from 'next/link'
import React from 'react'
import { Icon } from '@/components/Icon'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="md-display-large" style={{ margin: 0, color: 'var(--md-sys-color-primary)' }}>
          404
        </p>
        <h1 className="md-headline-medium">This page could not be found</h1>
        <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          It may have been moved or unpublished.
        </p>
        <div className="actions">
          <Link className="md-button md-button--filled md-button--has-icon md-state" href="/">
            <Icon name="arrowBack" />
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
