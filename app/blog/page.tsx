import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { posts } from '@/lib/blog'
import { business } from '@/lib/business'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Blog — Cabinetry & Woodworking Guides',
  description:
    'Guides and tips on custom cabinetry, kitchen design, wood species, and countertops from Marina Woodcrafts Design Inc. in Woodland Hills, CA.',
  alternates: { canonical: '/blog' },
  keywords: [
    'custom cabinetry blog',
    'kitchen cabinet guides Woodland Hills',
    'wood species for cabinets',
    'countertop buying guide Los Angeles',
  ],
  openGraph: {
    title: 'Blog — Marina Woodcrafts Design Inc.',
    description:
      'Practical guides on custom cabinetry, kitchen design, and countertops in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Marina Woodcrafts Design Inc. Blog',
    description:
      'Guides on custom cabinetry, kitchen design, wood species, and countertops in Woodland Hills, CA.',
    publisher: { '@type': 'HomeAndConstructionBusiness', name: business.legalName },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      author: { '@type': 'Organization', name: p.author },
      url: `https://marinawoodcraft.com/blog/${p.slug}`,
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">Journal</Reveal>
          <Reveal as="h1" className="section-title">
            Guides &amp; ideas<br />for your home.
          </Reveal>
          <Reveal className="line-divider" />
          <Reveal as="p" className="about-lead reveal-delay-1">
            Practical advice on custom cabinetry, kitchen and bathroom design, wood species, and
            countertops — written by the team at Marina Woodcrafts Design Inc. in Woodland Hills, CA.
          </Reveal>

          <div className="blog-list">
            {posts.map((post, i) => (
              <Reveal
                as="article"
                key={post.slug}
                className={`blog-card${i === 0 ? '' : ' reveal-delay-1'}`}
              >
                <Link href={`/blog/${post.slug}`} className="blog-card-media">
                  <Image
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    className="blog-card-img"
                    sizes="(max-width: 900px) 100vw, 420px"
                    priority={i === 0}
                  />
                </Link>
                <div className="blog-card-body">
                  <p className="blog-card-meta">
                    {post.dateLabel} · {post.readMinutes} min read
                  </p>
                  <h2 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="blog-card-link">
                    Read article
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
