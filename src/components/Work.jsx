import { useEffect, useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import Art from './Art'

// Visuvate-inspired: screens of the work wrap a rising 3D helix. Scrolling turns
// and lifts it, dragging (mouse or touch) spins it with momentum, and every
// value eases toward its target each frame so the motion stays smooth.
const screens = [
  { variant: 'movie', label: 'MovieThrill', meta: 'Home', target: '#project-moviethrill' },
  { variant: 'lms', label: 'LMS', meta: 'Courses', target: '#project-lms' },
  { variant: 'erp', label: 'ERP', meta: 'Records', target: '#experience' },
  { variant: 'movieDetail', label: 'MovieThrill', meta: 'Details', target: '#project-moviethrill' },
  { variant: 'lmsPlayer', label: 'LMS', meta: 'Lesson', target: '#project-lms' },
  { variant: 'ui', label: 'Components', meta: 'React · Tailwind', target: '#project-moviethrill' },
  { variant: 'lmsRoles', label: 'LMS', meta: 'Roles', target: '#project-lms' },
  { variant: 'erpForm', label: 'ERP', meta: 'Forms', target: '#experience' },
]
const CARDS = Array.from({ length: 16 }, (_, i) => screens[i % screens.length])
const PER_TURN = 7
const STEP = 360 / PER_TURN

function useHelix(stageRef, ringRef, progressRef) {
  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const cards = [...ring.querySelectorAll('[data-card]')]
    const still = prefersReducedMotion()

    let rise = 50
    const layout = () => {
      const w = stage.clientWidth
      const cw = Math.max(150, Math.min(300, w * (w < 768 ? 0.42 : 0.18)))
      const ch = cw * 0.75
      const radius = cw * (w < 768 ? 1.05 : 1.25)
      rise = ch * 0.17
      ring.style.setProperty('--cw', `${cw}px`)
      cards.forEach((el, i) => {
        const y = (i - (CARDS.length - 1) / 2) * rise
        el.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radius}px) translateY(${-y}px)`
      })
    }
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(stage)

    // Rotation = scroll-driven angle + drag offset + slow idle drift.
    const s = { cur: 0, drag: 0, vel: 0, liftCur: 0 }
    let dragging = false
    let lastX = 0
    let travelled = 0
    const down = (e) => {
      dragging = true
      lastX = e.clientX
      travelled = 0
      s.vel = 0
    }
    const move = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      travelled += Math.abs(dx)
      s.drag += dx * 0.25
      s.vel = dx * 0.25
    }
    const up = () => { dragging = false }
    // A drag shouldn't also count as a click on the card under the pointer.
    const click = (e) => { if (travelled > 6) { e.preventDefault(); e.stopPropagation() } }
    stage.addEventListener('pointerdown', down)
    stage.addEventListener('click', click, true)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(stage)

    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      const p = progressRef.current
      if (!dragging) {
        s.drag += s.vel
        s.vel *= 0.94
        if (!still) s.drag -= dt * 6
      }
      const angle = -p * 360 * 1.4 + s.drag
      s.cur += (angle - s.cur) * 0.08
      const lift = (p - 0.5) * rise * CARDS.length * 0.7
      s.liftCur += (lift - s.liftCur) * 0.08
      ring.style.transform = `translateY(${s.liftCur.toFixed(2)}px) rotateX(-8deg) rotateY(${s.cur.toFixed(3)}deg)`

      // Dim cards as they turn away from the viewer.
      cards.forEach((el, i) => {
        const a = ((i * STEP + s.cur) % 360 + 360) % 360
        const k = (Math.cos((a * Math.PI) / 180) + 1) / 2
        el.style.opacity = (0.25 + k * 0.75).toFixed(3)
        el.style.filter = `brightness(${(0.45 + k * 0.55).toFixed(3)})`
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      stage.removeEventListener('pointerdown', down)
      stage.removeEventListener('click', click, true)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [stageRef, ringRef, progressRef])
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const ring = useRef(null)
  const progress = useRef(0)
  useHelix(stage, ring, progress)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=220%',
          pin: stage.current,
          onUpdate: (self) => { progress.current = self.progress },
        })
        gsap.from('[data-work-title]', {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-paper text-ink">
      <div ref={stage} className="relative h-[100svh] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing">
        {/* Soft light ribbons in the background, like the reference's glow lines. */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="ribbon-blur"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>
          {[
            'M-50 620 C 300 380, 620 820, 980 520 S 1400 300, 1520 420',
            'M-80 260 C 260 120, 520 520, 860 330 S 1300 120, 1520 260',
            'M-40 820 C 400 640, 760 980, 1100 700 S 1400 560, 1520 640',
          ].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke="rgba(111,220,155,0.16)" strokeWidth="6" filter="url(#ribbon-blur)" />
              <path d={d} fill="none" stroke="rgba(198,242,216,0.3)" strokeWidth="1" />
            </g>
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-x-5 top-24 flex items-start justify-between md:inset-x-10 md:top-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(02) Selected work</p>
          <p className="hidden max-w-[16rem] text-right text-sm text-muted md:block">Scroll or drag to turn the work.</p>
        </div>

        <h2
          id="work-title"
          data-work-title
          className="font-tall pointer-events-none absolute inset-0 flex items-center justify-center text-[26vw] uppercase leading-none text-ink/[0.07] md:text-[19vw]"
        >
          Work
        </h2>

        <div className="absolute inset-0 top-[6%] [perspective:1600px] [perspective-origin:50%_40%]">
          <div ref={ring} className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform [transform-style:preserve-3d]">
            {CARDS.map((c, i) => (
              <div key={i} data-card className="absolute left-0 top-0 [backface-visibility:hidden]" style={{ width: 'var(--cw)' }}>
                <button
                  type="button"
                  onClick={() => scrollToTarget(c.target)}
                  aria-label={`${c.label} — ${c.meta}`}
                  className="group block w-full text-left"
                >
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                    <Art
                      variant={c.variant}
                      className="aspect-[4/3] w-full rounded-[10px] text-[calc(var(--cw)/20)] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] ring-1 ring-ink/10 transition-shadow duration-500 group-hover:ring-accent/60"
                    />
                  </span>
                  <span className="mt-2 flex items-baseline justify-between gap-3 text-[11px]">
                    <span className="font-medium">{c.label}</span>
                    <span className="text-ink/50">{c.meta}</span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-6 left-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:left-10">MERN · React.js · Node.js</p>
        <p className="pointer-events-none absolute bottom-6 right-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:right-10">Drag ⟷</p>
      </div>
    </section>
  )
}
