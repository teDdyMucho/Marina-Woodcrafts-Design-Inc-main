import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPost } from '@/lib/blog'
import { business } from '@/lib/business'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ slug: string }> }

// Read live from GitHub; refresh within ~60s of a commit (no redeploy needed).
export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.heroImage }],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleBody: post.paragraphs.join('\n\n'),
    image: post.heroImage.startsWith('http')
      ? post.heroImage
      : `https://www.marinawoodcrafts.com${post.heroImage}`,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category || undefined,
    keywords: post.tags.length ? post.tags.join(', ') : undefined,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
      telephone: business.phone,
    },
    mainEntityOfPage: `https://www.marinawoodcrafts.com/blog/${post.slug}`,
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap blog-article">
          <Reveal as="p" className="eyebrow">
            <Link href="/blog" className="blog-back">Journal</Link>
            {post.category ? ` · ${post.category}` : ''}
          </Reveal>
          <Reveal as="h1" className="section-title blog-article-title">{post.title}</Reveal>
          <Reveal as="p" className="blog-article-meta reveal-delay-1">
            {post.dateLabel} · {post.readMinutes} min read · {post.author}
          </Reveal>

          <Reveal className="blog-article-hero reveal-delay-1">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="blog-article-img"
              sizes="(max-width: 1100px) 100vw, 1100px"
              priority
            />
          </Reveal>

          <div className="blog-article-body">
            {post.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} className={i === 0 ? 'blog-article-lead' : undefined}>
                {p}
              </Reveal>
            ))}

            {post.tags.length > 0 && (
              <Reveal className="blog-article-tags reveal-delay-1">
                {post.tags.map((t) => (
                  <span className="blog-article-tag" key={t}>{t}</span>
                ))}
              </Reveal>
            )}

            {post.url && (
              <Reveal as="p" className="blog-article-ref">
                Reference:{' '}
                <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a>
              </Reveal>
            )}

            <Reveal className="blog-cta reveal-delay-1">
              <p>Planning a project in Woodland Hills or the greater Los Angeles area?</p>
              <Link href="/contact" className="btn btn-solid">Request a Free Consultation</Link>
            </Reveal>
          </div>
        </div>
      </article>
    </main>
  )
}
