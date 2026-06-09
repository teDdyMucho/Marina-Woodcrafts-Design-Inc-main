import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GalleryGrid } from './GalleryGrid'

const PHOTOS = [
  { src: '/a.png', alt: 'Photo A' },
  { src: '/b.png', alt: 'Photo B' },
]

describe('GalleryGrid', () => {
  it('renders an image thumbnail for each photo', () => {
    render(<GalleryGrid photos={PHOTOS} />)
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(PHOTOS.length)
  })

  it('opens the lightbox when a thumbnail is clicked', async () => {
    render(<GalleryGrid photos={PHOTOS} />)
    const thumbs = screen.getAllByRole('button')
    await userEvent.click(thumbs[0])
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('shows the clicked photo in the lightbox', async () => {
    render(<GalleryGrid photos={PHOTOS} />)
    await userEvent.click(screen.getAllByRole('button')[1])
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
  })
})
