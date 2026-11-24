import React from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from './Media'

type Props = {
  eyebrow?: string | null
  title: string
  subhead?: string | null
  image?: string | MediaType | null
  size?: 'large' | 'medium'
  as?: 'h1' | 'h2'
  children?: React.ReactNode
}

/**
 * Full-bleed photographic hero. Always rendered in the dark olive scheme (scoped M3 theme)
 * so text over imagery keeps its contrast in both site themes.
 */
export const ImmersiveHero: React.FC<Props> = ({ eyebrow, title, subhead, image, size = 'medium', as: H = 'h1', children }) => {
  const hasImage = !!image && typeof image === 'object'
  return (
    <section className={`immersive md-theme-dark immersive--${size}${hasImage ? ' immersive--with-image' : ''}`}>
      {hasImage && (
        <div className="immersive__media" data-parallax>
          <Media className="immersive__img" priority resource={image} size="hero" sizes="100vw" />
        </div>
      )}
      <div className="immersive__scrim" />
      <div className="container immersive__content">
        {eyebrow && <p className="immersive__eyebrow md-overline">{eyebrow}</p>}
        <H className={`immersive__title ${size === 'large' ? 'md-display-large' : 'md-display-medium'}`}>{title}</H>
        {subhead && <p className="immersive__subhead md-body-large">{subhead}</p>}
        {children}
      </div>
    </section>
  )
}
