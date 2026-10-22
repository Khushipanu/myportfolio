import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'

// Letters widen (font-stretch) as the pointer gets close, then ease back.
// Runs on fine pointers only and stops when the hero is off screen.
function useStretchLetters(root) {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    const chars = [...root.current.querySelectorAll('[data-stretch]')]
    const state = chars.map(() => ({ cur: 100, target: 100 }))
    const pointer = { x: -9999, y: -9999 }
    const RADIUS = 340
    let raf = 0
    let visible = true

    const tick = () => {
      raf = 0
      let moving = false
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2))
        const t = Math.max(0, 1 - d / RADIUS)
        state[i].target = 100 + 25 * t * t
        state[i].cur += (state[i].target - state[i].cur) * 0.14
        if (Math.abs(state[i].target - state[i].cur) > 0.05) moving = true
        el.style.fontStretch = `${state[i].cur.toFixed(2)}%`
      })
      if (moving && visible) raf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick) }
    const move = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; kick() }
    const leave = () => { pointer.x = -9999; pointer.y = -9999; kick() }

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick() })
    io.observe(root.current)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [root])
}

function Line({ word, className = '' }) {
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {word.toUpperCase().split('').map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-char data-stretch className="inline-block">{c}</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready }) {
  const root = useRef(null)
  const name = useRef(null)
  useStretchLetters(name)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.1 })
          .from('[data-char]', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.05 })
          .from('[data-hero-fade]', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 0.4)

        // On scroll away the two lines drift apart.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-line="1"]', { xPercent: -8, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to(name.current, { yPercent: -10, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-6 pt-24 md:px-10 md:pb-8 md:pt-28"
    >
      <div className="grid grid-cols-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span className="mask max-md:col-span-2"><span data-hero-fade>(Portfolio / 2026)</span></span>
        <span className="mask text-center max-md:hidden"><span data-hero-fade>{profile.role}</span></span>
        <span className="mask col-start-3 text-right"><span data-hero-fade>Haldwani, IN</span></span>
      </div>

      <h1
        ref={name}
        aria-label={profile.name}
        className="my-auto py-10 font-display text-[23vw] uppercase leading-[0.84] md:text-[16.4vw]"
      >
        <span data-line="1" className="block">
          <Line word={profile.firstName} />
        </span>
        <span data-line="2" className="block text-right">
          <Line word={profile.lastName} />
        </span>
      </h1>

      <div className="grid grid-cols-12 items-end gap-x-5 gap-y-6">
        <p className="col-span-12 max-w-sm text-[16px] leading-snug md:col-span-5 md:text-[17px]">
          <span className="mask"><span data-hero-fade>I design and build web applications with the</span></span>
          <span className="mask"><span data-hero-fade>MERN stack — from <em className="font-serif text-[1.15em] italic">interfaces</em> to <em className="font-serif text-[1.15em] italic">APIs</em>.</span></span>
          <span className="mask"><span data-hero-fade className="text-muted">Currently at Ruhanix OPC Pvt. Ltd.</span></span>
        </p>
        <p className="mask col-span-4 hidden text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:col-start-6 md:col-span-2 md:block">
          <span data-hero-fade>↓ Scroll, gently</span>
        </p>
        <div className="mask col-span-12 md:col-span-3 md:col-start-10 md:text-right">
          <span data-hero-fade>
            <button
              type="button"
              onClick={() => scrollToTarget('#work')}
              data-cursor-tone="dark"
              className="inline-flex items-center gap-2 rounded-full border border-ink/40 px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
            >
              See the work <span aria-hidden="true">→</span>
            </button>
          </span>
        </div>
      </div>
    </section>
  )
}
