'use client'

import { useState, type Ref } from 'react'
import type { GalleryPhoto } from '@/lib/gallery'
import { useReveal } from '@/hooks/useReveal'
import { Lightbox } from './Lightbox'

interface GalleryGridProps {
  photos: GalleryPhoto[]
}

function GalleryItem({
  photo,
  index,
  total,
  onOpen,
}: {
  photo: GalleryPhoto
  index: number
  total: number
  onOpen: () => void
}) {
  const { ref, visible } = useReveal()
  const plate = String(index + 1).padStart(2, '0')

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={`gallery-photo reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 0.08}s` }}
      onClick={onOpen}
      aria-label={photo.alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.alt} loading={index < 4 ? 'eager' : 'lazy'} />
      <span className="gallery-photo-plate">
        {plate}<i>/{String(total).padStart(2, '0')}</i>
      </span>
      <span className="gallery-photo-view">View</span>
    </button>
  )
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="gallery-photos">
        {photos.map((photo, i) => (
          <GalleryItem
            key={i}
            photo={photo}
            index={i}
            total={photos.length}
            onOpen={() => setLightboxIndex(i)}
          />
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
