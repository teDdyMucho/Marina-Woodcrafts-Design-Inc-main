import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Lightbox } from './Lightbox'

const PHOTOS = [
  { src: '/a.png', alt: 'Photo A' },
  { src: '/b.png', alt: 'Photo B' },
  { src: '/c.png', alt: 'Photo C' },
]

describe('Lightbox', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the current photo when open', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={1} onClose={() => {}} isOpen />)
    expect(screen.getByAltText('Photo B')).toBeInTheDocument()
  })

  it('shows a counter with current position', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} isOpen />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={onClose} isOpen />)
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={onClose} isOpen />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to the next photo with ArrowRight', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={0} onClose={() => {}} isOpen />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to the previous photo with ArrowLeft', () => {
    render(<Lightbox photos={PHOTOS} initialIndex={1} onClose={() => {}} isOpen />)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })
})
