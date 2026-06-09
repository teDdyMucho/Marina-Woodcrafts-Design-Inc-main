import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the brand name and current-year copyright', () => {
    render(<Footer />)
    expect(screen.getByText('Marina Woodcrafts')).toBeInTheDocument()
    expect(screen.getByText('Design Inc.')).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
    expect(screen.getByText(/Website by Paldz/)).toBeInTheDocument()
  })
})
