import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver; useReveal-based components need this stub.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver
