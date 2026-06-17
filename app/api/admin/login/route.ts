import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/login
 * Verifies ADMIN_BASIC_USER + ADMIN_BASIC_PASS and, on success, sets the
 * httpOnly `admin_session` cookie to ADMIN_SESSION_TOKEN. Constant-time
 * comparison so the password can't be probed byte-by-byte via timing.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

export async function POST(request: Request) {
  const expectedUser = process.env.ADMIN_BASIC_USER
  const expectedPass = process.env.ADMIN_BASIC_PASS
  const sessionToken = process.env.ADMIN_SESSION_TOKEN

  if (!expectedUser || !expectedPass || !sessionToken) {
    return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const { username, password } = body as Record<string, string>

  if (!username?.trim() || !password?.trim()) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const ok =
    constantTimeEqual(username, expectedUser) && constantTimeEqual(password, expectedPass)
  if (!ok) {
    return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'admin_session',
    value: sessionToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
