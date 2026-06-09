import { renderHook, act } from '@testing-library/react'
import { useScrolled } from './useScrolled'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
}

describe('useScrolled', () => {
  beforeEach(() => setScrollY(0))

  it('starts false when the page is at the top', () => {
    const { result } = renderHook(() => useScrolled(70))
    expect(result.current).toBe(false)
  })

  it('becomes true once scrollY exceeds the threshold', () => {
    const { result } = renderHook(() => useScrolled(70))
    act(() => {
      setScrollY(120)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('returns to false when scrolling back above the threshold line', () => {
    const { result } = renderHook(() => useScrolled(70))
    act(() => {
      setScrollY(120)
      window.dispatchEvent(new Event('scroll'))
    })
    act(() => {
      setScrollY(10)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })
})
