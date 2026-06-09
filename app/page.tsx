import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { ServicesTeaser } from '@/components/home/ServicesTeaser'
import { GalleryTeaser } from '@/components/home/GalleryTeaser'
import { ContactTeaser } from '@/components/home/ContactTeaser'

export const metadata: Metadata = {
  title: 'Custom Cabinetry & Woodcraft in Woodland Hills, CA',
  description:
    'Marina Woodcrafts Design Inc. handcrafts custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops in Woodland Hills, CA. 25+ years of experience.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <ServicesTeaser />
      <GalleryTeaser />
      <ContactTeaser />
    </>
  )
}
