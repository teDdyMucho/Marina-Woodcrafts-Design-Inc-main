import { notFound } from 'next/navigation'
import { getPost } from '@/lib/blog'
import { ArticleEditor, type ArticleDraft } from '@/components/admin/ArticleEditor'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edit article — Admin',
  robots: { index: false, follow: false },
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const initial: ArticleDraft = {
    title: post.title,
    slug: post.slug,
    url: post.url,
    category: post.category,
    readMinutes: post.readMinutes ? String(post.readMinutes) : '',
    tags: post.tags,
    excerpt: post.excerpt,
    body: post.body,
    publishedDate: post.date,
    featured: post.featured,
    published: post.published,
    existingHeroImage: post.heroImage,
  }

  return (
    <section className="admin-page admin-form-page">
      <div className="admin-page-head">
        <p className="admin-eyebrow">Content · Edit</p>
        <h1>Edit article</h1>
        <p className="admin-sub">Update the fields below and save. Changes commit straight to the blog.</p>
      </div>
      <ArticleEditor initial={initial} editing />
    </section>
  )
}
