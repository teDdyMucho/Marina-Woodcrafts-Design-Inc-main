import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'About Us — Our Story & Craftsmanship',
  description:
    'Marina Woodcrafts Design Inc. is a custom cabinetry and woodworking company in Woodland Hills, CA with 25+ years of experience building custom kitchens, bathroom vanities, closets, bookcases, and countertops across the greater Los Angeles area.',
  alternates: { canonical: '/about' },
  keywords: [
    'custom cabinetry Woodland Hills',
    'custom kitchen cabinets Los Angeles',
    'bathroom vanities Woodland Hills',
    'custom closets San Fernando Valley',
    'built-in bookcases Los Angeles',
    'countertop installation Woodland Hills',
    'woodworking company Los Angeles',
  ],
  openGraph: {
    title: 'About Marina Woodcrafts Design Inc. — Custom Cabinetry in Woodland Hills, CA',
    description:
      '25+ years of handcrafted custom cabinetry, vanities, closets, built-ins, and countertops in Woodland Hills and the greater Los Angeles area.',
    images: [{ url: '/Background.jpg' }],
  },
}

// FAQ content — kept here so it powers both the visible section and the
// FAQPage structured data below (high-value for AI answer engines / AEO).
const faqs = [
  {
    question: 'What does Marina Woodcrafts Design Inc. specialize in?',
    answer:
      'We specialize in custom cabinetry and woodworking — including custom kitchen cabinetry, bathroom vanities, closets and storage systems, bookcases and built-ins, and countertop supply and installation. Every piece is designed for your space and handcrafted in our Woodland Hills, CA workshop.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'Our workshop is in Woodland Hills, California, and we offer free in-home consultations throughout the San Fernando Valley and the greater Los Angeles area — including Calabasas, Tarzana, Encino, Sherman Oaks, and surrounding communities.',
  },
  {
    question: 'How long has Marina Woodcrafts been in business?',
    answer:
      'We have more than 25 years of experience and have completed over 100 custom woodworking projects. Every project is 100% handcrafted.',
  },
  {
    question: 'Do you offer free consultations?',
    answer:
      'Yes. We offer a free in-home consultation to measure your space, discuss design options and materials, and provide a transparent estimate before any work begins.',
  },
  {
    question: 'What materials do you build with?',
    answer:
      'We build with solid hardwoods such as maple, alder, cherry, oak, and walnut, using plywood or solid-wood box construction — never particle board. For countertops we supply and install granite, quartz (Caesarstone, Silestone, MSI), and butcher block.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Timelines depend on scope: most custom kitchens are completed in 3–5 weeks from design sign-off, bathroom vanities in 2–3 weeks, and closet systems in 1–2 weeks.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Free Consultation',
    body: 'We visit your home, measure your space, and discuss design, materials, and budget — at no cost and with no obligation.',
  },
  {
    num: '02',
    title: 'Design & Estimate',
    body: 'We translate your needs into a detailed design and a clear, transparent estimate before any work begins.',
  },
  {
    num: '03',
    title: 'Handcrafted Build',
    body: 'Each cabinet, vanity, and built-in is hand-built from solid hardwoods and quality plywood in our Woodland Hills workshop.',
  },
  {
    num: '04',
    title: 'Precision Installation',
    body: 'Our team installs on-site with careful fitting and finishing. Most projects are completed within 1–5 weeks.',
  },
]

