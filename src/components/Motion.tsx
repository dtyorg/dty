'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scroll-driven motion powered by GSAP — built to cost nothing on load:
 *  • GSAP + ScrollTrigger are dynamically imported when the browser is idle (separate chunk,
 *    never in the critical path) and are never downloaded with prefers-reduced-motion.
 *  • Only elements *below the fold* are hidden then revealed, so nothing visible on first paint
 *    flickers and LCP is untouched. Without JS everything is simply visible.
 *  • Only transform/opacity are animated (compositor-only, zero layout shift).
 *
 * Markup API (server components just add attributes):
 *  data-animate                 → fade + rise in when scrolled into view
 *  data-animate="scale"         → fade + slight scale
 *  data-animate-children[=scale]→ stagger the element's direct children
 *  data-parallax                → subtle scroll parallax (≥ 840px only)
 */
export function Motion() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const vh = window.innerHeight
        const belowFold = (el: Element) => el.getBoundingClientRect().top > vh * 0.92

        const reveal = (targets: Element[], variant: string | null, stagger: number) => {
          const els = targets.filter(belowFold)
          if (!els.length) return
          // opacity (not visibility): hidden-until-revealed content stays focusable for keyboard users;
          // focusing it scrolls it into view, which triggers the reveal.
          const from = variant === 'scale' ? { opacity: 0, scale: 0.94, y: 16 } : { opacity: 0, y: 28 }
          gsap.set(els, from)
          ScrollTrigger.batch(els, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'expo.out', // ≈ M3 emphasized-decelerate
                stagger,
                overwrite: true,
                clearProps: 'transform,opacity',
              }),
          })
        }

        gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((el) => reveal([el], el.dataset.animate || null, 0))
        gsap.utils
          .toArray<HTMLElement>('[data-animate-children]')
          .forEach((group) => reveal(Array.from(group.children), group.dataset.animateChildren || null, 0.08))

        gsap.matchMedia().add('(min-width: 840px)', () => {
          gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
            gsap.to(el, {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true },
            })
          })
        })
      })

      cleanup = () => ctx.revert()
    }

    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cic = window.cancelIdleCallback ?? window.clearTimeout
    const handle = ric(() => void start(), { timeout: 2000 })

    return () => {
      cancelled = true
      cic(handle)
      cleanup?.()
    }
  }, [pathname])

  return null
}
