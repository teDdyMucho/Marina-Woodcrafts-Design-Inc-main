import { categories, getCategory } from './gallery'

describe('gallery', () => {
  it('has exactly 4 category entries', () => {
    expect(categories).toHaveLength(4)
  })

  it('category slugs match expected route values', () => {
    expect(categories.map((c) => c.slug)).toEqual([
      'bathroom', 'kitchen', 'bedroom', 'living',
    ])
  })

  it('each category has at least 5 photos', () => {
    categories.forEach((cat) => {
      expect(cat.photos.length).toBeGreaterThanOrEqual(5)
    })
  })

  it('each photo has src and alt', () => {
    categories.forEach((cat) => {
      cat.photos.forEach((p) => {
        expect(p.src).toMatch(/^\/Gallery\//)
        expect(p.alt).toBeTruthy()
      })
    })
  })

  it('getCategory returns the correct entry by slug', () => {
    expect(getCategory('bathroom')?.name).toBe('Bathroom Vanities')
    expect(getCategory('kitchen')?.name).toBe('Kitchen Cabinetry')
  })

  it('getCategory returns undefined for unknown slug', () => {
    expect(getCategory('unknown')).toBeUndefined()
  })
})
