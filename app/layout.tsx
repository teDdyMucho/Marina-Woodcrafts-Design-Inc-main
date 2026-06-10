import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { IntroOverlay } from '@/components/layout/IntroOverlay'
import { ParallaxLayers } from '@/components/layout/ParallaxLayers'
import { CustomScrollbar } from '@/components/layout/CustomScrollbar'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { BackToTop } from '@/components/layout/BackToTop'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { business } from '@/lib/business'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://marinawoodcraft.com'),
  title: {
    default: 'Marina Woodcrafts Design Inc. | Custom Cabinetry in Woodland Hills, CA',
    template: '%s | Marina Woodcrafts Design Inc.',
  },
  description:
    'Custom kitchen cabinetry, bathroom vanities, closets, bookcases, and countertops handcrafted in Woodland Hills, CA. 25+ years of experience, 100+ projects completed.',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: business.legalName,
  image: 'https://marinawoodcraft.com/Icon.png',
  telephone: business.phone,
  email: business.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.streetAddress,
    addressLocality: business.address.addressLocality,
    addressRegion: business.address.addressRegion,
    postalCode: business.address.postalCode,
    addressCountry: business.address.addressCountry,
  },
  url: 'https://marinawoodcraft.com',
  sameAs: business.sameAs,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <IntroOverlay />
        <ScrollToTop />
        <CustomScrollbar />
        <ParallaxLayers />
        <Nav />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
