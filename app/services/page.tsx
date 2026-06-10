import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/lib/services'
import { business } from '@/lib/business'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Our Services — Custom Cabinetry & Woodwork in Woodland Hills, CA',
  description:
    'Custom kitchen cabinetry, bathroom vanities, closets and storage, bookcases and built-ins, and countertop installation in Woodland Hills, CA. 25+ years of precision craftsmanship serving the greater Los Angeles area.',
  alternates: { canonical: '/services' },
  keywords: [
    'custom kitchen cabinetry Woodland Hills',
    'bathroom vanities Los Angeles',
    'custom closets San Fernando Valley',
    'built-in bookcases Woodland Hills',
    'countertop installation Los Angeles',
    'granite quartz butcher block countertops',
    'custom woodworking Woodland Hills CA',
  ],
  openGraph: {
    title: 'Services — Marina Woodcrafts Design Inc.',
    description:
      'Custom kitchen cabinetry, vanities, closets, built-ins, and countertops handcrafted in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function ServicesPage() {
  const total = String(services.length).padStart(2, '0')

  // All service FAQs combined — one FAQPage block AI answer engines can cite.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: services.flatMap((s) =>
      s.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      }))
    ),
  }

  // Each offering as a Service entity, provided by the local business.
  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.summary,
        url: `https://marinawoodcraft.com/services/${s.slug}`,
        serviceType: s.title,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: business.legalName,
          telephone: business.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: business.address.streetAddress,
            addressLocality: business.address.addressLocality,
            addressRegion: business.address.addressRegion,
            postalCode: business.address.postalCode,
            addressCountry: business.address.addressCountry,
          },
        },
        areaServed: ['Woodland Hills', 'San Fernando Valley', 'Greater Los Angeles, CA'],
      },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section id="services" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">What We Do</Reveal>
          <Reveal as="h1" className="section-title">
            Craftsmanship in<br />every detail.
          </Reveal>
          <Reveal className="line-divider" />
          <Reveal as="p" className="about-lead reveal-delay-1">
            Marina Woodcrafts Design Inc. designs, hand-builds, and installs custom cabinetry and
            woodwork in Woodland Hills, CA and across the greater Los Angeles area. Below is what we
            build, the materials we use, and answers to the questions homeowners ask most — no
            click-throughs, everything in one place.
          </Reveal>

          <div className="services-detail-list">
            {services.map((svc, i) => (
              <article className="svc-detail" id={svc.slug} key={svc.slug}>
                <Reveal className="svc-detail-media">
                  <Image
                    src={svc.heroImage}
                    alt={`${svc.title} by Marina Woodcrafts Design Inc. in Woodland Hills, CA`}
                    fill
                    className="svc-detail-img"
                    sizes="(max-width: 900px) 100vw, 1100px"
                    priority={i === 0}
                  />
                </Reveal>

                <div className="svc-detail-cols">
                  <Reveal className="svc-detail-main">
                    <span className="svc-detail-num">{svc.num} / {total}</span>
                    <h2 className="svc-detail-title">{svc.title}</h2>
                    <p className="svc-detail-body">{svc.body}</p>
                  </Reveal>

                  {svc.faq.length > 0 && (
                    <Reveal className="svc-detail-faq reveal-delay-1">
                      <h3 className="svc-faq-heading">Frequently Asked Questions</h3>
                      {svc.faq.map((f) => (
                        <div className="svc-faq-item" key={f.question}>
                          <h4 className="svc-faq-q">{f.question}</h4>
                          <p className="svc-faq-a">{f.answer}</p>
                        </div>
                      ))}
                    </Reveal>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Reveal as="p" className="services-disclaimer reveal-delay-1" style={{ marginTop: '56px' }}>
            Pricing available upon request depending on design, materials, and project scope.
          </Reveal>

          <Reveal className="reveal-delay-1" style={{ marginTop: '28px' }}>
            <Link href="/contact" className="btn btn-solid">Request a Free Consultation</Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
