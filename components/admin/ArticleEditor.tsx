'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressModal } from './AdminModal'

export interface ArticleDraft {
  title: string
  slug: string
  url: string
  category: string
  readMinutes: string // kept as string for the input; '' = auto from body
  tags: string[]
  excerpt: string
  body: string // full article; blank line separates paragraphs
  publishedDate: string // yyyy-mm-dd
  featured: boolean
  published: boolean
  /** Hero image, uploaded as base64 — committed to GitHub on save. */
  heroImageName?: string
  heroImageType?: string
  heroImageData?: string // base64, no data: prefix
}

export const EMPTY_DRAFT: ArticleDraft = {
  title: '',
  slug: '',
  url: '',
  category: '',
  readMinutes: '',
  tags: [],
  excerpt: '',
  body: '',
  publishedDate: '',
  featured: false,
  published: true,
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function ArticleEditor({ initial }: { initial: ArticleDraft }) {
  const router = useRouter()
  const [draft, setDraft] = useState<ArticleDraft>(initial)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [tagInput, setTagInput] = useState('')

  function set<K extends keyof ArticleDraft>(key: K, value: ArticleDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function onTitle(value: string) {
    setDraft((d) => ({ ...d, title: value, slug: slugTouched ? d.slug : slugify(value) }))
  }

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result) // data:image/png;base64,XXXX
      const comma = dataUrl.indexOf(',')
      const meta = dataUrl.slice(0, comma)
      const base64 = dataUrl.slice(comma + 1)
      const mime = meta.match(/data:(.*);base64/)?.[1] ?? file.type
      setHeroPreview(dataUrl)
      setDraft((d) => ({
        ...d,
        heroImageName: file.name,
        heroImageType: mime,
        heroImageData: base64,
      }))
    }
    reader.readAsDataURL(file)
  }

  function onHeroInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function clearHero() {
    setHeroPreview(null)
    setDraft((d) => ({ ...d, heroImageName: undefined, heroImageType: undefined, heroImageData: undefined }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (!t) return
    if (!draft.tags.includes(t)) set('tags', [...draft.tags, t])
    setTagInput('')
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !tagInput && draft.tags.length) {
      set('tags', draft.tags.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    set('tags', draft.tags.filter((t) => t !== tag))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMessage('')
    try {
      const payload = {
        title: draft.title.trim(),
        slug: draft.slug.trim(),
        url: draft.url.trim(),
        category: draft.category.trim(),
        readMinutes: draft.readMinutes.trim() ? Number(draft.readMinutes) : undefined,
        tags: draft.tags,
        excerpt: draft.excerpt.trim(),
        body: draft.body,
        publishedDate: draft.publishedDate,
        featured: draft.featured,
        published: draft.published,
        heroImageName: draft.heroImageName,
        heroImageType: draft.heroImageType,
        heroImageData: draft.heroImageData,
      }
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? 'Save failed')
      // Success — keep the blocking modal up and move to the list. The modal
      // unmounts as the new page renders, so it never looks cancelable.
      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <form className="art-editor" onSubmit={save}>
      <ProgressModal
        open={status === 'saving'}
        title="Publishing article…"
        message="Committing to GitHub. Please don't close this window."
      />
      {/* Cover image */}
      <div className="art-field">
        <label>Cover image</label>
        <label
          className={`art-dropzone${dragging ? ' dragging' : ''}${heroPreview ? ' has-image' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
          onDrop={onDrop}
        >
          <input type="file" accept="image/*" onChange={onHeroInput} hidden />
          {heroPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroPreview} alt="Cover preview" className="art-dropzone-preview" />
              <span className="art-dropzone-overlay">Drop or click to replace</span>
            </>
          ) : (
            <>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="art-dropzone-main">
                Upload cover image — drag &amp; drop or <strong>browse</strong>
              </span>
              <span className="art-dropzone-hint">JPG, PNG, WebP · max 5 MB</span>
            </>
          )}
        </label>
        {draft.heroImageName && (
          <span className="art-hero-name">
            {draft.heroImageName}
            <button type="button" className="art-hero-clear" onClick={clearHero}>Remove</button>
          </span>
        )}
      </div>

      {/* Title */}
      <div className="art-field">
        <label htmlFor="art-title">Title</label>
        <input id="art-title" placeholder="Post title" value={draft.title} onChange={(e) => onTitle(e.target.value)} required />
      </div>

      {/* Slug */}
      <div className="art-field">
        <label htmlFor="art-slug">Slug</label>
        <input
          id="art-slug"
          placeholder="post-url-slug"
          value={draft.slug}
          onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }}
          required
        />
        <span className="art-help">Public URL: /blog/{draft.slug || '…'}</span>
      </div>

      {/* URL (external / reference) */}
      <div className="art-field">
        <label htmlFor="art-url">URL</label>
        <input id="art-url" type="url" placeholder="https://example.com/article" value={draft.url} onChange={(e) => set('url', e.target.value)} />
        <span className="art-help">External or reference URL saved with this post (optional)</span>
      </div>

      {/* Category + Read time */}
      <div className="art-row">
        <div className="art-field">
          <label htmlFor="art-category">Category</label>
          <input id="art-category" placeholder="e.g. Kitchen Design" value={draft.category} onChange={(e) => set('category', e.target.value)} />
        </div>
        <div className="art-field">
          <label htmlFor="art-read">Read time</label>
          <input id="art-read" type="number" min={1} placeholder="8 min read" value={draft.readMinutes} onChange={(e) => set('readMinutes', e.target.value)} />
        </div>
      </div>

      {/* Tags */}
      <div className="art-field">
        <label htmlFor="art-tags">Tags</label>
        <div className="art-tags">
          {draft.tags.map((t) => (
            <span className="art-tag" key={t}>
              {t}
              <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>×</button>
            </span>
          ))}
          <input
            id="art-tags"
            className="art-tag-input"
            placeholder="Add a tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={onTagKeyDown}
            onBlur={addTag}
          />
        </div>
        <span className="art-help">Press Enter or comma to add a tag</span>
      </div>

      {/* Excerpt */}
      <div className="art-field">
        <label htmlFor="art-excerpt">Excerpt</label>
        <textarea id="art-excerpt" rows={2} placeholder="Short summary shown on the blog cards…" value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} required />
      </div>

      {/* Body */}
      <div className="art-field">
        <label htmlFor="art-body">Body</label>
        <textarea id="art-body" rows={14} placeholder={'Write the full article here.\n\n# Heading\n## Sub-heading\n### Smaller heading\n– Bullet point (en dash)\n— Divider line (em dash)\n\nSeparate paragraphs with a blank line.'} value={draft.body} onChange={(e) => set('body', e.target.value)} required />
        <span className="art-help">
          Formatting: <strong># </strong>heading · <strong>## </strong>sub-heading · <strong>### </strong>smaller heading · <strong>– </strong>(en dash) bullet · <strong>—</strong> (em dash) divider · blank line = new paragraph.
        </span>
      </div>

      {/* Published date + toggles */}
      <div className="art-publish-row">
        <div className="art-field art-field-date">
          <label htmlFor="art-date">Published date</label>
          <input id="art-date" type="date" value={draft.publishedDate} onChange={(e) => set('publishedDate', e.target.value)} />
        </div>
        <div className="art-toggles">
          <label className="art-toggle">
            <input type="checkbox" checked={draft.featured} onChange={(e) => set('featured', e.target.checked)} />
            <span className="art-toggle-track"><span className="art-toggle-knob" /></span>
            Featured
          </label>
          <label className="art-toggle">
            <input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} />
            <span className="art-toggle-track"><span className="art-toggle-knob" /></span>
            Published
          </label>
        </div>
      </div>

      {message && <p className={`art-msg ${status === 'error' ? 'art-msg-error' : 'art-msg-ok'}`}>{message}</p>}

      <div className="art-submit-row">
        <button type="submit" className="btn btn-solid" disabled={status === 'saving'}>
          {status === 'saving' ? 'Creating…' : 'Create post'}
        </button>
      </div>
    </form>
  )
}
