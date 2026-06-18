'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ConfirmModal } from './AdminModal'

export function AdminLogoutButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  async function logout() {
    setBusy(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace('/admin/login')
      router.refresh()
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <>
      <button type="button" className="admin-logout" onClick={() => setConfirming(true)} disabled={busy}>
        Sign out
      </button>
      <ConfirmModal
        open={confirming}
        title="Sign out?"
        message="You'll need to log in again to manage the site."
        confirmLabel="Yes, sign out"
        cancelLabel="No"
        busy={busy}
        onConfirm={logout}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
