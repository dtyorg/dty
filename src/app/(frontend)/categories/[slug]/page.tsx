import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Feature } from '@/components/blocks/FeatureBlock'
import { CategoryChips } from '@/components/CategoryChips'
import { ImmersiveHero } from '@/components/ImmersiveHero'
import { RecipeGrid } from '@/components/RecipeCard'
import type { Category } from '@/payload-types'
import { getCategories, getCategoryBySlug, getRecipes } from '@/utilities/queries'

type Args = { params: Promise<{ slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  try {
    return (await getCategories()).filter((c) => c.slug).map((c) => ({ slug: c.slug as string }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const category = await getCategoryBySlug(decodeURIComponent((await params).slug))
  return category ? { title: category.title, description: category.description ?? undefined } : {}
}

export default async function CategoryPage({ params }: Args) {
  const category = await getCategoryBySlug(decodeURIComponent((await params).slug))
  if (!category) notFound()

  const all = await getCategories()
  const parent = typeof category.parent === 'object' ? category.parent : all.find((c) => c.id === category.parent)
  // A sub-category lives inside its parent section: reuse the section's hero, chips and feature.
  const section: Category = (parent as Category | undefined) ?? category
  const children = all.filter((c) => (typeof c.parent === 'object' ? c.parent?.id : c.parent) === category.id)
  const recipes = await getRecipes({ categoryIds: [category.id, ...children.map((c) => c.id)], limit: 60 })
  const feature = section.feature

  return (
    <>
      <ImmersiveHero
        eyebrow={parent ? `${section.title} · ${category.title}` : section.title}
        image={category.image || section.image}
        subhead={category.description || section.description}
        title={category.headline || (parent ? category.title : section.headline || section.title)}
      />
      <section className="section">
        <div className="container">
          <CategoryChips active={category.slug ?? ''} section={section} />
          <RecipeGrid recipes={recipes} />
        </div>
      </section>
      {feature?.enabled && feature.heading && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Feature body={feature.body} eyebrow={feature.eyebrow} heading={feature.heading} image={feature.image} link={feature.link} />
          </div>
        </section>
      )}
    </>
  )
}
