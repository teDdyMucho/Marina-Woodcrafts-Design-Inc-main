# Next.js Plan 3 — Gallery Pages

**Goal:** Build `/gallery` (overview) and `/gallery/[category]` (4 photo grid pages) with a full-screen Lightbox component, `lib/gallery.ts` data source, and `ImageGallery` JSON-LD schema on each category page.

**Architecture:** `lib/gallery.ts` enumerates all photos per category. `GalleryGrid` renders the photo grid with click-to-lightbox. `Lightbox` is a client component with prev/next navigation, keyboard support (Arrow keys, Escape), touch swipe, and a fade transition — ported from `index.html:2249–2296`. `/gallery/[category]` uses `generateStaticParams` from `lib/gallery.ts`.

---

## Task 1: `lib/gallery.ts` — typed gallery data

**Files:** `lib/gallery.ts`, `lib/gallery.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/gallery.test.ts`:
```ts
import { categories, getCategory } from './gallery'

describe('gallery', () => {
  it('has exactly 4 category entries', () => {
    expect(categories).toHaveLength(4)
  })

  it('category slugs match expected route values', () => {
    expect(categories.map((c) => c.slug)).toEqual([
      'bathroom', 'kitchen', 'bedroom', 'living',
    ])
  })

  it('each category has at least 5 photos', () => {
    categories.forEach((cat) => {
      expect(cat.photos.length).toBeGreaterThanOrEqual(5)
    })
  })

  it('each photo has src and alt', () => {
    categories.forEach((cat) => {
      cat.photos.forEach((p) => {
        expect(p.src).toMatch(/^\/Gallery\//)
        expect(p.alt).toBeTruthy()
      })
    })
  })

  it('getCategory returns the correct entry by slug', () => {
    expect(getCategory('bathroom')?.name).toBe('Bathroom Vanities')
    expect(getCategory('kitchen')?.name).toBe('Kitchen Cabinetry')
  })

  it('getCategory returns undefined for unknown slug', () => {
    expect(getCategory('unknown')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run to verify FAILS**
```bash
npm test -- lib/gallery.test.ts
```

- [ ] **Step 3: Write `lib/gallery.ts`**

```ts
export interface GalleryPhoto {
  src: string
  alt: string
}

export interface GalleryCategory {
  slug: string
  name: string
  description: string
  coverImage: string
  photos: GalleryPhoto[]
}

function photos(dir: string, name: string, files: string[]): GalleryPhoto[] {
  return files.map((f) => ({
    src: `/Gallery/${dir}/${f}`,
    alt: `${name} — photo`,
  }))
}

export const categories: GalleryCategory[] = [
  {
    slug: 'bathroom',
    name: 'Bathroom Vanities',
    description: 'Custom bathroom vanities built for your space — floating, floor-mounted, single and double sink configurations.',
    coverImage: '/Gallery/Bathroom%20Vanities/1.png',
    photos: photos('Bathroom%20Vanities', 'Bathroom Vanities', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png',
      '9.png','10.png','11.png','12.png','13.jpg','14.png','15.png','16.png',
    ]),
  },
  {
    slug: 'kitchen',
    name: 'Kitchen Cabinetry',
    description: 'Handcrafted kitchen cabinetry built to your layout — Shaker, raised-panel, and fully custom profiles.',
    coverImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
    photos: photos('Custom%20Kitchen%20Cabinetry', 'Kitchen Cabinetry', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png',
      '11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png',
    ]),
  },
  {
    slug: 'bedroom',
    name: 'Bedroom Closets & Storage',
    description: 'Custom closet systems and bedroom storage built to the exact dimensions of your space.',
    coverImage: '/Gallery/Bedroom%20Closets%20%26%20Storage/1.png',
    photos: photos('Bedroom%20Closets%20%26%20Storage', 'Bedroom Closets & Storage', [
      '1.png','2.png','3.png','4.png','5.png','6.png','7.png',
      '8.png','9.png','10.png','11.png','12.png','13.png',
    ]),
  },
  {
    slug: 'living',
    name: 'Living Area Cabinet & Shelves',
    description: 'Built-in shelving, entertainment centers, and living area cabinetry that becomes part of your home.',
    coverImage: '/Gallery/Living-Area-Cabinet-Shelves/1.png',
    photos: photos('Living-Area-Cabinet-Shelves', 'Living Area Cabinet & Shelves', [
      '1.png','2.png','3.png','4.png','5.png','6.png',
    ]),
  },
]

