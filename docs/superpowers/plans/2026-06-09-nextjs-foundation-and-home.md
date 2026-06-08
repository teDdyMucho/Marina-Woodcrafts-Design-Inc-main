# Next.js Foundation + Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a new Next.js 15 (App Router, TypeScript) project that renders a pixel-faithful Home page with all shared layout chrome (intro animation, nav, parallax layers, custom scrollbar, scroll-reveal) working, deployable to Vercel as a fully static build.

**Architecture:** Scaffold Next.js fresh, port the existing site's CSS into `app/globals.css` near-verbatim, move assets into `public/`, then build shared behaviors as small testable hooks (`useScrolled`, `useReveal`, `useParallax`, `useScrollProgress`) wired into focused client components (`IntroOverlay`, `Nav`, `MobileNav`, `ParallaxLayers`, `CustomScrollbar`, `Footer`) assembled in `app/layout.tsx`. The Home page composes Hero/About-teaser/Services-teaser/Gallery-teaser/Contact-teaser sections using ported markup and the `useReveal` wrapper.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Vitest + React Testing Library + jsdom (for hook/component unit tests), `next/font/google`, `next/image`

---

## File Structure

```
app/
  layout.tsx              — root layout: fonts, globals.css import, JSON-LD, shared chrome
  page.tsx                — Home page
  globals.css             — imports the split CSS files below
  styles/
    base.css              — resets, custom properties, body, scrollbar-hiding
    nav.css               — #nav, .nav-*, #mobile-nav, #nav-toggle
    hero.css              — #hero, .hero-*, .btn*, .scroll-cue
    sections.css          — .section, .wrap, .eyebrow, .section-title, dividers, .reveal
    about.css             — #about, .about-*, .stat-*
    services.css          — #services, .services-*, .service-card, .svc-*
    gallery.css           — #gallery, .gallery-*, .g-item*, .g-slide*, modal/lightbox CSS
    contact.css           — #contact, .contact-*, .field, form styles
    footer.css            — footer, .footer-*
    intro.css             — #intro-overlay, #door-overlay, #door-fallback, parallax (.fg-layer)
    responsive.css        — all @media blocks (tablet/mobile/extra-small)
components/
  layout/
    IntroOverlay.tsx      — first-visit intro video + door animation
    ParallaxLayers.tsx    — fg-small/medium/big speckle layers
    CustomScrollbar.tsx   — replacement scrollbar UI
    Nav.tsx               — desktop nav bar
    MobileNav.tsx         — mobile slide-over nav
    Footer.tsx            — site footer
  ui/
    Reveal.tsx            — wrapper applying useReveal's IntersectionObserver class toggle
hooks/
  useScrolled.ts          — boolean: has the user scrolled past 70px
  useReveal.ts            — IntersectionObserver-driven "visible" class toggle
  useParallax.ts          — returns { small, medium, big } backgroundPositionY values
  useScrollProgress.ts    — returns scrollbar thumb height/top + drag/seek handlers
lib/
  business.ts             — typed company facts (name, address, phone, email, stats, sameAs)
public/
  ...                     — moved from Assets/ (see Task 2)
test/
  setup.ts                — jsdom + RTL setup for Vitest
vitest.config.ts
```

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json` (replaced), `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Run the Next.js scaffolder into a temp dir, then merge**

Run (from the project root):
```bash
npx create-next-app@latest tmp-next --typescript --eslint --app --src-dir=false --import-alias "@/*" --no-tailwind
```
Expected: a `tmp-next/` directory is created with a working Next.js 15 app.

- [ ] **Step 2: Move the scaffolded files into the project root**

