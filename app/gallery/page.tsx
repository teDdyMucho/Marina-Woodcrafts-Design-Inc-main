import type { Metadata } from 'next'
import { GalleryCollections } from '@/components/gallery/GalleryCollections'
import { Reveal } from '@/components/ui/Reveal'
import { categories } from '@/lib/gallery'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Gallery — Our Work',
  description:
    'Browse our portfolio of custom kitchen cabinetry, bathroom vanities, closets, and living area built-ins. 100+ projects completed in Woodland Hills, CA.',
  alternates: { canonical: '/gallery' },
  keywords: [
    'custom cabinetry portfolio Woodland Hills',
    'kitchen cabinetry gallery Los Angeles',
    'bathroom vanity projects',
    'custom closet gallery',
    'built-in bookcases portfolio',
  ],
  openGraph: {
    title: 'Portfolio Gallery — Marina Woodcrafts Design Inc.',
    description: 'Custom woodwork and cabinetry in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function GalleryPage() {
  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portfolio Gallery — Marina Woodcrafts Design Inc.',
    description:
      'Portfolio of custom cabinetry and woodworking projects by Marina Woodcrafts Design Inc. in Woodland Hills, CA.',
    about: { '@type': 'HomeAndConstructionBusiness', name: business.legalName },
    hasPart: categories.map((c) => ({
      '@type': 'ImageGallery',
      name: c.name,
      description: c.details.join(' '),
      url: `https://marinawoodcraft.com/gallery/${c.slug}`,
      numberOfItems: c.photos.length,
    })),
  }

  return (
    <main className="gallery-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      <section id="gallery" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <div className="gallery-meta">
            <div>
              <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
              <Reveal as="h1" className="section-title section-title-light">Our Work</Reveal>
              <Reveal className="line-divider line-divider-light" />
            </div>
          </div>

          <GalleryCollections />
        </div>
      </section>
    </main>
  )
}
