# GEO Audit Report: Marina Woodcrafts Design Inc.

**Audit Date:** 2026-06-09
**Source:** Local codebase audit ([index.html](index.html)) — no live URL provided, so this audit is based on the deployed source rather than a crawl. Brand Authority and Platform Optimization scores are estimates based on what's discoverable in the code; verify with a live-site scan once a URL is available.
**Business Type:** Local Business / Custom Craftsmanship Service (custom cabinetry & woodcraft, Woodland Hills, CA)
**Pages Analyzed:** 1 (single-page site — `index.html` only, anchor-based navigation)

---

## Executive Summary

**Overall GEO Score: 22/100 (Critical)**

The site is visually polished but essentially invisible to AI answer engines: it has zero meta description, zero structured data (no LocalBusiness/Organization/Service schema), no robots.txt, sitemap, or llms.txt, and all content lives behind a single URL with thin, generic copy. An AI system asked "who does custom cabinetry in Woodland Hills?" has almost nothing machine-readable to latch onto here. The fixes are mostly additive (meta tags + JSON-LD + a couple of text blocks) and don't require touching the visual design.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 15/100 | 25% | 3.75 |
| Brand Authority | 25/100 | 20% | 5.00 |
| Content E-E-A-T | 30/100 | 20% | 6.00 |
| Technical GEO | 10/100 | 15% | 1.50 |
| Schema & Structured Data | 0/100 | 10% | 0.00 |
| Platform Optimization | 30/100 | 10% | 3.00 |
| **Overall GEO Score** | | | **~22/100** |

---

## Critical Issues (Fix Immediately)

