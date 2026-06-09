import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export function AboutTeaser() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Our Story</Reveal>
        <Reveal as="h2" className="section-title">
          Crafted with tradition,<br />designed for today.
        </Reveal>
        <Reveal className="line-divider" />

        <div className="about-grid">
          <div className="about-body">
            <Reveal as="p" className="reveal-delay-1">
              Marina Woodcrafts Design Inc was built on a passion for craftsmanship and high-quality woodworking.
              The company started with a focus on delivering custom cabinetry solutions tailored to each client&rsquo;s
              unique space and needs.
            </Reveal>
            <Reveal as="p" className="reveal-delay-2">
              Over time, it has grown into a trusted provider of custom kitchens, bathroom vanities, closets, and countertops,
              known for precision, durability, and refined design.
            </Reveal>
            <Reveal className="reveal-delay-3">
              <Link href="/about" className="btn btn-solid" style={{ marginTop: '12px' }}>Our Story</Link>
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
  )
}
