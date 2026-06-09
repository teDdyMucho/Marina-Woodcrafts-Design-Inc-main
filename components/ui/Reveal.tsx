'use client'

import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, as = 'div', className = '', style }: RevealProps) {
  const { ref, visible } = useReveal()
  const classes = ['reveal', className, visible ? 'visible' : ''].filter(Boolean).join(' ')

  return createElement(as, { ref, className: classes, style }, children)
}
