export interface BlogSection {
  heading: string
  paragraphs: string[]
}

export interface BlogFaq {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string // ISO yyyy-mm-dd
  dateLabel: string
  author: string
  heroImage: string
  readMinutes: number
  keywords: string[]
  intro: string
  sections: BlogSection[]
  faq: BlogFaq[]
}

/**
 * Articles live as JSON files in /content/articles on GitHub, committed by the
 * admin "Upload article" action. The blog reads them straight from GitHub, so a
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

function normalize(raw: Record<string, unknown>): BlogPost | null {
  if (!raw || typeof raw.slug !== 'string' || typeof raw.title !== 'string') return null
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
    keywords: asArray<string>(raw.keywords),
    intro: typeof raw.intro === 'string' ? raw.intro : '',
    sections: asArray<BlogSection>(raw.sections),
    faq: asArray<BlogFaq>(raw.faq),
  }
}

interface GhEntry {
  type: string
  name: string
  download_url: string | null
}

export async function getPosts(): Promise<BlogPost[]> {
  let listing: unknown
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${ARTICLES_DIR}?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders(), next: { revalidate: REVALIDATE } }
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
        const res = await fetch(f.download_url as string, {
          headers: ghHeaders(),
          next: { revalidate: REVALIDATE },
        })
        if (!res.ok) return null
        return normalize(await res.json())
      } catch {
        return null
      }
    })
  )

  return loaded
    .filter((p): p is BlogPost => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getPosts()
  return all.find((p) => p.slug === slug)
}
