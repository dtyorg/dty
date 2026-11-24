import React from 'react'
import type { CardGridBlock as Props } from '@/payload-types'
import { CMSLink } from '../CMSLink'
import { Media } from '../Media'

export const CardGridBlock: React.FC<Props> = ({ heading, intro, cards, variant }) => (
  <section className="section">
    <div className="container">
      {heading && <h2 className="section-heading md-headline-medium" data-animate>{heading}</h2>}
      {intro && <p className="section-intro md-body-large">{intro}</p>}
      <div className="card-grid" data-animate-children>
        {cards?.map((card) => (
          <article className={`md-card md-card--${variant ?? 'elevated'}`} key={card.id}>
            {card.image && <Media className="md-card__media" resource={card.image} size="card" />}
            <div className="md-card__body">
              <h3 className="md-title-large">{card.title}</h3>
              {card.description && <p className="md-card__supporting md-body-medium">{card.description}</p>}
            </div>
            {card.enableLink && card.link && (
              <div className="md-card__actions">
                <CMSLink link={card.link} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>
)
