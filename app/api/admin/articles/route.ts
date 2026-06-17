import { NextResponse } from 'next/server'
import { GITHUB_REPO, GITHUB_BRANCH } from '@/lib/blog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const API = 'https://api.github.com'
const ARTICLES_DIR = 'content/articles'
const IMAGE_DIR = 'public/blog'

function headers(token: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'marina-woodcrafts',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function extFor(name?: string, type?: string): string {
  const fromName = name && name.includes('.') ? name.split('.').pop()!.toLowerCase() : ''
  if (fromName) return fromName.replace(/[^a-z0-9]/g, '') || 'jpg'
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  if (type === 'image/gif') return 'gif'
  return 'jpg'
}

function wordCount(...parts: string[]): number {
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length
}

interface SectionIn {
  heading?: string
  paragraphs?: string[]
}

/**
 * POST /api/admin/articles
 * Commits the article as content/articles/<slug>.json (and its hero image as
 * public/blog/<slug>.<ext>) straight to GitHub via the Git Data API. The blog
 * reads articles live from GitHub, so it shows up within ~60s — no redeploy.
 */
export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'Server is missing GITHUB_TOKEN. Add it to the environment to publish articles.' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : ''
  const intro = typeof body.intro === 'string' ? body.intro.trim() : ''
  const slug = slugify((typeof body.slug === 'string' && body.slug) || title)
  const sections = (Array.isArray(body.sections) ? body.sections : []) as SectionIn[]
  const faq = Array.isArray(body.faq) ? body.faq : []
  const keywords = Array.isArray(body.keywords) ? body.keywords : []
  const heroImageName = typeof body.heroImageName === 'string' ? body.heroImageName : undefined
  const heroImageType = typeof body.heroImageType === 'string' ? body.heroImageType : undefined
  const heroImageData = typeof body.heroImageData === 'string' ? body.heroImageData : undefined

  if (!title || !slug || !excerpt) {
    return NextResponse.json(
      { error: 'Title, slug, and excerpt are required.' },
      { status: 400 }
    )
  }

  // Computed metadata
  const now = new Date()
  const date = now.toISOString().slice(0, 10) // yyyy-mm-dd
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now)
  const author = 'Marina Woodcrafts Design Inc.'
  const allText = [
    intro,
    ...sections.flatMap((s) => [s.heading ?? '', ...(s.paragraphs ?? [])]),
  ]
  const readMinutes = Math.max(1, Math.round(wordCount(...allText) / 200))

  // Hero image (committed alongside the JSON). Served from the raw GitHub URL so
  // it's live immediately, before any Vercel redeploy.
  let heroImage = '/Background.jpg'
  let imagePath: string | null = null
  let imageBase64: string | null = null
  const base64 =
    heroImageData && heroImageData.includes(',')
      ? heroImageData.slice(heroImageData.indexOf(',') + 1)
      : heroImageData ?? null
  if (base64) {
    const ext = extFor(heroImageName, heroImageType)
    imagePath = `${IMAGE_DIR}/${slug}.${ext}`
    imageBase64 = base64
    heroImage = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${imagePath}`
  }

  const article = {
    slug,
    title,
    excerpt,
    date,
    dateLabel,
    author,
    heroImage,
    readMinutes,
    keywords,
    intro,
    sections: sections.map((s) => ({
      heading: s.heading ?? '',
      paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs : [],
    })),
    faq,
  }

  const repo = `${API}/repos/${GITHUB_REPO}`

  try {
    // 1. Current branch head + base tree
    const refRes = await fetch(`${repo}/git/ref/heads/${GITHUB_BRANCH}`, {
      headers: headers(token),
      cache: 'no-store',
    })
    if (!refRes.ok) {
      return NextResponse.json(
        { error: `Could not read branch ${GITHUB_BRANCH} (${refRes.status}).` },
        { status: 502 }
      )
    }
    const refJson = await refRes.json()
    const baseCommitSha: string = refJson.object.sha

    const commitRes = await fetch(`${repo}/git/commits/${baseCommitSha}`, {
      headers: headers(token),
      cache: 'no-store',
    })
    const baseTreeSha: string = (await commitRes.json()).tree.sha

    // 2. Blobs
    const treeItems: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = []

    const jsonBlob = await fetch(`${repo}/git/blobs`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        content: JSON.stringify(article, null, 2),
        encoding: 'utf-8',
      }),
    }).then((r) => r.json())
    treeItems.push({
      path: `${ARTICLES_DIR}/${slug}.json`,
      mode: '100644',
      type: 'blob',
      sha: jsonBlob.sha,
    })

    if (imagePath && imageBase64) {
      const imgBlob = await fetch(`${repo}/git/blobs`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ content: imageBase64, encoding: 'base64' }),
      }).then((r) => r.json())
      treeItems.push({ path: imagePath, mode: '100644', type: 'blob', sha: imgBlob.sha })
    }

    // 3. Tree -> commit -> move ref
    const newTree = await fetch(`${repo}/git/trees`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
    }).then((r) => r.json())

    const newCommit = await fetch(`${repo}/git/commits`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        message: `content: publish article "${title}"`,
        tree: newTree.sha,
        parents: [baseCommitSha],
      }),
    }).then((r) => r.json())

    const update = await fetch(`${repo}/git/refs/heads/${GITHUB_BRANCH}`, {
      method: 'PATCH',
      headers: headers(token),
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    })
    if (!update.ok) {
      const detail = await update.text()
      return NextResponse.json(
        { error: `Could not update branch (${update.status}). ${detail}` },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      slug,
      url: `/blog/${slug}`,
      commit: newCommit.sha,
      message: 'Published to GitHub. It will appear on the blog within about a minute.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not reach GitHub. Please try again.' },
      { status: 502 }
    )
  }
}
