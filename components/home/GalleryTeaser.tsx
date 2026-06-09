import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

const CATEGORIES = [
  { slug: 'bathroom', name: 'Bathroom Vanities', img: '/Gallery/Bathroom%20Vanities/1.png' },
  { slug: 'kitchen', name: 'Kitchen Cabinetry', img: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png' },
  { slug: 'bedroom', name: 'Bedroom Closets & Storage', img: '/Gallery/Bedroom%20Closets%20&%20Storage/1.png' },
  { slug: 'living', name: 'Living Area Cabinet & Shelves', img: '/Gallery/Living-Area-Cabinet-Shelves/1.png' },
]

export function GalleryTeaser() {
  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <div className="gallery-meta">
          <div>
            <Reveal as="p" className="eyebrow eyebrow-light">Portfolio</Reveal>
            <Reveal as="h2" className="section-title section-title-light">Our Work</Reveal>
            <Reveal className="line-divider line-divider-light" />
          </div>
          <Reveal>
            <Link href="/gallery" className="btn btn-outline-light">View Full Gallery</Link>
          </Reveal>
        </div>
        <div className="gallery-grid">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} className={`g-item${i === 0 ? '' : ` reveal-delay-${Math.min(i, 3)}`}`}>
              <Link href={`/gallery/${cat.slug}`} style={{ display: 'contents' }}>
                <Image src={cat.img} alt={cat.name} fill className="g-thumb" sizes="(max-width: 900px) 100vw, 33vw" />
                <div className="g-item-label">
                  <div className="g-item-name">{cat.name}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
