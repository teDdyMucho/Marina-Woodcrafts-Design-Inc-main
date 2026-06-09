import type { Metadata } from 'next'
import { services } from '@/lib/services'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Our Services — Custom Cabinetry & Woodwork',
  description:
    'Custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops in Woodland Hills, CA. 25+ years of precision craftsmanship.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — Marina Woodcrafts Design Inc.',
    description: 'Custom woodcraft services in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function ServicesPage() {
  return (
    <main>
      <section id="services" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">What We Do</Reveal>
          <Reveal as="h1" className="section-title">
            Craftsmanship in<br />every detail.
          </Reveal>
          <Reveal className="line-divider" />

          <div className="services-grid" style={{ marginTop: '48px' }}>
            {services.map((svc, i) => (
              <ServiceCard
                key={svc.slug}
                service={svc}
                delayClass={i === 0 ? '' : `reveal-delay-${Math.min(i, 3)}`}
              />
            ))}
          </div>

          <Reveal as="p" className="services-disclaimer reveal-delay-1" style={{ marginTop: '40px' }}>
            Pricing available upon request depending on design, materials, and project scope.
          </Reveal>
        </div>
      </section>
    </main>
  )
}
