# Next.js Plan 2 — About + Services Pages

**Goal:** Build `/about`, `/services`, and `/services/[slug]` (5 detail pages) — reusing all shared chrome from Plan 1, adding `lib/services.ts` as the typed data source, and baking in `Service` + `FAQPage` JSON-LD schema on each detail page.

**Architecture:** A single `lib/services.ts` data file drives routing, metadata, and schema. The `/services/[slug]` route uses `generateStaticParams` so all 5 pages are pre-rendered at build time. Each detail page gets expanded copy (materials, process, timeline), a FAQ block, and a `Service` schema script — directly addressing the GEO audit's "thin content" finding.

---

## File Structure

```
lib/
  services.ts             — 5 service entries: { slug, num, title, summary, body, heroImage, faq[] }
app/
  about/
    page.tsx              — /about — full company story + stats + video
  services/
    page.tsx              — /services — overview grid of all 5 with links
    [slug]/
      page.tsx            — /services/[slug] — detail page: expanded copy + FAQ + Service schema
components/
  services/
    ServiceCard.tsx       — card used on both /services overview and teasers
    ServiceCard.test.tsx
```

---

## Task 1: `lib/services.ts` — typed service data

**Files:**
- Create: `lib/services.ts`, `lib/services.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/services.test.ts`:
```ts
import { services, getService } from './services'

describe('services', () => {
  it('has exactly 5 service entries', () => {
    expect(services).toHaveLength(5)
  })

  it('each service has required fields', () => {
    services.forEach((svc) => {
      expect(svc.slug).toBeTruthy()
      expect(svc.num).toMatch(/^\d{2}$/)
      expect(svc.title).toBeTruthy()
      expect(svc.summary).toBeTruthy()
      expect(svc.body).toBeTruthy()
      expect(Array.isArray(svc.faq)).toBe(true)
      expect(svc.faq.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('slugs match the expected route values', () => {
    const slugs = services.map((s) => s.slug)
    expect(slugs).toEqual([
      'kitchen-cabinetry',
      'bathroom-vanities',
      'closets-storage',
      'bookcases-built-ins',
      'countertops',
    ])
  })

  it('getService returns the correct entry by slug', () => {
    const svc = getService('kitchen-cabinetry')
    expect(svc?.title).toBe('Custom Kitchen Cabinetry')
  })

  it('getService returns undefined for unknown slug', () => {
    expect(getService('unknown')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- lib/services.test.ts
```
Expected: FAIL — `Cannot find module './services'`.

- [ ] **Step 3: Write `lib/services.ts`**

