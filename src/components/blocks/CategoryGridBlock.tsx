import Link from 'next/link'
import React from 'react'
import type { CategoryGridBlock as Props } from '@/payload-types'
import { getCategories } from '@/utilities/queries'
import { Icon, type IconName } from '../Icon'
import { Media } from '../Media'
import { ImagePlaceholder } from '../RecipeCard'

export async function CategoryGridBlock({ heading, intro, categories, style }: Props) {
  const all = await getCategories()
  const pickedIds = (categories ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  const list = pickedIds.length
    ? pickedIds.map((id) => all.find((c) => c.id === id)).filter((c) => !!c)
    : all.filter((c) => !c.parent)

  if (style === 'list') {
    return (
      <section className="section">
        <div className="container">
          {heading && <h2 className="section-heading md-headline-large" data-animate>{heading}</h2>}
          {intro && <p className="section-intro md-body-large">{intro}</p>}
          <div className="category-grid" data-animate-children>
            {list.map((c) => (
              <Link className="category-tile md-state" href={`/categories/${c.slug}`} key={c.id}>
                <span aria-hidden="true" className="category-tile__mark">
                  <Icon name={(c.icon as IconName) ?? 'cocktail'} />
                </span>
                <span>
                  <span className="md-title-large" style={{ display: 'block' }}>
                    {c.title}
                  </span>
                  {c.description && <span className="md-body-small category-tile__desc">{c.description}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        {heading && <h2 className="section-heading section-heading--rule md-headline-large" data-animate>{heading}</h2>}
        {intro && <p className="section-intro section-intro--center md-body-large">{intro}</p>}
        <div className="world-grid" data-animate-children="scale">
          {list.map((c) => (
            <Link className="world-tile md-theme-dark md-state" href={`/categories/${c.slug}`} key={c.id}>
              {c.image ? (
                <Media className="world-tile__img" resource={c.image} size="card" />
              ) : (
                <ImagePlaceholder className="world-tile__img" icon={(c.icon as IconName) ?? 'cocktail'} />
              )}
              <span className="world-tile__label">
                <span className="md-headline-medium">{c.title}</span>
                <span className="md-label-large world-tile__explore">
                  Explore <Icon name="arrowForward" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
