'use client'

import Link from 'next/link'

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  open: boolean
  links: NavLink[]
  onClose: () => void
}

export function MobileNav({ open, links, onClose }: MobileNavProps) {
  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-label="Navigation menu"
      className={open ? 'open' : ''}
      style={{ display: open ? 'flex' : 'none' }}
    >
      {links.map((link) => (
        <Link key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}
