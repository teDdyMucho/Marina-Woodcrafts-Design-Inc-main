import { NextResponse } from 'next/server'

// Where contact submissions are forwarded. Overridable via env on Vercel.
const WEBHOOK_URL =
  process.env.CONTACT_WEBHOOK_URL ??
  'https://primary-production-6722.up.railway.app/webhook/submit-contact'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { name, email, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Forward the submission to the webhook server-side (no CORS issues, and the
  // webhook URL stays out of the client bundle).
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        submittedAt: new Date().toISOString(),
        source: 'marinawoodcraft.com/contact',
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Could not send your message. Please try again or call us.' },
        { status: 502 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Network error sending your message. Please try again.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
