import { renderHook, act } from '@testing-library/react'
import { useParallax } from './useParallax'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
}

describe('useParallax', () => {
  beforeEach(() => setScrollY(0))

  it('starts at zero offset for all three layers', () => {
    const { result } = renderHook(() => useParallax())
    expect(result.current).toEqual({ small: 0, medium: 0, big: 0 })
  })

  it('computes layer offsets proportional to scroll position and speed', () => {
    const { result } = renderHook(() => useParallax())
    act(() => {
      setScrollY(1000)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toEqual({
      small: -70,
      medium: -170,
      big: -300,
    })
  })
})
