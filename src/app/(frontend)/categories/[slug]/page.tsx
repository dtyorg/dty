import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Feature } from '@/components/blocks/FeatureBlock'
import { CategoryChips } from '@/components/CategoryChips'
import { ImmersiveHero } from '@/components/ImmersiveHero'
import { JsonLd } from '@/components/JsonLd'
import { RecipeGrid } from '@/components/RecipeCard'
import type { Category } from '@/payload-types'
import { getCategories, getCategoryBySlug, getPayloadClient, getRecipes } from '@/utilities/queries'
import { buildMetadata } from '@/utilities/seo'
import { breadcrumbLd, graph, itemListLd, webPageLd } from '@/utilities/structuredData'

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
  if (!category) return {}
  const parent = typeof category.parent === 'object' ? category.parent : null
  const singular = (t: string) => t.replace(/s$/i, '')
  const payload = await getPayloadClient()
  const children = await payload.find({ collection: 'categories', where: { parent: { equals: category.id } }, depth: 0, limit: 100, select: {} })
  const { totalDocs } = await payload.count({
    collection: 'recipes',
    where: { and: [{ _status: { equals: 'published' } }, { categories: { in: [category.id, ...children.docs.map((c) => c.id)] } }] },
  })
  const base = category.description || parent?.description || ''
  return buildMetadata({
    title: parent ? `${category.title} ${singular(parent.title).toLowerCase()} recipes` : `${singular(category.title)} recipes`,
    metaTitle: category.meta?.title,
    description:
      category.meta?.description ||
      `${base} Browse ${totalDocs} ${singular(category.title).toLowerCase()} recipes with exact measures and step-by-step methods.`.trim(),
    path: `/categories/${category.slug}`,
    images: [category.meta?.image, category.image, parent?.image],
    eyebrow: parent?.title ?? 'Category',
  })
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

  const path = `/categories/${category.slug}`
  const crumbs = [{ name: 'Home', path: '/' }, ...(parent ? [{ name: section.title, path: `/categories/${section.slug}` }] : []), { name: category.title, path }]

  return (
    <>
      <JsonLd
        data={graph(
          {
            ...webPageLd({ name: `${category.title} recipes`, path, description: category.description || section.description, type: 'CollectionPage' }),
            mainEntity: itemListLd(recipes),
          },
          breadcrumbLd(crumbs),
        )}
      />
      <ImmersiveHero
        eyebrow={parent ? `${section.title} · ${category.title}` : section.title}
        image={category.image || section.image}
        subhead={category.description || section.description}
        title={category.headline || (parent ? category.title : section.headline || section.title)}
      />
      <section className="section">
        <div className="container">
          <h2 className="md-visually-hidden">{category.title} recipes</h2>
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
