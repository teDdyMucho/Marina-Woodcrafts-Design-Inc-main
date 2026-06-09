import { render } from '@testing-library/react'
import { IntroOverlay } from './IntroOverlay'

const STORAGE_KEY = 'mwdi-intro-shown'

beforeEach(() => {
  sessionStorage.clear()
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
  window.HTMLMediaElement.prototype.load = vi.fn()
})

describe('IntroOverlay', () => {
  it('renders the overlay and marks the session on first visit', () => {
    const { container } = render(<IntroOverlay />)
    expect(container.querySelector('#intro-overlay')).toBeInTheDocument()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('renders nothing on a repeat visit within the same session', () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    const { container } = render(<IntroOverlay />)
    expect(container.querySelector('#intro-overlay')).not.toBeInTheDocument()
  })

  it('renders a skip button that dismisses the overlay', () => {
    const { container, getByText } = render(<IntroOverlay />)
    expect(getByText('Skip')).toBeInTheDocument()
    expect(container.querySelector('#intro-overlay')).toBeInTheDocument()
  })
})
