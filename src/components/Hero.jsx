import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'
import Orb3D from './Orb3D'

const Sparkle = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}><path fill="currentColor" d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z" /></svg>
)

const dots = [
  { href: '#top', label: 'Intro' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
]

// Letters widen (font-stretch) as the pointer gets close, then ease back.
// Runs on fine pointers only and stops when the hero is off screen.
function useStretchLetters(root) {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    const chars = [...root.current.querySelectorAll('[data-stretch]')]
    const BASE = 100
    const state = chars.map(() => ({ cur: BASE, target: BASE }))
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
        state[i].target = BASE + 22 * t * t
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
        gsap.timeline({ delay: 0.35 })
          .from('[data-char]', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.06 })
          .from('[data-hero-fade]', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 0.4)
          .from('[data-hero-rule]', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.3)
          .from('[data-sparkle]', { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(2)' }, 0.6)

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
      <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span className="mask"><span data-hero-fade>// 01</span></span>
        <span className="relative block h-px w-40 bg-ink/15">
          <span data-hero-rule className="absolute inset-y-0 left-0 w-1/4 origin-left bg-ink/80" />
        </span>
      </div>

      <div className="relative my-auto py-6">
        <h1
          ref={name}
          aria-label={profile.name}
          className="hero-name relative z-10 uppercase leading-[0.86] text-[21vw] md:text-[12.6vw]"
        >
          <span data-line="1" className="relative block md:pl-[0.3em]">
            <span data-sparkle className="absolute left-0 top-[0.1em] block w-[0.13em] text-accent max-md:hidden">
              <Sparkle className="h-auto w-full" />
            </span>
            <Line word={profile.firstName} />
          </span>
          <span data-line="2" className="block text-right">
            <Line word={profile.lastName} />
          </span>
        </h1>

        {ready && <Orb3D className="absolute right-[2%] top-[-46%] z-0 h-[52vw] w-[52vw] md:right-[13%] md:top-[-30%] md:h-[25vw] md:w-[25vw]" data-orb />}

        <div className="mt-8 max-w-xl md:absolute md:bottom-[-4%] md:left-[4.2%] md:mt-0">
          <p className="mask text-[22px] leading-tight tracking-[-0.01em] md:text-[2.3vw]"><span data-hero-fade>I turn ideas into</span></p>
          <p className="mask font-serif text-[26px] italic leading-tight text-accent md:text-[2.7vw]">
            <span data-hero-fade>interactive digital experiences.</span>
          </p>
          <div className="mask mt-6 border-l-2 border-accent/70 pl-4">
            <p data-hero-fade className="max-w-xs text-[13px] leading-relaxed text-ink/60">
              <span className="text-ink/85">Developer. Builder. Problem Solver.</span><br />Full Stack Developer passionate about building modern web applications, clean code and meaningful user experiences.
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Sections" className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:right-10 md:flex">
        {dots.map((d, i) => (
          <a
            key={d.href}
            href={d.href}
            onClick={(e) => { e.preventDefault(); scrollToTarget(d.href) }}
            aria-label={d.label}
            className={`block h-1.5 w-1.5 rounded-full transition-colors hover:bg-accent ${i === 0 ? 'bg-accent' : 'bg-ink/30'}`}
          />
        ))}
        <span className="mt-2 block h-40 w-px bg-ink/15" />
      </nav>

      <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="mask shrink-0">
          <span data-hero-fade className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border border-ink/20 border-t-accent [animation-duration:2.4s]" aria-hidden="true" />
            Scroll to explore
          </span>
        </span>
        <span className="h-px flex-1 bg-ink/10" />
        <span className="mask shrink-0">
          <button
            type="button"
            data-hero-fade
            onClick={() => scrollToTarget('#work')}
            className="group flex items-center gap-3 border-b border-accent/60 pb-1.5 uppercase tracking-[0.14em] hover:text-ink"
          >
            Based in India
            <span aria-hidden="true" className="text-lg leading-none text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </button>
        </span>
      </div>
    </section>
  )
}
