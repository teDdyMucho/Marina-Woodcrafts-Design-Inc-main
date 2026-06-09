'use client'

import { useEffect, useState, useCallback } from 'react'
import type { GalleryPhoto } from '@/lib/gallery'

interface LightboxProps {
  photos: GalleryPhoto[]
  initialIndex: number
  isOpen?: boolean
  onClose: () => void
}

export function Lightbox({ photos, initialIndex, isOpen = false, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex, isOpen])

  const nav = useCallback((dir: number) => {
    setIndex((i) => (i + dir + photos.length) % photos.length)
  }, [photos.length])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'ArrowLeft') nav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, nav, onClose])

  if (!isOpen || !photos.length) return null

  const photo = photos[index]

  return (
    <div
      id="lightbox"
      className="open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button id="lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img id="lightbox-img" src={photo.src} alt={photo.alt} />
      <div id="lightbox-counter">{index + 1} / {photos.length}</div>
      {photos.length > 1 && (
        <>
          <button id="lightbox-prev" aria-label="Previous" onClick={() => nav(-1)}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button id="lightbox-next" aria-label="Next" onClick={() => nav(1)}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
