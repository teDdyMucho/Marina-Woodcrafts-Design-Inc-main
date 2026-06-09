global.IntersectionObserver = class {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

import { render, screen } from '@testing-library/react'
import { ServiceCard } from './ServiceCard'

const MOCK_SERVICE = {
  slug: 'kitchen-cabinetry',
  num: '01',
  title: 'Custom Kitchen Cabinetry',
  summary: 'Designed and built to fit your kitchen layout.',
  body: '',
  heroImage: '/Gallery/Custom%20Kitchen%20Cabinetry/1.png',
  faq: [],
}

describe('ServiceCard', () => {
  it('renders the service number, title, and summary', () => {
    render(<ServiceCard service={MOCK_SERVICE} />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Custom Kitchen Cabinetry')).toBeInTheDocument()
    expect(screen.getByText(/Designed and built/)).toBeInTheDocument()
  })

  it('links to the service detail page', () => {
    render(<ServiceCard service={MOCK_SERVICE} />)
    expect(screen.getByRole('link', { name: /learn more|view|kitchen cabinetry/i })).toHaveAttribute(
      'href',
      '/services/kitchen-cabinetry'
    )
  })
})
