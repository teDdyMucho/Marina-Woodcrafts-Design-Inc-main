import Link from 'next/link'
import { getPosts, postStatus } from '@/lib/blog'
import { ArticleListClient } from '@/components/admin/ArticleListClient'

// Always read live from GitHub so deletes/creates show immediately (no wait).
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Articles — Admin',
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, string> = {
  all: 'All articles',
  draft: 'Drafts',
  review: 'In Review',
  scheduled: 'Scheduled',
  published: 'Published',
  retired: 'Archive',
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const active = status ?? 'all'

  // Includes drafts (published: false) so the admin can see everything.
  const all = (await getPosts({ includeUnpublished: true, fresh: true })).map((p) => ({
    ...p,
    status: postStatus(p),
  }))
  const list = active === 'all' ? all : all.filter((p) => p.status === active)

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Content · {STATUS_LABELS[active] ?? 'Articles'}</p>
        <h1>Articles</h1>
        <p className="admin-sub">
          Articles you upload here appear on the blog. Write the article, add a hero image, and
          upload it to your workflow. Use the sidebar to filter by status.
        </p>
      </div>

      <div className="art-actions">
        <Link href="/admin/articles/new" className="btn btn-solid">Upload an article</Link>
      </div>

      {list.length === 0 ? (
        <p className="admin-note">No articles with this status yet.</p>
      ) : (
        <ArticleListClient
          articles={list.map((p) => ({
            slug: p.slug,
            title: p.title,
            dateLabel: p.dateLabel,
            readMinutes: p.readMinutes,
            status: p.status,
          }))}
        />
      )}
    </section>
  )
}
