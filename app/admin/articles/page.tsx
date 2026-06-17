import Link from 'next/link'
import { getPosts } from '@/lib/blog'

export const revalidate = 30

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
  const all = (await getPosts({ includeUnpublished: true })).map((p) => ({
    ...p,
    status: p.published ? ('published' as const) : ('draft' as const),
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
        <ul className="art-list">
          {list.map((p) => (
            <li className="art-row-item" key={p.slug}>
              <div>
                <h2>{p.title}</h2>
                <p className="art-row-meta">
                  {p.dateLabel} · {p.readMinutes} min read · /blog/{p.slug}
                </p>
              </div>
              <div className="art-row-side">
                <span className="art-badge">{p.status}</span>
                <Link href={`/blog/${p.slug}`} target="_blank" className="art-view">View →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
