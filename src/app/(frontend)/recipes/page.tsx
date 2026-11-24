import type { Metadata } from 'next'
import React from 'react'
import { CategoryChips } from '@/components/CategoryChips'
import { JsonLd } from '@/components/JsonLd'
import { ImmersiveHero } from '@/components/ImmersiveHero'
import { RecipeGrid } from '@/components/RecipeCard'
import { getRecipes } from '@/utilities/queries'
import { buildMetadata } from '@/utilities/seo'
import { breadcrumbLd, graph, itemListLd, webPageLd } from '@/utilities/structuredData'

const DESCRIPTION = 'Classics, modern twists, spirits and wine serves — measured, tested and ready to pour.'

export const generateMetadata = (): Promise<Metadata> =>
  buildMetadata({ title: 'All cocktail & drink recipes', description: DESCRIPTION, path: '/recipes', eyebrow: 'The collection' })
export const revalidate = 600

export default async function RecipesPage() {
  const recipes = await getRecipes({ limit: 60 })
  return (
    <>
      <JsonLd
        data={graph(
          { ...webPageLd({ name: 'All recipes', path: '/recipes', description: DESCRIPTION, type: 'CollectionPage' }), mainEntity: itemListLd(recipes) },
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Recipes', path: '/recipes' }]),
        )}
      />
      <ImmersiveHero eyebrow="The collection" subhead={DESCRIPTION} title="Every drink, one shaker away." />
      <section className="section">
        <div className="container">
          <h2 className="md-visually-hidden">All recipes</h2>
          <CategoryChips active="all" />
          <RecipeGrid recipes={recipes} />
        </div>
      </section>
    </>
  )
}
