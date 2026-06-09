import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from './MobileNav'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
]

describe('MobileNav', () => {
  it('renders nothing visible when closed', () => {
    render(<MobileNav open={false} links={LINKS} onClose={() => {}} />)
    expect(document.getElementById('mobile-nav')).not.toHaveClass('open')
  })

  it('applies the open class when open', () => {
    render(<MobileNav open links={LINKS} onClose={() => {}} />)
    expect(document.getElementById('mobile-nav')).toHaveClass('open')
  })

  it('calls onClose when a link is clicked', async () => {
    const onClose = vi.fn()
    render(<MobileNav open links={LINKS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(onClose).toHaveBeenCalled()
  })
})
