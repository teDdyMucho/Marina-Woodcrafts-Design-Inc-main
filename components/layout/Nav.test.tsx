import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

vi.mock('@/hooks/useScrolled', () => ({ useScrolled: () => false }))
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('Nav', () => {
  it('renders the brand link to home and the four section links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /marina woodcrafts/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '/gallery')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('renders a hamburger toggle button for mobile', () => {
    render(<Nav />)
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })
})

describe('Nav when scrolled', () => {
  it('applies the scrolled class', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/useScrolled', () => ({ useScrolled: () => true }))
    const { Nav: ScrolledNav } = await import('./Nav')
    render(<ScrolledNav />)
    expect(document.getElementById('nav')).toHaveClass('scrolled')
  })
})
