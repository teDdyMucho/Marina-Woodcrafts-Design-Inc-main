import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

const FEATURED = [
  { num: '01', title: 'Custom Kitchen Cabinetry', desc: 'Designed and built to fit your kitchen layout with precision, combining functionality and modern aesthetics.' },
  { num: '02', title: 'Bathroom Vanities', desc: 'Custom-built vanities tailored to maximize space while maintaining a clean and elegant look.' },
  { num: '03', title: 'Closets & Storage Solutions', desc: 'Efficient and stylish storage systems designed to match your lifestyle and space requirements.' },
]

export function ServicesTeaser() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="services-header">
          <div>
            <Reveal as="p" className="eyebrow">What We Do</Reveal>
            <Reveal as="h2" className="section-title">Craftsmanship in<br />every detail.</Reveal>
          </div>
          <Reveal>
            <Link href="/services" className="btn btn-outline-dark">View All Services</Link>
          </Reveal>
        </div>
        <div className="services-grid">
          {FEATURED.map((svc, i) => (
            <Reveal key={svc.num} className={`service-card${i === 0 ? '' : ` reveal-delay-${i}`}`}>
              <div className="svc-num">{svc.num}</div>
              <h3 className="svc-title">{svc.title}</h3>
              <p className="svc-desc">{svc.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
