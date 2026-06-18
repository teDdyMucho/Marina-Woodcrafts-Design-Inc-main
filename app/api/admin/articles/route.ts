import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { GITHUB_REPO, GITHUB_BRANCH } from '@/lib/blog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Drop cached blog data so the public site reflects the change immediately. */
function refreshBlog(slug: string) {
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
}

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

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
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
  const articleBody = typeof body.body === 'string' ? body.body.trim() : ''
  const slug = slugify((typeof body.slug === 'string' && body.slug) || title)
  const url = typeof body.url === 'string' ? body.url.trim() : ''
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  const tags = Array.isArray(body.tags)
    ? (body.tags as unknown[]).filter((t): t is string => typeof t === 'string')
    : []
  const featured = body.featured === true
  const published = body.published !== false
  const publishedDate =
    typeof body.publishedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.publishedDate)
      ? body.publishedDate
      : ''
  const readMinutesInput =
    typeof body.readMinutes === 'number' && body.readMinutes > 0
      ? Math.round(body.readMinutes)
      : null
  const heroImageName = typeof body.heroImageName === 'string' ? body.heroImageName : undefined
  const heroImageType = typeof body.heroImageType === 'string' ? body.heroImageType : undefined
  const heroImageData = typeof body.heroImageData === 'string' ? body.heroImageData : undefined
  const existingHeroImage = typeof body.heroImage === 'string' ? body.heroImage : ''

  if (!title || !slug || !excerpt) {
    return NextResponse.json(
      { error: 'Title, slug, and excerpt are required.' },
      { status: 400 }
    )
  }

  // Date — from the form's "Published date", or today.
  const date = publishedDate || new Date().toISOString().slice(0, 10)
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
  const author = 'Marina Woodcrafts Design Inc.'
  const readMinutes = readMinutesInput ?? Math.max(1, Math.round(wordCount(articleBody) / 200))

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
  } else if (existingHeroImage) {
    // Editing without replacing the cover — keep the current image.
    heroImage = existingHeroImage
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
    category,
    tags,
    url,
    body: articleBody,
    featured,
    published,
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

    refreshBlog(slug)

    return NextResponse.json({
      ok: true,
      slug,
      url: `/blog/${slug}`,
      commit: newCommit.sha,
      message: published
        ? 'Published to GitHub. It will appear on the blog within about a minute.'
        : 'Saved as a draft to GitHub (not shown on the public blog).',
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not reach GitHub. Please try again.' },
      { status: 502 }
    )
  }
}

/** Delete a single file from the repo (commits the removal). */
async function deletePath(repo: string, token: string, path: string, message: string) {
  const meta = await fetch(`${repo}/contents/${path}?ref=${GITHUB_BRANCH}`, {
    headers: headers(token),
    cache: 'no-store',
  })
  if (!meta.ok) return false // already gone
  const sha: string = (await meta.json()).sha
  const del = await fetch(`${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ message, sha, branch: GITHUB_BRANCH }),
  })
  return del.ok
}

/**
 * DELETE /api/admin/articles?slug=<slug>
 * Removes content/articles/<slug>.json (and any public/blog/<slug>.* hero image)
 * from GitHub. The blog drops the article within ~60s — no redeploy.
 */
export async function DELETE(request: Request) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server is missing GITHUB_TOKEN.' }, { status: 500 })
  }

  const slug = slugify(new URL(request.url).searchParams.get('slug') ?? '')
  if (!slug) {
    return NextResponse.json({ error: 'A slug is required.' }, { status: 400 })
  }

  const repo = `${API}/repos/${GITHUB_REPO}`

  try {
    const removed = await deletePath(
      repo,
      token,
      `${ARTICLES_DIR}/${slug}.json`,
      `content: delete article "${slug}"`
    )
    if (!removed) {
      return NextResponse.json({ error: 'Article not found on GitHub.' }, { status: 404 })
    }

    // Best-effort: remove the hero image(s) that share the slug.
    try {
      const list = await fetch(`${repo}/contents/${IMAGE_DIR}?ref=${GITHUB_BRANCH}`, {
        headers: headers(token),
        cache: 'no-store',
      })
      if (list.ok) {
        const entries = (await list.json()) as { name: string }[]
        for (const e of entries) {
          if (e.name.startsWith(`${slug}.`)) {
            await deletePath(repo, token, `${IMAGE_DIR}/${e.name}`, `content: delete hero for "${slug}"`)
          }
        }
      }
    } catch {
      /* image cleanup is best-effort */
    }

    refreshBlog(slug)

    return NextResponse.json({
      ok: true,
      slug,
      message: 'Deleted from GitHub.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not reach GitHub. Please try again.' },
      { status: 502 }
    )
  }
}
