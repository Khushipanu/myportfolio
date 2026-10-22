import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

let lenisInstance = null
export const getLenis = () => lenisInstance

// Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  // Leave room for the fixed header, except when jumping back to the top.
  const offset = el.id === 'top' ? 0 : -90
  if (lenisInstance) lenisInstance.scrollTo(el, { duration: 1.6, offset })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
