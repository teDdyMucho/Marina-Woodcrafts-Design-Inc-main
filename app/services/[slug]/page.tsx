import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { services, getService } from '@/lib/services'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const svc = getService(slug)
  if (!svc) return {}
  return {
    title: `${svc.title} in Woodland Hills, CA`,
    description: `${svc.summary} Serving Woodland Hills and the greater Los Angeles area. 25+ years of experience.`,
    alternates: { canonical: `/services/${svc.slug}` },
    openGraph: {
      title: `${svc.title} | Marina Woodcrafts Design Inc.`,
      description: svc.summary,
      images: [{ url: svc.heroImage }],
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const svc = getService(slug)
  if (!svc) notFound()

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.title,
    description: svc.summary,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
      },
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 34.1684, longitude: -118.5989 },
      geoRadius: '50000',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: svc.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="section" style={{ paddingTop: '140px', paddingBottom: '0' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">{`0${services.findIndex(s => s.slug === svc.slug) + 1} / 0${services.length}`}</Reveal>
          <Reveal as="h1" className="section-title">{svc.title}</Reveal>
          <Reveal className="line-divider" />
        </div>
      </section>

      <section style={{ position: 'relative', width: '100%', height: '420px', marginBottom: '0' }}>
        <Image
          src={svc.heroImage}
          alt={svc.title}
          fill
          className="g-thumb"
          sizes="100vw"
          priority
        />
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: '680px' }}>
            <Reveal as="p" className="reveal-delay-1" style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              {svc.body}
            </Reveal>
            <Reveal className="reveal-delay-2" style={{ marginTop: '32px' }}>
              <Link href="/contact" className="btn btn-solid">Start a Project</Link>
              <Link href="/services" className="btn btn-outline-dark" style={{ marginLeft: '12px' }}>All Services</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {svc.faq.length > 0 && (
        <section className="section" style={{ paddingTop: '0' }}>
          <div className="wrap">
            <Reveal as="h2" className="section-title" style={{ fontSize: '1.6rem' }}>
              Frequently Asked Questions
            </Reveal>
            <Reveal className="line-divider" />
            <div style={{ marginTop: '32px', maxWidth: '680px' }}>
              {svc.faq.map((item, i) => (
                <Reveal key={i} className={i === 0 ? '' : 'reveal-delay-1'} style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.1rem', marginBottom: '8px' }}>
                    {item.question}
                  </h3>
                  <p style={{ lineHeight: 1.7, opacity: 0.85 }}>{item.answer}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
