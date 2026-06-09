import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/gallery'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Gallery — Our Work',
  description:
    'Browse our portfolio of custom kitchen cabinetry, bathroom vanities, closets, and living area built-ins. 100+ projects completed in Woodland Hills, CA.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Portfolio Gallery — Marina Woodcrafts Design Inc.',
    description: 'Custom woodwork and cabinetry in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function GalleryPage() {
  return (
    <main>
      <section id="gallery" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <div className="gallery-meta">
            <div>
              <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
              <Reveal as="h1" className="section-title section-title-light">Our Work</Reveal>
              <Reveal className="line-divider line-divider-light" />
            </div>
          </div>

          <div className="gallery-grid" style={{ marginTop: '40px' }}>
            {categories.map((cat, i) => (
              <Reveal
                key={cat.slug}
                className={`g-item${i === 0 ? '' : ` reveal-delay-${Math.min(i, 3)}`}`}
              >
                <Link href={`/gallery/${cat.slug}`} style={{ display: 'contents' }}>
                  <Image
                    src={cat.coverImage}
                    alt={cat.name}
                    fill
                    className="g-thumb"
                    sizes="(max-width: 900px) 100vw, 33vw"
                    priority={i === 0}
                  />
                  <div className="g-item-label">
                    <div className="g-item-name">{cat.name}</div>
                    <div className="g-item-hint">{cat.photos.length} photos</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
