'use client'

import { useRef } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const { geometry, visible } = useScrollProgress(trackRef)

  function scrollableHeight() {
    return document.documentElement.scrollHeight - window.innerHeight
  }

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === thumbRef.current) return
    const rect = trackRef.current!.getBoundingClientRect()
    const clickRatio = (e.clientY - rect.top) / rect.height
    window.scrollTo({ top: clickRatio * scrollableHeight(), behavior: 'smooth' })
  }

  function handleThumbMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    thumbRef.current?.classList.add('dragging')
    const startY = e.clientY
    const startScroll = window.scrollY
    const trackHeight = trackRef.current!.clientHeight
    const thumbHeight = thumbRef.current!.clientHeight
    const scrollable = scrollableHeight()

    function onMove(ev: MouseEvent) {
      const delta = ev.clientY - startY
      const scrollDelta = (delta / (trackHeight - thumbHeight)) * scrollable
      window.scrollTo(0, Math.max(0, Math.min(scrollable, startScroll + scrollDelta)))
    }
    function onUp() {
      thumbRef.current?.classList.remove('dragging')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div id="custom-scrollbar" className={visible ? 'sb-visible' : ''}>
      <button id="sb-up" aria-label="Scroll up" onClick={() => window.scrollBy({ top: -120, behavior: 'smooth' })}>
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0.5L7.5 5.5H0.5L4 0.5Z" fill="currentColor" />
        </svg>
      </button>
      <div id="sb-track" ref={trackRef} onClick={handleTrackClick}>
        <div
          id="sb-thumb"
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
          style={{ height: `${geometry.heightPx}px`, top: `${geometry.topPx}px` }}
        />
      </div>
      <button id="sb-down" aria-label="Scroll down" onClick={() => window.scrollBy({ top: 120, behavior: 'smooth' })}>
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 5.5L0.5 0.5H7.5L4 5.5Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
