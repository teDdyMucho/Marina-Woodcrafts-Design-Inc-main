'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { categories } from '@/lib/gallery'
import { GalleryGrid } from './GalleryGrid'

/**
 * Tabbed gallery — switch between collections in place (button to button),
 * no navigation to a separate category page.
 */
export function GalleryCollections() {
  const [active, setActive] = useState(0)
  const cat = categories[active]
  const tabsRef = useRef<HTMLDivElement>(null)

  function selectTab(i: number) {
    setActive(i)
    // Jump back up to the tabs so the new collection is seen from its intro,
    // instead of being left stranded mid-grid after scrolling down.
    requestAnimationFrame(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // First photo is the feature image (shown above), so the grid covers the rest.
  // Split those into the collection's groups, in order; the last group takes
  // whatever remains.
  const gridPhotos = cat.photos.slice(1)
  let offset = 0
  const groupSlices = cat.groups.map((g, i) => {
    const isLast = i === cat.groups.length - 1
    const photos = isLast ? gridPhotos.slice(offset) : gridPhotos.slice(offset, offset + g.count)
    offset += g.count
    return { ...g, photos }
  })

  return (
    <>
      <div className="gallery-tabs" role="tablist" aria-label="Gallery collections" ref={tabsRef}>
        {categories.map((c, i) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={i === active}
            className={`gallery-tab${i === active ? ' active' : ''}`}
            onClick={() => selectTab(i)}
          >
            {c.name}
            <span className="gallery-tab-count">{c.photos.length}</span>
          </button>
        ))}
      </div>

      <div className="gallery-collection">
        <div className="gallery-intro">
          <div className="gallery-intro-text">
            <h2 className="gallery-collection-title">{cat.name}</h2>
            <p className="gallery-collection-count">
              {cat.photos.length} projects in this collection
            </p>
            <div className="gallery-collection-desc">
              {cat.details.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <div className="gallery-intro-media">
            <Image
              key={cat.slug}
              src={cat.coverImage}
              alt={`${cat.name} by Marina Woodcrafts Design Inc.`}
              fill
              className="gallery-intro-img"
              sizes="(max-width: 900px) 100vw, 480px"
            />
          </div>
        </div>
        {/* Grouped sub-galleries — similar projects together, each with an
            informative blurb (better for readers and for SEO / GEO / AEO). */}
        {groupSlices.map((g, i) =>
          g.photos.length === 0 ? null : (
            <section className="gallery-group" key={`${cat.slug}-${i}`}>
              <h3 className="gallery-group-title">{g.title}</h3>
              <p className="gallery-group-desc">{g.description}</p>
              <GalleryGrid photos={g.photos} />
            </section>
          )
        )}
      </div>
    </>
  )
}
