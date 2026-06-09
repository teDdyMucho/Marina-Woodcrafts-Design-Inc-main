'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useScrolled } from '@/hooks/useScrolled'
import { MobileNav } from './MobileNav'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const scrolled = useScrolled(70)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-brand">
          <Image src="/Icon.png" alt="MW" width={34} height={34} className="nav-icon" />
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
