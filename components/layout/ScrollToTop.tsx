'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Forces every page navigation to start at the top. The site sets
 * `scroll-behavior: smooth` globally, which can otherwise leave a new page
 * scrolled to wherever the previous one was. `behavior: 'instant'` overrides
 * that so the jump to top is immediate on each route change.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
