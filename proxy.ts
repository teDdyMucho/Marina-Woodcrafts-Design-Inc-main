import { NextResponse, type NextRequest } from 'next/server'

/**
 * Admin gate. Every /admin/* and /api/admin/* request (except the login page
 * and login API) must carry the httpOnly `admin_session` cookie matching
 * ADMIN_SESSION_TOKEN. Unauthenticated visitors are redirected to the login.
 */
const ADMIN_COOKIE = 'admin_session'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/admin/login' || path === '/api/admin/login') {
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SESSION_TOKEN
  if (!secret) {
    return new NextResponse('Admin auth not configured.', { status: 503 })
  }

  const got = request.cookies.get(ADMIN_COOKIE)?.value
  if (got && got === secret) return NextResponse.next()

  if (path.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const loginUrl = new URL('/admin/login', request.url)
  if (path !== '/admin') loginUrl.searchParams.set('next', path)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
