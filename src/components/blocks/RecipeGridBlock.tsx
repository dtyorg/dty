import Link from 'next/link'
import React from 'react'
import type { Category, RecipeGridBlock as Props } from '@/payload-types'
import { getRecipes } from '@/utilities/queries'
import { Icon } from '../Icon'
import { RecipeGrid } from '../RecipeCard'

export async function RecipeGridBlock({ heading, intro, source, category, recipes, limit, showAllLink, style }: Props) {
  const cat = category && typeof category === 'object' ? (category as Category) : null
  const ids = (recipes ?? []).map((r) => (typeof r === 'object' ? r.id : r))
  const items =
    source === 'selection'
      ? ids.length
        ? await getRecipes({ ids, limit: ids.length })
        : []
      : await getRecipes({
          limit: limit ?? 6,
          featured: source === 'featured',
          categoryId: source === 'category' ? (cat?.id ?? (category as string)) : undefined,
        })

  const allHref = source === 'category' && cat?.slug ? `/categories/${cat.slug}` : '/recipes'

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            {heading && <h2 className="section-heading md-headline-large">{heading}</h2>}
            {intro && <p className="section-intro md-body-large">{intro}</p>}
          </div>
          {showAllLink && (
            <Link className="md-button md-button--text md-button--has-trailing-icon md-state section-head__action" href={allHref}>
              View all
              <Icon name="arrowForward" />
            </Link>
          )}
        </div>
        <RecipeGrid recipes={items} variant={style ?? 'cards'} />
      </div>
    </section>
  )
}
