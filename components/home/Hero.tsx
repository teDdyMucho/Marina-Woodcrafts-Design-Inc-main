import Image from 'next/image'
import Link from 'next/link'
import { business } from '@/lib/business'

export function Hero() {
  return (
    <section id="hero">
      <div className="hero-inner">
        <Image src="/Icon.png" alt="Marina Woodcrafts" width={5400} height={3360} className="hero-logo" priority />
        <p className="hero-eyebrow">{business.tagline}</p>
        <h1 className="hero-headline">
          Where Wood<br />Becomes <em>Art</em>
        </h1>
        <p className="hero-sub">
          Custom woodcraft and interior design rooted in tradition,<br />
          crafted for the spaces where life happens.
        </p>
        <Link href="/about" className="btn btn-outline-light">Discover Our Work</Link>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="scroll-cue-line"></div>
      </div>
    </section>
  )
}
