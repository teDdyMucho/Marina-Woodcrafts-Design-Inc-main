'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function AdminLoginForm() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get('next') ?? '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? 'Login failed')
      router.replace(next)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-login-card" onSubmit={handleSubmit}>
      <div className="admin-login-head">
        <span className="admin-login-badge">Admin Access</span>
        <h1>Sign in</h1>
        <p>Authorized users only.</p>
      </div>

      <div className="admin-field">
        <label htmlFor="admin-user">Username</label>
        <input
          id="admin-user"
          type="text"
          required
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="admin-pass">Password</label>
        <input
          id="admin-pass"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
      </div>

      {err && <p className="admin-login-error" role="alert">{err}</p>}

      <button type="submit" className="btn btn-solid admin-login-btn" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
