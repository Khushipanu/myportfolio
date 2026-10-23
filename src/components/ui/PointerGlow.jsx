import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

// Site-wide soft spotlight that follows the pointer, plus a small ripple on
// click — both from the "Digital Serenity" component, tinted with the accent.
export default function PointerGlow() {
  const glow = useRef(null)
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    // Eased follow on the GPU (transform only), so it trails smoothly.
    const el = glow.current
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const x = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
    let shown = false
    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { autoAlpha: 1, duration: 0.4 })
      }
      x(e.clientX); y(e.clientY)
    }
    const leave = () => { shown = false; gsap.to(el, { autoAlpha: 0, duration: 0.4 }) }
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
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[36rem] w-[36rem] rounded-full opacity-0 will-change-transform"
        style={{ background: 'radial-gradient(circle closest-side, rgba(111,220,155,0.08), rgba(111,220,155,0.03) 45%, rgba(111,220,155,0) 100%)' }}
      />
      {ripples.map((r) => (
        <span key={r.id} aria-hidden="true" className="s-ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </>
  )
}
