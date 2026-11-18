'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { CMSLink, type CMSLinkData, resolveHref } from '../CMSLink'
import { Icon } from '../Icon'
import { ThemeSegmented, ThemeToggleButton } from '../ThemeSwitcher'

type Props = {
  siteName: string
  logo?: React.ReactNode
  navItems: { id?: string | null; link: CMSLinkData }[]
  cta?: CMSLinkData | null
}

const isActive = (pathname: string, href: string | null) =>
  !!href && (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

export const TopAppBar: React.FC<Props> = ({ siteName, logo, navItems, cta }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  // Drawer is tied to the path it was opened on, so navigating closes it.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null)
  const open = openOnPath === pathname
  const setOpen = (v: boolean) => setOpenOnPath(v ? pathname : null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape to close, focus management, body scroll lock
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    drawerRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOnPath(null)
    window.addEventListener('keydown', onKey)
    const menuButton = menuButtonRef.current
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      menuButton?.focus()
    }
  }, [open])

  const brand = (
    <>
      {logo ?? (
        <span aria-hidden="true" className="md-top-app-bar__mark">
          <Icon name="cocktail" />
        </span>
      )}
      <span className="md-top-app-bar__name">{siteName}</span>
    </>
  )

  return (
    <>
      <header className="md-top-app-bar" data-scrolled={scrolled}>
        <div className="md-top-app-bar__row">
          <button
            aria-controls="nav-drawer"
            aria-expanded={open}
            aria-label="Open navigation menu"
            className="md-icon-button md-state md-top-app-bar__menu"
            onClick={() => setOpen(true)}
            ref={menuButtonRef}
            type="button"
          >
            <Icon name="menu" />
          </button>
          <Link className="md-top-app-bar__brand" href="/">
            {brand}
          </Link>
          <nav aria-label="Main" className="md-top-app-bar__nav">
            {navItems.map(({ link, id }, i) => (
              <CMSLink
                appearance="plain"
                ariaCurrent={isActive(pathname, resolveHref(link))}
                className="md-nav-link md-state"
                key={id ?? i}
                link={link}
              />
            ))}
          </nav>
          {cta && <CMSLink className="md-top-app-bar__cta" link={cta} />}
          <Link aria-label="Search recipes" className="md-icon-button md-state" href="/search" title="Search">
            <Icon name="search" />
          </Link>
          <ThemeToggleButton />
        </div>
      </header>

      <div aria-hidden="true" className="md-scrim" data-open={open} onClick={() => setOpen(false)} />
      <div
        aria-label="Navigation"
        aria-modal="true"
        className="md-drawer"
        data-open={open}
        id="nav-drawer"
        inert={!open}
        ref={drawerRef}
        role="dialog"
      >
        <div className="md-drawer__header">
          <span className="md-title-small">{siteName}</span>
          <button
            aria-label="Close navigation menu"
            className="md-icon-button md-state"
            onClick={() => setOpen(false)}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Main mobile">
          <Link aria-current={pathname === '/' ? 'page' : undefined} className="md-drawer__item md-state" href="/">
            Home
          </Link>
          {navItems
            .filter(({ link }) => resolveHref(link) !== '/')
            .map(({ link, id }, i) => (
              <CMSLink
                appearance="plain"
                ariaCurrent={isActive(pathname, resolveHref(link))}
                className="md-drawer__item md-state"
                key={id ?? i}
                link={link}
              />
            ))}
        </nav>
        <div className="md-drawer__footer">
          {cta && <CMSLink className="md-drawer__cta" link={cta} />}
          <p className="md-label-medium" style={{ margin: '24px 0 8px' }}>
            Theme
          </p>
          <ThemeSegmented showLabels />
        </div>
      </div>
    </>
  )
}
