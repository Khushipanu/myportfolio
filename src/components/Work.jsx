import { useEffect, useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import Art from './Art'

// Visuvate-style "works" vortex: project screens ride a tilted helix like a
// conveyor, curving around it (each card is built from thin vertical slices
// placed on the cylinder), with their backs showing as they turn away. The
// flow advances on its own, faster with scroll, and can be dragged with a
// mouse or finger; every value eases per frame so motion stays smooth.
const screens = [
  { variant: 'movie', label: 'MovieThrill — home', target: '#project-moviethrill' },
  { variant: 'lms', label: 'LMS — courses', target: '#project-lms' },
  { variant: 'erp', label: 'ERP — records', target: '#experience' },
  { variant: 'movieDetail', label: 'MovieThrill — details', target: '#project-moviethrill' },
  { variant: 'lmsPlayer', label: 'LMS — lesson', target: '#project-lms' },
  { variant: 'ui', label: 'Reusable components', target: '#project-moviethrill' },
  { variant: 'lmsRoles', label: 'LMS — roles', target: '#project-lms' },
  { variant: 'erpForm', label: 'ERP — forms', target: '#experience' },
]
const COUNT = 17
const CARDS = Array.from({ length: COUNT }, (_, i) => screens[i % screens.length])
const PER_TURN = 6
const STEP = 360 / PER_TURN
const SPAN = COUNT * STEP
const SLICES = 5
// The helix axis leans to the right as it rises; cards stay upright.
const LEAN = 1.25

function useVortex(stageRef, ringRef, progressRef) {
  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const cards = [...ring.querySelectorAll('[data-card]')]
    const slices = cards.map((c) => [...c.querySelectorAll('[data-slice]')])
    const shades = cards.map((c) => [...c.querySelectorAll('[data-shade]')])
    const still = prefersReducedMotion()

    const g = { cw: 260, ch: 195, r: 300, pitch: 240, dSlice: 0 }
    const layout = () => {
      const w = stage.clientWidth
      g.cw = Math.max(150, Math.min(320, w * (w < 768 ? 0.42 : 0.165)))
      g.ch = g.cw * 0.72
      g.r = (PER_TURN * g.cw * 1.04) / (2 * Math.PI)
      g.pitch = g.ch * 1.15
      g.dSlice = ((g.cw / SLICES) / g.r) * (180 / Math.PI)
      ring.style.setProperty('--cw', `${g.cw}px`)
      ring.style.setProperty('--ch', `${g.ch}px`)
      ring.style.setProperty('--sw', `${g.cw / SLICES + 0.6}px`)
    }
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(stage)

    // offset (degrees along the helix) = idle drift + scroll + drag.
    const s = { drift: 0, drag: 0, vel: 0, scrollCur: 0, offset: 0 }
    let dragging = false
    let lastX = 0
    let lastY = 0
    let travelled = 0
    const down = (e) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      travelled = 0
      s.vel = 0
    }
    const move = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      travelled += Math.abs(dx) + Math.abs(dy)
      const d = (dx - dy * 0.5) * 0.3
      s.drag += d
      s.vel = d
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

    const wrap = (v) => ((v % SPAN) + SPAN) % SPAN
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      if (!dragging) {
        s.drag += s.vel
        s.vel *= 0.94
      }
      if (!still) s.drift += dt * 9
      const scroll = progressRef.current * SPAN * 0.9
      s.scrollCur += (scroll - s.scrollCur) * 0.09
      const target = s.drift + s.scrollCur + s.drag
      s.offset += (target - s.offset) * 0.15

      for (let i = 0; i < COUNT; i++) {
        // Position along the helix, centred so the middle sits in view.
        const a = wrap(i * STEP + s.offset) - SPAN / 2
        const y = (-a / 360) * g.pitch
        const edge = Math.min(1, (470 - Math.abs(a)) / (STEP * 1.1))
        const x = -y * LEAN
        // Opacity/filter go on the slices: on the card they would flatten its 3D curve.
        cards[i].style.visibility = edge <= 0 ? 'hidden' : 'visible'
        const op = Math.max(0, edge).toFixed(3)
        const sl = slices[i]
        for (let j = 0; j < SLICES; j++) {
          const sa = a + (j - (SLICES - 1) / 2) * g.dSlice
          const ks = (Math.cos((sa * Math.PI) / 180) + 1) / 2
          const el = sl[j]
          el.style.opacity = op
          shades[i][j].style.opacity = ((1 - ks) * 0.78).toFixed(3)
          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) rotateY(${sa.toFixed(3)}deg) translateZ(${g.r.toFixed(1)}px)`
        }
      }
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

function Card({ c }) {
  return (
    <div data-card className="absolute left-0 top-0 [transform-style:preserve-3d]">
      {Array.from({ length: SLICES }).map((_, j) => (
        <div
          key={j}
          data-slice
          className="absolute left-0 top-0 overflow-hidden will-change-transform [backface-visibility:visible]"
          style={{ width: 'var(--sw)', height: 'var(--ch)' }}
        >
          <div className="absolute top-0 h-full" style={{ width: 'var(--cw)', left: `calc(var(--cw) / ${SLICES} * ${-j})` }}>
            <Art
              variant={c.variant}
              className={`h-full w-full text-[calc(var(--cw)/19)] ${j === 0 ? 'rounded-l-[10px]' : ''} ${j === SLICES - 1 ? 'rounded-r-[10px]' : ''}`}
            />
          </div>
          <div data-shade className="pointer-events-none absolute inset-0 bg-black" />
        </div>
      ))}
    </div>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const ring = useRef(null)
  const progress = useRef(0)
  useVortex(stage, ring, progress)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          pin: stage.current,
          onUpdate: (self) => { progress.current = self.progress },
        })
        gsap.from('[data-work-title]', {
          yPercent: 30,
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
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-[#0b0d0c] text-ink">
      <div ref={stage} data-cursor="Drag" className="relative h-[100svh] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing">
        {/* Glowing light ribbons behind the vortex. */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="ribbon-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          {[
            'M-60 700 C 260 420, 520 900, 860 560 S 1300 260, 1520 380',
            'M-80 230 C 240 80, 560 520, 900 300 S 1280 60, 1520 200',
            'M-40 880 C 380 640, 720 1000, 1060 720 S 1380 520, 1520 600',
            'M200 -40 C 420 260, 160 560, 520 760 S 880 980, 980 1000',
            'M1500 -20 C 1180 260, 1380 540, 1040 760 S 760 980, 640 1000',
          ].map((d, i) => (
            <g key={i} opacity={i > 2 ? 0.6 : 1}>
              <path d={d} fill="none" stroke="rgba(47,158,102,0.55)" strokeWidth="10" filter="url(#ribbon-glow)" />
              <path d={d} fill="none" stroke="rgba(198,242,216,0.55)" strokeWidth="1.2" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,13,12,0.85)_80%)]" />

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">(02) Selected work</p>

        <h2
          id="work-title"
          data-work-title
          className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]"
        >
          My Works
        </h2>

        <div className="absolute inset-0 [perspective:1500px] [perspective-origin:50%_50%]">
          <div
            ref={ring}
            className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
            style={{ transform: 'rotateX(-8deg)' }}
          >
            {CARDS.map((c, i) => (
              <button key={i} type="button" onClick={() => scrollToTarget(c.target)} aria-label={c.label} className="contents">
                <Card c={c} />
              </button>
            ))}
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-6 right-5 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:right-10">Drag ⟷</p>
      </div>
    </section>
  )
}
