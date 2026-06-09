'use client'

import { useEffect, useState } from 'react'

const SPEED_SMALL = 0.07
const SPEED_MEDIUM = 0.17
const SPEED_BIG = 0.3

export interface ParallaxOffsets {
  small: number
  medium: number
  big: number
}

export function useParallax(): ParallaxOffsets {
  const [offsets, setOffsets] = useState<ParallaxOffsets>({ small: 0, medium: 0, big: 0 })

  useEffect(() => {
    function update() {
      const y = window.scrollY
      setOffsets({
        small: y === 0 ? 0 : -y * SPEED_SMALL,
        medium: y === 0 ? 0 : -y * SPEED_MEDIUM,
        big: y === 0 ? 0 : -y * SPEED_BIG,
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return offsets
}
