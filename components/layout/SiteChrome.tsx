'use client'

import { usePathname } from 'next/navigation'
import { IntroOverlay } from './IntroOverlay'
import { ParallaxLayers } from './ParallaxLayers'
import { CustomScrollbar } from './CustomScrollbar'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { BackToTop } from './BackToTop'

/**
 * The public-site chrome (intro, nav, footer, parallax, scrollbar, back-to-top).
 * Hidden on /admin so the admin console renders standalone with its own shell.
 */
export function SiteChrome() {
  const pathname = usePathname() ?? ''
  if (pathname.startsWith('/admin')) return null

  // Skip the landing-style intro/loading overlay on the blog so articles open
  // straight to the content (e.g. admin "View" or "Read article" links).
  const showIntro = !pathname.startsWith('/blog')

  return (
    <>
      {showIntro && <IntroOverlay />}
      <CustomScrollbar />
      <ParallaxLayers />
      <Nav />
      <Footer />
      <BackToTop />
    </>
  )
}
