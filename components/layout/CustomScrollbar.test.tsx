import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomScrollbar } from './CustomScrollbar'
import { vi } from 'vitest'

vi.mock('@/hooks/useScrollProgress', () => ({
  useScrollProgress: () => ({ geometry: { heightPx: 100, topPx: 20 }, visible: true }),
}))

describe('CustomScrollbar', () => {
  it('renders up/down buttons and a thumb positioned per the hook geometry', () => {
    render(<CustomScrollbar />)
    expect(screen.getByLabelText('Scroll up')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll down')).toBeInTheDocument()
    const thumb = document.getElementById('sb-thumb')
    expect(thumb).toHaveStyle({ height: '100px', top: '20px' })
  })

  it('shows the sb-visible class when the hook reports visible', () => {
    render(<CustomScrollbar />)
    expect(document.getElementById('custom-scrollbar')).toHaveClass('sb-visible')
  })

  it('scrolls up by 120px when the up arrow is clicked', async () => {
    const scrollBy = vi.fn()
    window.scrollBy = scrollBy
    render(<CustomScrollbar />)
    await userEvent.click(screen.getByLabelText('Scroll up'))
    expect(scrollBy).toHaveBeenCalledWith({ top: -120, behavior: 'smooth' })
  })

  it('scrolls down by 120px when the down arrow is clicked', async () => {
    const scrollBy = vi.fn()
    window.scrollBy = scrollBy
    render(<CustomScrollbar />)
    await userEvent.click(screen.getByLabelText('Scroll down'))
    expect(scrollBy).toHaveBeenCalledWith({ top: 120, behavior: 'smooth' })
  })
})
