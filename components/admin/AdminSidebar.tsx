'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const ICONS = {
  dashboard: (
    <Ico>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </Ico>
  ),
  inbox: (
    <Ico>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </Ico>
  ),
  blog: (
    <Ico>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </Ico>
  ),
  gallery: (
    <Ico>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.5-3.5L9 20" />
    </Ico>
  ),
  services: (
    <Ico>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z" />
    </Ico>
  ),
  site: (
    <Ico>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Ico>
  ),
  write: (
    <Ico>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Ico>
  ),
  generate: (
    <Ico>
      <path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
      <path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7z" />
    </Ico>
  ),
} as const

const MANAGE: { href: string; label: string; icon: ReactNode; exact?: boolean }[] = [
  { href: '/admin', label: 'Dashboard', icon: ICONS.dashboard, exact: true },
  { href: '/admin/submissions', label: 'Submissions', icon: ICONS.inbox },
]

const ARTICLE_TABS = [
  { key: 'all', label: 'Overview', href: '/admin/articles' },
  { key: 'draft', label: 'Drafts', href: '/admin/articles?status=draft' },
  { key: 'review', label: 'In Review', href: '/admin/articles?status=review' },
  { key: 'scheduled', label: 'Scheduled', href: '/admin/articles?status=scheduled' },
  { key: 'published', label: 'Published', href: '/admin/articles?status=published' },
  { key: 'retired', label: 'Archive', href: '/admin/articles?status=retired' },
]

export function AdminSidebar() {
  const pathname = usePathname() ?? ''
  const inArticles = pathname.startsWith('/admin/articles')

  // Published article count, fetched live (articles live in GitHub).
  const [published, setPublished] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/admin/articles/count')
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d) => alive && setPublished(typeof d.count === 'number' ? d.count : 0))
      .catch(() => alive && setPublished(0))
    return () => {
      alive = false
    }
  }, [])

  // Existing posts on the blog all count as published; the rest live in the workflow.
  const COUNTS: Record<string, number> = {
    all: published ?? 0,
    published: published ?? 0,
    draft: 0,
    review: 0,
    scheduled: 0,
    retired: 0,
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-head">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-mark">MW</span>
          <span className="admin-brand-text">
            Marina Woodcrafts
            <span>Admin Console</span>
          </span>
        </Link>
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-label">Manage</p>
        {MANAGE.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-row${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="admin-nav-ico">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <p className="admin-nav-label" style={{ marginTop: '18px' }}>Content</p>
        <Link
          href="/admin/articles"
          className={`admin-nav-row${inArticles ? ' active' : ''}`}
          aria-current={pathname === '/admin/articles' ? 'page' : undefined}
        >
          <span className="admin-nav-ico">{ICONS.blog}</span>
          <span style={{ flex: 1 }}>Articles</span>
          {published !== null && <span className="admin-nav-badge">{published}</span>}
          <span className={`admin-nav-chevron${inArticles ? ' open' : ''}`}>›</span>
        </Link>

        {inArticles && (
          <div className="admin-subnav">
            {ARTICLE_TABS.map((t) => (
              <Link key={t.key} href={t.href} className="admin-subnav-row">
                <span>{t.label}</span>
                {COUNTS[t.key] > 0 && <span className="admin-nav-badge">{COUNTS[t.key]}</span>}
              </Link>
            ))}
            <Link href="/admin/articles/new" className="admin-subnav-row">
              <span className="admin-nav-ico">{ICONS.write}</span>
              Upload article
            </Link>
          </div>
        )}

        <p className="admin-nav-label" style={{ marginTop: '18px' }}>Site</p>
        <Link href="/" className="admin-nav-row" target="_blank">
          <span className="admin-nav-ico">{ICONS.site}</span>
          View live site
        </Link>
        <Link href="/gallery" className="admin-nav-row" target="_blank">
          <span className="admin-nav-ico">{ICONS.gallery}</span>
          Gallery
        </Link>
        <Link href="/services" className="admin-nav-row" target="_blank">
          <span className="admin-nav-ico">{ICONS.services}</span>
          Services
        </Link>
      </nav>

      <div className="admin-sidebar-foot">
        <span className="admin-status-dot" />
        Production · Live
      </div>
    </aside>
  )
}
