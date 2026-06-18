'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ConfirmModal, ProgressModal } from './AdminModal'

export interface ArticleRow {
  slug: string
  title: string
  dateLabel: string
  readMinutes: number
  status: 'published' | 'draft'
}

export function ArticleListClient({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter()
  const [target, setTarget] = useState<ArticleRow | null>(null) // confirm dialog
  const [deleting, setDeleting] = useState(false) // progress modal
  const [error, setError] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Set<string>>(new Set()) // optimistic

  const visible = articles.filter((p) => !removed.has(p.slug))

  async function confirmDelete() {
    if (!target) return
    const slug = target.slug
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/articles?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? 'Delete failed')
      // Drop the row from the UI immediately, then reconcile with the server.
      setRemoved((prev) => new Set(prev).add(slug))
      setTarget(null)
      setDeleting(false)
      window.dispatchEvent(new Event('articles-changed'))
      router.refresh()
    } catch (e) {
      setDeleting(false)
      setTarget(null)
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <>
      {error && <p className="art-msg art-msg-error">{error}</p>}

      <ul className="art-list">
        {visible.map((p) => (
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
              <Link href={`/admin/articles/edit/${p.slug}`} className="art-edit">Edit</Link>
              <button
                type="button"
                className="art-delete"
                onClick={() => { setError(null); setTarget(p) }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={Boolean(target) && !deleting}
        title="Delete this article?"
        message={
          <>
            “{target?.title}” will be removed from GitHub and drop off the blog. This can’t be undone.
          </>
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />

      <ProgressModal
        open={deleting}
        title="Deleting article…"
        message="Committing the removal to GitHub. Please don't close this window."
      />
    </>
  )
}
