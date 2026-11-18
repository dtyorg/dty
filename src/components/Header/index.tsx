import React from 'react'
import { getGlobal } from '@/utilities/queries'
import { Media } from '../Media'
import { TopAppBar } from './TopAppBar'

export async function Header() {
  const header = await getGlobal('header')
  return (
    <TopAppBar
      cta={header.cta?.enabled ? header.cta.link : null}
      logo={
        header.logo && typeof header.logo === 'object' ? (
          <Media className="md-top-app-bar__logo" resource={header.logo} size="thumbnail" sizes="32px" />
        ) : undefined
      }
      navItems={header.navItems ?? []}
      siteName={header.siteName || 'D3TY'}
    />
  )
}
