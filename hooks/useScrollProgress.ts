'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export interface ThumbGeometry {
  heightPx: number
  topPx: number
}

interface ThumbInputs {
  scrollY: number
  scrollHeight: number
  viewportHeight: number
  trackHeight: number
}

const MIN_THUMB_HEIGHT = 28

export function computeThumbGeometry({ scrollY, scrollHeight, viewportHeight, trackHeight }: ThumbInputs): ThumbGeometry {
  const scrollable = scrollHeight - viewportHeight
  if (scrollable <= 0) {
    return { heightPx: trackHeight, topPx: 0 }
  }

  const ratio = scrollY / scrollable
  const heightPx = Math.max(MIN_THUMB_HEIGHT, trackHeight * (viewportHeight / scrollHeight))
  const maxTop = trackHeight - heightPx
  return { heightPx, topPx: ratio * maxTop }
}

export function useScrollProgress(trackRef: RefObject<HTMLElement | null>) {
  const [geometry, setGeometry] = useState<ThumbGeometry>({ heightPx: 0, topPx: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>

    function update() {
      const trackHeight = trackRef.current?.clientHeight ?? 0
      setGeometry(
        computeThumbGeometry({
          scrollY: window.scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
          trackHeight,
        })
      )
    }

    function onScroll() {
      update()
      setVisible(true)
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => setVisible(false), 1000)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      clearTimeout(hideTimer)
    }
  }, [trackRef])

  return { geometry, visible }
}
