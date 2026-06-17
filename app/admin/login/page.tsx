import { Suspense } from 'react'
import Link from 'next/link'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <header className="admin-login-topbar">
        <Link href="/" className="admin-login-home">← Back to site</Link>
      </header>
      <section className="admin-login-body">
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </main>
  )
}
