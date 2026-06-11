import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories, getCategory } from '@/lib/gallery'
import { business } from '@/lib/business'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ category: string }> }

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}

  return {
    title: `${cat.name} — Marina Woodcrafts Design Inc.`,
    description: cat.description,
    alternates: { canonical: `/gallery/${cat.slug}` },
    openGraph: {
      title: `${cat.name} — Marina Woodcrafts Design Inc.`,
      description: cat.description,
      images: [{ url: cat.coverImage }],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const imageObjects = cat.photos.slice(0, 8).map((photo) => ({
    '@type': 'ImageObject',
    contentUrl: `https://www.marinawoodcrafts.com${photo.src}`,
    description: photo.alt,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${cat.name} — Marina Woodcrafts Design Inc.`,
    description: cat.description,
    author: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
    },
    image: imageObjects,
  }

  return (
    <main className="gallery-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Section 1 — Hero / intro */}
      <section className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
          <Reveal as="h1" className="section-title section-title-light">{cat.name}</Reveal>
          <Reveal className="line-divider line-divider-light" />
          <Reveal as="p" className="reveal-delay-1" style={{ marginTop: '24px', maxWidth: '640px' }}>
            {cat.description}
          </Reveal>
          <Reveal className="reveal-delay-2" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link href="/gallery" className="btn btn-outline-light">All Collections</Link>
            <Link href="/contact" className="btn btn-solid">Start a Project</Link>
          </Reveal>
        </div>
      </section>

      {/* Section 2 — Photo grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ paddingTop: 0 }}>
          <GalleryGrid photos={cat.photos} />
        </div>
      </section>
    </main>
  )
}
