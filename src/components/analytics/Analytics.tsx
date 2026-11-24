'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useSyncExternalStore } from 'react'
import { consentStore, markTrackingReady } from './track'

export type TrackingConfig = {
  requireConsent: boolean
  ga4Id?: string | null
  gtmId?: string | null
  metaPixelId?: string | null
  bingUetId?: string | null
  clarityId?: string | null
  privacyPath?: string
}

// Official vendor snippets, parameterised with IDs that were format-validated in Payload
// and are JSON-encoded here (never string-concatenated raw).
const snippets = (c: TrackingConfig): string[] => {
  const s: string[] = []
  if (c.ga4Id) {
    s.push(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(c.ga4Id)});
(function(d){var j=d.createElement('script');j.async=1;j.src='https://www.googletagmanager.com/gtag/js?id='+${JSON.stringify(encodeURIComponent(c.ga4Id))};d.head.appendChild(j)})(document);`)
  }
  if (c.gtmId) {
    s.push(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer',${JSON.stringify(c.gtmId)});`)
  }
  if (c.metaPixelId) {
    s.push(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(c.metaPixelId)});fbq('track','PageView');`)
  }
  if (c.bingUetId) {
    // enableAutoSpaTracking: UET records client-side route changes by itself
    s.push(`(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:${JSON.stringify(c.bingUetId)},enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","https://bat.bing.com/bat.js","uetq");`)
  }
  if (c.clarityId) {
    s.push(`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(c.clarityId)});`)
  }
  return s
}

/** Runs after `load` + idle so tracking never competes with rendering. */
const whenIdleAfterLoad = (fn: () => void) => {
  const idle = () => (window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1)))(fn, { timeout: 4000 })
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}

export function Analytics(config: TrackingConfig) {
  const consent = useSyncExternalStore(consentStore.subscribe, consentStore.get, consentStore.getServer)
  const pathname = usePathname()
  const loaded = useRef(false)
  const firstPath = useRef(pathname)
  const hasTools = snippets(config).length > 0
  const allowed = hasTools && (!config.requireConsent || consent === 'granted')

  // Inject vendor snippets once, after consent
  useEffect(() => {
    if (!allowed || loaded.current) return
    loaded.current = true
    whenIdleAfterLoad(() => {
      for (const code of snippets(config)) {
        const el = document.createElement('script')
        el.text = code
        document.head.appendChild(el)
      }
      markTrackingReady()
    })
  }, [allowed, config])

  // Page views on client-side navigation (GA4 enhanced measurement, UET auto-SPA and Clarity handle their own)
  useEffect(() => {
    if (!loaded.current || pathname === firstPath.current) return
    firstPath.current = pathname
    const w = window as Window & { fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] }
    w.fbq?.('track', 'PageView')
    if (config.gtmId) w.dataLayer?.push({ event: 'page_view', page_path: pathname })
  }, [pathname, config.gtmId])

  if (!hasTools || !config.requireConsent || consent !== null) return null

  return (
    <div aria-label="Cookie consent" aria-live="polite" className="consent md-theme-dark" role="region">
      <p className="md-body-medium consent__text">
        We use cookies to understand how our recipes are used and to measure our ads.{' '}
        <Link href={config.privacyPath || '/privacy'}>Privacy policy</Link>
      </p>
      <div className="consent__actions">
        <button className="md-button md-button--text md-state" onClick={() => consentStore.set('denied')} type="button">
          Decline
        </button>
        <button className="md-button md-button--filled md-state" onClick={() => consentStore.set('granted')} type="button">
          Accept
        </button>
      </div>
    </div>
  )
}
