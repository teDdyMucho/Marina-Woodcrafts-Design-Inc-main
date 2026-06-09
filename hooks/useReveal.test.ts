import { act, renderHook } from '@testing-library/react'
import { useReveal } from './useReveal'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element[] = []
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
  observe(el: Element) { this.observed.push(el) }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  // @ts-expect-error -- replacing the global with a test double
  global.IntersectionObserver = MockIntersectionObserver
})

describe('useReveal', () => {
  it('returns a ref and starts not-visible', () => {
    const { result } = renderHook(() => useReveal())
    expect(result.current.visible).toBe(false)
    expect(result.current.ref.current).toBeNull()
  })

  it('becomes visible once the observed element intersects', () => {
    const { result, rerender } = renderHook(() => useReveal())
    const el = document.createElement('div')
    // @ts-expect-error -- assigning to a ref's current for the test
    result.current.ref.current = el
    rerender()

    const observer = MockIntersectionObserver.instances[0]
    act(() => {
      observer.callback(
        [{ target: el, isIntersecting: true } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver
      )
    })

    expect(result.current.visible).toBe(true)
  })
})
