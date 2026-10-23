import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

// Desktop-only cursor matching the reference: a small orange dot that tracks the
// pointer closely and a thin grey ring that trails behind it. Over elements
// marked data-cursor-tone="dark" (light buttons) the dot turns dark.
export default function Cursor() {
  const wrap = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    document.documentElement.classList.add('has-cursor')
    wrap.current.style.display = 'block'
    gsap.set([dot.current, ring.current], { autoAlpha: 0 })
    let shown = false

    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 })
      }
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
    }
    const over = (e) => {
      const dark = e.target.closest('[data-cursor-tone="dark"]')
      gsap.to(dot.current, { backgroundColor: dark ? '#131313' : '#f5894b', duration: 0.25 })
      gsap.to(ring.current, {
        borderColor: dark ? 'rgba(19,19,19,0.45)' : 'rgba(233,228,223,0.28)',
        duration: 0.4,
        ease: 'power3',
      })
    }
    const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 })
    const enter = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 })

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ display: 'none' }}>
      <div ref={ring} className="absolute -left-[22px] -top-[22px] h-11 w-11 rounded-full border border-ink/30" />
      <div ref={dot} className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full bg-accent" />
    </div>
  )
}
