import type { Metadata } from 'next'
import React from 'react'
import { TrackEvent } from '@/components/analytics/TrackEvent'
import { Icon } from '@/components/Icon'
import { RecipeGrid } from '@/components/RecipeCard'
import { getRecipes } from '@/utilities/queries'

export const metadata: Metadata = { title: 'Search recipes', robots: { index: false, follow: true } }

type Args = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Args) {
  const q = ((await searchParams).q ?? '').trim().slice(0, 80)
  const results = q ? await getRecipes({ search: q, limit: 48 }) : []

  return (
    <>
      <section className="hero">
        <div className="container container--narrow">
          <p className="hero__eyebrow md-overline">Search</p>
          <h1 className="hero__headline md-display-medium">Find your next pour.</h1>
          <form action="/search" className="md-field search-form" role="search">
            <Icon name="search" />
            <label className="md-visually-hidden" htmlFor="q">
              Search recipes
            </label>
            <input autoFocus defaultValue={q} id="q" name="q" placeholder="Negroni, gin, lime…" type="search" />
            <button className="md-button md-button--filled md-state" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>
      {q && <TrackEvent event="search" params={{ search_term: q, results: results.length }} />}
      {q && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <p aria-live="polite" className="md-title-medium" style={{ marginTop: 0 }}>
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”
            </p>
            <RecipeGrid emptyText="No recipes match that search. Try an ingredient like “gin” or “lime”." recipes={results} />
          </div>
        </section>
      )}
    </>
  )
}
