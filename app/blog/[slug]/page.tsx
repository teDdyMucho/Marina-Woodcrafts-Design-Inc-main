import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { posts, getPost } from '@/lib/blog'
import { business } from '@/lib/business'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.keywords,
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
  const post = getPost(slug)
  if (!post) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://marinawoodcraft.com${post.heroImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
      telephone: business.phone,
    },
    mainEntityOfPage: `https://marinawoodcraft.com/blog/${post.slug}`,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap blog-article">
          <Reveal as="p" className="eyebrow">
            <Link href="/blog" className="blog-back">Journal</Link>
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
            <Reveal as="p" className="blog-article-lead">{post.intro}</Reveal>
            {post.sections.map((s) => (
              <Reveal as="section" key={s.heading} className="blog-section">
                <h2 className="blog-section-title">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            ))}

            {post.faq.length > 0 && (
              <Reveal as="section" className="blog-section">
                <h2 className="blog-section-title">Frequently Asked Questions</h2>
                {post.faq.map((f) => (
                  <div className="blog-faq-item" key={f.question}>
                    <h3 className="blog-faq-q">{f.question}</h3>
                    <p className="blog-faq-a">{f.answer}</p>
                  </div>
                ))}
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
