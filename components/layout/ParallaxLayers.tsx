'use client'

import { useParallax } from '@/hooks/useParallax'

export function ParallaxLayers() {
  const { small, medium, big } = useParallax()

  return (
    <>
      <div className="fg-layer" id="fg-small" style={{ backgroundPositionY: `${small}px` }} />
      <div className="fg-layer" id="fg-medium" style={{ backgroundPositionY: `${medium}px` }} />
      <div className="fg-layer" id="fg-big" style={{ backgroundPositionY: `${big}px` }} />
    </>
  )
}
