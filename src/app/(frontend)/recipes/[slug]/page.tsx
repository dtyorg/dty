import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Icon } from '@/components/Icon'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ImmersiveHero } from '@/components/ImmersiveHero'
import { JsonLd } from '@/components/JsonLd'
import { TrackEvent } from '@/components/analytics/TrackEvent'
import { difficultyLabel, RecipeGrid } from '@/components/RecipeCard'
import { RichText } from '@/components/RichText'
import type { Category } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getPayloadClient, getRecipeBySlug, getRecipes } from '@/utilities/queries'
import { buildMetadata, getSiteSettings } from '@/utilities/seo'
import { breadcrumbLd, graph, recipeLd } from '@/utilities/structuredData'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const recipes = await payload.find({
      collection: 'recipes',
      limit: 1000,
      pagination: false,
      select: { slug: true },
    })
    return recipes.docs.filter((d) => d.slug).map(({ slug }) => ({ slug: slug as string }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipeBySlug(decodeURIComponent(slug))
  if (!recipe) return {}
  const cats = (recipe.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const section = cats.find((c) => !c.parent)
  const kind = section?.title === 'Wines' ? 'wine cocktail' : section?.title === 'Spirits' ? 'drink' : 'cocktail'
  return buildMetadata({
    title: `${recipe.title} ${kind} recipe`,
    metaTitle: recipe.meta?.title,
    description:
      recipe.meta?.description ||
      [recipe.description, recipe.ingredients?.length ? `Made with ${recipe.ingredients.slice(0, 3).map((i) => i.name.toLowerCase()).join(', ')}.` : '']
        .filter(Boolean)
        .join(' '),
    path: `/recipes/${recipe.slug}`,
    images: [recipe.meta?.image, recipe.image],
    eyebrow: section?.title,
    type: 'article',
    publishedTime: recipe.publishedAt,
    modifiedTime: recipe.updatedAt,
    section: section?.title,
    tags: cats.map((c) => c.title),
    alternateTypes: { 'text/markdown': `/recipes/${recipe.slug}.md` },
  })
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default async function RecipePage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const recipe = await getRecipeBySlug(decodeURIComponent(slug))
  if (!recipe) notFound()

  const categories = (recipe.categories ?? []).filter((c): c is Category => typeof c === 'object')
  const d = recipe.details
  const facts = [
    d?.difficulty && { label: 'Difficulty', value: difficultyLabel[d.difficulty] },
    d?.prepMinutes && { label: 'Prep', value: `${d.prepMinutes} min` },
    d?.servings && { label: 'Serves', value: String(d.servings) },
    d?.method && { label: 'Method', value: cap(d.method) },
    d?.glass && { label: 'Glass', value: d.glass },
  ].filter((f): f is { label: string; value: string } => Boolean(f))

  // The top-level section (Cocktails / Spirits / Wines) this recipe belongs to
  const section = categories.find((c) => !c.parent) ?? null
  const relatedCat = categories.find((c) => c.parent) ?? section
  const related = relatedCat
    ? await getRecipes({ categoryId: relatedCat.id, excludeId: recipe.id, limit: 3 })
    : []

  const settings = await getSiteSettings()
  const path = `/recipes/${recipe.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    ...(section ? [{ name: section.title, path: `/categories/${section.slug}` }] : [{ name: 'Recipes', path: '/recipes' }]),
    ...(relatedCat && relatedCat !== section ? [{ name: relatedCat.title, path: `/categories/${relatedCat.slug}` }] : []),
    { name: recipe.title, path },
  ]

  return (
    <article>
      <JsonLd data={graph(recipeLd(recipe, settings), breadcrumbLd(crumbs))} />
      <TrackEvent event="view_item" params={{ item_id: recipe.slug ?? '', item_name: recipe.title, item_category: section?.title ?? '' }} />
      {draft && <LivePreviewListener serverURL={getServerSideURL()} />}

      <ImmersiveHero
        eyebrow={[section?.title, relatedCat !== section ? relatedCat?.title : null].filter(Boolean).join(' · ') || 'Recipe'}
        image={recipe.image}
        subhead={recipe.description}
        title={recipe.title}
      >
        {!!facts.length && (
          <dl className="recipe-facts hero-in" style={{ '--i': 4 } as React.CSSProperties}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="md-label-medium">{f.label}</dt>
                <dd className="md-title-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </ImmersiveHero>

      <div className="container recipe-crumbs">
        <Link className="md-button md-button--text md-button--has-icon md-state recipe-back" href={section ? `/categories/${section.slug}` : '/recipes'}>
          <Icon name="arrowBack" />
          {section ? `All ${section.title.toLowerCase()}` : 'All recipes'}
        </Link>
        <div className="md-chip-set">
          {categories.map((c) => (
            <Link className="md-chip md-chip--pill md-state" href={`/categories/${c.slug}`} key={c.id}>
              {c.title}
            </Link>
          ))}
          {d?.alcoholFree && <span className="md-chip md-chip--pill md-chip--selected">Alcohol-free</span>}
        </div>
      </div>

      <div className="container recipe-body">
        <aside className="md-card md-card--filled recipe-ingredients" data-animate>
          <div className="md-card__body">
            <h2 className="md-title-large" style={{ margin: 0 }}>
              Ingredients
            </h2>
            <ul>
              {recipe.ingredients?.map((ing) => (
                <li key={ing.id}>
                  <span className="recipe-ingredients__qty md-label-large">
                    {[ing.amount, ing.unit?.replace('-', ' ')].filter(Boolean).join(' ')}
                  </span>
                  <span className="md-body-large">
                    {ing.name}
                    {ing.note && <span className="recipe-ingredients__note">, {ing.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
            {d?.garnish && (
              <p className="md-body-medium" style={{ margin: 0 }}>
                <strong>Garnish:</strong> {d.garnish}
              </p>
            )}
          </div>
        </aside>

        <div>
          <h2 className="md-headline-medium" style={{ marginTop: 0 }}>
            Method
          </h2>
          <ol className="recipe-steps" data-animate-children>
            {recipe.steps?.map((s, i) => (
              <li id={`step-${i + 1}`} key={s.id}>
                <span aria-hidden="true" className="recipe-steps__num md-title-medium">
                  {i + 1}
                </span>
                <p className="md-body-large">{s.instruction}</p>
              </li>
            ))}
          </ol>
          {recipe.notes && (
            <>
              <h2 className="md-headline-medium">Notes</h2>
              <RichText data={recipe.notes} />
            </>
          )}
        </div>
      </div>

      {!!related.length && (
        <section className="section">
          <div className="container">
            <h2 className="section-heading md-headline-medium" style={{ marginBottom: 24 }}>
              More {relatedCat?.title.toLowerCase()}
            </h2>
            <RecipeGrid recipes={related} />
          </div>
        </section>
      )}
    </article>
  )
}
