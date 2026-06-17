import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** POST /api/admin/logout — clears the admin_session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
