# Next.js Migration Design — Marina Woodcrafts Design Inc.

**Date:** 2026-06-09
**Status:** Approved, ready for implementation planning
**Context:** Following a [GEO audit](../../../GEO-AUDIT-REPORT.md) that scored the current single-page static site 22/100 (Critical) — driven mainly by zero structured data, no meta descriptions, no AI-crawler discovery files, and a single-URL architecture that caps how AI/search systems can cite the site — the site will be migrated from a static Vite/HTML build (deployed to Netlify) to Next.js (deployed to Vercel) to gain per-route SEO control, structured data, and a multi-page citable surface, while preserving the existing visual design exactly.

---

## Goals

1. Preserve the current visual design and animations pixel-for-pixel (full-fidelity rebuild — this was an explicit, non-negotiable requirement).
2. Restructure from one scrolling page into a real multi-page site so AI/search systems can cite specific services and gallery categories directly.
3. Bake in the GEO audit's recommendations from day one (metadata, schema, expanded copy, FAQ, discovery files) rather than as a follow-up pass.
4. Ship on Vercel with every page statically generated — the only server-side piece is a minimal serverless function backing the contact form.

## Non-Goals

- Redesigning the visual style, layout, or branding.
- Building a CMS or making content editable outside the codebase (content lives in typed data files).
- Wiring the contact form to a live email/webhook backend — that integration will be supplied later; this migration delivers a fully functional UI backed by a stub API route ready for a one-file swap.

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | First-class per-route metadata, built-in `sitemap.ts`/`robots.ts`, static params for dynamic routes |
| Rendering | Full static generation (SSG) for all pages | Brochure site with no dynamic data — matches current static Netlify setup. The one exception is the contact form's API route, which runs as a minimal Vercel serverless function only when a visitor submits the form — every page itself is pre-rendered static HTML |
| Styling | Ported global CSS (`app/globals.css`, split into a few logical files) | The existing ~1,300 lines of custom CSS (animations, custom properties, media queries) are copied near-verbatim — guarantees pixel-perfect fidelity; far lower risk than translating to Tailwind |
| Assets | Moved from `Assets/` → `public/`; photos through `next/image` | Next's static-serving convention; automatic image optimization improves Core Web Vitals (a Technical GEO finding) |
| Fonts | `next/font/google` for Playfair Display + Inter | Self-hosted, zero layout shift, replaces the current Google Fonts CDN `<link>` |
| Hosting | Vercel | Stated goal — pairs Next.js's SEO tooling with Vercel's edge network |

---

## Routing & Pages

All routes are statically generated at build time.

```
/                       Home — hero, story teaser, services teaser, featured gallery, contact teaser
/about                  Full company story, stats, team/credentials
/services               Overview grid of all 5 offerings
/services/[slug]        5 pages: kitchen-cabinetry, bathroom-vanities, closets-storage,
                        bookcases-built-ins, countertops — expanded copy + Service schema
/gallery                Overview of all 4 categories
/gallery/[category]     4 pages: bathroom, kitchen, bedroom, living — photo grid + lightbox
/contact                Form + studio info + map link
```

`[slug]` and `[category]` routes use `generateStaticParams`, sourced from the typed data files described below — adding a new service or gallery category later means adding one object, not new routing code.

---

## Component & Animation Architecture

The original page mixes markup with one large vanilla-JS block doing direct DOM manipulation (intro video, door-opening sequence, parallax, custom scrollbar, scroll-reveal, gallery modals, lightbox). Each behavior becomes a focused, independently-testable client component or hook:

**Layout-level** (mounted once in `app/layout.tsx`, shared across every page):
- `<IntroOverlay />` — plays the intro video → door-opening animation **only on the visitor's first page load of the browsing session**, tracked via `sessionStorage`; never replays on subsequent internal navigation
- `<ParallaxLayers />` — the three speckle foreground layers (`fg-small/medium/big`), driven by a `useParallax` scroll hook
- `<CustomScrollbar />` — replacement scrollbar UI, driven by a `useScrollProgress` hook (position, drag, click-to-seek)
- `<Nav />` / `<MobileNav />` — uses Next's `<Link>` for cross-page routing (replacing the current in-page anchor links), scroll-darkening behavior extracted into a `useScrolled` hook

