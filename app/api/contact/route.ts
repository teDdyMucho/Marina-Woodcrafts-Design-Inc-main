import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { name, email, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // TODO: wire to webhook/email (e.g. Resend, SendGrid, or a Zapier webhook)
  console.log('[contact form]', { name, email, message })

  return NextResponse.json({ success: true })
}
