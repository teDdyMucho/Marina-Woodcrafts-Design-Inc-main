'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'

/** The login page renders bare; every other /admin route gets the shell. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  if (pathname === '/admin/login') return <>{children}</>
  return <AdminShell>{children}</AdminShell>
}
