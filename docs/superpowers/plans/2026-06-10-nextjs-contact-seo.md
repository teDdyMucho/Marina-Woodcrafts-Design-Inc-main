# Next.js Plan 4 — Contact + SEO Finishing

**Goal:** Ship the `/contact` page (with a fully functional form UI backed by a stub API route), generate `sitemap.xml` and `robots.txt` via Next.js built-in generators, publish `public/llms.txt` for AI ingestion, and remove `index.html` from the repo root.

---

## Task 1: `app/api/contact/route.ts` — contact form API stub

**Files:** `app/api/contact/route.ts`, `app/api/contact/route.test.ts`

The route validates required fields and returns JSON. It has a clearly marked `// TODO: wire to webhook/email` comment so the integration point is obvious.

- [ ] **Step 1: Write the failing test**

Create `app/api/contact/route.test.ts`:
```ts
import { POST } from './route'

async function makeRequest(body: Record<string, string>) {
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }))
}

describe('POST /api/contact', () => {
  it('returns 400 when name is missing', async () => {
    const res = await makeRequest({ email: 'a@b.com', message: 'hi' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const res = await makeRequest({ name: 'Alice', message: 'hi' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is missing', async () => {
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com' })
    expect(res.status).toBe(400)
  })

  it('returns 200 with success for valid input', async () => {
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify FAILS**
```bash
npm test -- app/api/contact/route.test.ts
```

- [ ] **Step 3: Write `app/api/contact/route.ts`**

```ts
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
```

- [ ] **Step 4: Run to verify PASSES**
```bash
npm test -- app/api/contact/route.test.ts
```
Expected: 4 passed.

- [ ] **Step 5: Commit**
```bash
git add app/api/contact/route.ts app/api/contact/route.test.ts
git commit -m "Add contact form API route stub with validation"
```

---

## Task 2: `ContactForm` component (TDD)

**Files:** `components/contact/ContactForm.tsx`, `components/contact/ContactForm.test.tsx`

Client component — name, email, message fields. Submits via `fetch('/api/contact')`. Shows success message on 200, error message on failure.

- [ ] **Step 1: Write the failing test**

Create `components/contact/ContactForm.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders name, email, and message fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('shows success message after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }))
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    })
  })

  it('shows error message on failed submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    }))
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run to verify FAILS**
```bash
npm test -- components/contact/ContactForm.test.tsx
```

- [ ] **Step 3: Write `components/contact/ContactForm.tsx`**

```tsx
'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      message: fd.get('message') as string,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success">
        <p>Thank you — we&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <p role="alert" className="contact-error">{errorMsg}</p>
      )}

      <div className="form-group">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="form-group">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="form-group">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required />
      </div>

      <button
        type="submit"
        className="btn btn-solid"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run to verify PASSES**
```bash
npm test -- components/contact/ContactForm.test.tsx
```
Expected: 4 passed.

- [ ] **Step 5: Commit**
```bash
git add components/contact/ContactForm.tsx components/contact/ContactForm.test.tsx
git commit -m "Add ContactForm component with success/error states"
```

---

## Task 3: `/contact` page

**Files:** `app/contact/page.tsx`

- [ ] **Step 1: Write `app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Request a free consultation for custom cabinetry in Woodland Hills, CA. Call (310) 990-0788 or send us a message.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Marina Woodcrafts Design Inc.',
    description: 'Free consultations for custom kitchen cabinetry, bathroom vanities, closets, and built-ins in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function ContactPage() {
  return (
    <main>
      <section id="contact" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">Get In Touch</Reveal>
          <Reveal as="h1" className="section-title">Contact Us</Reveal>
          <Reveal className="line-divider" />

          <div className="contact-layout">
            <div className="contact-info">
              <Reveal as="h2" className="contact-sub reveal-delay-1">Let&apos;s Build Something</Reveal>
              <Reveal as="p" className="contact-body reveal-delay-1">
                Ready to start your project? We offer free in-home consultations throughout
                the greater Los Angeles area. Reach out by phone, email, or the form below
                and we&apos;ll get back to you within one business day.
              </Reveal>
              <Reveal className="contact-details reveal-delay-2">
                <p>
                  <a href={business.phoneHref}>{business.phone}</a>
                </p>
                <p>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </p>
                <p>
                  {business.address.streetAddress},<br />
                  {business.address.addressLocality}, {business.address.addressRegion} {business.address.postalCode}
                </p>
              </Reveal>
            </div>

            <Reveal className="contact-form-wrap reveal-delay-2">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Build to verify**
```bash
npm run build
```

- [ ] **Step 3: Commit**
```bash
git add app/contact/page.tsx
git commit -m "Add /contact page with ContactForm and business info"
```

---

## Task 4: `app/sitemap.ts` + `app/robots.ts`

**Files:** `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { categories } from '@/lib/gallery'
import { services } from '@/lib/services'

const BASE = 'https://marinawoodcraft.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const galleryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/gallery/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...serviceRoutes, ...galleryRoutes]
}
```

- [ ] **Step 2: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: 'https://marinawoodcraft.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Build to verify both generate**
```bash
npm run build
```

- [ ] **Step 4: Commit**
```bash
git add app/sitemap.ts app/robots.ts
git commit -m "Add sitemap.xml and robots.txt with AI crawler allow rules"
```

---

## Task 5: `public/llms.txt`

**Files:** `public/llms.txt`

Plain-text summary for AI ingestion. Follows the llms.txt convention (h1 business name, then sections separated by `##`).

- [ ] **Step 1: Write `public/llms.txt`**

```
# Marina Woodcrafts Design Inc.

Marina Woodcrafts Design Inc. is a custom woodworking and cabinetry company based in Woodland Hills, California. We design and build handcrafted kitchen cabinetry, bathroom vanities, bedroom closets, bookcases, built-in shelving, and custom countertops. Every piece is built to the exact dimensions and specifications of your home.

## Services

- **Kitchen Cabinetry**: Full custom kitchen cabinet design and installation. We build Shaker, raised-panel, and fully custom cabinet profiles using hardwood, plywood, and MDF. Typical projects take 6–10 weeks.
- **Bathroom Vanities**: Custom floating and floor-mounted vanities, single and double sink configurations. Available in painted and stained finishes.
- **Bedroom Closets & Storage**: Custom closet systems built to the exact dimensions of your space. Walk-in, reach-in, and wall-to-wall configurations.
- **Bookcases & Built-Ins**: Floor-to-ceiling bookcases, entertainment centers, and office built-ins that become a permanent part of your home.
- **Countertops**: Custom countertop fabrication and installation in quartz, granite, butcher block, and laminate.

## About

Marina Woodcrafts Design Inc. has over 25 years of experience and has completed more than 100 projects across the greater Los Angeles area. Every piece is 100% handcrafted in our workshop.

## Contact

- Phone: +1 (310) 990-0788
- Email: Marinawoodcraftsdesign@hotmail.com
- Address: 20857 Martha St, Woodland Hills, CA 91367
- Service area: Greater Los Angeles, including the San Fernando Valley, Calabasas, Westlake Village, and Thousand Oaks

## Website

The full website is available at https://marinawoodcraft.com with individual pages for each service and a photo gallery organized by category.
```

- [ ] **Step 2: Commit**
```bash
git add public/llms.txt
git commit -m "Add llms.txt for AI crawler ingestion"
```

---

## Task 6: Remove `index.html` + final verification

- [ ] **Step 1: Remove `index.html`**
```bash
git rm index.html
git commit -m "Remove legacy Vite index.html — migration to Next.js complete"
```

- [ ] **Step 2: Run full test suite**
```bash
npm test
```
Expected: all tests pass (57+).

- [ ] **Step 3: Clean production build**
```bash
rm -rf .next && npm run build
```
Expected: succeeds. All routes present including `/contact`, `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 4: Verify git status is clean**
```bash
git status
git log --oneline -15
```

---

## Done

After Task 6, the full migration is complete:
- 13 content pages (/, /about, /services, /services/[5 slugs], /gallery, /gallery/[4 slugs], /contact)
- `/sitemap.xml` with 14 URLs
- `/robots.txt` allowing all AI crawlers
- `/llms.txt` for AI ingestion
- All interactive behaviors preserved (intro animation, parallax, custom scrollbar, scroll-reveal)
- JSON-LD on every page (LocalBusiness in layout, Service + FAQPage on service pages, ImageGallery on gallery pages)
- Zero legacy Vite code
