import { computeThumbGeometry } from './useScrollProgress'

describe('computeThumbGeometry', () => {
  it('returns a full-height thumb when the page is not scrollable', () => {
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 800, viewportHeight: 800, trackHeight: 600 })
    expect(geo).toEqual({ heightPx: 600, topPx: 0 })
  })

  it('sizes the thumb proportional to viewport vs document height, with a 28px minimum', () => {
    // viewport=800, document=2400 → ratio 1/3 → trackHeight(600)/3 = 200
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 2400, viewportHeight: 800, trackHeight: 600 })
    expect(geo.heightPx).toBe(200)
  })

  it('enforces the 28px minimum thumb height for very long pages', () => {
    // viewport=800, document=40000 → computed height would be 12, clamp to 28
    const geo = computeThumbGeometry({ scrollY: 0, scrollHeight: 40000, viewportHeight: 800, trackHeight: 600 })
    expect(geo.heightPx).toBe(28)
  })

  it('positions the thumb proportionally to scroll progress within the available track', () => {
    // scrollable = 2400 - 800 = 1600; ratio = 800/1600 = 0.5; thumbH = 200; maxTop = 600-200 = 400
    const geo = computeThumbGeometry({ scrollY: 800, scrollHeight: 2400, viewportHeight: 800, trackHeight: 600 })
    expect(geo).toEqual({ heightPx: 200, topPx: 200 })
  })
})
