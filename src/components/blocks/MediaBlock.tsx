import React from 'react'
import type { MediaBlock as Props } from '@/payload-types'
import { Media } from '../Media'

export const MediaBlock: React.FC<Props> = ({ media, caption }) => (
  <section className="section">
    <div className="container">
      <figure className="media-figure" data-animate="scale">
        <Media resource={media} size="hero" sizes="(max-width: 1280px) 100vw, 1280px" />
        {(caption || (typeof media === 'object' && media?.caption)) && (
          <figcaption className="md-body-small">
            {caption || (typeof media === 'object' ? media?.caption : '')}
          </figcaption>
        )}
      </figure>
    </div>
  </section>
)
