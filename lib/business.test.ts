import { business } from './business'

describe('business', () => {
  it('has the studio address and phone formatted for tel: links', () => {
    expect(business.name).toBe('Marina Woodcrafts Design Inc.')
    expect(business.phone).toBe('+1 (310) 990-0788')
    expect(business.phoneHref).toBe('tel:+13109900788')
    expect(business.email).toBe('Marinawoodcraftsdesign@hotmail.com')
  })

  it('has a complete postal address for schema use', () => {
    expect(business.address).toEqual({
      streetAddress: '20857 Martha St',
      addressLocality: 'Woodland Hills',
      addressRegion: 'CA',
      postalCode: '91367',
      addressCountry: 'US',
    })
  })

  it('has a Google Maps URL derived from the address', () => {
    expect(business.mapsUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=20857+Martha+St+Woodland+Hills+CA+91367'
    )
  })

  it('has the three headline stats in display order', () => {
    expect(business.stats).toEqual([
      { value: '25+', label: 'Years of Experience' },
      { value: '100+', label: 'Projects Completed' },
      { value: '100%', label: 'Handcrafted' },
    ])
  })
})
