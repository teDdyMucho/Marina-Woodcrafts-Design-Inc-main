export interface PostalAddress {
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

export interface BusinessStat {
  value: string
  label: string
}

export interface Business {
  name: string
  legalName: string
  tagline: string
  phone: string
  phoneHref: string
  email: string
  address: PostalAddress
  mapsUrl: string
  stats: BusinessStat[]
  sameAs: string[]
}

const address: PostalAddress = {
  streetAddress: '20857 Martha St',
  addressLocality: 'Woodland Hills',
  addressRegion: 'CA',
  postalCode: '91367',
  addressCountry: 'US',
}

export const business: Business = {
  name: 'Marina Woodcrafts Design Inc.',
  legalName: 'Marina Woodcrafts Design Inc.',
  tagline: 'Handcrafted with Purpose',
  phone: '+1 (310) 990-0788',
  phoneHref: 'tel:+13109900788',
  email: 'Marinawoodcraftsdesign@hotmail.com',
  address,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=20857+Martha+St+Woodland+Hills+CA+91367',
  stats: [
    { value: '25+', label: 'Years of Experience' },
    { value: '100+', label: 'Projects Completed' },
    { value: '100%', label: 'Handcrafted' },
  ],
  sameAs: [],
}
