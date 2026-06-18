import { getPosts, postStatus } from '@/lib/blog'
import { AdminCalendar } from '@/components/admin/AdminCalendar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Articles Calendar — Admin',
  robots: { index: false, follow: false },
}

export default async function ArticlesCalendarPage() {
  const articles = (await getPosts({ includeUnpublished: true, fresh: true })).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    status: postStatus(p),
  }))
  const today = new Date().toISOString().slice(0, 7) // yyyy-mm

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Content · Calendar</p>
        <h1>Articles calendar</h1>
        <p className="admin-sub">
          See when each article is published. Click a highlighted day to view its articles.
        </p>
      </div>

      <AdminCalendar articles={articles} initialMonth={today} />
    </section>
  )
}
