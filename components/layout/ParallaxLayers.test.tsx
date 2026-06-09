import { render } from '@testing-library/react'
import { ParallaxLayers } from './ParallaxLayers'

vi.mock('@/hooks/useParallax', () => ({
  useParallax: () => ({ small: -10, medium: -20, big: -30 }),
}))

describe('ParallaxLayers', () => {
  it('renders three layers with ids matching the ported CSS hooks', () => {
    const { container } = render(<ParallaxLayers />)
    expect(container.querySelector('#fg-small')).toBeInTheDocument()
    expect(container.querySelector('#fg-medium')).toBeInTheDocument()
    expect(container.querySelector('#fg-big')).toBeInTheDocument()
  })

  it('applies the computed backgroundPositionY from useParallax to each layer', () => {
    const { container } = render(<ParallaxLayers />)
    expect(container.querySelector('#fg-small')).toHaveStyle({ backgroundPositionY: '-10px' })
    expect(container.querySelector('#fg-medium')).toHaveStyle({ backgroundPositionY: '-20px' })
    expect(container.querySelector('#fg-big')).toHaveStyle({ backgroundPositionY: '-30px' })
  })
})