```bash
mv tmp-next/package.json tmp-next/tsconfig.json tmp-next/next.config.ts tmp-next/next-env.d.ts tmp-next/.eslintrc.json . 2>/dev/null
mv tmp-next/app .
rm -rf tmp-next
```
Expected: `app/`, `package.json`, `tsconfig.json`, `next.config.ts` now live at the project root, replacing the old Vite ones. The old `index.html`, `vite.config.js`, and `package-lock.json` (Vite's) remain for now — they'll be removed in Step 4.

- [ ] **Step 3: Remove the old Vite build setup**

```bash
git rm vite.config.js package-lock.json
```
Expected: both files are staged for removal. `index.html` stays in place temporarily as a content reference for later tasks — it will be deleted in the final cleanup task of the last plan in this series.

- [ ] **Step 4: Update `.gitignore` for Next.js**

Open `.gitignore` and ensure it contains (add any missing lines):
```
node_modules
.next
out
dist
.env*.local
.vercel
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```
Expected: `node_modules/` populated, `package-lock.json` (Next.js's) created, no errors.

- [ ] **Step 6: Verify the scaffolded app runs**

```bash
npm run dev
```
Expected: server starts on `http://localhost:3000`, the default Next.js starter page loads without errors. Stop the server with Ctrl+C once confirmed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 15 App Router project, remove Vite build setup"
```

---

## Task 2: Move assets into `public/` and verify paths

**Files:**
- Create: `public/` (populated from `Assets/`)
- Modify: none yet (path references updated in later tasks as each component is built)

- [ ] **Step 1: Move the Assets directory contents into `public/`**

```bash
git mv Assets/* public/
git mv Assets/.[!.]* public/ 2>/dev/null
rmdir Assets
```
Expected: `public/Background.jpg`, `public/Icon.png`, `public/Gallery/`, `public/Intro Animation/`, `public/Our Story/`, `public/foreground/`, `public/Favicon.png` all present; `Assets/` directory removed.

- [ ] **Step 2: Confirm Next.js serves a moved asset**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/Icon.png"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/Background.jpg"
kill %1
```
Expected: both return `200`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Move static assets from Assets/ into public/ for Next.js"
```

---

## Task 3: Set up Vitest for hook/component unit tests

**Files:**
- Create: `vitest.config.ts`, `test/setup.ts`
- Modify: `package.json` (add `test` script and devDependencies)

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 3: Create `test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add the `test` script to `package.json`**

In the `"scripts"` section, add:
```json
"test": "vitest run"
```

- [ ] **Step 5: Write a smoke test to confirm the harness works**

Create `test/smoke.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'

function Hello() {
  return <p>hello world</p>
}

describe('test harness smoke test', () => {
  it('renders and finds text', () => {
    render(<Hello />)
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it and confirm it passes**

```bash
npm test
```
Expected: `1 passed`. Then delete `test/smoke.test.tsx` — it was only to prove the harness works.

```bash
rm test/smoke.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add Vitest + React Testing Library for hook/component unit tests"
```

---

## Task 4: Port global CSS into split files

**Files:**
- Create: `app/styles/base.css`, `app/styles/nav.css`, `app/styles/hero.css`, `app/styles/sections.css`, `app/styles/about.css`, `app/styles/services.css`, `app/styles/gallery.css`, `app/styles/contact.css`, `app/styles/footer.css`, `app/styles/intro.css`, `app/styles/responsive.css`
- Modify: `app/globals.css`

The source CSS lives in `index.html` lines 12–1364 (the `<style>` block). Copy each rule group into its file **verbatim** — no rewriting, since pixel-fidelity depends on it. Use the section comment banners already in the source (e.g. `/* ── INTRO OVERLAY ── */`, `/* ── NAVBAR ── */`) as your boundaries. Map them as follows:

| Source section (by banner comment) | Destination file |
|---|---|
| Reset, `:root`, `html`, `body`, `.intro-active` | `base.css` |
| `INTRO OVERLAY`, `door-overlay`, `door-fallback`, `CSS fallback door animation`, `PORTRAIT INTRO SIZING` | `intro.css` |
| `CUSTOM SCROLLBAR` | `base.css` (the `#custom-scrollbar`, `#sb-*` rules) |
| `PARALLAX FOREGROUND LAYERS` | `intro.css` (`.fg-layer`, `#fg-small/medium/big`) |
| `NAVBAR`, `HAMBURGER MENU (mobile nav)` | `nav.css` |
| `HERO` | `hero.css` |
| `SHARED SECTION` (`.section`, `.wrap`, `.eyebrow`, `.section-title`, `DIVIDER`, `SCROLL REVEAL`) | `sections.css` |
| `ABOUT` | `about.css` |
| `SERVICES` | `services.css` |
| `GALLERY`, `GALLERY MODALS`, `LIGHTBOX`, `GALLERY THUMBNAILS & INLINE SLIDESHOW` | `gallery.css` |
| `CONTACT` | `contact.css` |
| `FOOTER` | `footer.css` |
| `RESPONSIVE — TABLET`, `RESPONSIVE — MOBILE`, `Extra-small` | `responsive.css` |

- [ ] **Step 1: Create each file and paste its rules verbatim from `index.html`**

Copy the exact CSS text (selectors, properties, values, comments, `@media`/`@keyframes` blocks) from the corresponding `index.html` line ranges into each new file per the table above. Do not rename classes, reorder properties, or "clean up" anything — fidelity is the goal.

- [ ] **Step 2: Replace the contents of `app/globals.css` with imports**

```css
@import './styles/base.css';
@import './styles/intro.css';
@import './styles/nav.css';
@import './styles/hero.css';
@import './styles/sections.css';
@import './styles/about.css';
@import './styles/services.css';
@import './styles/gallery.css';
@import './styles/contact.css';
@import './styles/footer.css';
@import './styles/responsive.css';
```

- [ ] **Step 3: Update the `.fg-layer` background-image URLs for the new asset location**

In `app/styles/intro.css`, find the three `#fg-*` rules (originally `index.html:296-301`) and update the `url(...)` paths from `url('foreground/small.png')` etc. to `url('/foreground/small.png')` (leading slash — `public/` assets are served from the site root in Next.js):
```css
#fg-small  { background-image: url('/foreground/small.png');  z-index: 5; opacity: 0.5; }
#fg-medium { background-image: url('/foreground/medium.png'); z-index: 6; opacity: 0.5; }
#fg-big    { background-image: url('/foreground/big.png');    z-index: 7; opacity: 0.5; }
```

- [ ] **Step 4: Verify the build compiles with the new CSS**

```bash
npm run build
```
Expected: build succeeds with no CSS errors (warnings about unused selectors are fine at this stage — components that use them don't exist yet).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Port site CSS from index.html into split globals.css files"
```

---

## Task 5: `lib/business.ts` — typed company data

**Files:**
- Create: `lib/business.ts`, `lib/business.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/business.test.ts`:
```ts
import { business } from './business'

describe('business', () => {
  it('has the studio address and phone formatted for tel: links', () => {
    expect(business.name).toBe('Marina Woodcrafts Design Inc.')
    expect(business.phone).toBe('+1 (310) 990-0788')
    expect(business.phoneHref).toBe('tel:+13109900788')
    expect(business.email).toBe('Marinawoodcraftsdesign@hotmail.com')
  })

  it('has a complete postal address for schema use', () => {
    expect(business.address).toEqual({
      streetAddress: '20857 Martha St',
      addressLocality: 'Woodland Hills',
      addressRegion: 'CA',
      postalCode: '91367',
      addressCountry: 'US',
    })
  })

  it('has a Google Maps URL derived from the address', () => {
    expect(business.mapsUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=20857+Martha+St+Woodland+Hills+CA+91367'
    )
  })

  it('has the three headline stats in display order', () => {
    expect(business.stats).toEqual([
      { value: '25+', label: 'Years of Experience' },
      { value: '100+', label: 'Projects Completed' },
      { value: '100%', label: 'Handcrafted' },
    ])
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- lib/business.test.ts
```
Expected: FAIL — `Cannot find module './business'`.

- [ ] **Step 3: Write `lib/business.ts`**

```ts
export interface PostalAddress {
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

export interface BusinessStat {
  value: string
  label: string
}

export interface Business {
  name: string
  legalName: string
  tagline: string
  phone: string
  phoneHref: string
  email: string
  address: PostalAddress
  mapsUrl: string
  stats: BusinessStat[]
  sameAs: string[]
}

const address: PostalAddress = {
  streetAddress: '20857 Martha St',
  addressLocality: 'Woodland Hills',
  addressRegion: 'CA',
  postalCode: '91367',
  addressCountry: 'US',
}

export const business: Business = {
  name: 'Marina Woodcrafts',
  legalName: 'Marina Woodcrafts Design Inc.',
  tagline: 'Handcrafted with Purpose',
  phone: '+1 (310) 990-0788',
  phoneHref: 'tel:+13109900788',
  email: 'Marinawoodcraftsdesign@hotmail.com',
  address,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=20857+Martha+St+Woodland+Hills+CA+91367',
  stats: [
    { value: '25+', label: 'Years of Experience' },
    { value: '100+', label: 'Projects Completed' },
    { value: '100%', label: 'Handcrafted' },
  ],
  // TODO: add Google Business Profile / Houzz / social links once provided
  sameAs: [],
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- lib/business.test.ts
```
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/business.ts lib/business.test.ts
git commit -m "Add typed business data module with tests"
```

---

## Task 6: `useScrolled` hook (nav scroll-darkening)

**Files:**
- Create: `hooks/useScrolled.ts`, `hooks/useScrolled.test.ts`

This recreates the behavior at `index.html:2013-2014` — `nav.classList.toggle('scrolled', window.scrollY > 70)`.

- [ ] **Step 1: Write the failing test**

Create `hooks/useScrolled.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react'
import { useScrolled } from './useScrolled'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
}

describe('useScrolled', () => {
  beforeEach(() => setScrollY(0))

  it('starts false when the page is at the top', () => {
    const { result } = renderHook(() => useScrolled(70))
    expect(result.current).toBe(false)
  })

  it('becomes true once scrollY exceeds the threshold', () => {
    const { result } = renderHook(() => useScrolled(70))
    act(() => {
      setScrollY(120)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('returns to false when scrolling back above the threshold line', () => {
    const { result } = renderHook(() => useScrolled(70))
    act(() => {
      setScrollY(120)
      window.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      setScrollY(10)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- hooks/useScrolled.test.ts
```
Expected: FAIL — `Cannot find module './useScrolled'`.

- [ ] **Step 3: Write `hooks/useScrolled.ts`**

```ts
'use client'

import { useEffect, useState } from 'react'

export function useScrolled(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- hooks/useScrolled.test.ts
```
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add hooks/useScrolled.ts hooks/useScrolled.test.ts
git commit -m "Add useScrolled hook for nav scroll-darkening behavior"
```

---

## Task 7: `useReveal` hook + `Reveal` wrapper component (scroll-in animation)

**Files:**
- Create: `hooks/useReveal.ts`, `hooks/useReveal.test.ts`, `components/ui/Reveal.tsx`, `components/ui/Reveal.test.tsx`

This recreates `index.html:2061-2068` — an `IntersectionObserver` that adds a `visible` class once an element scrolls into view (threshold 0.12), matching the `.reveal`/`.reveal.visible` CSS already ported into `sections.css`.

- [ ] **Step 1: Write the failing test for the hook**

Create `hooks/useReveal.test.ts`:
```ts
import { renderHook } from '@testing-library/react'
import { useReveal } from './useReveal'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element[] = []
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
  observe(el: Element) { this.observed.push(el) }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  // @ts-expect-error -- replacing the global with a test double
  global.IntersectionObserver = MockIntersectionObserver
})

describe('useReveal', () => {
  it('returns a ref and starts not-visible', () => {
    const { result } = renderHook(() => useReveal())
    expect(result.current.visible).toBe(false)
    expect(result.current.ref.current).toBeNull()
  })

  it('becomes visible once the observed element intersects', () => {
    const { result, rerender } = renderHook(() => useReveal())
    const el = document.createElement('div')
    // Attach the element to the ref the way React would on mount
    // @ts-expect-error -- assigning to a ref's current for the test
    result.current.ref.current = el
    rerender()

    const observer = MockIntersectionObserver.instances[0]
    observer.callback(
      [{ target: el, isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver
    )

    expect(result.current.visible).toBe(true)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- hooks/useReveal.test.ts
```
Expected: FAIL — `Cannot find module './useReveal'`.

- [ ] **Step 3: Write `hooks/useReveal.ts`**

```ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useReveal() {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true)
        })
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  })

  return { ref, visible }
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- hooks/useReveal.test.ts
```
Expected: `2 passed`.

- [ ] **Step 5: Write the failing test for the `Reveal` wrapper**

Create `components/ui/Reveal.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

class MockIntersectionObserver {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  // @ts-expect-error -- test double
  global.IntersectionObserver = MockIntersectionObserver
})

describe('Reveal', () => {
  it('renders children inside an element with the reveal class', () => {
    render(<Reveal>content</Reveal>)
    const el = screen.getByText('content')
    expect(el).toHaveClass('reveal')
    expect(el).not.toHaveClass('visible')
  })

  it('applies extra class names alongside reveal', () => {
    render(<Reveal className="reveal-delay-2">content</Reveal>)
    expect(screen.getByText('content')).toHaveClass('reveal', 'reveal-delay-2')
  })

  it('renders the given element type', () => {
    render(<Reveal as="h2">heading</Reveal>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('reveal')
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- components/ui/Reveal.test.tsx
```
Expected: FAIL — `Cannot find module './Reveal'`.

- [ ] **Step 7: Write `components/ui/Reveal.tsx`**

```tsx
'use client'

import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, as = 'div', className = '', style }: RevealProps) {
  const { ref, visible } = useReveal()
  const classes = ['reveal', className, visible ? 'visible' : ''].filter(Boolean).join(' ')

  return createElement(as, { ref, className: classes, style }, children)
}
```

- [ ] **Step 8: Run it to verify it passes**

```bash
npm test -- components/ui/Reveal.test.tsx
```
Expected: `3 passed`.

- [ ] **Step 9: Commit**

```bash
git add hooks/useReveal.ts hooks/useReveal.test.ts components/ui/Reveal.tsx components/ui/Reveal.test.tsx
git commit -m "Add useReveal hook and Reveal wrapper for scroll-in animations"
```

---

## Task 8: `useParallax` hook

**Files:**
- Create: `hooks/useParallax.ts`, `hooks/useParallax.test.ts`

Recreates `index.html:1956-1983` — three layers moving at speeds 0.07 / 0.17 / 0.30 of scroll position.

- [ ] **Step 1: Write the failing test**

Create `hooks/useParallax.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react'
import { useParallax } from './useParallax'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
}

describe('useParallax', () => {
  beforeEach(() => setScrollY(0))

  it('starts at zero offset for all three layers', () => {
    const { result } = renderHook(() => useParallax())
    expect(result.current).toEqual({ small: 0, medium: 0, big: 0 })
  })

  it('computes layer offsets proportional to scroll position and speed', () => {
    const { result } = renderHook(() => useParallax())
    act(() => {
      setScrollY(1000)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toEqual({
      small: -70,   // -1000 * 0.07
      medium: -170, // -1000 * 0.17
      big: -300,    // -1000 * 0.30
    })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- hooks/useParallax.test.ts
```
Expected: FAIL — `Cannot find module './useParallax'`.

- [ ] **Step 3: Write `hooks/useParallax.ts`**

```ts
'use client'

import { useEffect, useState } from 'react'

const SPEED_SMALL = 0.07
const SPEED_MEDIUM = 0.17
const SPEED_BIG = 0.3

export interface ParallaxOffsets {
  small: number
  medium: number
  big: number
}

export function useParallax(): ParallaxOffsets {
  const [offsets, setOffsets] = useState<ParallaxOffsets>({ small: 0, medium: 0, big: 0 })

  useEffect(() => {
    let ticking = false

    function update() {
      const y = window.scrollY
      setOffsets({
        small: -y * SPEED_SMALL,
        medium: -y * SPEED_MEDIUM,
        big: -y * SPEED_BIG,
      })
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return offsets
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- hooks/useParallax.test.ts
```
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add hooks/useParallax.ts hooks/useParallax.test.ts
git commit -m "Add useParallax hook for foreground speckle layer scroll effect"
```

---

## Task 9: `ParallaxLayers` component

**Files:**
- Create: `components/layout/ParallaxLayers.tsx`, `components/layout/ParallaxLayers.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/layout/ParallaxLayers.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { ParallaxLayers } from './ParallaxLayers'

vi.mock('@/hooks/useParallax', () => ({
  useParallax: () => ({ small: -10, medium: -20, big: -30 }),
}))

describe('ParallaxLayers', () => {
  it('renders three layers with ids matching the ported CSS hooks', () => {
    const { container } = render(<ParallaxLayers />)
    expect(container.querySelector('#fg-small')).toBeInTheDocument()
    expect(container.querySelector('#fg-medium')).toBeInTheDocument()
    expect(container.querySelector('#fg-big')).toBeInTheDocument()
  })

  it('applies the computed backgroundPositionY from useParallax to each layer', () => {
    const { container } = render(<ParallaxLayers />)
    expect(container.querySelector('#fg-small')).toHaveStyle({ backgroundPositionY: '-10px' })
    expect(container.querySelector('#fg-medium')).toHaveStyle({ backgroundPositionY: '-20px' })
    expect(container.querySelector('#fg-big')).toHaveStyle({ backgroundPositionY: '-30px' })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/layout/ParallaxLayers.test.tsx
```
Expected: FAIL — `Cannot find module './ParallaxLayers'`.

- [ ] **Step 3: Write `components/layout/ParallaxLayers.tsx`**

```tsx
'use client'

import { useParallax } from '@/hooks/useParallax'

export function ParallaxLayers() {
  const { small, medium, big } = useParallax()

  return (
    <>
      <div className="fg-layer" id="fg-small" style={{ backgroundPositionY: `${small}px` }} />
      <div className="fg-layer" id="fg-medium" style={{ backgroundPositionY: `${medium}px` }} />
      <div className="fg-layer" id="fg-big" style={{ backgroundPositionY: `${big}px` }} />
    </>
  )
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- components/layout/ParallaxLayers.test.tsx
```
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/layout/ParallaxLayers.tsx components/layout/ParallaxLayers.test.tsx
git commit -m "Add ParallaxLayers component"
```

---

## Task 10: `useScrollProgress` hook (custom scrollbar logic)

**Files:**
- Create: `hooks/useScrollProgress.ts`, `hooks/useScrollProgress.test.ts`

Recreates the thumb-sizing math from `index.html:1996-2005` (`updateThumb`) as a pure, testable function plus a hook that recomputes it on scroll/resize. Drag and click-to-seek stay as imperative handlers inside the `CustomScrollbar` component (Task 11) since they need DOM event coordinates — but the thumb geometry is pure and worth isolating.

- [ ] **Step 1: Write the failing test**

Create `hooks/useScrollProgress.test.ts`:
```ts
import { computeThumbGeometry } from './useScrollProgress'

describe('computeThumbGeometry', () => {
  it('returns a full-height thumb when the page is not scrollable', () => {
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 800, viewportHeight: 800, trackHeight: 600 })
    expect(geo).toEqual({ heightPx: 600, topPx: 0 })
  })

  it('sizes the thumb proportional to viewport vs document height, with a 28px minimum', () => {
    // viewport=800, document=2400 → ratio 1/3 → trackHeight(600)/3 = 200
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 2400, viewportHeight: 800, trackHeight: 600 })
    expect(geo.heightPx).toBe(200)
  })

  it('enforces the 28px minimum thumb height for very long pages', () => {
    // viewport=800, document=40000 → computed height would be 12, clamp to 28
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 40000, viewportHeight: 800, trackHeight: 600 })
    expect(geo.heightPx).toBe(28)
  })

  it('positions the thumb proportionally to scroll progress within the available track', () => {
    // scrollable = 2400 - 800 = 1600; ratio = 800/1600 = 0.5; thumbH = 200; maxTop = 600-200 = 400
    const geo = computeThumbGeometry({ scrollY: 800, scrollHeight: 2400, viewportHeight: 800, trackHeight: 600 })
    expect(geo).toEqual({ heightPx: 200, topPx: 200 })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- hooks/useScrollProgress.test.ts
```
Expected: FAIL — `Cannot find module './useScrollProgress'`.

- [ ] **Step 3: Write `hooks/useScrollProgress.ts`**

```ts
'use client'

import { useEffect, useState } from 'react'

export interface ThumbGeometry {
  heightPx: number
  topPx: number
}

interface ThumbInputs {
  scrollY: number
  scrollHeight: number
  viewportHeight: number
  trackHeight: number
}

const MIN_THUMB_HEIGHT = 28

export function computeThumbGeometry({ scrollY, scrollHeight, viewportHeight, trackHeight }: ThumbInputs): ThumbGeometry {
  const scrollable = scrollHeight - viewportHeight
  if (scrollable <= 0) {
    return { heightPx: trackHeight, topPx: 0 }
  }

  const ratio = scrollY / scrollable
  const heightPx = Math.max(MIN_THUMB_HEIGHT, trackHeight * (viewportHeight / scrollHeight))
  const maxTop = trackHeight - heightPx
  return { heightPx, topPx: ratio * maxTop }
}

export function useScrollProgress(trackRef: React.RefObject<HTMLElement | null>) {
  const [geometry, setGeometry] = useState<ThumbGeometry>({ heightPx: 0, topPx: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>

    function update() {
      const trackHeight = trackRef.current?.clientHeight ?? 0
      setGeometry(
        computeThumbGeometry({
          scrollY: window.scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
          trackHeight,
        })
      )
    }

    function onScroll() {
      update()
      setVisible(true)
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => setVisible(false), 1000)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      clearTimeout(hideTimer)
    }
  }, [trackRef])

  return { geometry, visible }
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- hooks/useScrollProgress.test.ts
```
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add hooks/useScrollProgress.ts hooks/useScrollProgress.test.ts
git commit -m "Add useScrollProgress hook with tested thumb-geometry calculation"
```

---

## Task 11: `CustomScrollbar` component

**Files:**
- Create: `components/layout/CustomScrollbar.tsx`, `components/layout/CustomScrollbar.test.tsx`

Recreates `index.html:1988-2058` (markup at `1397-1411`): track click-to-seek, thumb drag, up/down arrow buttons, auto-hide after 1s of inactivity.

- [ ] **Step 1: Write the failing test**

Create `components/layout/CustomScrollbar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomScrollbar } from './CustomScrollbar'

vi.mock('@/hooks/useScrollProgress', () => ({
  useScrollProgress: () => ({ geometry: { heightPx: 100, topPx: 20 }, visible: true }),
}))

describe('CustomScrollbar', () => {
  it('renders up/down buttons and a thumb positioned per the hook geometry', () => {
    render(<CustomScrollbar />)
    expect(screen.getByLabelText('Scroll up')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll down')).toBeInTheDocument()
    const thumb = document.getElementById('sb-thumb')
    expect(thumb).toHaveStyle({ height: '100px', top: '20px' })
  })

  it('shows the sb-visible class when the hook reports visible', () => {
    render(<CustomScrollbar />)
    expect(document.getElementById('custom-scrollbar')).toHaveClass('sb-visible')
  })

  it('scrolls up by 120px when the up arrow is clicked', async () => {
    const scrollBy = vi.fn()
    window.scrollBy = scrollBy
    render(<CustomScrollbar />)
    await userEvent.click(screen.getByLabelText('Scroll up'))
    expect(scrollBy).toHaveBeenCalledWith({ top: -120, behavior: 'smooth' })
  })

  it('scrolls down by 120px when the down arrow is clicked', async () => {
    const scrollBy = vi.fn()
    window.scrollBy = scrollBy
    render(<CustomScrollbar />)
    await userEvent.click(screen.getByLabelText('Scroll down'))
    expect(scrollBy).toHaveBeenCalledWith({ top: 120, behavior: 'smooth' })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/layout/CustomScrollbar.test.tsx
```
Expected: FAIL — `Cannot find module './CustomScrollbar'`.

- [ ] **Step 3: Write `components/layout/CustomScrollbar.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const { geometry, visible } = useScrollProgress(trackRef)

  function scrollableHeight() {
    return document.documentElement.scrollHeight - window.innerHeight
  }

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === thumbRef.current) return
    const rect = trackRef.current!.getBoundingClientRect()
    const clickRatio = (e.clientY - rect.top) / rect.height
    window.scrollTo({ top: clickRatio * scrollableHeight(), behavior: 'smooth' })
  }

  function handleThumbMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    thumbRef.current?.classList.add('dragging')
    const startY = e.clientY
    const startScroll = window.scrollY
    const trackHeight = trackRef.current!.clientHeight
    const thumbHeight = thumbRef.current!.clientHeight
    const scrollable = scrollableHeight()

    function onMove(ev: MouseEvent) {
      const delta = ev.clientY - startY
      const scrollDelta = (delta / (trackHeight - thumbHeight)) * scrollable
      window.scrollTo(0, Math.max(0, Math.min(scrollable, startScroll + scrollDelta)))
    }
    function onUp() {
      thumbRef.current?.classList.remove('dragging')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div id="custom-scrollbar" className={visible ? 'sb-visible' : ''}>
      <button id="sb-up" aria-label="Scroll up" onClick={() => window.scrollBy({ top: -120, behavior: 'smooth' })}>
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0.5L7.5 5.5H0.5L4 0.5Z" fill="currentColor" />
        </svg>
      </button>
      <div id="sb-track" ref={trackRef} onClick={handleTrackClick}>
        <div
          id="sb-thumb"
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
          style={{ height: `${geometry.heightPx}px`, top: `${geometry.topPx}px` }}
        />
      </div>
      <button id="sb-down" aria-label="Scroll down" onClick={() => window.scrollBy({ top: 120, behavior: 'smooth' })}>
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 5.5L0.5 0.5H7.5L4 5.5Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- components/layout/CustomScrollbar.test.tsx
```
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/layout/CustomScrollbar.tsx components/layout/CustomScrollbar.test.tsx
git commit -m "Add CustomScrollbar component"
```

---

## Task 12: `Nav` and `MobileNav` components

**Files:**
- Create: `components/layout/Nav.tsx`, `components/layout/Nav.test.tsx`, `components/layout/MobileNav.tsx`, `components/layout/MobileNav.test.tsx`

Recreates markup at `index.html:1426-1451` and the mobile-menu toggle JS at `index.html:2308-2336`. **Important deviation from the source:** the original used in-page anchors (`#about`, `#services`, etc.); since content now lives on separate routed pages, links point to `/about`, `/services`, `/gallery`, `/contact` and use Next's `<Link>`.

- [ ] **Step 1: Write the failing test for `Nav`**

Create `components/layout/Nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

vi.mock('@/hooks/useScrolled', () => ({ useScrolled: () => false }))
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('Nav', () => {
  it('renders the brand link to home and the four section links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /marina woodcrafts/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '/gallery')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('renders a hamburger toggle button for mobile', () => {
    render(<Nav />)
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })
})

describe('Nav when scrolled', () => {
  it('applies the scrolled class', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/useScrolled', () => ({ useScrolled: () => true }))
    const { Nav: ScrolledNav } = await import('./Nav')
    render(<ScrolledNav />)
    expect(document.getElementById('nav')).toHaveClass('scrolled')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/layout/Nav.test.tsx
```
Expected: FAIL — `Cannot find module './Nav'`.

- [ ] **Step 3: Write `components/layout/Nav.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useScrolled } from '@/hooks/useScrolled'
import { MobileNav } from './MobileNav'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const scrolled = useScrolled(70)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-brand">
          <Image src="/Icon.png" alt="MW" width={34} height={34} className="nav-icon" />
          <div className="nav-wordmark">
            Marina Woodcrafts
            <span>Design Inc.</span>
          </div>
        </Link>
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <button
          id="nav-toggle"
          className={menuOpen ? 'open' : ''}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <MobileNav open={menuOpen} links={LINKS} onClose={() => setMenuOpen(false)} />
    </>
  )
}
```

- [ ] **Step 4: Run it to verify `Nav` passes**

```bash
npm test -- components/layout/Nav.test.tsx
```
Expected: tests fail at this point because `MobileNav` doesn't exist yet — that's expected; continue to Step 5 to create it.

- [ ] **Step 5: Write the failing test for `MobileNav`**

Create `components/layout/MobileNav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from './MobileNav'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
]

describe('MobileNav', () => {
  it('renders nothing visible when closed', () => {
    render(<MobileNav open={false} links={LINKS} onClose={() => {}} />)
    expect(document.getElementById('mobile-nav')).not.toHaveClass('open')
  })

  it('applies the open class when open', () => {
    render(<MobileNav open links={LINKS} onClose={() => {}} />)
    expect(document.getElementById('mobile-nav')).toHaveClass('open')
  })

  it('calls onClose when a link is clicked', async () => {
    const onClose = vi.fn()
    render(<MobileNav open links={LINKS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- components/layout/MobileNav.test.tsx
```
Expected: FAIL — `Cannot find module './MobileNav'`.

- [ ] **Step 7: Write `components/layout/MobileNav.tsx`**

```tsx
'use client'

import Link from 'next/link'

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  open: boolean
  links: NavLink[]
  onClose: () => void
}

export function MobileNav({ open, links, onClose }: MobileNavProps) {
  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-label="Navigation menu"
      className={open ? 'open' : ''}
      style={{ display: open ? 'flex' : 'none' }}
    >
      {links.map((link) => (
        <Link key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Run both test files to verify everything passes**

```bash
npm test -- components/layout/Nav.test.tsx components/layout/MobileNav.test.tsx
```
Expected: all tests pass (3 in `Nav.test.tsx`, 3 in `MobileNav.test.tsx`).

- [ ] **Step 9: Commit**

```bash
git add components/layout/Nav.tsx components/layout/Nav.test.tsx components/layout/MobileNav.tsx components/layout/MobileNav.test.tsx
git commit -m "Add Nav and MobileNav components with route-based links"
```

---

## Task 13: `IntroOverlay` component (first-visit-only intro animation)

**Files:**
- Create: `components/layout/IntroOverlay.tsx`, `components/layout/IntroOverlay.test.tsx`

Recreates `index.html:1371-1394` (markup) and `1818-1949` (JS), with one deviation called out in the spec: **the animation plays only once per browsing session**, tracked via `sessionStorage`, regardless of which page the visitor lands on first.

- [ ] **Step 1: Write the failing test**

Create `components/layout/IntroOverlay.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { IntroOverlay } from './IntroOverlay'

const STORAGE_KEY = 'mwdi-intro-shown'

beforeEach(() => {
  sessionStorage.clear()
  // jsdom doesn't implement video playback; stub the bits the component touches
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
  window.HTMLMediaElement.prototype.load = vi.fn()
})

describe('IntroOverlay', () => {
  it('renders the overlay and marks the session on first visit', () => {
    const { container } = render(<IntroOverlay />)
    expect(container.querySelector('#intro-overlay')).toBeInTheDocument()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('renders nothing on a repeat visit within the same session', () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    const { container } = render(<IntroOverlay />)
    expect(container.querySelector('#intro-overlay')).not.toBeInTheDocument()
  })

  it('renders a skip button that dismisses the overlay', () => {
    const { container, getByText } = render(<IntroOverlay />)
    expect(getByText('Skip')).toBeInTheDocument()
    expect(container.querySelector('#intro-overlay')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/layout/IntroOverlay.test.tsx
```
Expected: FAIL — `Cannot find module './IntroOverlay'`.

- [ ] **Step 3: Write `components/layout/IntroOverlay.tsx`**

This keeps the same overall mechanics as the source (video → pixel-sampled door overlay → CSS-fallback door, portrait swap, frame preloading) but gates the whole thing behind a `sessionStorage` check and renders `null` after the sequence finishes or on repeat visits.

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'mwdi-intro-shown'
const DOOR_COUNT_LANDSCAPE = 32
const DOOR_COUNT_PORTRAIT = 35
const MS_PER_FRAME = 1000 / 24

export function IntroOverlay() {
  const [shouldRender, setShouldRender] = useState(false)
  const [phase, setPhase] = useState<'video' | 'doors' | 'fallback' | 'done'>('video')
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const doorFrameRef = useRef<HTMLImageElement>(null)
  const barColorRef = useRef('#ffffff')
  const loadedCountRef = useRef(0)
  const dismissedRef = useRef(false)
  const isPortraitRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setShouldRender(false)
      return
    }
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setShouldRender(true)
    document.body.classList.add('intro-active')
    isPortraitRef.current = window.innerHeight > window.innerWidth

    const video = videoRef.current
    if (!video) return

    if (isPortraitRef.current) {
      const source = video.querySelector('source')
      source?.setAttribute('src', '/Intro%20Animation/intro.aep_AME/Portait_Version/Intro_Portait_Version.mp4')
      video.load()
    }

    const doorCount = isPortraitRef.current ? DOOR_COUNT_PORTRAIT : DOOR_COUNT_LANDSCAPE
    const doorSrcs = Array.from({ length: doorCount }, (_, i) => {
      const n = String(i).padStart(5, '0')
      return isPortraitRef.current
        ? `/Intro%20Animation/intro.aep_AME/Portait_Version/Door24/Door24_Portait_Version_${n}.png`
        : `/Intro%20Animation/intro.aep_AME/Door24/Door24_${n}.png`
    })
    doorSrcs.forEach((src) => {
      const img = new window.Image()
      img.onload = () => { loadedCountRef.current += 1 }
      img.src = src
    })

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let sampling = false

    function sampleTopLeft() {
      if (!sampling || !ctx || !video) return
      try {
        ctx.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        barColorRef.current = `rgb(${r},${g},${b})`
        if (overlayRef.current) overlayRef.current.style.background = barColorRef.current
      } catch { /* canvas not yet readable */ }
      requestAnimationFrame(sampleTopLeft)
    }

    function startDoors() {
      document.body.classList.remove('intro-active')
      const doorCountNow = isPortraitRef.current ? DOOR_COUNT_PORTRAIT : DOOR_COUNT_LANDSCAPE

      if (loadedCountRef.current === doorCountNow && !isPortraitRef.current) {
        setPhase('doors')
        if (doorFrameRef.current) doorFrameRef.current.src = doorSrcs[0]
        let idx = 1
        const tick = setInterval(() => {
          if (idx >= doorCountNow) {
            clearInterval(tick)
            setPhase('done')
            return
          }
          if (doorFrameRef.current) doorFrameRef.current.src = doorSrcs[idx++]
        }, MS_PER_FRAME)
      } else {
        setPhase('fallback')
        const fbDur = Math.round((doorCountNow / 24) * 1000)
        setTimeout(() => setPhase('done'), fbDur + 100)
      }
    }

    function dismiss() {
      if (dismissedRef.current) return
      dismissedRef.current = true
      sampling = false
      video.pause()
      startDoors()
    }

    video.addEventListener('ended', dismiss)
    video.addEventListener('loadedmetadata', () => {
      setTimeout(dismiss, video.duration * 1000)
    })
    video.addEventListener('canplay', () => {
      if (!sampling) { sampling = true; requestAnimationFrame(sampleTopLeft) }
    })
    video.addEventListener('error', dismiss)

    video.play().catch(() => {
      if (overlayRef.current) overlayRef.current.style.cursor = 'pointer'
      overlayRef.current?.addEventListener('click', () => video.play().catch(dismiss), { once: true })
    })

    return () => { sampling = false }
  }, [])

  if (!shouldRender || phase === 'done') return null

  return (
    <>
      {phase === 'video' && (
        <div id="intro-overlay" ref={overlayRef}>
          <video id="intro-video" ref={videoRef} muted playsInline preload="auto">
            <source src="/Intro%20Animation/intro.aep_AME/Intro_v3.mp4" type="video/mp4" />
          </video>
          <button
            id="intro-skip"
            onClick={() => {
              videoRef.current?.dispatchEvent(new Event('error'))
            }}
          >
            Skip
          </button>
        </div>
      )}
      {phase === 'doors' && (
        <div id="door-overlay" style={{ display: 'flex' }}>
          <div className="door-bar" id="door-bar-top" style={{ background: barColorRef.current }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="door-frame" ref={doorFrameRef} alt="" />
          <div className="door-bar" id="door-bar-bottom" style={{ background: barColorRef.current }} />
        </div>
      )}
      {phase === 'fallback' && (
        <div id="door-fallback" className="fb-animate" style={{ display: 'flex' }}>
          <div className="door-bar" id="fb-bar-top" style={{ background: barColorRef.current }} />
          <div id="fb-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-wood-frame" src="/Intro%20Animation/wood%20frame.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-door-right" src="/Intro%20Animation/door%20right.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-door-left" src="/Intro%20Animation/door%20left.png" alt="" />
          </div>
          <div className="door-bar" id="fb-bar-bottom" style={{ background: barColorRef.current }} />
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- components/layout/IntroOverlay.test.tsx
```
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/layout/IntroOverlay.tsx components/layout/IntroOverlay.test.tsx
git commit -m "Add IntroOverlay component, gated to play once per browsing session"
```

---

## Task 14: `Footer` component

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/Footer.test.tsx`

Recreates `index.html:1715-1727`, pulling copy text from `lib/business.ts` instead of hardcoding it.

- [ ] **Step 1: Write the failing test**

Create `components/layout/Footer.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the brand name and current-year copyright', () => {
    render(<Footer />)
    expect(screen.getByText('Marina Woodcrafts')).toBeInTheDocument()
    expect(screen.getByText('Design Inc.')).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
    expect(screen.getByText(/Website by Paldz/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- components/layout/Footer.test.tsx
```
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Write `components/layout/Footer.tsx`**

```tsx
import Image from 'next/image'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-brand">
        <Image src="/Icon.png" alt="MW" width={30} height={30} className="footer-icon" />
        <div className="footer-brand-text">
          <span className="footer-name">Marina Woodcrafts</span>
          <span className="footer-name-sub">Design Inc.</span>
        </div>
      </div>
      <div className="footer-legal">
        <p className="footer-copy">© {year} Marina Woodcrafts Design Inc. All rights reserved.</p>
        <p className="footer-credit">Website by Paldz</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run it to verify it passes**

```bash
npm test -- components/layout/Footer.test.tsx
```
Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/Footer.test.tsx
git commit -m "Add Footer component"
```

---

## Task 15: Assemble the root layout with JSON-LD

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { IntroOverlay } from '@/components/layout/IntroOverlay'
import { ParallaxLayers } from '@/components/layout/ParallaxLayers'
import { CustomScrollbar } from '@/components/layout/CustomScrollbar'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { business } from '@/lib/business'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://marinawoodcraft.com'),
  title: {
    default: 'Marina Woodcrafts Design Inc. | Custom Cabinetry in Woodland Hills, CA',
    template: '%s | Marina Woodcrafts Design Inc.',
  },
  description:
    'Custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops handcrafted in Woodland Hills, CA. 25+ years of experience, 100+ projects completed.',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: business.legalName,
  image: 'https://marinawoodcraft.com/Icon.png',
  telephone: business.phone,
  email: business.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.streetAddress,
    addressLocality: business.address.addressLocality,
    addressRegion: business.address.addressRegion,
    postalCode: business.address.postalCode,
    addressCountry: business.address.addressCountry,
  },
  url: 'https://marinawoodcraft.com',
  sameAs: business.sameAs,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <IntroOverlay />
        <CustomScrollbar />
        <ParallaxLayers />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update `app/styles/base.css` font-family references**

The ported CSS references `'Inter', sans-serif` and `'Playfair Display', serif` directly (from the old Google Fonts `<link>`). Update `body` in `base.css` and `.hero-headline`/`.section-title`/etc. selectors across the style files to use the CSS variables Next's font loader provides instead — find every `font-family: 'Inter', sans-serif;` and replace with `font-family: var(--font-inter), sans-serif;`, and every `font-family: 'Playfair Display', serif;` with `font-family: var(--font-playfair), serif;`.

```bash
grep -rl "font-family: 'Inter'" app/styles/ | xargs sed -i '' "s/font-family: 'Inter', sans-serif;/font-family: var(--font-inter), sans-serif;/g"
grep -rl "font-family: 'Playfair Display'" app/styles/ | xargs sed -i '' "s/font-family: 'Playfair Display', serif;/font-family: var(--font-playfair), serif;/g"
```
Expected: both commands report files changed; re-run `grep -rn "font-family: 'Inter'\|font-family: 'Playfair" app/styles/` to confirm zero remaining matches.

- [ ] **Step 3: Verify the dev server renders the layout without errors**

```bash
npm run dev &
sleep 4
curl -s "http://localhost:3000" | grep -o '<title>[^<]*' | head -1
curl -s "http://localhost:3000" | grep -o 'application/ld+json' | head -1
kill %1
```
Expected: the title line shows the configured default title, and `application/ld+json` is found in the page source.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/styles/
git commit -m "Assemble root layout with shared chrome, fonts, and LocalBusiness JSON-LD"
```

---

## Task 16: Build the Home page

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/AboutTeaser.tsx`, `components/home/ServicesTeaser.tsx`, `components/home/GalleryTeaser.tsx`, `components/home/ContactTeaser.tsx`
- Modify: `app/page.tsx`

Each teaser section ports its corresponding markup from `index.html` (Hero: `1456-1477`; About: `1482-1528`; Services header + first 3 cards: `1533-1591`; Gallery: featured slideshow + grid `1596-1652`; Contact: `1657-1710`), wrapped in `<Reveal>` in place of the original `class="reveal"` elements, and linking onward to the full pages (`/about`, `/services`, `/gallery`, `/contact`) instead of in-page anchors. Teasers show a representative subset (e.g., 3 of 5 services, the featured slideshow + grid) with a "View all" link to the full page — full content lives on the dedicated routes built in later plans.

- [ ] **Step 1: Write `components/home/Hero.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { business } from '@/lib/business'

export function Hero() {
  return (
    <section id="hero">
      <div className="hero-inner">
        <Image src="/Icon.png" alt="Marina Woodcrafts" width={200} height={200} className="hero-logo" priority />
        <p className="hero-eyebrow">{business.tagline}</p>
        <h1 className="hero-headline">
          Where Wood<br />Becomes <em>Art</em>
        </h1>
        <p className="hero-sub">
          Custom woodcraft and interior design rooted in tradition,<br />
          crafted for the spaces where life happens.
        </p>
        <Link href="/about" className="btn btn-outline-light">Discover Our Work</Link>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="scroll-cue-line"></div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `components/home/AboutTeaser.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export function AboutTeaser() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Our Story</Reveal>
        <Reveal as="h2" className="section-title">
          Crafted with tradition,<br />designed for today.
        </Reveal>
        <Reveal className="line-divider" />

        <div className="about-grid">
          <div className="about-body">
            <Reveal as="p" className="reveal-delay-1">
              Marina Woodcrafts Design Inc was built on a passion for craftsmanship and high-quality woodworking.
              The company started with a focus on delivering custom cabinetry solutions tailored to each client&rsquo;s
              unique space and needs.
            </Reveal>
            <Reveal as="p" className="reveal-delay-2">
              Over time, it has grown into a trusted provider of custom kitchens, bathroom vanities, closets, and countertops,
              known for precision, durability, and refined design.
            </Reveal>
            <Reveal className="reveal-delay-3">
              <Link href="/about" className="btn btn-solid" style={{ marginTop: '12px' }}>Our Story</Link>
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
  )
}
```

- [ ] **Step 3: Write `components/home/ServicesTeaser.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

const FEATURED = [
  { num: '01', title: 'Custom Kitchen Cabinetry', desc: 'Designed and built to fit your kitchen layout with precision, combining functionality and modern aesthetics.' },
  { num: '02', title: 'Bathroom Vanities', desc: 'Custom-built vanities tailored to maximize space while maintaining a clean and elegant look.' },
  { num: '03', title: 'Closets & Storage Solutions', desc: 'Efficient and stylish storage systems designed to match your lifestyle and space requirements.' },
]

export function ServicesTeaser() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="services-header">
          <div>
            <Reveal as="p" className="eyebrow">What We Do</Reveal>
            <Reveal as="h2" className="section-title">Craftsmanship in<br />every detail.</Reveal>
          </div>
          <Reveal>
            <Link href="/services" className="btn btn-outline-dark">View All Services</Link>
          </Reveal>
        </div>
        <div className="services-grid">
          {FEATURED.map((svc, i) => (
            <Reveal key={svc.num} className={`service-card${i === 0 ? '' : ` reveal-delay-${i}`}`}>
              <div className="svc-num">{svc.num}</div>
              <h3 className="svc-title">{svc.title}</h3>
              <p className="svc-desc">{svc.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `components/home/GalleryTeaser.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

const CATEGORIES = [
  { slug: 'bathroom', name: 'Bathroom Vanities', img: '/Gallery/Bathroom%20Vanities/1.png' },
  { slug: 'kitchen', name: 'Kitchen Cabinetry', img: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png' },
  { slug: 'bedroom', name: 'Bedroom Closets & Storage', img: '/Gallery/Bedroom%20Closets%20&%20Storage/1.png' },
  { slug: 'living', name: 'Living Area Cabinet & Shelves', img: '/Gallery/Living-Area-Cabinet-Shelves/1.png' },
]

export function GalleryTeaser() {
  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <div className="gallery-meta">
          <div>
            <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
            <Reveal as="h2" className="section-title section-title-light">Our Work</Reveal>
            <Reveal className="line-divider line-divider-light" />
          </div>
          <Reveal>
            <Link href="/gallery" className="btn btn-outline-light">View Full Gallery</Link>
          </Reveal>
        </div>
        <div className="gallery-grid">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} as={Link} className={`g-item${i === 0 ? '' : ` reveal-delay-${Math.min(i, 3)}`}`} {...{ href: `/gallery/${cat.slug}` }}>
              <Image src={cat.img} alt={cat.name} fill className="g-thumb" sizes="(max-width: 900px) 100vw, 33vw" />
              <div className="g-item-label">
                <div className="g-item-name">{cat.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

> **Note for the implementer:** `Reveal`'s `as` prop is typed as `ElementType`; passing `Link` works at runtime, but if TypeScript complains about the spread `href` prop, change that line to wrap `<Link href={...}>` *inside* a `<Reveal>` (`as="div"`) the same way `AboutTeaser`'s CTA button does, and move the `g-item`/`reveal-delay-*` classes onto the `Link`. Verify with `npm run build` in Step 6 and adjust if the build reports a type error here.

- [ ] **Step 5: Write `components/home/ContactTeaser.tsx`**

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function ContactTeaser() {
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Get in Touch</Reveal>
        <Reveal as="h2" className="section-title">Let&rsquo;s build something<br />beautiful together.</Reveal>
        <Reveal className="line-divider" />
        <Reveal as="p" className="reveal-delay-1" style={{ maxWidth: '40rem', marginTop: '24px' }}>
          Let&rsquo;s bring your vision to life with cabinetry and countertop solutions designed specifically for your space.
        </Reveal>
        <Reveal className="reveal-delay-2" style={{ marginTop: '28px' }}>
          <Link href="/contact" className="btn btn-solid">Start a Conversation</Link>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Assemble `app/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { ServicesTeaser } from '@/components/home/ServicesTeaser'
import { GalleryTeaser } from '@/components/home/GalleryTeaser'
import { ContactTeaser } from '@/components/home/ContactTeaser'

export const metadata: Metadata = {
  title: 'Custom Cabinetry & Woodcraft in Woodland Hills, CA',
  description:
    'Marina Woodcrafts Design Inc. handcrafts custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops in Woodland Hills, CA. 25+ years of experience.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <ServicesTeaser />
      <GalleryTeaser />
      <ContactTeaser />
    </>
  )
}
```

- [ ] **Step 7: Run the full test suite**

```bash
npm test
```
Expected: all tests across all files pass (no failures).

- [ ] **Step 8: Run a production build**

```bash
npm run build
```
Expected: build completes successfully; `/` is listed as a statically generated route (`○` marker) in the output. Fix any TypeScript or lint errors that surface (most likely candidates: the `Reveal as={Link}` usage flagged in Step 4's note).

- [ ] **Step 9: Manually verify visual fidelity in the browser**

```bash
npm run dev
```
Open `http://localhost:3000` and compare against the live reference (open `index.html` via `npm run preview` in a separate terminal if needed, or compare against the deployed Netlify site). Check specifically:
- Intro video plays once, door animation transitions in, then the homepage is revealed
- Hero, About, Services, Gallery, Contact teaser sections match the original's layout, spacing, colors, and typography
- Scroll-reveal animations trigger as sections enter the viewport
- Parallax speckle layers move at the three different speeds while scrolling
- Custom scrollbar appears on scroll, auto-hides after ~1s, and the thumb drag/track-click/arrow-button interactions work
- Nav darkens on scroll past ~70px; mobile hamburger menu opens/closes
- Resize to a narrow viewport and confirm the responsive breakpoints (tablet ≤900px, mobile ≤600px) match the original

Stop the dev server once verified.

- [ ] **Step 10: Commit**

```bash
git add components/home/ app/page.tsx
git commit -m "Build Home page with Hero, About/Services/Gallery/Contact teasers"
```

---

## Task 17: Deploy verification

**Files:** none (verification only)

- [ ] **Step 1: Confirm a clean production build**

```bash
rm -rf .next
npm run build
```
Expected: build succeeds with zero errors; output shows all routes statically generated.

- [ ] **Step 2: Run the production server locally and spot-check**

```bash
npm run start &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/Icon.png"
curl -s "http://localhost:3000" | grep -o 'application/ld+json' | head -1
kill %1
```
Expected: both HTTP checks return `200`, and `application/ld+json` is present in the rendered HTML.

- [ ] **Step 3: Commit any final fixes discovered during verification, then confirm a clean working tree**

```bash
git status
```
Expected: `nothing to commit, working tree clean`. If there are uncommitted fixes from the verification step, commit them with a message describing what was fixed.

---

## Notes for Subsequent Plans

- Plan 2 (`About + Services`) will replace `AboutTeaser`'s "Our Story" link target content with a full `/about` page, and build out `/services` + `/services/[slug]` — reusing `Reveal`, `Nav`/`Footer` chrome, and `lib/business.ts`.
- Plan 3 (`Gallery`) builds `/gallery` + `/gallery/[category]`, reusing the `GalleryTeaser` category data (which should be promoted to `lib/gallery.ts` at that point) plus new `GalleryGrid`/`GalleryModal`/`Lightbox` components ported from `index.html:2148-2296`.
- Plan 4 (`Contact + SEO finishing`) builds `/contact` with the real form + `app/api/contact/route.ts`, plus `app/sitemap.ts`, `app/robots.ts`, and `public/llms.txt`. It also removes the now-unused `index.html` from the repo root.