```ts
export interface ServiceFaq {
  question: string
  answer: string
}

export interface Service {
  slug: string
  num: string
  title: string
  summary: string
  body: string
  heroImage: string
  faq: ServiceFaq[]
}

export const services: Service[] = [
  {
    slug: 'kitchen-cabinetry',
    num: '01',
    title: 'Custom Kitchen Cabinetry',
    summary: 'Designed and built to fit your kitchen layout with precision, combining functionality and modern aesthetics.',
    body: `Every kitchen we build starts with your space. We measure, design, and hand-build each cabinet run to maximize storage, flow, and visual harmony — whether you prefer clean Shaker lines, raised-panel traditional, or a completely custom profile. Materials range from solid hardwoods (maple, alder, cherry) to premium MDF with lacquer finishes. Hardware, drawer-box joinery, and interior fittings are selected for longevity, not just looks. Most kitchen installations are completed within 3–5 weeks from final design sign-off.`,
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    faq: [
      { question: 'How long does a custom kitchen take?', answer: 'From design approval to installation, most custom kitchens take 3–5 weeks. Complex projects with specialty finishes or appliance cutouts may take 6–8 weeks.' },
      { question: 'What wood species do you work with?', answer: 'We work with maple, alder, cherry, oak, and walnut. We can also source specialty woods on request. MDF with lacquer finishes is available for a painted look.' },
      { question: 'Do you offer free consultations?', answer: 'Yes. We offer a free in-home consultation to measure your space, discuss design options, and provide an estimate. Contact us to schedule.' },
    ],
  },
  {
    slug: 'bathroom-vanities',
    num: '02',
    title: 'Bathroom Vanities',
    summary: 'Custom-built vanities tailored to maximize space while maintaining a clean and elegant look.',
    body: `A custom vanity transforms a bathroom from functional to finished. We build floating and floor-mounted vanities in any configuration — single or double sink, integrated toe-kicks, built-in power strips, and custom drawer dividers. Moisture-resistant finishes and solid-wood or plywood boxes (never particle board) ensure your vanity stays beautiful in the humidity of daily use. Most single-vanity projects are completed within 2–3 weeks.`,
    heroImage: '/Gallery/Bathroom%20Vanities/1.png',
    faq: [
      { question: 'Are your vanities moisture-resistant?', answer: 'Yes. We use plywood or solid-wood box construction with moisture-resistant finishes — never particle board, which can swell and degrade in bathroom conditions.' },
      { question: 'Can you match an existing vanity style?', answer: 'We can match door profiles, finishes, and hardware to existing cabinetry in your home for a cohesive look.' },
      { question: 'Do you install the plumbing?', answer: 'We handle the cabinetry installation and coordinate the rough-in cutouts. We recommend coordinating with a licensed plumber for the faucet and drain connections.' },
    ],
  },
  {
    slug: 'closets-storage',
    num: '03',
    title: 'Closets & Storage Solutions',
    summary: 'Efficient and stylish storage systems designed to match your lifestyle and space requirements.',
    body: `We design and build closet systems that work the way you do — whether that means a walk-in with island, a reach-in optimized for folded clothes, or a garage wall with deep utility shelving. Every unit is built to the exact dimensions of your space, with adjustable shelves, pull-out drawers, and hanging sections where you actually need them. Finishes range from painted MDF to melamine and natural wood veneers. Most closet projects are installed within 1–2 weeks.`,
    heroImage: '/Gallery/Bedroom%20Closets%20&%20Storage/1.png',
    faq: [
      { question: 'Can you build a closet in an awkward space?', answer: 'Yes — this is where custom work shines. We build to the exact dimensions of your space, including angled ceilings, knee walls, and non-standard alcoves.' },
      { question: 'Are the shelves adjustable?', answer: 'By default, yes. We use a pin-shelf system that allows shelves to be repositioned as your storage needs change.' },
      { question: 'Do you do garage storage as well?', answer: 'Yes. We build wall-mounted and freestanding garage storage with a mix of cabinets, open shelving, and heavy-duty hanging systems.' },
    ],
  },
  {
    slug: 'bookcases-built-ins',
    num: '04',
    title: 'Bookcases & Built-ins',
    summary: 'Custom shelving and built-in units for both decorative and functional purposes.',
    body: `Built-in bookcases and entertainment centers add architectural character to a room that freestanding furniture simply cannot. We design around your wall dimensions, doorways, and ceiling height — creating seamless installations that look like they were always there. Options include open shelving, closed base cabinets, glass-front display sections, and integrated lighting channels. We work in painted, stained, and cerused finishes to match any interior style.`,
    heroImage: '/Gallery/Living-Area-Cabinet-Shelves/1.png',
    faq: [
      { question: 'Can built-ins be removed later?', answer: 'Built-ins are designed to be permanent, but they can be removed. We anchor to studs with minimal wall patching required. Many clients choose to keep them when selling — they add real estate value.' },
      { question: 'Do you add lighting?', answer: 'Yes. We can route channels for LED strip lighting or puck lights, and coordinate with your electrician for hardwired connections.' },
      { question: 'Can you match my existing trim and millwork?', answer: 'Absolutely. We can profile custom base moldings, crown, and face-frame details to match existing millwork in your home.' },
    ],
  },
  {
    slug: 'countertops',
    num: '05',
    title: 'Countertops',
    summary: 'Installation of high-quality materials including Granite, Caesarstone, and Butcher Block.',
    body: `The right countertop ties the room together. We supply and install granite, quartz (Caesarstone, Silestone, MSI), and butcher block countertops. Each slab is templated on-site for precision cuts around sinks, cooktops, and outlets. Edge profiles — eased, beveled, ogee, waterfall — are selected to complement your cabinetry. Butcher block is finished with food-safe oil and wax. Lead times vary by material; most installations are completed within 1–2 weeks of template.`,
    heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    faq: [
      { question: 'What countertop materials do you offer?', answer: 'We offer granite, quartz (Caesarstone, Silestone, MSI Q Premium), and butcher block. We can source other materials — marble, quartzite, dekton — by request.' },
      { question: 'How do I choose the right material?', answer: 'Granite and quartz are both highly durable. Granite requires periodic sealing; quartz is maintenance-free. Butcher block is warm and renewable but requires more care near sinks. We help you weigh the tradeoffs during your consultation.' },
      { question: 'Do you remove the old countertop?', answer: 'Yes. Removal and disposal of the existing countertop is included in our installation service.' },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- lib/services.test.ts
```
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/services.ts lib/services.test.ts
git commit -m "Add typed services data module with tests"
```

---

## Task 2: `ServiceCard` component

**Files:**
- Create: `components/services/ServiceCard.tsx`, `components/services/ServiceCard.test.tsx`

Used on the `/services` overview page. Shows num, title, summary, and a link to the detail page.

- [ ] **Step 1: Write the failing test**

Create `components/services/ServiceCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ServiceCard } from './ServiceCard'

