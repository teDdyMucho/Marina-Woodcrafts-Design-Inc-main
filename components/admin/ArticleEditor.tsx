'use client'

import { useState } from 'react'

export interface DraftSection {
  heading: string
  body: string // paragraphs separated by blank lines
}
export interface DraftFaq {
  question: string
  answer: string
}
export interface ArticleDraft {
  title: string
  slug: string
  excerpt: string
  intro: string
  sections: DraftSection[]
  faq: DraftFaq[]
  keywords: string
  status: string
  /** Hero image, uploaded as base64 — your workflow stores it and sets the final URL. */
  heroImageName?: string
  heroImageType?: string
  heroImageData?: string // base64, no data: prefix
}

export const EMPTY_DRAFT: ArticleDraft = {
  title: '',
  slug: '',
  excerpt: '',
  intro: '',
  sections: [{ heading: '', body: '' }],
  faq: [{ question: '', answer: '' }],
  keywords: '',
  status: 'draft',
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
  const [draft, setDraft] = useState<ArticleDraft>(initial)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug))
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

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

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setMessage('')
    try {
      const payload = {
        ...draft,
        keywords: draft.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        sections: draft.sections
          .filter((s) => s.heading.trim() || s.body.trim())
          .map((s) => ({
            heading: s.heading.trim(),
            paragraphs: s.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
          })),
        faq: draft.faq.filter((f) => f.question.trim() && f.answer.trim()),
      }
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error ?? 'Save failed')
      setStatus('saved')
      setMessage(
        json.message ??
          'Published to GitHub. It will appear on the blog within about a minute.'
      )
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <form className="art-editor" onSubmit={save}>
      <div className="art-field">
        <label>Cover / hero image</label>
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
              <span className="art-dropzone-hint">JPG, PNG, or WebP</span>
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

      <div className="art-field">
        <label htmlFor="art-title">Title</label>
        <input id="art-title" value={draft.title} onChange={(e) => onTitle(e.target.value)} required />
      </div>

      <div className="art-row">
        <div className="art-field">
          <label htmlFor="art-slug">Slug</label>
          <input
            id="art-slug"
            value={draft.slug}
            onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }}
            required
          />
        </div>
        <div className="art-field">
          <label htmlFor="art-status">Status</label>
          <select id="art-status" value={draft.status} onChange={(e) => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="art-field">
        <label htmlFor="art-excerpt">Excerpt</label>
        <textarea id="art-excerpt" rows={2} value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} required />
      </div>

      <div className="art-field">
        <label htmlFor="art-intro">Intro</label>
        <textarea id="art-intro" rows={3} value={draft.intro} onChange={(e) => set('intro', e.target.value)} />
      </div>

      <div className="art-field">
        <label>Sections</label>
        {draft.sections.map((s, i) => (
          <div className="art-block" key={i}>
            <input
              placeholder="Section heading"
              value={s.heading}
              onChange={(e) => {
                const sections = [...draft.sections]
                sections[i] = { ...sections[i], heading: e.target.value }
                set('sections', sections)
              }}
            />
            <textarea
              placeholder="Paragraphs (separate with a blank line)"
              rows={4}
              value={s.body}
              onChange={(e) => {
                const sections = [...draft.sections]
                sections[i] = { ...sections[i], body: e.target.value }
                set('sections', sections)
              }}
            />
            {draft.sections.length > 1 && (
              <button type="button" className="art-remove" onClick={() => set('sections', draft.sections.filter((_, j) => j !== i))}>
                Remove section
              </button>
            )}
          </div>
        ))}
        <button type="button" className="art-add" onClick={() => set('sections', [...draft.sections, { heading: '', body: '' }])}>
          + Add section
        </button>
      </div>

      <div className="art-field">
        <label>FAQ</label>
        {draft.faq.map((f, i) => (
          <div className="art-block" key={i}>
            <input
              placeholder="Question"
              value={f.question}
              onChange={(e) => {
                const faq = [...draft.faq]
                faq[i] = { ...faq[i], question: e.target.value }
                set('faq', faq)
              }}
            />
            <textarea
              placeholder="Answer"
              rows={2}
              value={f.answer}
              onChange={(e) => {
                const faq = [...draft.faq]
                faq[i] = { ...faq[i], answer: e.target.value }
                set('faq', faq)
              }}
            />
            {draft.faq.length > 1 && (
              <button type="button" className="art-remove" onClick={() => set('faq', draft.faq.filter((_, j) => j !== i))}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="art-add" onClick={() => set('faq', [...draft.faq, { question: '', answer: '' }])}>
          + Add FAQ
        </button>
      </div>

      <div className="art-field">
        <label htmlFor="art-keywords">Keywords (comma-separated)</label>
        <input id="art-keywords" value={draft.keywords} onChange={(e) => set('keywords', e.target.value)} />
      </div>

      {message && <p className={`art-msg ${status === 'error' ? 'art-msg-error' : 'art-msg-ok'}`}>{message}</p>}

      <button type="submit" className="btn btn-solid" disabled={status === 'saving'}>
        {status === 'saving' ? 'Uploading…' : 'Upload article'}
      </button>
    </form>
  )
}
