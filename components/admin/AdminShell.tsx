'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminLogoutButton } from './AdminLogoutButton'

/** Persistent admin chrome (sidebar + top bar) shared by every /admin page
 *  except the login screen. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <Link href="/" className="admin-topbar-link" target="_blank">
            View site →
          </Link>
          <AdminLogoutButton />
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