const MOCK_SERVICE = {
  slug: 'kitchen-cabinetry',
  num: '01',
  title: 'Custom Kitchen Cabinetry',
  summary: 'Designed and built to fit your kitchen layout.',
  body: '',
  heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
  faq: [],
}

describe('ServiceCard', () => {
  it('renders the service number, title, and summary', () => {
    render(<ServiceCard service={MOCK_SERVICE} />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Custom Kitchen Cabinetry')).toBeInTheDocument()
    expect(screen.getByText(/Designed and built/)).toBeInTheDocument()
  })

  it('links to the service detail page', () => {
    render(<ServiceCard service={MOCK_SERVICE} />)
    expect(screen.getByRole('link', { name: /learn more|view|kitchen cabinetry/i })).toHaveAttribute(
      'href',
      '/services/kitchen-cabinetry'
    )
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/services/ServiceCard.test.tsx
```

- [ ] **Step 3: Write `components/services/ServiceCard.tsx`**

```tsx
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { Reveal } from '@/components/ui/Reveal'

interface ServiceCardProps {
  service: Service
  delayClass?: string
}

export function ServiceCard({ service, delayClass = '' }: ServiceCardProps) {
  return (
    <Reveal className={`service-card${delayClass ? ` ${delayClass}` : ''}`}>
      <div className="svc-num">{service.num}</div>
      <h3 className="svc-title">{service.title}</h3>
      <p className="svc-desc">{service.summary}</p>
      <Link href={`/services/${service.slug}`} className="svc-link">
        Learn more
      </Link>
    </Reveal>
  )
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- components/services/ServiceCard.test.tsx
```
Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add components/services/ServiceCard.tsx components/services/ServiceCard.test.tsx
git commit -m "Add ServiceCard component"
```

---

## Task 3: `/about` page

**Files:**
- Create: `app/about/page.tsx`

Ports the About section from `index.html:1482–1528` into a full dedicated page, with expanded narrative, stats, and a video.

- [ ] **Step 1: Write `app/about/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'About Us — Our Story & Craftsmanship',
  description:
    'Marina Woodcrafts Design Inc. has been delivering precision custom cabinetry and woodwork in Woodland Hills, CA for 25+ years. Learn about our story, values, and team.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Marina Woodcrafts Design Inc.',
    description: '25+ years of handcrafted cabinetry in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function AboutPage() {
  return (
    <main>
      <section id="about" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">Our Story</Reveal>
          <Reveal as="h1" className="section-title">
            Crafted with tradition,<br />designed for today.
          </Reveal>
          <Reveal className="line-divider" />

          <div className="about-grid">
            <div className="about-body">
              <Reveal as="p" className="reveal-delay-1">
                Marina Woodcrafts Design Inc. was built on a passion for craftsmanship and
                high-quality woodworking. Founded in the Woodland Hills area of Los Angeles,
                the company started with a focus on delivering custom cabinetry solutions
                tailored to each client&rsquo;s unique space and needs.
              </Reveal>
              <Reveal as="p" className="reveal-delay-2">
                Over more than 25 years, we have grown into a trusted provider of custom kitchens,
                bathroom vanities, closets, bookcases, and countertops — known for precision,
                durability, and refined design. Every project is approached with attention to
                detail, ensuring both functionality and aesthetic value.
              </Reveal>
              <Reveal as="p" className="reveal-delay-3">
                We believe the best work comes from listening carefully, measuring twice, and
                never cutting corners. Our pieces are built to last a lifetime — because your
                home deserves nothing less.
              </Reveal>
              <Reveal className="reveal-delay-3" style={{ marginTop: '28px' }}>
                <Link href="/services" className="btn btn-solid">See Our Services</Link>
              </Reveal>
            </div>
            <Reveal className="about-img reveal-delay-1">
              <video autoPlay muted loop playsInline>
                <source src="/Our%20Story/Our%20Story.mp4" type="video/mp4" />
              </video>
            </Reveal>
          </div>

          <div className="about-stats">
            {business.stats.map((stat, i) => (
              <Reveal key={stat.label} className={i === 0 ? '' : `reveal-delay-${i}`}>
                <div className="stat-num">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npm run build
```
Expected: succeeds; `/about` listed as a static route.

- [ ] **Step 3: Verify the dev server serves `/about`**

```bash
npm run dev &
DEV_PID=$!
sleep 8
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/about")
echo "About: $STATUS"
kill $DEV_PID 2>/dev/null || true
```
Expected: 200.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "Add /about page with expanded company narrative and stats"
```

---

## Task 4: `/services` overview page

**Files:**
- Create: `app/services/page.tsx`

Full grid of all 5 services using `ServiceCard`, linking to detail pages.

- [ ] **Step 1: Write `app/services/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { services } from '@/lib/services'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Our Services — Custom Cabinetry & Woodwork',
  description:
    'Custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops in Woodland Hills, CA. 25+ years of precision craftsmanship.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — Marina Woodcrafts Design Inc.',
    description: 'Custom woodcraft services in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function ServicesPage() {
  return (
    <main>
      <section id="services" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">What We Do</Reveal>
          <Reveal as="h1" className="section-title">
            Craftsmanship in<br />every detail.
          </Reveal>
          <Reveal className="line-divider" />

          <div className="services-grid" style={{ marginTop: '48px' }}>
            {services.map((svc, i) => (
              <ServiceCard
                key={svc.slug}
                service={svc}
                delayClass={i === 0 ? '' : `reveal-delay-${Math.min(i, 3)}`}
              />
            ))}
          </div>

          <Reveal as="p" className="services-disclaimer reveal-delay-1" style={{ marginTop: '40px' }}>
            Pricing available upon request depending on design, materials, and project scope.
          </Reveal>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```
Expected: `/services` appears as a static route.

- [ ] **Step 3: Commit**

```bash
git add app/services/page.tsx
git commit -m "Add /services overview page with all 5 service cards"
```

---

## Task 5: `/services/[slug]` detail pages

**Files:**
- Create: `app/services/[slug]/page.tsx`

5 statically generated detail pages. Each gets expanded body copy, a FAQ block, `Service` JSON-LD schema, and `FAQPage` JSON-LD schema.

- [ ] **Step 1: Write `app/services/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { services, getService } from '@/lib/services'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const svc = getService(slug)
  if (!svc) return {}
  return {
    title: `${svc.title} in Woodland Hills, CA`,
    description: `${svc.summary} Serving Woodland Hills and the greater Los Angeles area. 25+ years of experience.`,
    alternates: { canonical: `/services/${svc.slug}` },
    openGraph: {
      title: `${svc.title} | Marina Woodcrafts Design Inc.`,
      description: svc.summary,
      images: [{ url: svc.heroImage }],
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const svc = getService(slug)
  if (!svc) notFound()

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.title,
    description: svc.summary,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
      },
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 34.1684, longitude: -118.5989 },
      geoRadius: '50000',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: svc.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="section" style={{ paddingTop: '140px', paddingBottom: '0' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">{`0${services.findIndex(s => s.slug === svc.slug) + 1} / 0${services.length}`}</Reveal>
          <Reveal as="h1" className="section-title">{svc.title}</Reveal>
          <Reveal className="line-divider" />
        </div>
      </section>

      {/* Hero image */}
      <section style={{ position: 'relative', width: '100%', height: '420px', marginBottom: '0' }}>
        <Image
          src={svc.heroImage}
          alt={svc.title}
          fill
          className="g-thumb"
          sizes="100vw"
          priority
        />
      </section>

      {/* Body copy */}
      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: '680px' }}>
            <Reveal as="p" className="reveal-delay-1" style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              {svc.body}
            </Reveal>
            <Reveal className="reveal-delay-2" style={{ marginTop: '32px' }}>
              <Link href="/contact" className="btn btn-solid">Start a Project</Link>
              <Link href="/services" className="btn btn-outline-dark" style={{ marginLeft: '12px' }}>All Services</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {svc.faq.length > 0 && (
        <section className="section" style={{ paddingTop: '0' }}>
          <div className="wrap">
            <Reveal as="h2" className="section-title" style={{ fontSize: '1.6rem' }}>
              Frequently Asked Questions
            </Reveal>
            <Reveal className="line-divider" />
            <div style={{ marginTop: '32px', maxWidth: '680px' }}>
              {svc.faq.map((item, i) => (
                <Reveal key={i} className={i === 0 ? '' : 'reveal-delay-1'} style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.1rem', marginBottom: '8px' }}>
                    {item.question}
                  </h3>
                  <p style={{ lineHeight: 1.7, opacity: 0.85 }}>{item.answer}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Build and verify all 5 routes are generated**

```bash
npm run build
```
Expected: `/services/[slug]` with 5 pages listed as static routes (`○ /services/kitchen-cabinetry` etc.)

- [ ] **Step 3: Verify a detail page serves correctly**

```bash
npm run dev &
DEV_PID=$!
sleep 8
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/services/kitchen-cabinetry")
JSONLD=$(curl -s "http://localhost:3000/services/kitchen-cabinetry" | grep -o 'application/ld+json' | wc -l)
echo "Service detail: $STATUS, JSON-LD blocks: $JSONLD"
kill $DEV_PID 2>/dev/null || true
```
Expected: 200, at least 2 JSON-LD blocks (Service + FAQPage).

- [ ] **Step 4: Commit**

```bash
git add app/services/ 
git commit -m "Add /services/[slug] detail pages with Service + FAQPage JSON-LD schema"
```

---

## Task 6: Run full test suite + final build verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: all tests pass (no regressions).

- [ ] **Step 2: Clean production build**

```bash
rm -rf .next && npm run build
```
Expected: succeeds. Static routes listed: `/`, `/about`, `/services`, `/services/kitchen-cabinetry`, `/services/bathroom-vanities`, `/services/closets-storage`, `/services/bookcases-built-ins`, `/services/countertops`.

- [ ] **Step 3: Verify clean git tree**

```bash
git status
```
Expected: nothing to commit.

---

## Notes for Subsequent Plans

- Plan 3 (`Gallery`) builds `/gallery` + `/gallery/[category]` (4 pages) — `GalleryGrid`, `GalleryModal`, `Lightbox` components ported from `index.html:2148–2296`, plus `lib/gallery.ts` data file and `ImageGallery` schema.
- Plan 4 (`Contact + SEO finishing`) builds `/contact` with a real form + `app/api/contact/route.ts` stub, plus `app/sitemap.ts`, `app/robots.ts`, and `public/llms.txt`. Removes `index.html` from the repo root.
