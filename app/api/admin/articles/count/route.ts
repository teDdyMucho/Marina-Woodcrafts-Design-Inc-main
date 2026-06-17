import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/blog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /api/admin/articles/count — number of published articles (from GitHub). */
export async function GET() {
  try {
    const count = (await getPosts()).length
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
