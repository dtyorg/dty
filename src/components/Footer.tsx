import Link from 'next/link'
import React from 'react'
import { getGlobal } from '@/utilities/queries'
import { CookieSettingsButton } from './analytics/CookieSettingsButton'
import { CMSLink } from './CMSLink'
import { Icon } from './Icon'
import { SocialIcon } from './SocialIcon'
import { ThemeSegmented } from './ThemeSwitcher'

export async function Footer() {
  const [footer, header, settings] = await Promise.all([getGlobal('footer'), getGlobal('header'), getGlobal('site-settings')])
  const hasTracking = Boolean(settings.ga4Id || settings.gtmId || settings.metaPixelId || settings.bingUetId || settings.clarityId)
  return (
    <footer className="site-footer">
      <div className="container site-footer__row">
        <Link className="site-footer__brand" href="/">
          <Icon name="cocktail" />
          <span className="md-top-app-bar__name">{header.siteName || 'D3TY'}</span>
        </Link>
        {!!footer.links?.length && (
          <nav aria-label="Footer" className="site-footer__links md-body-medium">
            {footer.links.map(({ link, id }) => (
              <CMSLink appearance="plain" key={id} link={link} />
            ))}
            {hasTracking && settings.requireConsent !== false && <CookieSettingsButton />}
          </nav>
        )}
        {!!footer.socials?.length && (
          <ul className="site-footer__socials">
            {footer.socials.map((s) => (
              <li key={s.id}>
                <a aria-label={s.platform} className="md-icon-button md-state" href={s.url} rel="noopener noreferrer" target="_blank">
                  <SocialIcon platform={s.platform} />
                </a>
              </li>
            ))}
          </ul>
        )}
        {footer.legal && <span className="site-footer__legal md-body-small">{footer.legal}</span>}
      </div>
      <div className="container">
        <hr className="md-divider" />
        <div className="site-footer__bottom">
          <span className="md-body-small">{footer.copyright}</span>
          <ThemeSegmented />
        </div>
      </div>
    </footer>
  )
}
