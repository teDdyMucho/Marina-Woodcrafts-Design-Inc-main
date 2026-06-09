import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function ContactTeaser() {
  return (
    <section id="contact" className="section">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Get in Touch</Reveal>
        <Reveal as="h2" className="section-title">Let&rsquo;s build something<br />beautiful together.</Reveal>
        <Reveal className="line-divider" />
        <Reveal as="p" className="reveal-delay-1" style={{ maxWidth: '40rem', marginTop: '24px' }}>
          Let&rsquo;s bring your vision to life with cabinetry and countertop solutions designed specifically for your space.
        </Reveal>
        <Reveal className="reveal-delay-2" style={{ marginTop: '28px' }}>
          <Link href="/contact" className="btn btn-solid">Start a Conversation</Link>
        </Reveal>
      </div>
    </section>
  )
}
