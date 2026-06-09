'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'mwdi-intro-shown'
const DOOR_COUNT_LANDSCAPE = 32
const DOOR_COUNT_PORTRAIT = 35
const MS_PER_FRAME = 1000 / 24

export function IntroOverlay() {
  const [shouldRender, setShouldRender] = useState(false)
  const [phase, setPhase] = useState<'video' | 'doors' | 'fallback' | 'done'>('video')
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const doorFrameRef = useRef<HTMLImageElement>(null)
  const barColorRef = useRef('#ffffff')
  const loadedCountRef = useRef(0)
  const dismissedRef = useRef(false)
  const isPortraitRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setShouldRender(false)
      return
    }
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setShouldRender(true)
    document.body.classList.add('intro-active')
    isPortraitRef.current = window.innerHeight > window.innerWidth

    const video = videoRef.current
    if (!video) return

    if (isPortraitRef.current) {
      const source = video.querySelector('source')
      source?.setAttribute('src', '/Intro%20Animation/intro.aep_AME/Portait_Version/Intro_Portait_Version.mp4')
      video.load()
    }

    const doorCount = isPortraitRef.current ? DOOR_COUNT_PORTRAIT : DOOR_COUNT_LANDSCAPE
    const doorSrcs = Array.from({ length: doorCount }, (_, i) => {
      const n = String(i).padStart(5, '0')
      return isPortraitRef.current
        ? `/Intro%20Animation/intro.aep_AME/Portait_Version/Door24/Door24_Portait_Version_${n}.png`
        : `/Intro%20Animation/intro.aep_AME/Door24/Door24_${n}.png`
    })
    doorSrcs.forEach((src) => {
      const img = new window.Image()
      img.onload = () => { loadedCountRef.current += 1 }
      img.src = src
    })

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let sampling = false

    function sampleTopLeft() {
      if (!sampling || !ctx || !video) return
      try {
        ctx.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        barColorRef.current = `rgb(${r},${g},${b})`
        if (overlayRef.current) overlayRef.current.style.background = barColorRef.current
      } catch { /* canvas not yet readable */ }
      requestAnimationFrame(sampleTopLeft)
    }

    function startDoors() {
      document.body.classList.remove('intro-active')
      const doorCountNow = isPortraitRef.current ? DOOR_COUNT_PORTRAIT : DOOR_COUNT_LANDSCAPE

      if (loadedCountRef.current === doorCountNow && !isPortraitRef.current) {
        setPhase('doors')
        if (doorFrameRef.current) doorFrameRef.current.src = doorSrcs[0]
        let idx = 1
        const tick = setInterval(() => {
          if (idx >= doorCountNow) {
            clearInterval(tick)
            setPhase('done')
            return
          }
          if (doorFrameRef.current) doorFrameRef.current.src = doorSrcs[idx++]
        }, MS_PER_FRAME)
      } else {
        setPhase('fallback')
        const fbDur = Math.round((doorCountNow / 24) * 1000)
        setTimeout(() => setPhase('done'), fbDur + 100)
      }
    }

    function dismiss() {
      if (dismissedRef.current) return
      dismissedRef.current = true
      sampling = false
      video!.pause()
      startDoors()
    }

    video.addEventListener('ended', dismiss)
    video.addEventListener('loadedmetadata', () => {
      setTimeout(dismiss, video.duration * 1000)
    })
    video.addEventListener('canplay', () => {
      if (!sampling) { sampling = true; requestAnimationFrame(sampleTopLeft) }
    })
    video.addEventListener('error', dismiss)

    video.play().catch(() => {
      if (overlayRef.current) overlayRef.current.style.cursor = 'pointer'
      overlayRef.current?.addEventListener('click', () => video.play().catch(dismiss), { once: true })
    })

    return () => { sampling = false }
  }, [])

  if (!shouldRender || phase === 'done') return null

  return (
    <>
      {phase === 'video' && (
        <div id="intro-overlay" ref={overlayRef}>
          <video id="intro-video" ref={videoRef} muted playsInline preload="auto">
            <source src="/Intro%20Animation/intro.aep_AME/Intro_v3.mp4" type="video/mp4" />
          </video>
          <button
            id="intro-skip"
            onClick={() => {
              videoRef.current?.dispatchEvent(new Event('error'))
            }}
          >
            Skip
          </button>
        </div>
      )}
      {phase === 'doors' && (
        <div id="door-overlay" style={{ display: 'flex' }}>
          <div className="door-bar" id="door-bar-top" style={{ background: barColorRef.current }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="door-frame" ref={doorFrameRef} alt="" />
          <div className="door-bar" id="door-bar-bottom" style={{ background: barColorRef.current }} />
        </div>
      )}
      {phase === 'fallback' && (
        <div id="door-fallback" className="fb-animate" style={{ display: 'flex' }}>
          <div className="door-bar" id="fb-bar-top" style={{ background: barColorRef.current }} />
          <div id="fb-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-wood-frame" src="/Intro%20Animation/wood%20frame.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-door-right" src="/Intro%20Animation/door%20right.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="fb-door-left" src="/Intro%20Animation/door%20left.png" alt="" />
          </div>
          <div className="door-bar" id="fb-bar-bottom" style={{ background: barColorRef.current }} />
        </div>
      )}
    </>
  )
}
