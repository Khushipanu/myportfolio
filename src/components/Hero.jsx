import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, resume } from '../data/content'
import DotField from './ui/DotField'

// Interactive hero in the jet black / hot pink / chartreuse palette:
// - a dot grid that lights up around the pointer,
// - a name whose letters grow bolder as the pointer nears,
// - a line that cycles through what Khushi builds, and an info strip.
const builds = ['web apps', 'REST APIs', 'ERP systems', 'MERN projects']

function Line({ word, className = '' }) {
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {word.split('').map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-char data-px className="inline-block">{c}</span>
        </span>
      ))}
    </span>
  )
}

// Letters respond to the pointer: the closer it gets, the heavier each one
// becomes (colours stay as they are). Values ease every frame so the motion
// stays fluid.
function useProximity(rootRef, ready) {
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const root = rootRef.current
    const chars = [...root.querySelectorAll('[data-px]')]
    const state = chars.map(() => 0)
    const pointer = { x: -9999, y: -9999 }
    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (window.scrollY > window.innerHeight * 1.2) return
      const R = Math.max(220, window.innerWidth * 0.18)
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2))
        const goal = Math.max(0, 1 - d / R)
        state[i] += (goal - state[i]) * 0.14
        const k = state[i]
        c.style.fontWeight = String(Math.round(700 + k * 200))
      })
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      chars.forEach((c) => { c.style.fontWeight = '' })
    }
  }, [rootRef, ready])
}

function Cycler() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % builds.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-bottom">
      <span key={i} className="cycle-in inline-block border-b-2 border-chartreuse font-semibold leading-[1.15] text-ink">{builds[i]}</span>
    </span>
  )
}

export default function Hero({ ready }) {
  const root = useRef(null)
  const name = useRef(null)
  useProximity(name, ready)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.3 })
          .from('[data-dots]', { autoAlpha: 0, duration: 1.4, ease: 'power2.out' })
          .from('[data-char]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 0.1)
          .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.5)

        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(name.current, { yPercent: -14, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-jet px-5 pb-6 pt-28 text-ink md:px-10 md:pb-8 md:pt-32">
      <div data-dots className="absolute inset-0 -z-10">
        <DotField className="h-full w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[10%] h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,45,168,0.18),transparent)] blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-[10%] bottom-[0%] h-[55vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.12),transparent)] blur-2xl" />
      </div>

      <div className="flex items-center justify-between gap-6">
        <span data-hero-fade className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 bg-jet/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
            <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
          </span>
          Available for work
        </span>
        <span data-hero-fade className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50 md:block">Move your cursor ✦</span>
      </div>

      <div className="relative my-auto py-8">
        <h1
          ref={name}
          aria-label={profile.name}
          className="font-sans leading-[0.9] tracking-[-0.06em] [font-weight:700] text-[20vw] md:text-[min(15vw,27svh)]"
        >
          <Line word={profile.firstName} />
          <Line word={profile.lastName} className="text-chartreuse md:pl-[22vw]" />
        </h1>

        <p data-hero-fade className="mt-8 max-w-2xl font-sans text-[20px] font-normal leading-snug tracking-[-0.02em] text-ink/70 md:mt-10 md:text-[28px]">
          Full Stack Developer — I build <Cycler /> that people enjoy using.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-hero-fade
            onClick={() => scrollToTarget('#work')}
            className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet transition-[translate] duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:-rotate-45">→</span>
            Explore my work
          </button>
          <a
            href={resume.href}
            download={resume.file}
            data-hero-fade
            className="flex items-center gap-2.5 rounded-full border border-pink/60 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-pink transition-colors duration-300 hover:bg-pink hover:text-jet"
          >
            Resume <span aria-hidden="true">↓</span>
          </a>
        </div>

        <dl data-hero-fade className="grid grid-cols-3 gap-6 border-t border-ink/15 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] md:w-[34rem] md:text-[11px]">
          {[
            ['Role', 'Full Stack Dev'],
            ['Stack', 'MERN · React'],
            ['Based in', 'Haldwani, IN'],
          ].map(([k, v], i) => (
            <div key={k}>
              <dt className={i === 1 ? 'text-chartreuse' : 'text-pink'}>{k}</dt>
              <dd className="mt-1.5 text-ink/80">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
