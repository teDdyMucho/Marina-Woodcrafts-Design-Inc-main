import { ArticleEditor } from '@/components/admin/ArticleEditor'

export const metadata = {
  title: 'Write Article — Admin',
  robots: { index: false, follow: false },
}

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  intro: '',
  sections: [{ heading: '', body: '' }],
  faq: [{ question: '', answer: '' }],
  keywords: '',
  status: 'draft',
}

export default function NewArticlePage() {
  return (
    <section className="admin-page admin-form-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Content</p>
        <h1>Upload an article</h1>
        <p className="admin-sub">Write the article, add a hero image, then upload it to your workflow.</p>
      </div>
      <ArticleEditor initial={EMPTY} />
    </section>
  )
}
