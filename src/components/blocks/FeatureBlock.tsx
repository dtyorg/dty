import React from 'react'
import type { FeatureBlock as Props } from '@/payload-types'
import { CMSLink, type CMSLinkData } from '../CMSLink'
import { Media } from '../Media'
import { ImagePlaceholder } from '../RecipeCard'

type FeatureProps = {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  image?: Props['image']
  imagePosition?: Props['imagePosition']
  link?: CMSLinkData | null
}

export const Feature: React.FC<FeatureProps> = ({ eyebrow, heading, body, image, imagePosition, link }) => (
  <div className={`feature md-card md-card--outlined${imagePosition === 'end' ? ' feature--reverse' : ''}`}>
    {image ? <Media className="feature__img" resource={image} size="card" sizes="(max-width: 840px) 100vw, 50vw" /> : <ImagePlaceholder className="feature__img" />}
    <div className="feature__body">
      {eyebrow && <p className="md-overline feature__eyebrow">{eyebrow}</p>}
      {heading && <h2 className="md-display-small feature__heading">{heading}</h2>}
      {body && <p className="md-body-large feature__text">{body}</p>}
      {link && <CMSLink link={link} trailingIcon="arrowForward" />}
    </div>
  </div>
)

export const FeatureBlock: React.FC<Props> = (props) => (
  <section className="section">
    <div className="container">
      <Feature {...props} link={props.enableLink ? props.link : null} />
    </div>
  </section>
)
