import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'About Us — Our Story & Craftsmanship',
  description:
    'Marina Woodcrafts Design Inc. has been delivering precision custom cabinetry and woodwork in Woodland Hills, CA for 25+ years. Learn about our story, values, and team.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Marina Woodcrafts Design Inc.',
    description: '25+ years of handcrafted cabinetry in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function AboutPage() {
  return (
    <main>
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
                Marina Woodcrafts Design Inc. was built on a passion for craftsmanship and
                high-quality woodworking. Founded in the Woodland Hills area of Los Angeles,
                the company started with a focus on delivering custom cabinetry solutions
                tailored to each client&rsquo;s unique space and needs.
              </Reveal>
              <Reveal as="p" className="reveal-delay-2">
                Over more than 25 years, we have grown into a trusted provider of custom kitchens,
                bathroom vanities, closets, bookcases, and countertops — known for precision,
                durability, and refined design. Every project is approached with attention to
                detail, ensuring both functionality and aesthetic value.
              </Reveal>
              <Reveal as="p" className="reveal-delay-3">
                We believe the best work comes from listening carefully, measuring twice, and
                never cutting corners. Our pieces are built to last a lifetime — because your
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
        </div>
      </section>
    </main>
  )
}
