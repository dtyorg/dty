import Link from 'next/link'
import React from 'react'
import type { Category, Page, Recipe } from '@/payload-types'
import { Icon, type IconName } from './Icon'

export type CMSLinkData = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?:
    | { relationTo: 'pages'; value: string | Page }
    | { relationTo: 'recipes'; value: string | Recipe }
    | { relationTo: 'categories'; value: string | Category }
    | null
  url?: string | null
  label?: string | null
  appearance?: ('filled' | 'tonal' | 'outlined' | 'text') | null
}

export const resolveHref = (link?: CMSLinkData | null): string | null => {
  if (!link) return null
  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = link.reference.value.slug
    if (!slug) return null
    if (link.reference.relationTo === 'recipes') return `/recipes/${slug}`
    if (link.reference.relationTo === 'categories') return `/categories/${slug}`
    return slug === 'home' ? '/' : `/${slug}`
  }
  return link.url || null
}

type Props = {
  link?: CMSLinkData | null
  className?: string
  /** Override the stored appearance. 'plain' renders an unstyled link. */
  appearance?: CMSLinkData['appearance'] | 'plain'
  icon?: IconName
  trailingIcon?: IconName
  children?: React.ReactNode
  ariaCurrent?: boolean
}

export const CMSLink: React.FC<Props> = ({ link, className, appearance, icon, trailingIcon, children, ariaCurrent }) => {
  const href = resolveHref(link)
  if (!href || !link) return null
  const look = appearance ?? link.appearance ?? 'plain'
  const classes =
    look === 'plain'
      ? className
      : ['md-button', `md-button--${look}`, 'md-state', icon && 'md-button--has-icon', trailingIcon && 'md-button--has-trailing-icon', className]
          .filter(Boolean)
          .join(' ')
  const newTab = link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <Link
      aria-current={ariaCurrent ? 'page' : undefined}
      className={classes}
      href={href}
      {...newTab}
    >
      {icon && <Icon name={icon} />}
      {children ?? link.label}
      {trailingIcon && <Icon name={trailingIcon} />}
    </Link>
  )
}
