import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

// Desktop-only cursor: a small dot plus a ring that grows (with an optional
// label) over anything marked data-cursor.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    document.documentElement.classList.add('has-cursor')

    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest('[data-cursor], a, button')
      const text = t?.getAttribute('data-cursor') || ''
      label.current.textContent = text
      gsap.to(ring.current, { scale: t ? (text ? 2.6 : 1.8) : 1, duration: 0.4, ease: 'power3' })
      gsap.to(ring.current, { backgroundColor: text ? '#ff4f1f' : 'rgba(255,79,31,0)', borderColor: text ? '#ff4f1f' : '#ece7df', duration: 0.3 })
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.3 })
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
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference [@media(hover:hover)and(pointer:fine)]:block">
      <div ref={dot} className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-paper" />
      <div ref={ring} className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-paper">
        <span ref={label} className="text-[5px] font-semibold uppercase tracking-wider text-ink" />
      </div>
    </div>
  )
}
