import type { Metadata } from 'next'
import Image from 'next/image'
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
  {
    question: 'How much do custom kitchen cabinets cost in Woodland Hills?',
    answer:
      'Custom kitchen cabinet pricing in Woodland Hills and the greater Los Angeles area depends on kitchen size, wood species, and finishes. As a general guide, entry-level custom kitchens start around $15,000–$25,000, mid-range projects run about $25,000–$45,000, and high-end kitchens with premium woods and specialty finishes can reach $45,000 or more. We provide a free, transparent estimate for your exact space before any work begins.',
  },
  {
    question: 'Are custom cabinets worth it compared to stock cabinets?',
    answer:
      'For most homeowners, yes. Stock cabinets are cheaper upfront but come in fixed sizes and often use particle board. Our custom cabinets are built to the exact dimensions of your space from solid hardwoods and quality plywood, so they fit perfectly, make full use of every inch, and last for decades — a better long-term value for your Woodland Hills home.',
  },
  {
    question: 'What is the difference between custom, semi-custom, and stock cabinets?',
    answer:
      'Stock cabinets are mass-produced in standard sizes from a catalog. Semi-custom cabinets start from stock sizes but allow some changes to finishes and dimensions. Fully custom cabinets — what we build — are made from scratch to the exact measurements of your space, with your choice of wood species, door style, and hardware. Custom delivers the best fit and quality, especially for kitchens with angled ceilings, islands, or unusual layouts.',
  },
  {
    question: 'Do you also build custom closets, bathroom vanities, and built-ins?',
    answer:
      'Yes. In addition to custom kitchen cabinets, we design and build custom bathroom vanities, walk-in and reach-in closet systems, bookcases, entertainment centers, and other built-ins — all handcrafted to fit your space. We also supply and install countertops in granite, quartz, and butcher block.',
  },
  {
    question: 'Do your custom cabinets come with a guarantee?',
    answer:
      'Yes. We stand behind our craftsmanship. Because every cabinet is hand-built from solid hardwoods and quality plywood — never particle board — it is made to last. If anything is not right with our workmanship, we make it right. Ask us for the details during your free in-home consultation.',
  },
]

// Founder interview — the questions double as natural-language headings (strong
// for SEO / AI answer engines), and drive the Person structured data below.
const founder = {
  name: 'Majid Mandi',
  role: 'Owner & Founder',
  photo: '/Our%20Story/profile.png',
}

const interview = [
  {
    question: 'Who is the owner of Marina Woodcrafts Design Inc.?',
    answer:
      'I’m Majid Mandi, the owner and founder of Marina Woodcrafts Design Inc. in Woodland Hills, California. I’m personally involved in every custom cabinetry project we take on — from the first in-home measurement to the final installation.',
  },
  {
    question: 'Why did you start Marina Woodcrafts?',
    answer:
      'It started with my passion for carpentry. I’ve spent my career working with wood, and I founded Marina Woodcrafts to build custom cabinets, vanities, and built-ins the right way — handcrafted, made to measure, and built to last — for homeowners across the greater Los Angeles area.',
  },
  {
    question: 'What makes Marina Woodcrafts different from other cabinet makers in Los Angeles?',
    answer:
      'Two things: excellent customer service and high-quality products. We take the time to listen and understand exactly what each client needs, then build every piece from solid hardwoods and quality plywood — no shortcuts, no particle board, and no compromise on materials or craftsmanship.',
  },
  {
    question: 'What values guide the way you work with clients?',
    answer:
      'Honesty, respect, reliability, and professionalism. Those four values shape every conversation, every estimate, and every project — from a single bathroom vanity to a complete custom kitchen. When we give you a price and a timeline, we stand behind both.',
  },
  {
    question: 'What do you want every client to feel after working with Marina Woodcrafts?',
    answer:
      '100% satisfied. I want every client to be proud of their new space and confident they made the right choice. That’s the standard we hold ourselves to on every single project — and it’s why so much of our work comes from repeat clients and referrals.',
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

  const founderJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: founder.name,
    jobTitle: founder.role,
    image: `https://marinawoodcraft.com${founder.photo}`,
    description:
      'Majid Mandi is the owner and founder of Marina Woodcrafts Design Inc., a custom cabinetry and woodworking company in Woodland Hills, CA. Driven by a lifelong passion for carpentry, he leads every project with a focus on honesty, quality, and 100% client satisfaction.',
    knowsAbout: ['Custom cabinetry', 'Carpentry', 'Woodworking', 'Kitchen cabinets'],
    worksFor: {
      '@type': 'HomeAndConstructionBusiness',
      name: business.legalName,
    },
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
      founder: { '@type': 'Person', name: founder.name, jobTitle: founder.role },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
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

          {/* Meet the Founder */}
          <div className="about-block">
            <Reveal as="h2" className="about-block-title">
              Meet the Founder
            </Reveal>
            <Reveal as="p" className="about-lead reveal-delay-1">
              Marina Woodcrafts Design Inc. is led by owner and founder{' '}
              <strong>{founder.name}</strong> — a craftsman whose lifelong passion for carpentry is
              behind every custom cabinet, vanity, and built-in we make.
            </Reveal>
            <div className="about-founder">
              <div className="about-founder-card">
                <Image
                  src={founder.photo}
                  alt={`${founder.name}, ${founder.role} of Marina Woodcrafts Design Inc.`}
                  width={1086}
                  height={1448}
                  className="about-founder-photo"
                  sizes="(max-width: 800px) 96px, 250px"
                />
                <span className="about-founder-name">{founder.name}</span>
                <span className="about-founder-role">{founder.role}</span>
              </div>
              <div className="about-interview">
                {interview.map((item, i) => (
                  <Reveal
                    as="div"
                    key={item.question}
                    className={`about-faq-item${i === 0 ? '' : ' reveal-delay-1'}`}
                  >
                    <h3 className="about-faq-q">{item.question}</h3>
                    <p className="about-faq-a">{item.answer}</p>
                  </Reveal>
                ))}
              </div>
            </div>
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
