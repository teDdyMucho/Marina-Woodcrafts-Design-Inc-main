import { ArticleEditor, type ArticleDraft } from '@/components/admin/ArticleEditor'

export const metadata = {
  title: 'New post — Admin',
  robots: { index: false, follow: false },
}

export default function NewArticlePage() {
  const today = new Date().toISOString().slice(0, 10)
  const initial: ArticleDraft = {
    title: '',
    slug: '',
    url: '',
    category: '',
    readMinutes: '',
    tags: [],
    excerpt: '',
    body: '',
    publishedDate: today,
    featured: false,
    published: true,
  }
  return (
    <section className="admin-page admin-form-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Content</p>
        <h1>New post</h1>
        <p className="admin-sub">Fill in the fields below and create the post. It publishes straight to the blog.</p>
      </div>
      <ArticleEditor initial={initial} />
    </section>
  )
}
