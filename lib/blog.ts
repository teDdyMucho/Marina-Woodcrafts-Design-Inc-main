/** A rendered block parsed from the article body. */
export type BlogBlock =
  | { type: 'h2'; text: string } // "# " — main heading
  | { type: 'h3'; text: string } // "## " — sub-heading
  | { type: 'h4'; text: string } // "### " — sub-sub-heading
  | { type: 'ul'; items: string[] } // "– " (en dash) — bullet list
  | { type: 'hr' } // "—" (em dash) — section divider
  | { type: 'p'; text: string } // plain paragraph

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string // ISO yyyy-mm-dd
  dateLabel: string
  author: string
  heroImage: string
  readMinutes: number
  category: string
  tags: string[]
  url: string // external / reference URL (optional, '' when none)
  body: string // full article; raw text with light formatting markers
  paragraphs: string[] // plain-text blocks, for JSON-LD / previews
  blocks: BlogBlock[] // parsed structure, for rendering
  featured: boolean
  published: boolean
}

/**
 * Parse the body into renderable blocks using a light syntax:
 *   "# heading"   -> main heading (h2)
 *   "## heading"  -> sub-heading (h3)
 *   "– item"      -> bullet point (en dash U+2013); consecutive lines group
 *   "—"           -> section divider (em dash U+2014)
 *   blank line    -> new paragraph
 */
export function parseBody(body: string): BlogBlock[] {
  const blocks: BlogBlock[] = []
  let para: string[] = []
  let list: string[] = []
  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') })
      para = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: list })
      list = []
    }
  }
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flushPara()
      flushList()
      continue
    }
    if (line.startsWith('### ')) {
      flushPara(); flushList()
      blocks.push({ type: 'h4', text: line.slice(4).trim() })
      continue
    }
    if (line.startsWith('## ')) {
      flushPara(); flushList()
      blocks.push({ type: 'h3', text: line.slice(3).trim() })
      continue
    }
    if (line.startsWith('# ')) {
      flushPara(); flushList()
      blocks.push({ type: 'h2', text: line.slice(2).trim() })
      continue
    }
    if (/^—/.test(line)) {
      // em dash — section divider
      flushPara(); flushList()
      blocks.push({ type: 'hr' })
      continue
    }
    if (/^–\s?/.test(line)) {
      // en dash — bullet point
      flushPara()
      list.push(line.replace(/^–\s?/, '').trim())
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()
  return blocks
}

/**
 * Articles live as JSON files in /content/articles on GitHub, committed by the
 * admin "Create post" action. The blog reads them straight from GitHub, so a
 * new article shows up within ~60s of the commit — no Vercel redeploy needed.
 */
export const GITHUB_REPO = process.env.GITHUB_REPO ?? 'teDdyMucho/Marina-Woodcrafts-Design-Inc-main'
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main'
const ARTICLES_DIR = 'content/articles'
const REVALIDATE = 60 // seconds

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'marina-woodcrafts',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

/** Plain-text version of the body (markers stripped), for JSON-LD / previews. */
function toParagraphs(blocks: BlogBlock[]): string[] {
  return blocks.flatMap((b) =>
    b.type === 'hr' ? [] : b.type === 'ul' ? b.items : [b.text]
  )
}

function normalize(raw: Record<string, unknown>): BlogPost | null {
  if (!raw || typeof raw.slug !== 'string' || typeof raw.title !== 'string') return null
  const body = typeof raw.body === 'string' ? raw.body : ''
  const blocks = parseBody(body)
  const tags = asArray<string>(raw.tags).length
    ? asArray<string>(raw.tags)
    : asArray<string>(raw.keywords)
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: typeof raw.excerpt === 'string' ? raw.excerpt : '',
    date: typeof raw.date === 'string' ? raw.date : '1970-01-01',
    dateLabel:
      typeof raw.dateLabel === 'string'
        ? raw.dateLabel
        : typeof raw.date === 'string'
          ? raw.date
          : '',
    author: typeof raw.author === 'string' ? raw.author : 'Marina Woodcrafts Design Inc.',
    heroImage:
      typeof raw.heroImage === 'string' && raw.heroImage ? raw.heroImage : '/Background.jpg',
    readMinutes: typeof raw.readMinutes === 'number' ? raw.readMinutes : 4,
    category: typeof raw.category === 'string' ? raw.category : '',
    tags,
    url: typeof raw.url === 'string' ? raw.url : '',
    body,
    paragraphs: toParagraphs(blocks),
    blocks,
    featured: raw.featured === true,
    published: raw.published !== false, // default to published when absent
  }
}

interface GhEntry {
  type: string
  name: string
  download_url: string | null
}

interface GetPostsOptions {
  /** Include drafts (published: false). Defaults to false (public site). */
  includeUnpublished?: boolean
  /** Bypass the cache and read live from GitHub (admin views). */
  fresh?: boolean
}

/** Fetch init: live (no-store) for admin, or 60s-revalidate + tag for public. */
function ghInit(fresh?: boolean): RequestInit {
  return fresh
    ? { headers: ghHeaders(), cache: 'no-store' }
    : { headers: ghHeaders(), next: { revalidate: REVALIDATE, tags: ['articles'] } }
}

export async function getPosts(opts: GetPostsOptions = {}): Promise<BlogPost[]> {
  let listing: unknown
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${ARTICLES_DIR}?ref=${GITHUB_BRANCH}`,
      ghInit(opts.fresh)
    )
    if (!res.ok) return [] // folder doesn't exist yet, or rate-limited
    listing = await res.json()
  } catch {
    return []
  }
  if (!Array.isArray(listing)) return []

  const files = (listing as GhEntry[]).filter(
    (f) => f.type === 'file' && f.name.endsWith('.json') && f.download_url
  )

  const loaded = await Promise.all(
    files.map(async (f) => {
      try {
        const res = await fetch(f.download_url as string, ghInit(opts.fresh))
        if (!res.ok) return null
        return normalize(await res.json())
      } catch {
        return null
      }
    })
  )

  return loaded
    .filter((p): p is BlogPost => Boolean(p))
    // Public site shows every published post immediately (date is just a label).
    .filter((p) => opts.includeUnpublished || p.published)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1 // featured first
      return a.date < b.date ? 1 : -1 // then newest first
    })
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts({ includeUnpublished: true })
  return all.find((p) => p.slug === slug)
}

export type PostStatus = 'draft' | 'published'

/** Published toggle OFF -> 'draft' (hidden from blog); ON -> 'published'. */
export function postStatus(p: { published: boolean }): PostStatus {
  return p.published ? 'published' : 'draft'
}