**Shared utility:**
- `useReveal()` — recreates the `.reveal` / `.reveal.visible` IntersectionObserver scroll-in effect via a small wrapper component any section can opt into

**Feature components** (composed by multiple pages):
- `<ServiceCard />`, `<GalleryGrid />`, `<GalleryModal />`, `<Lightbox />`, `<ContactForm />`, `<Footer />`

This keeps each behavior independently understandable and changeable — e.g. the lightbox can be modified without touching parallax code — and lets new pages (like the per-service pages) compose existing pieces plus their own copy and metadata.

---

## Data Layer & Content Plan

A single typed source of truth drives both rendering and SEO/schema generation:

```ts
lib/services.ts   → 5 entries: { slug, title, summary, body, heroImage, faq[] }
lib/gallery.ts    → 4 entries: { slug, title, photos[] }
lib/business.ts   → company facts: name, address, phone, email, hours, stats, sameAs[]
```

**New copy** (addressing the audit's "thin content" finding — each service currently has one ~20-word marketing sentence):
- Each `/services/[slug]` page gets expanded copy: materials, process, typical timeline, what makes the offering distinct
- Each `/gallery/[category]` page gets a short descriptive intro
- `/about` gets a fuller company narrative

The assistant will draft this content based on the existing brand voice and current service descriptions; the user will review and edit before launch, since specifics (materials, timelines, license numbers, phone number) require the user's input or sign-off.

**FAQ section:** 5–6 Q&As (service area, consultation process, timelines, materials offered), marked up with `FAQPage` schema — the audit's top-recommended citability win, currently entirely absent.

---

## SEO / GEO Implementation

Directly resolves the GEO audit's findings (current scores in parentheses):

**Per-page metadata** (Schema & Structured Data: 0/100; Technical GEO: 10/100) — every route exports `generateMetadata`/`metadata` with title, description, canonical URL, Open Graph + Twitter Card images (`Icon.png`/`Background.jpg`).

**Structured data (JSON-LD)**:
- `LocalBusiness`/`HomeAndConstructionBusiness` + `Organization` in the root layout — name, address, geo, phone, email, `sameAs` (social/review profile links), `makesOffer`
- `Service` schema on each `/services/[slug]` page
- `FAQPage` schema on the FAQ section
- `CollectionPage`/`ImageGallery` schema on gallery pages

**Discovery files** (Technical GEO: 10/100), via Next's built-in generators:
- `app/sitemap.ts` — generates `sitemap.xml` from the static route list + dynamic params
- `app/robots.ts` — explicitly allows AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `anthropic-ai`)
- `public/llms.txt` — plain-text business/services summary for AI ingestion

---

## Contact Form

A client-side `<ContactForm />` posts to `app/api/contact/route.ts` — a stub API route that:
- Validates the submitted fields
- Returns a success response and logs the submission server-side
- Has a clearly marked `// TODO: wire to webhook` integration point

The UI is fully functional at launch (shows confirmation states, handles errors); connecting it to a live email/webhook backend later is a one-file change to the route handler, with no UI changes required.

---

## Open Items / Risks

- **Phone number & license info:** the audit flagged the missing phone number (NAP consistency) and noted that mentioning trade licenses/certifications strengthens E-E-A-T. These need to come from the user before the schema and contact page can be finalized.
- **Brand authority links:** `sameAs` schema links (Google Business Profile, Houzz, social profiles) depend on the user providing/confirming which profiles exist.
- **Asset paths:** the current site references heavily-nested asset paths with spaces (e.g. `Intro Animation/intro.aep_AME/Door24/...`) that will need URL-encoding-safe handling when moved into `public/` and referenced via `next/image`/`<source>`.
