'use client'

/**
 * Vendor-neutral event API. Call `track('sign_up', {...})` anywhere on the client:
 * events are queued until consent is given and the vendor snippets are loaded, then
 * forwarded to every configured tool with its own naming (GA4 / GTM / Meta / Bing / Clarity).
 */
export type TrackEventName = 'sign_up' | 'view_item' | 'search'
type Params = Record<string, string | number | boolean>

type W = Window & {
  gtag?: (...a: unknown[]) => void
  dataLayer?: unknown[]
  fbq?: (...a: unknown[]) => void
  uetq?: { push: (...a: unknown[]) => void }
  clarity?: (...a: unknown[]) => void
}

const META_EVENTS: Record<TrackEventName, string> = { sign_up: 'Lead', view_item: 'ViewContent', search: 'Search' }

let ready = false
const queue: [TrackEventName, Params][] = []

const send = (name: TrackEventName, params: Params) => {
  const w = window as W
  w.gtag?.('event', name, params)
  if (!w.gtag && w.dataLayer) w.dataLayer.push({ event: name, ...params }) // GTM-only setups
  if (w.fbq) {
    const meta =
      name === 'view_item'
        ? { content_name: params.item_name, content_ids: [params.item_id], content_category: params.item_category, content_type: 'product' }
        : name === 'search'
          ? { search_string: params.search_term }
          : params
    w.fbq('track', META_EVENTS[name], meta)
  }
  w.uetq?.push('event', name, params)
  w.clarity?.('event', name)
}

export const track = (name: TrackEventName, params: Params = {}) => {
  if (typeof window === 'undefined') return
  if (ready) send(name, params)
  else if (queue.length < 50) queue.push([name, params])
}

/** Called by <Analytics> once vendor snippets are on the page. */
export const markTrackingReady = () => {
  ready = true
  queue.splice(0).forEach(([n, p]) => send(n, p))
}

/** Consent store (localStorage), shared by the banner, the loader and the footer link. */
export type Consent = 'granted' | 'denied' | null
const KEY = 'd3ty-consent'
const listeners = new Set<() => void>()
export const consentStore = {
  subscribe: (cb: () => void) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
  get: (): Consent => {
    try {
      const v = localStorage.getItem(KEY)
      return v === 'granted' || v === 'denied' ? v : null
    } catch {
      return null
    }
  },
  getServer: (): Consent | 'unknown' => 'unknown',
  set: (v: Consent) => {
    const prev = consentStore.get()
    try {
      if (v) localStorage.setItem(KEY, v)
      else localStorage.removeItem(KEY)
    } catch {}
    listeners.forEach((l) => l())
    // Withdrawing consent after scripts ran: reload so no tracker stays in memory
    if (prev === 'granted' && v !== 'granted') window.location.reload()
  },
}
