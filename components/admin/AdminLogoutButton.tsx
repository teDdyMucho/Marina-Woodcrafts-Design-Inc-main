'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminLogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function logout() {
    setBusy(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace('/admin/login')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" className="admin-logout" onClick={logout} disabled={busy}>
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
