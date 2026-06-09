import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Reveal } from '@/components/ui/Reveal'
import { business } from '@/lib/business'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Request a free consultation for custom cabinetry in Woodland Hills, CA. Call (310) 990-0788 or send us a message.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Marina Woodcrafts Design Inc.',
    description: 'Free consultations for custom kitchen cabinetry, bathroom vanities, closets, and built-ins in Woodland Hills, CA.',
    images: [{ url: '/Background.jpg' }],
  },
}

export default function ContactPage() {
  return (
    <main>
      <section id="contact" className="section" style={{ paddingTop: '140px' }}>
        <div className="wrap">
          <Reveal as="p" className="eyebrow">Get In Touch</Reveal>
          <Reveal as="h1" className="section-title">Contact Us</Reveal>
          <Reveal className="line-divider" />

          <div className="contact-layout">
            <div className="contact-info">
              <Reveal as="h2" className="contact-sub reveal-delay-1">Let&apos;s Build Something</Reveal>
              <Reveal as="p" className="contact-body reveal-delay-1">
                Ready to start your project? We offer free in-home consultations throughout
                the greater Los Angeles area. Reach out by phone, email, or the form below
                and we&apos;ll get back to you within one business day.
              </Reveal>
              <Reveal className="contact-details reveal-delay-2">
                <p>
                  <a href={business.phoneHref}>{business.phone}</a>
                </p>
                <p>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </p>
                <p>
                  {business.address.streetAddress},<br />
                  {business.address.addressLocality}, {business.address.addressRegion} {business.address.postalCode}
                </p>
              </Reveal>
            </div>

            <Reveal className="contact-form-wrap reveal-delay-2">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
