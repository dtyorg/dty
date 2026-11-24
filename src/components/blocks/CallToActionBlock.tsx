import React from 'react'
import type { CallToActionBlock as Props } from '@/payload-types'
import { CMSLink } from '../CMSLink'

export const CallToActionBlock: React.FC<Props> = ({ heading, body, links }) => (
  <section className="section">
    <div className="container">
      <div className="cta" data-animate="scale">
        <div>
          <h2 className="md-headline-medium">{heading}</h2>
          {body && <p className="md-body-large">{body}</p>}
        </div>
        {!!links?.length && (
          <div className="actions">
            {links.map(({ link, id }) => (
              <CMSLink key={id} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
)