export function getCategory(slug: string): GalleryCategory | undefined {
  return categories.find((c) => c.slug === slug)
}
```

- [ ] **Step 4: Run to verify PASSES**
```bash
npm test -- lib/gallery.test.ts
```
Expected: 6 passed.

- [ ] **Step 5: Commit**
```bash
git add lib/gallery.ts lib/gallery.test.ts
git commit -m "Add typed gallery data module with tests"
```

---

## Task 2: `Lightbox` component

**Files:** `components/gallery/Lightbox.tsx`, `components/gallery/Lightbox.test.tsx`

Full-screen image viewer with fade transition, prev/next, close, keyboard (Arrows + Escape), and touch swipe. Ported from `index.html:2249–2296`.

- [ ] **Step 1: Write the failing test**

Create `components/gallery/Lightbox.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Lightbox } from './Lightbox'

const PHOTOS = [
  { src: '/a.png', alt: 'Photo A' },
  { src: '/b.png', alt: 'Photo B' },
  { src: '/c.png', alt: 'Photo C' },
]

describe('Lightbox', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the current photo when open', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={1} onClose={() => {}} isOpen />)
    expect(screen.getByAltText('Photo B')).toBeInTheDocument()
  })

  it('shows a counter with current position', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} isOpen />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={onClose} isOpen />)
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={onClose} isOpen />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to the next photo with ArrowRight', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} isOpen />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to the previous photo with ArrowLeft', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={1} onClose={() => {}} isOpen />)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify FAILS**
```bash
npm test -- components/gallery/Lightbox.test.tsx
```

- [ ] **Step 3: Write `components/gallery/Lightbox.tsx`**

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { GalleryPhoto } from '@/lib/gallery'

