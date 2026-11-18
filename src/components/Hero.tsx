import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from './CMSLink'
import { ImmersiveHero } from './ImmersiveHero'
import { Media } from './Media'

export const Hero: React.FC<{ hero: Page['hero']; fallbackTitle: string }> = ({ hero, fallbackTitle }) => {
  const type = hero?.type ?? 'standard'
  if (type === 'none') return null

  if (type === 'immersive') {
    return (
      <ImmersiveHero eyebrow={hero?.eyebrow} image={hero?.media} size="large" subhead={hero?.subhead} title={hero?.headline || fallbackTitle}>
        {!!hero?.links?.length && (
          <div className="actions">
            {hero.links.map(({ link, id }) => (
              <CMSLink key={id} link={link} trailingIcon="arrowForward" />
            ))}
          </div>
        )}
      </ImmersiveHero>
    )
  }

  const content = (
    <div>
      {hero?.eyebrow && <p className="hero__eyebrow md-label-large">{hero.eyebrow}</p>}
      <h1 className="hero__headline md-display-large">{hero?.headline || fallbackTitle}</h1>
      {hero?.subhead && <p className="hero__subhead md-body-large">{hero.subhead}</p>}
      {!!hero?.links?.length && (
        <div className="actions">
          {hero.links.map(({ link, id }, i) => (
            <CMSLink icon={i === 0 ? 'arrowForward' : undefined} key={id} link={link} />
          ))}
        </div>
      )}
    </div>
  )

  if (type === 'expressive') {
    return (
      <section className="hero hero--expressive">
        <div className="container">
          <div className={`hero__panel${hero?.media ? ' hero__panel--with-media' : ''}`}>
            {content}
            <Media
              className="hero__media"
              priority
              resource={hero?.media}
              size="hero"
              sizes="(max-width: 840px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero">
      <div className="container">{content}</div>
    </section>
  )
}
