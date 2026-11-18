import Link from 'next/link'
import React from 'react'
import type { Category, Recipe } from '@/payload-types'
import { Icon, type IconName } from './Icon'
import { Media } from './Media'

export const difficultyLabel = { easy: 'Easy', medium: 'Medium', advanced: 'Advanced' } as const

/** Branded placeholder when an item has no photo yet. */
export const ImagePlaceholder: React.FC<{ icon?: IconName; className?: string }> = ({ icon = 'cocktail', className }) => (
  <div aria-hidden="true" className={`img-placeholder md-theme-dark ${className ?? ''}`}>
    <Icon name={icon} />
  </div>
)

const iconFor = (recipe: Partial<Recipe>): IconName => {
  const cats = (recipe.categories ?? []).filter((c): c is Category => typeof c === 'object')
  // The first category is the recipe's primary section (Cocktails / Spirits / Wines)
  return (cats[0]?.icon as IconName | undefined) ?? 'cocktail'
}

export const RecipeCard: React.FC<{ recipe: Partial<Recipe> }> = ({ recipe }) => {
  const d = recipe.details
  return (
    <Link className="md-card md-card--outlined md-state recipe-card" href={`/recipes/${recipe.slug}`}>
      {recipe.image ? (
        <Media className="md-card__media recipe-card__media" resource={recipe.image} size="card" />
      ) : (
        <ImagePlaceholder className="md-card__media recipe-card__media" icon={iconFor(recipe)} />
      )}
      <div className="md-card__body">
        <h3 className="md-title-large" style={{ margin: 0 }}>
          {recipe.title}
        </h3>
        {recipe.description && <p className="md-card__supporting md-body-medium recipe-card__desc">{recipe.description}</p>}
        <p className="recipe-card__meta md-label-medium">
          {d?.prepMinutes ? (
            <span>
              <Icon name="schedule" /> {d.prepMinutes} mins
            </span>
          ) : null}
          {d?.difficulty && (
            <span>
              <Icon name="bars" /> {difficultyLabel[d.difficulty]}
            </span>
          )}
          {d?.alcoholFree && <span>0% ABV</span>}
        </p>
        <span className="recipe-card__cta md-label-large">
          View Recipe <Icon name="arrowForward" />
        </span>
      </div>
    </Link>
  )
}

/** Compact image tile used for “Trending right now”. */
export const RecipeTile: React.FC<{ recipe: Partial<Recipe> }> = ({ recipe }) => (
  <Link className="recipe-tile md-theme-dark md-state" href={`/recipes/${recipe.slug}`}>
    {recipe.image ? (
      <Media className="recipe-tile__img" resource={recipe.image} size="card" />
    ) : (
      <ImagePlaceholder className="recipe-tile__img" icon={iconFor(recipe)} />
    )}
    <span className="recipe-tile__label">
      <span className="md-title-large">{recipe.title}</span>
      <Icon name="arrowForward" />
    </span>
  </Link>
)

export const RecipeGrid: React.FC<{ recipes: Partial<Recipe>[]; emptyText?: string; variant?: 'cards' | 'strip' }> = ({
  recipes,
  emptyText = 'No recipes here yet — check back soon.',
  variant = 'cards',
}) =>
  recipes.length ? (
    <div className={variant === 'strip' ? 'recipe-strip' : 'card-grid'}>
      {recipes.map((r) => (variant === 'strip' ? <RecipeTile key={r.id} recipe={r} /> : <RecipeCard key={r.id} recipe={r} />))}
    </div>
  ) : (
    <div className="empty-state md-body-large">{emptyText}</div>
  )