interface LightboxProps {
  photos: GalleryPhoto[]
  initialIndex: number
  isOpen?: boolean
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, isOpen = false, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex, isOpen])

  const nav = useCallback((dir: number) => {
    setIndex((i) => (i + dir + photos.length) % photos.length)
  }, [photos.length])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'ArrowLeft') nav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, nav, onClose])

  if (!isOpen || !photos.length) return null

  const photo = photos[index]

  return (
    <div
      id="lightbox"
      className="open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button id="lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img id="lightbox-img" src={photo.src} alt={photo.alt} />
      <div id="lightbox-counter">{index + 1} / {photos.length}</div>
      {photos.length > 1 && (
        <>
          <button id="lightbox-prev" aria-label="Previous" onClick={() => nav(-1)}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button id="lightbox-next" aria-label="Next" onClick={() => nav(1)}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run to verify PASSES**
```bash
npm test -- components/gallery/Lightbox.test.tsx
```
Expected: 7 passed.

- [ ] **Step 5: Commit**
```bash
git add components/gallery/Lightbox.tsx components/gallery/Lightbox.test.tsx
git commit -m "Add Lightbox component with keyboard and navigation support"
```

---

## Task 3: `GalleryGrid` component

**Files:** `components/gallery/GalleryGrid.tsx`, `components/gallery/GalleryGrid.test.tsx`

Photo grid — renders thumbnails, opens Lightbox on click.

- [ ] **Step 1: Write the failing test**

Create `components/gallery/GalleryGrid.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GalleryGrid } from './GalleryGrid'

const PHOTOS = [
  { src: '/a.png', alt: 'Photo A' },
  { src: '/b.png', alt: 'Photo B' },
]

describe('GalleryGrid', () => {
  it('renders an image thumbnail for each photo', () => {
    render(<GalleryGrid photos={PHOTOS} />)
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(PHOTOS.length)
  })

  it('opens the lightbox when a thumbnail is clicked', async () => {
    render(<GalleryGrid photos={PHOTOS} />)
    const thumbs = screen.getAllByRole('button')
    await userEvent.click(thumbs[0])
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('shows the clicked photo in the lightbox', async () => {
    render(<GalleryGrid photos={PHOTOS} />)
    await userEvent.click(screen.getAllByRole('button')[1])
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify FAILS**
```bash
npm test -- components/gallery/GalleryGrid.test.tsx
```

- [ ] **Step 3: Write `components/gallery/GalleryGrid.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { GalleryPhoto } from '@/lib/gallery'
import { Lightbox } from './Lightbox'

interface GalleryGridProps {
  photos: GalleryPhoto[]
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="modal-grid">
        {photos.map((photo, i) => (
          <button
            key={i}
            className="modal-photo"
            onClick={() => setLightboxIndex(i)}
            aria-label={photo.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} loading={i < 6 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <Lightbox
        photos={photos}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  )
}
```

- [ ] **Step 4: Run to verify PASSES**
```bash
npm test -- components/gallery/GalleryGrid.test.tsx
```
Expected: 3 passed.

- [ ] **Step 5: Commit**
```bash
git add components/gallery/GalleryGrid.tsx components/gallery/GalleryGrid.test.tsx
git commit -m "Add GalleryGrid component with Lightbox integration"
```

---

## Task 4: `/gallery` overview page

**Files:** `app/gallery/page.tsx`

- [ ] **Step 1: Write `app/gallery/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/gallery'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Gallery — Our Work',
  description:
    'Browse our portfolio of custom kitchen cabinetry, bathroom vanities, closets, and living area built-ins. 100+ projects completed in Woodland Hills, CA.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Portfolio Gallery — Marina Woodcrafts Design Inc.',
    description: 'Custom woodwork and cabinetry in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function GalleryPage() {
  return (
    <main>
      <section id="gallery" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <div className="gallery-meta">
            <div>
              <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
              <Reveal as="h1" className="section-title section-title-light">Our Work</Reveal>
              <Reveal className="line-divider line-divider-light" />
            </div>
          </div>

          <div className="gallery-grid" style={{ marginTop: '40px' }}>
            {categories.map((cat, i) => (
              <Reveal
                key={cat.slug}
                className={`g-item${i === 0 ? '' : ` reveal-delay-${Math.min(i, 3)}`}`}
              >
                <Link href={`/gallery/${cat.slug}`} style={{ display: 'contents' }}>
                  <Image
                    src={cat.coverImage}
                    alt={cat.name}
                    fill
                    className="g-thumb"
                    sizes="(max-width: 900px) 100vw, 33vw"
                    priority={i === 0}
                  />
                  <div className="g-item-label">
                    <div className="g-item-name">{cat.name}</div>
                    <div className="g-item-hint">{cat.photos.length} photos</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
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
Expected: `/gallery` appears as a static route.

- [ ] **Step 3: Commit**
```bash
git add app/gallery/page.tsx
git commit -m "Add /gallery overview page with 4 category cards"
```

---

## Task 5: `/gallery/[category]` detail pages

**Files:** `app/gallery/[category]/page.tsx`

4 statically generated pages with photo grid, Lightbox, and `ImageGallery` JSON-LD schema.

- [ ] **Step 1: Write `app/gallery/[category]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, getCategory } from '@/lib/gallery'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}
  return {
    title: `${cat.name} Gallery`,
    description: `${cat.description} View ${cat.photos.length} photos of our custom work in Woodland Hills, CA.`,
    alternates: { canonical: `/gallery/${cat.slug}` },
    openGraph: {
      title: `${cat.name} | Marina Woodcrafts Design Inc.`,
      description: cat.description,
      images: [{ url: cat.coverImage }],
    },
  }
}

export default async function GalleryCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const imageGalleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${cat.name} — Marina Woodcrafts Design Inc.`,
    description: cat.description,
    author: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
    },
    image: cat.photos.slice(0, 8).map((p) => ({
      '@type': 'ImageObject',
      contentUrl: `https://marinawoodcraft.com${p.src}`,
      description: p.alt,
    })),
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }} />

      <section className="section" style={{ paddingTop: '140px', paddingBottom: '32px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
          <Reveal as="h1" className="section-title section-title-light">{cat.name}</Reveal>
          <Reveal className="line-divider line-divider-light" />
          <Reveal as="p" className="reveal-delay-1" style={{ marginTop: '16px', maxWidth: '560px', opacity: 0.8 }}>
            {cat.description}
          </Reveal>
          <Reveal className="reveal-delay-2" style={{ marginTop: '20px' }}>
            <Link href="/gallery" className="btn btn-outline-light" style={{ marginRight: '12px' }}>All Collections</Link>
            <Link href="/contact" className="btn btn-solid">Start a Project</Link>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="wrap">
          <GalleryGrid photos={cat.photos} />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Build and verify all 4 routes**
```bash
npm run build
```
Expected: `/gallery/[category]` with 4 pages listed.

- [ ] **Step 3: Verify with dev server**
```bash
npm run dev &
DEV_PID=$!
sleep 8
GALLERY=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/gallery")
CAT=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/gallery/bathroom")
JSONLD=$(curl -s "http://localhost:3000/gallery/bathroom" | grep -o 'application/ld+json' | wc -l | tr -d ' ')
echo "gallery=$GALLERY cat=$CAT json-ld-blocks=$JSONLD"
kill $DEV_PID 2>/dev/null || true
```
Expected: all 200, json-ld-blocks >= 1.

- [ ] **Step 4: Commit**
```bash
git add app/gallery/
git commit -m "Add /gallery and /gallery/[category] pages with ImageGallery JSON-LD schema"
```

---

## Task 6: Full test suite + final build verification

- [ ] **Step 1: Run all tests**
```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 2: Clean production build**
```bash
rm -rf .next && npm run build
```
Expected: succeeds. Static routes include `/gallery` and all 4 category pages.

- [ ] **Step 3: Confirm clean git tree**
```bash
git status
```

---

## Notes for Plan 4

- Plan 4 (`Contact + SEO finishing`) builds `/contact` with a working form + `app/api/contact/route.ts` stub, plus `app/sitemap.ts`, `app/robots.ts`, and `public/llms.txt`. It also removes `index.html` from the repo root and adds a `vercel.json` for deployment.
