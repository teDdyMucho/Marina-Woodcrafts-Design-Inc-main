'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useScrolled } from '@/hooks/useScrolled'
import { MobileNav } from './MobileNav'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const scrolled = useScrolled(70)
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // The home page has a dark hero behind the nav, so the transparent nav looks
  // right there. Inner pages have light backgrounds at the top — keep the solid
  // background so the light-colored logo and links stay visible.
  const solid = scrolled || pathname !== '/'

  return (
    <>
      <nav id="nav" className={solid ? 'scrolled' : ''}>
        <Link href="/" className="nav-brand">
          <Image
            src="/Icon.png"
            alt="MW"
            width={5400}
            height={3360}
            className="nav-icon"
            style={{ height: '34px', width: 'auto' }}
            priority
          />
          <div className="nav-wordmark">
            Marina Woodcrafts
            <span>Design Inc.</span>
          </div>
        </Link>
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <button
          id="nav-toggle"
          className={menuOpen ? 'open' : ''}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <MobileNav open={menuOpen} links={LINKS} onClose={() => setMenuOpen(false)} />
    </>
  )
}
