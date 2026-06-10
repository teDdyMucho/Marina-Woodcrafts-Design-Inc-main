'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'mwdi-intro-shown'
const FPS = 24
const FRAMES_LANDSCAPE = 32
const FRAMES_PORTRAIT = 35
const FADE_MS = 450

// Recovered intro media lives under /public/intro (a plain, non-ignored path —
// it used to sit inside an *.aep_AME/ folder that .gitignore excluded, which is
// how it went missing during the Vite → Next.js migration).
const VIDEO_LANDSCAPE = '/intro/landscape/Intro_v3.mp4'
const VIDEO_PORTRAIT = '/intro/portrait/Intro_Portait_Version.mp4'
const frameSrc = (portrait: boolean, i: number) => {
  const n = String(i).padStart(5, '0')
  return portrait
    ? `/intro/portrait/Door24/Door24_Portait_Version_${n}.png`
    : `/intro/landscape/Door24/Door24_${n}.png`
}

/**
 * Intro: the brand video plays, then the cabinet doors swing open (Door24 PNG
 * sequence) to reveal the site. Hardened against the failure modes that kept it
 * stuck: muted-autoplay is forced, a watchdog guarantees we leave the video
 * phase, and the door frames are preloaded so the open never hangs.
 *
 * Shows once per session. Append ?intro to the URL to force a replay.
 */
export function IntroOverlay() {
  const [phase, setPhase] = useState<'hidden' | 'video' | 'doors'>('hidden')
  const [closing, setClosing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const doorImgRef = useRef<HTMLImageElement>(null)
  const portraitRef = useRef(false)
  const framesRef = useRef<HTMLImageElement[]>([])
  const movedOnRef = useRef(false)
  const initRef = useRef(false)

  // ── Setup (runs once, even under StrictMode double-invoke) ──
  useEffect(() => {
    if (typeof window === 'undefined' || initRef.current) return
    initRef.current = true

    const force = window.location.search.includes('intro')
    if (!force && sessionStorage.getItem(STORAGE_KEY) === 'true') return
    sessionStorage.setItem(STORAGE_KEY, 'true')

    const portrait = window.innerHeight > window.innerWidth
    portraitRef.current = portrait
    const count = portrait ? FRAMES_PORTRAIT : FRAMES_LANDSCAPE
    framesRef.current = Array.from({ length: count }, (_, i) => {
      const img = new window.Image()
      img.src = frameSrc(portrait, i)
      return img
    })

    document.body.classList.add('intro-active')
    setPhase('video')
  }, [])

  // ── Video phase: play, then hand off to the door sequence ──
  useEffect(() => {
    if (phase !== 'video') return
    const video = videoRef.current
    if (!video) return

    // React doesn't reliably set `muted` from the prop, and browsers block
    // muted-autoplay if the element isn't actually muted — which froze frame 0.
    video.muted = true
    if (portraitRef.current) {
      const source = video.querySelector('source')
      source?.setAttribute('src', VIDEO_PORTRAIT)
      video.load()
    }

    const toDoors = () => {
      if (movedOnRef.current) return
      movedOnRef.current = true
      setPhase('doors')
    }

    video.addEventListener('ended', toDoors)
    video.addEventListener('error', toDoors)
    video.addEventListener('loadedmetadata', () => {
      setTimeout(toDoors, (video.duration || 4) * 1000)
    })
    video.play().catch(() => {
      // Autoplay blocked — don't strand the user; move on to the door reveal.
      setTimeout(toDoors, 400)
    })

    // Hard watchdog: never let the video phase hang.
    const watchdog = setTimeout(toDoors, 6000)
    return () => clearTimeout(watchdog)
  }, [phase])

  // ── Door phase: play the open sequence, then fade to the site ──
  useEffect(() => {
    if (phase !== 'doors') return
    const img = doorImgRef.current
    const frames = framesRef.current

    function done() {
      setClosing(true)
      window.setTimeout(() => {
        document.body.classList.remove('intro-active')
        setPhase('hidden')
      }, FADE_MS)
    }

    if (!img || frames.length === 0) {
      done()
      return
    }

    let i = 0
    img.src = frames[0].src
    const id = setInterval(() => {
      i += 1
      if (i >= frames.length) {
        clearInterval(id)
        done()
        return
      }
      img.src = frames[i].src
    }, 1000 / FPS)

    return () => clearInterval(id)
  }, [phase])

  if (phase === 'hidden') return null

  return (
    <>
      {phase === 'video' && (
        <div id="intro-overlay">
          <video id="intro-video" ref={videoRef} muted autoPlay playsInline preload="auto">
            <source src={VIDEO_LANDSCAPE} type="video/mp4" />
          </video>
          <button
            id="intro-skip"
            onClick={() => {
              // Skip the whole intro straight to the site.
              movedOnRef.current = true
              document.body.classList.remove('intro-active')
              setPhase('hidden')
            }}
          >
            Skip
          </button>
        </div>
      )}
      {phase === 'doors' && (
        <div id="door-overlay" className={closing ? 'closing' : ''} style={{ display: 'flex' }}>
          <div className="door-bar" id="door-bar-top" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="door-frame" ref={doorImgRef} alt="" />
          <div className="door-bar" id="door-bar-bottom" />
        </div>
      )}
    </>
  )
}