export default function AboutPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Marina Woodcrafts Design Inc.',
    description:
      'Custom cabinetry and woodworking company in Woodland Hills, CA with 25+ years of experience serving the greater Los Angeles area.',
    mainEntity: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
      telephone: business.phone,
      email: business.email,
      areaServed: ['Woodland Hills', 'San Fernando Valley', 'Greater Los Angeles, CA'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
      },
      knowsAbout: [
        'Custom kitchen cabinetry',
        'Bathroom vanities',
        'Custom closets and storage',
        'Bookcases and built-ins',
        'Countertop installation',
      ],
    },
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section id="about" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">Our Story</Reveal>
          <Reveal as="h1" className="section-title">
            Crafted with tradition,<br />designed for today.
          </Reveal>
          <Reveal className="line-divider" />

          <div className="about-grid">
            <div className="about-body">
              <Reveal as="p" className="reveal-delay-1">
                Marina Woodcrafts Design Inc. is a custom cabinetry and woodworking company based
                in Woodland Hills, California. For more than 25 years we have designed, hand-built,
                and installed custom kitchens, bathroom vanities, closets, bookcases, and
                countertops for homeowners across the greater Los Angeles area and the San
                Fernando Valley.
              </Reveal>
              <Reveal as="p" className="reveal-delay-2">
                What began as a small workshop focused on bespoke cabinetry has grown into a
                trusted name for precision woodwork — known for solid-wood construction, refined
                design, and a finish quality built to last a lifetime. Every project is made to the
                exact dimensions of your space, never mass-produced.
              </Reveal>
              <Reveal as="p" className="reveal-delay-3">
                We believe the best work comes from listening carefully, measuring twice, and never
                cutting corners. From the first free in-home consultation to final installation,
                your project is handled by craftsmen who treat your home as their own — because your
                home deserves nothing less.
              </Reveal>
              <Reveal className="reveal-delay-3" style={{ marginTop: '28px' }}>
                <Link href="/services" className="btn btn-solid">See Our Services</Link>
              </Reveal>
            </div>
            <Reveal className="about-img reveal-delay-1">
              <video autoPlay muted loop playsInline>
                <source src="/Our%20Story/Our%20Story.mp4" type="video/mp4" />
              </video>
            </Reveal>
          </div>

          <div className="about-stats">
            {business.stats.map((stat, i) => (
              <Reveal key={stat.label} className={i === 0 ? '' : `reveal-delay-${i}`}>
                <div className="stat-num">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Reveal>
            ))}
          </div>

          {/* Process */}
          <div className="about-block">
            <Reveal as="h2" className="about-block-title">
              How We Work — From Consultation to Installation
            </Reveal>
            <Reveal as="p" className="about-lead reveal-delay-1">
              A clear, four-step process keeps every project on time and on budget — with no
              surprises along the way.
            </Reveal>
            <ol className="about-steps">
              {steps.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.num}
                  className={`about-step${i === 0 ? '' : ` reveal-delay-${Math.min(i, 3)}`}`}
                >
                  <span className="about-step-num">{step.num}</span>
                  <h3 className="about-step-title">{step.title}</h3>
                  <p>{step.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Why us */}
          <div className="about-block">
            <Reveal as="h2" className="about-block-title">
              Why Homeowners in Woodland Hills Choose Us
            </Reveal>
            <div className="about-values">
              <Reveal className="about-value reveal-delay-1">
                <h3>25+ Years of Experience</h3>
                <p>
                  More than 100 completed custom woodworking projects across Woodland Hills and the
                  greater Los Angeles area.
                </p>
              </Reveal>
              <Reveal className="about-value reveal-delay-2">
                <h3>Solid, Honest Materials</h3>
                <p>
                  Maple, alder, cherry, oak, and walnut with plywood or solid-wood box construction
                  — never particle board, so your cabinetry lasts.
                </p>
              </Reveal>
              <Reveal className="about-value reveal-delay-3">
                <h3>Truly Custom</h3>
                <p>
                  Built to the exact dimensions of your space — including angled ceilings, knee
                  walls, and awkward alcoves that off-the-shelf cabinets can&rsquo;t handle.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Service area */}
          <div className="about-block">
            <Reveal as="h2" className="about-block-title">
              Serving Woodland Hills &amp; the Greater Los Angeles Area
            </Reveal>
            <Reveal as="p" className="about-lead reveal-delay-1">
              Our workshop is located at {business.address.streetAddress},{' '}
              {business.address.addressLocality}, {business.address.addressRegion}{' '}
              {business.address.postalCode}. We offer free in-home consultations throughout the San
              Fernando Valley and greater Los Angeles — including Calabasas, Tarzana, Encino,
              Sherman Oaks, and surrounding communities. Call{' '}
              <a href={business.phoneHref} className="about-inline-link">{business.phone}</a> to
              schedule yours.
            </Reveal>
          </div>

          {/* FAQ */}
          <div className="about-block">
            <Reveal as="h2" className="about-block-title">
              Frequently Asked Questions
            </Reveal>
            <div className="about-faq">
              {faqs.map((f, i) => (
                <Reveal
                  as="div"
                  key={f.question}
                  className={`about-faq-item${i === 0 ? '' : ' reveal-delay-1'}`}
                >
                  <h3 className="about-faq-q">{f.question}</h3>
                  <p className="about-faq-a">{f.answer}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="reveal-delay-1" style={{ marginTop: '36px' }}>
              <Link href="/contact" className="btn btn-solid">Request a Free Consultation</Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
