import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

// Site-wide soft spotlight that follows the pointer, plus a small ripple on
// click — both from the "Digital Serenity" component, tinted with the accent.
export default function PointerGlow() {
  const glow = useRef(null)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const move = (e) => {
      const el = glow.current
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      el.style.opacity = '1'
    }
    const leave = () => { glow.current.style.opacity = '0' }
    const click = (e) => {
      if (prefersReducedMotion()) return
      const r = { id: performance.now(), x: e.clientX, y: e.clientY }
      setRipples((p) => [...p, r])
      setTimeout(() => setRipples((p) => p.filter((x) => x.id !== r.id)), 900)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('click', click)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('click', click)
    }
  }, [])

  return (
    <>
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[28rem] w-[28rem] rounded-full opacity-0 blur-3xl transition-opacity duration-300 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(245,137,75,0.09), rgba(245,137,75,0.03) 45%, transparent 70%)' }}
      />
      {ripples.map((r) => (
        <span key={r.id} aria-hidden="true" className="s-ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </>
  )
}
