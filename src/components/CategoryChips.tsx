import Link from 'next/link'
import React from 'react'
import type { Category } from '@/payload-types'
import { getCategories } from '@/utilities/queries'

/**
 * M3 filter chips. Inside a section (e.g. Cocktails) they list its sub-categories;
 * on /recipes they list the top-level sections.
 */
export async function CategoryChips({ section, active }: { section?: Category | null; active: string }) {
  const all = await getCategories()
  const items = section
    ? all.filter((c) => (typeof c.parent === 'object' ? c.parent?.id : c.parent) === section.id)
    : all.filter((c) => !c.parent)
  if (!items.length) return null
  const allHref = section ? `/categories/${section.slug}` : '/recipes'
  const allActive = section ? active === section.slug : active === 'all'

  return (
    <nav aria-label="Filter recipes" className="md-chip-set chip-row">
      <Link aria-current={allActive ? 'page' : undefined} className={`md-chip md-chip--pill md-state${allActive ? ' md-chip--selected' : ''}`} href={allHref}>
        All
      </Link>
      {items.map((c) => (
        <Link
          aria-current={active === c.slug ? 'page' : undefined}
          className={`md-chip md-chip--pill md-state${active === c.slug ? ' md-chip--selected' : ''}`}
          href={`/categories/${c.slug}`}
          key={c.id}
        >
          {c.title}
        </Link>
      ))}
    </nav>
  )
}
