import { services, getService } from './services'

describe('services', () => {
  it('has exactly 5 service entries', () => {
    expect(services).toHaveLength(5)
  })

  it('each service has required fields', () => {
    services.forEach((svc) => {
      expect(svc.slug).toBeTruthy()
      expect(svc.num).toMatch(/^\d{2}$/)
      expect(svc.title).toBeTruthy()
      expect(svc.summary).toBeTruthy()
      expect(svc.body).toBeTruthy()
      expect(Array.isArray(svc.faq)).toBe(true)
      expect(svc.faq.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('slugs match the expected route values', () => {
    const slugs = services.map((s) => s.slug)
    expect(slugs).toEqual([
      'kitchen-cabinetry',
      'bathroom-vanities',
      'closets-storage',
      'bookcases-built-ins',
      'countertops',
    ])
  })

  it('getService returns the correct entry by slug', () => {
    const svc = getService('kitchen-cabinetry')
    expect(svc?.title).toBe('Custom Kitchen Cabinetry')
  })

  it('getService returns undefined for unknown slug', () => {
    expect(getService('unknown')).toBeUndefined()
  })
})
