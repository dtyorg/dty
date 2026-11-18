import React from 'react'
import type { NewsletterBlock as Props } from '@/payload-types'
import { Icon } from '../Icon'
import { NewsletterForm } from './NewsletterForm'

export const NewsletterBlock: React.FC<Props> = ({ heading, body, buttonLabel }) => (
  <section className="section">
    <div className="container">
      <div className="newsletter">
        <span aria-hidden="true" className="newsletter__icon">
          <Icon name="mail" />
        </span>
        <div className="newsletter__copy">
          {heading && <h2 className="md-headline-small" style={{ margin: 0 }}>{heading}</h2>}
          {body && <p className="md-body-medium" style={{ margin: '4px 0 0' }}>{body}</p>}
        </div>
        <NewsletterForm buttonLabel={buttonLabel || 'Join'} source="newsletter-block" />
      </div>
    </div>
  </section>
)
