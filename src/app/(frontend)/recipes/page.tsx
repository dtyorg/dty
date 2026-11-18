import type { Metadata } from 'next'
import React from 'react'
import { CategoryChips } from '@/components/CategoryChips'
import { ImmersiveHero } from '@/components/ImmersiveHero'
import { RecipeGrid } from '@/components/RecipeCard'
import { getRecipes } from '@/utilities/queries'

export const metadata: Metadata = { title: 'All recipes' }
export const revalidate = 600

export default async function RecipesPage() {
  const recipes = await getRecipes({ limit: 60 })
  return (
    <>
      <ImmersiveHero
        eyebrow="The collection"
        subhead="Classics, modern twists, spirits and wine serves — measured, tested and ready to pour."
        title="Every drink, one shaker away."
      />
      <section className="section">
        <div className="container">
          <CategoryChips active="all" />
          <RecipeGrid recipes={recipes} />
        </div>
      </section>
    </>
  )
}
