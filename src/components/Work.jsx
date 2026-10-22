import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MotionPathPlugin, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import Art from './Art'

// Visuvate-inspired: a handful of frames travel along an S-curve as you scroll.
const cards = [
  { variant: 'movie', label: 'MovieThrill', meta: 'React.js · Redux Toolkit', target: '#project-moviethrill' },
  { variant: 'lms', label: 'Learning Management System', meta: 'MERN Stack', target: '#project-lms' },
  { variant: 'code', label: 'RESTful APIs', meta: 'Node.js · Express.js', target: '#project-lms' },
  { variant: 'ui', label: 'Reusable Components', meta: 'React.js · Tailwind CSS', target: '#project-moviethrill' },
  { variant: 'erp', label: 'ERP Modules', meta: 'Ruhanix — 2026', target: '#experience' },
]

// Path drawn in a 1000 × 600 box and scaled to the stage.
const PATH = 'M 1120 40 C 760 40, 700 300, 500 300 S 240 560, -120 560'
const GAP = 0.3
// Where the first card sits when the section pins, and where the last one stops.
const START = 0.22
const END = 0.62

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const pathRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const els = gsap.utils.toArray('[data-card]', root.current)
        const raw = MotionPathPlugin.getRawPath(pathRef.current)
        MotionPathPlugin.cacheRawPathMeasurements(raw)

        const place = (progress) => {
          const { clientWidth: w, clientHeight: h } = stage.current
          const total = END - START + GAP * (els.length - 1)
          els.forEach((el, i) => {
            const p = START + progress * total - i * GAP
            const t = gsap.utils.clamp(0, 1, p)
            const pt = MotionPathPlugin.getPositionOnPath(raw, t)
            const focus = 1 - Math.min(1, Math.abs(t - 0.5) * 2)
            gsap.set(el, {
              x: (pt.x / 1000) * w,
              y: (pt.y / 600) * h,
              xPercent: -50,
              yPercent: -50,
              scale: 0.62 + focus * 0.5,
              rotation: (0.5 - t) * 14,
              zIndex: Math.round(focus * 10),
              autoAlpha: p <= 0 || p >= 1 ? 0 : 1,
            })
          })
        }

        place(0)
        ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: '+=320%',
            pin: stage.current,
            scrub: 1,
            onUpdate: (self) => place(self.progress),
            onRefresh: (self) => place(self.progress),
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative bg-paper-2 text-ink">
      <div ref={stage} className="relative h-[100svh] overflow-hidden motion-reduce:hidden">
        <div className="absolute inset-x-5 top-24 flex items-start justify-between md:inset-x-10 md:top-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">(02) Selected work</p>
          <p className="hidden max-w-[16rem] text-right text-sm text-ink/60 md:block">
            Two projects, one stack — scroll to move through the work.
          </p>
        </div>

        <h2 id="work-title" className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[20vw] uppercase leading-none text-ink/[0.05] md:text-[15vw]">
          Work
        </h2>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path ref={pathRef} d={PATH} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <ul className="absolute inset-0">
          {cards.map((c, i) => (
            <li key={i} data-card className="absolute left-0 top-0 w-[58vw] text-[2.2vw] md:w-[22vw] md:text-[0.9vw]" style={{ opacity: 0 }}>
              <button
                type="button"
                onClick={() => scrollToTarget(c.target)}
                data-cursor="View"
                className="group block w-full text-left"
              >
                <Art variant={c.variant} className="aspect-[4/3] w-full rounded-[4px] ring-1 ring-ink/10 transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-ink/50">{c.meta}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="absolute bottom-6 left-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:left-10">MERN · React.js · Node.js</p>
        <p className="absolute bottom-6 right-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:right-10">Scroll</p>
      </div>

      {/* Calm fallback for people who prefer reduced motion. */}
      <div className="hidden px-5 py-24 motion-reduce:block md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">(02) Selected work</p>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <li key={i} className="text-[2.6vw] md:text-[1vw]">
              <Art variant={c.variant} className="aspect-[4/3] w-full rounded-[4px]" />
              <p className="mt-3 flex justify-between text-[13px]"><span>{c.label}</span><span className="text-ink/50">{c.meta}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
