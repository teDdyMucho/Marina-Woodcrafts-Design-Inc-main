import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPost, getPosts } from '@/lib/blog'
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

  // Other articles, newest first (by date), for the "More articles" grid below.
  const others = (await getPosts())
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)

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
        <div className="wrap">
         <div className="blog-article">
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
            {(() => {
              const leadIndex = post.blocks.findIndex((b) => b.type === 'p')
              return post.blocks.map((b, i) => {
                if (b.type === 'h2') return <Reveal as="h2" key={i} className="blog-body-h2">{b.text}</Reveal>
                if (b.type === 'h3') return <Reveal as="h3" key={i} className="blog-body-h3">{b.text}</Reveal>
                if (b.type === 'h4') return <Reveal as="h4" key={i} className="blog-body-h4">{b.text}</Reveal>
                if (b.type === 'hr') return <Reveal key={i} className="blog-body-hr" />
                if (b.type === 'ul') {
                  return (
                    <Reveal as="ul" key={i} className="blog-body-ul">
                      {b.items.map((it, j) => <li key={j}>{it}</li>)}
                    </Reveal>
                  )
                }
                return (
                  <Reveal as="p" key={i} className={i === leadIndex ? 'blog-article-lead' : undefined}>
                    {b.text}
                  </Reveal>
                )
              })
            })()}

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
        </div>
      </article>

      {others.length > 0 && (
        <section className="blog-more">
          <h2 className="blog-more-title">Latest articles</h2>
          <div className="blog-more-grid">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-more-card">
                <div className="blog-more-media">
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    className="blog-more-img"
                    sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 300px"
                  />
                </div>
                <h3 className="blog-more-card-title">{p.title}</h3>
                <p className="blog-more-date">{p.dateLabel}</p>
              </Link>
            ))}
          </div>
          <div className="blog-more-foot">
            <Link href="/blog" className="btn btn-outline-dark">All articles</Link>
          </div>
        </section>
      )}
    </main>
  )
}
