import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

class MockIntersectionObserver {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  // @ts-expect-error -- test double
  global.IntersectionObserver = MockIntersectionObserver
})

describe('Reveal', () => {
  it('renders children inside an element with the reveal class', () => {
    render(<Reveal>content</Reveal>)
    const el = screen.getByText('content')
    expect(el).toHaveClass('reveal')
    expect(el).not.toHaveClass('visible')
  })

  it('applies extra class names alongside reveal', () => {
    render(<Reveal className="reveal-delay-2">content</Reveal>)
    expect(screen.getByText('content')).toHaveClass('reveal', 'reveal-delay-2')
  })

  it('renders the given element type', () => {
    render(<Reveal as="h2">heading</Reveal>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('reveal')
  })
})
