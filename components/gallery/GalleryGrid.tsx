'use client'

import { useState } from 'react'
import type { GalleryPhoto } from '@/lib/gallery'
import { Lightbox } from './Lightbox'

interface GalleryGridProps {
  photos: GalleryPhoto[]
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="modal-grid">
        {photos.map((photo, i) => (
          <button
            key={i}
            className="modal-photo"
            onClick={() => setLightboxIndex(i)}
            aria-label={photo.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} loading={i < 6 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <Lightbox
        photos={photos}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  )
}
