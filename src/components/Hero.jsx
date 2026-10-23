import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'
import SerenityBackdrop from './ui/SerenityBackdrop'

const dots = [
  { href: '#top', label: 'Intro' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
]

// Letters near the pointer (or a finger) lift slightly and fade to green.
// Each letter eases toward its target every frame, so motion stays smooth
// whatever the pointer does; the loop sleeps once everything settles.
function useLetterLift(root) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const els = [...root.current.querySelectorAll('[data-lift]')]
    const cur = els.map(() => 0)
    const pointer = { x: -9999, y: -9999 }
    const RADIUS = 260
    let raf = 0
    let visible = true
    let release = 0

    const tick = () => {
      raf = 0
      let moving = false
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2))
        const t = Math.max(0, 1 - d / RADIUS)
        const target = t * t * (3 - 2 * t)
        cur[i] += (target - cur[i]) * 0.12
        if (Math.abs(target - cur[i]) > 0.002) moving = true
        el.style.transform = `translate3d(0, ${(-cur[i] * 7).toFixed(2)}%, 0)`
        el.style.setProperty('--lift', cur[i].toFixed(3))
      })
      if (moving && visible) raf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick) }
    const set = (x, y) => { pointer.x = x; pointer.y = y; kick() }
    const move = (e) => set(e.clientX, e.clientY)
    const down = (e) => {
      if (e.pointerType === 'mouse') return
      clearTimeout(release)
      set(e.clientX, e.clientY)
    }
    const up = (e) => {
      if (e.pointerType === 'mouse') return
      release = setTimeout(() => set(-9999, -9999), 450)
    }
    const leave = () => set(-9999, -9999)

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick() })
    io.observe(root.current)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(release)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [root])
}

function Line({ word, className = '' }) {
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {word.toUpperCase().split('').map((c, i) => (
        <span key={i} data-lift className="lift inline-block overflow-hidden align-bottom will-change-transform">
          <span data-char className="inline-block">{c}</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready }) {
  const root = useRef(null)
  const name = useRef(null)
  useLetterLift(name)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.35 })
          .from('[data-char]', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.06 })
          .from('[data-hero-fade]', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 0.4)
          .from('[data-word]', { autoAlpha: 0, y: 30, scale: 0.85, filter: 'blur(10px)', duration: 0.9, ease: 'power3.out', stagger: 0.09, clearProps: 'filter,transform' }, 0.7)
          .from('[data-hero-rule]', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.3)

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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-5 pb-6 pt-24 md:px-10 md:pb-8 md:pt-28"
    >
      <SerenityBackdrop start={ready} id="hero-grid" className="-z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow glow-deep drift right-[-10%] top-[2%] h-[70vh] w-[55vw]" />
        <div className="glow glow-mint drift-slow bottom-[-25%] left-[-12%] h-[70vh] w-[50vw]" />
        <div className="glow glow-soft drift bottom-[5%] right-[20%] h-[40vh] w-[30vw]" />
      </div>

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
          className="hero-name relative z-10 uppercase leading-[0.84] text-[30vw] md:text-[19vw]"
        >
          <span data-line="1" className="relative block">
            <Line word={profile.firstName} />
          </span>
          <span data-line="2" className="block text-right">
            <Line word={profile.lastName} />
          </span>
        </h1>


        <div className="mt-8 max-w-xl md:absolute md:bottom-[2%] md:left-0 md:mt-0">
          <p className="text-[22px] leading-tight tracking-[-0.01em] md:text-[2.3vw]">
            {'I turn ideas into'.split(' ').map((w, i) => (
              <span key={i} data-word className="word mr-[0.25em]">{w}</span>
            ))}
          </p>
          <p className="w-fit font-serif text-accent text-[26px] italic leading-tight md:text-[2.7vw]">
            {'interactive digital experiences.'.split(' ').map((w, i) => (
              <span key={i} data-word className="word mr-[0.22em]">{w}</span>
            ))}
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