1. **No structured data anywhere** ([index.html](index.html)) — Zero `<script type="application/ld+json">` blocks. AI systems rely heavily on schema to confirm entity identity (name, address, services, hours). Add `LocalBusiness`/`HomeAndConstructionBusiness` + `Service` + `Organization` schema.
2. **No meta description** ([index.html:6](index.html#L6)) — `<title>` exists but there's no `<meta name="description">`. This is the single most common source AI engines and search snippets pull from for a one-line summary of the business.
3. **No robots.txt / sitemap.xml / llms.txt** — None of these exist at the project root or in `dist`. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) have no explicit access signal, and there's no `llms.txt` pointing them to the most citable content.

## High Priority Issues

4. **Missing Open Graph / Twitter Card tags** ([index.html:4-10](index.html#L4-L10)) — No `og:title`, `og:description`, `og:image`, or `twitter:card`. This affects how the page is summarized when shared or referenced by AI tools that fetch link previews.
5. **No phone number listed** ([index.html:1670-1677](index.html#L1670-L1677)) — Only an email and a Google Maps link are given. NAP (Name-Address-Phone) consistency is a core local-business trust signal AI systems use for entity verification; a missing phone number weakens it.
6. **Single-URL architecture** — Everything (About, Services, Gallery, Contact) lives under anchors on one page (`#about`, `#services`, etc.). AI systems cite distinct URLs; a one-page site has only one citable surface, capping how often and how specifically it can be referenced (e.g., it can't link directly to "Bathroom Vanities" as its own indexed page).
7. **No canonical URL declared** — With a single-page app and hash-based navigation, a `<link rel="canonical">` matters to avoid any ambiguity about the authoritative URL once deployed (e.g., www vs. non-www, trailing slash variants on Netlify).

## Medium Priority Issues

8. **Thin, generic service descriptions** ([index.html:1546-1586](index.html#L1546-L1586)) — Each of the 5 services gets one ~20-word sentence (e.g., "Designed and built to fit your kitchen layout with precision..."). This is too short for AI systems to extract a confident, quotable answer about *what specifically* the company does differently. No materials, process details, timelines, or examples are given in text (only in images).
9. **No FAQ content** — A "Get in Touch" section exists, but there's no FAQ block (e.g., "How long does a custom kitchen take?", "Do you offer free consultations?", "What areas do you serve?"). FAQ content is one of the highest-yield citability formats for AI answer engines, and `FAQPage` schema is straightforward to add.
10. **No team/credentials/experience narrative beyond stat counters** ([index.html:1513-1526](index.html#L1513-L1526)) — "25+ Years of Experience," "100+ Projects Completed" are good trust signals but are bare numbers with no supporting names, certifications, or specific project narratives an AI system could cite as evidence of expertise (E-E-A-T).
11. **No testimonials or third-party reviews** — No client quotes, no Google/Yelp review references, no case studies. This is one of the strongest authority signals for local-business AI citation and is currently absent entirely.
12. **Gallery content is image-only** ([index.html:1625-1648](index.html#L1625-L1648)) — Each gallery category (Bathroom Vanities, Kitchen Cabinetry, etc.) has only an `alt` attribute as text; there's no accompanying written description of materials, design choices, or project specifics that AI systems could extract and quote.

## Low Priority Issues

13. **Footer copyright/credit text only** ([index.html:1723-1726](index.html#L1723-L1726)) — No links to social profiles, Google Business Profile, or review platforms, which would help AI systems cross-reference the entity across the web.
14. **No `lang` region/locale variant** ([index.html:2](index.html#L2)) — `lang="en"` is fine, but for a CA-based local business, structured data with explicit `addressRegion`/`addressLocality` will do more work than HTML lang attributes.
15. **Hero/H1 doesn't include brand or location** ([index.html:1464-1466](index.html#L1464-L1466)) — "Where Wood Becomes Art" is evocative but not descriptive; an H1 (or supporting text near it) that mentions "Marina Woodcrafts Design — Custom Cabinetry in Woodland Hills, CA" gives AI systems an unambiguous entity+location anchor right at the top of the page.

---

## Category Deep Dives

### AI Citability (15/100)
The page has almost no self-contained, quotable factual statements. Sentences like "Custom-built vanities tailored to maximize space while maintaining a clean and elegant look" are marketing language, not extractable facts (no dimensions, materials, locations served, turnaround times, pricing ranges, or process steps). The strongest citable facts currently are the three stat counters (25+ years, 100+ projects, 100% handcrafted) and the studio address — everything else is too vague for an AI system to confidently quote as an answer to a user's question.

**Fix direction:** Add 2-4 sentence "what makes us different" blurbs per service that include concrete specifics (materials used, typical project length, service area, design process steps).

### Brand Authority (25/100 — estimate)
Cannot be fully assessed from source code alone. Signals found in-repo: a single email (`Marinawoodcraftsdesign@hotmail.com` — a free Hotmail address, which slightly undercuts professional-entity signals vs. a custom domain email), a Google Maps link to the studio address, and "Website by Paldz" credit. No links to Google Business Profile, Yelp, Houzz, Instagram, Facebook, or LinkedIn appear anywhere in the markup — these are exactly the third-party platforms AI systems cross-reference to confirm a local business is real and reputable.

**Fix direction:** Add footer/contact links to Google Business Profile, Houzz (very relevant for woodcraft/cabinetry), and any active social profiles; consider a branded domain email.

### Content E-E-A-T (30/100)
There is a brief company-history narrative (the "Our Story" section, [index.html:1492-1501](index.html#L1492-L1501)) which is a reasonable start for "Experience," but it has no named individuals, no credentials/certifications, no licensing info (contractor's license number is a strong trust signal for this industry), and no sourced claims. "Trustworthiness" signals like a privacy policy, terms, or any legal page are absent from the footer.

**Fix direction:** Name the founder/lead craftsperson, mention any trade licenses or certifications (e.g., CA contractor's license #), and add 1-2 short project case studies with specifics.

### Technical GEO (10/100)
No `robots.txt`, no `sitemap.xml`, no `llms.txt` exist in the repo or build output. The site is a Vite-built SPA-style single page (per [package.json](package.json) and [netlify.toml](netlify.toml)), which is fine for rendering since content is in static HTML (not client-rendered from JS), but there's no machine-readable map of the site's content for crawlers — AI or otherwise.

**Fix direction:** Add a minimal `robots.txt` (allow all, explicitly list `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`), a `sitemap.xml` (even a single-URL one), and an `llms.txt` summarizing the business, services, and key facts in plain text for AI ingestion.

### Schema & Structured Data (0/100)
Zero schema of any kind. For a local craftsmanship business, the highest-value missing types are `LocalBusiness` (or the more specific `HomeAndConstructionBusiness`), `Service` (one per offering — kitchen cabinetry, vanities, closets, etc.), `Organization`, and eventually `FAQPage` and `Review`/`AggregateRating` once testimonials exist.

**Fix direction:** Add a single JSON-LD block in `<head>` with `LocalBusiness` (name, address, geo, telephone, email, openingHours, sameAs links to social/review profiles, makesOffer → Service entries).

### Platform Optimization (30/100 — estimate)
No evidence in the code of presence on platforms AI models commonly cite for local businesses (Google Business Profile, Yelp, Houzz, Angi, Nextdoor, Instagram/Facebook business pages). This can't be fully verified without a live web search, but nothing in the footer, contact section, or anywhere else links out to any of these — which itself is a signal that either they don't exist or aren't being surfaced.

**Fix direction:** Claim/verify a Google Business Profile and a Houzz profile (industry-specific and high-trust for AI home-improvement queries), and link to them from the site footer.

---

## Quick Wins (Implement This Week)

1. Add `<meta name="description" content="...">` summarizing the business, location, and core services (under 160 characters).
2. Add a single `LocalBusiness` JSON-LD block to `<head>` with name, address, phone, email, and `makesOffer` entries for each of the 5 services.
3. Add a phone number to the contact section and to the schema (NAP consistency).
4. Create a minimal `robots.txt` that explicitly allows AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `anthropic-ai`).
5. Add Open Graph and Twitter Card meta tags using existing brand assets (`Icon.png`, `Background.jpg`).

## 30-Day Action Plan

### Week 1: Technical & Schema Foundation
- [ ] Add meta description, canonical URL, OG/Twitter tags
- [ ] Add `LocalBusiness` + `Service` JSON-LD schema
- [ ] Create `robots.txt`, `sitemap.xml`, and a basic `llms.txt`

### Week 2: Content Depth
- [ ] Expand each of the 5 service descriptions to 3-4 sentences with concrete specifics (materials, timelines, service area)
- [ ] Add a short FAQ section with 5-6 Q&As (turnaround time, service area, free consultations, materials offered) + `FAQPage` schema
- [ ] Add a phone number and license/certification info to the contact section

### Week 3: Authority & Trust Signals
- [ ] Claim/verify Google Business Profile and Houzz listing; link both from the footer with `sameAs` in schema
- [ ] Add 1-2 short written project case studies (problem → approach → result) alongside existing gallery images
- [ ] Add 2-3 client testimonials with `Review`/`AggregateRating` schema

### Week 4: Expand Citable Surface
- [ ] Consider splitting key sections (Services, Gallery categories) into their own indexable URLs/pages so AI systems can cite specific offerings directly rather than only the homepage
- [ ] Add named individual(s) — founder/lead craftsperson — with a short bio for E-E-A-T
- [ ] Re-run this audit against the live URL once changes are deployed to validate crawler access and rendering

---

## Appendix: Pages Analyzed

| URL | Title | GEO Issues |
|---|---|---|
| `index.html` (single page, sections: Hero, About, Services, Gallery, Contact) | Marina Woodcrafts Design Inc. | 15 |

**Note:** No `sitemap.xml`, `robots.txt`, or additional HTML pages exist in the repository or `Assets/` directory — this is a true single-page site. A live-URL crawl could reveal additional issues (e.g., actual rendering behavior, response codes, redirect chains) not visible from source alone.
