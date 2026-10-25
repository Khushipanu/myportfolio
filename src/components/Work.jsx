import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import WorkPoster from './WorkPoster'

// Visuvate-style "works" stream: simple project cards flow in from the lower
// left, swing past the "My Works" title close to the viewer and drift away to
// the upper right, in two staggered lanes. The section is held while scrolling moves
// the stream, which also drifts slowly on its own. The card passing the
// centre drives the highlight and lights up its skills. Each card is a link:
// add a project's URL as `href` and its cards open it.
const CARDS = [
  { variant: 'movie', label: 'MovieThrill — home', project: 'MovieThrill', highlight: 'Movie data from The Movie Database (TMDB) API, fetched with Axios.', skills: ['React.js', 'Tailwind CSS', 'JavaScript'], href: null },
  { variant: 'lms', label: 'LMS — courses', project: 'Learning Management System', highlight: 'JWT authentication with student and instructor roles (RBAC).', skills: ['Node.js', 'Express.js', 'MongoDB'], href: null },
  { variant: 'erp', label: 'ERP — records', project: 'ERP · Ruhanix', highlight: 'Reusable React.js components for ERP modules, forms and data views.', skills: ['React.js', 'JavaScript'], href: null },
  { variant: 'movieDetail', label: 'MovieThrill — details', project: 'MovieThrill', highlight: 'App-wide state managed with Redux Toolkit and React-Redux.', skills: ['React.js', 'Redux Toolkit'], href: null },
  { variant: 'lmsPlayer', label: 'LMS — lesson', project: 'Learning Management System', highlight: 'Course purchasing and streaming on a full MERN stack.', skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'], href: null },
]
const SKILLS = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript']
const LANES = [-0.5, 0.5]
const PER_LANE = 4
// Every card's lane and starting place along the stream; the lanes are
// staggered and each cycles through all five projects.
const FLOW = LANES.flatMap((lane, li) =>
  Array.from({ length: PER_LANE }, (_, k) => ({ lane, t0: (k + li / LANES.length) / PER_LANE, v: (k * 2 + li * 3) % CARDS.length })),
)
const RAD = Math.PI / 180

function useStream(stageRef, flowRef, progressRef, onFront) {
  useEffect(() => {
    const stage = stageRef.current
    const cards = [...flowRef.current.querySelectorAll('[data-card]')]
    const shades = cards.map((c) => c.querySelector('[data-shade]'))
    const still = prefersReducedMotion()
    const g = { w: 0, h: 0, cw: 0 }

    const layout = () => {
      g.w = stage.clientWidth
      g.h = stage.clientHeight
      g.cw = g.w < 768 ? g.w * 0.6 : Math.min(g.w * 0.22, g.h * 0.4)
      flowRef.current.style.setProperty('--cw', `${g.cw}px`)
      flowRef.current.style.setProperty('--ch', `${g.cw * 0.7}px`)
      draw()
    }

    const s = { flow: 0, drift: 0 }
    let front = -1
    const draw = () => {
      const { w, h } = g
      const mobile = w < 768
      let best = -1
      let bestD = 9
      FLOW.forEach((c, i) => {
        const t = (((c.t0 + s.flow + s.drift) % 1) + 1) % 1
        const u = t * 2 - 1 // -1 lower left … 1 upper right
        // Along a gentle diagonal arc that bulges towards the viewer.
        const along = mobile ? { x: u * w * 0.55, y: -u * h * 0.55 } : { x: u * w * 0.72, y: -u * h * 0.58 }
        const perp = c.lane * (mobile ? g.cw * 1.1 : g.cw * 1.2)
        const x = along.x + perp * 0.55
        const y = along.y + perp * 0.75 + Math.sin(u * Math.PI) * -h * 0.04
        const z = Math.cos(u * Math.PI * 0.5) * g.cw * 2 - g.cw * 1.1
        const ry = -u * 58
        const rx = u * 14
        const rz = -u * 8 - 6
        const fade = Math.min(1, (1 - Math.abs(u)) * 4)
        cards[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`
        cards[i].style.opacity = fade.toFixed(3)
        cards[i].style.zIndex = String(Math.round(z + 2000))
        shades[i].style.opacity = (Math.min(0.7, Math.abs(u) ** 1.5 * 0.7)).toFixed(3)
        if (Math.abs(u) < bestD) { bestD = Math.abs(u); best = c.v }
      })
      if (best !== front) {
        front = best
        onFront(best)
      }
    }

    let raf = 0
    let last = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(stage)
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? Math.min(64, now - last) : 16.7
      last = now
      if (!visible) return
      const k = still ? 1 : 1 - Math.pow(1 - 0.08, dt / 16.7)
      s.flow += (progressRef.current * 1.4 - s.flow) * k
      if (!still) s.drift += dt * 0.000018
      draw()
    }

    layout()
    raf = requestAnimationFrame(tick)
    const ro = new ResizeObserver(layout)
    ro.observe(stage)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [stageRef, flowRef, progressRef, onFront])
}

function Card({ c }) {
  const Tag = c.href ? 'a' : 'div'
  const link = c.href ? { href: c.href, target: '_blank', rel: 'noreferrer' } : { title: `${c.project} — link coming soon` }
  return (
    <Tag
      data-card
      data-cursor={c.href ? 'Open' : 'Soon'}
      aria-label={c.label}
      {...link}
      className="absolute left-0 top-0 block cursor-pointer will-change-transform [backface-visibility:visible]"
      style={{ width: 'var(--cw)', height: 'var(--ch)', marginLeft: 'calc(var(--cw) / -2)', marginTop: 'calc(var(--ch) / -2)' }}
    >
      <WorkPoster variant={c.variant} className="h-full w-full rounded-[14px] border border-white/30 text-[calc(var(--cw)/19)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]" />
      <span data-shade className="pointer-events-none absolute inset-0 rounded-[14px] bg-black" />
    </Tag>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const flow = useRef(null)
  const [front, setFront] = useState(0)
  const progress = useRef(0)
  useStream(stage, flow, progress, setFront)
  const active = CARDS[front]

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
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-[radial-gradient(ellipse_at_50%_45%,#141414_0%,#080808_60%,#030303_100%)] text-ink">
      <div
        ref={stage}
        className="relative h-[100svh] select-none overflow-hidden"
      >
        {/* A web of glowing, electric lines behind the stream, drifting slowly. */}
        <svg aria-hidden="true" className="work-lines pointer-events-none absolute inset-[-6%] h-[112%] w-[112%]" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="line-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          {[
            ['M-60 700 C 220 380, 520 900, 820 540 S 1260 220, 1520 360', '#d4ff3f'],
            ['M-80 210 C 260 60, 540 520, 900 280 S 1300 80, 1520 220', '#ff2da8'],
            ['M-40 880 C 360 620, 700 1000, 1060 700 S 1380 500, 1520 600', '#d4ff3f'],
            ['M180 -40 C 420 240, 120 560, 520 760 S 860 980, 980 1000', '#ff2da8'],
            ['M1500 -20 C 1160 240, 1400 560, 1040 760 S 760 980, 620 1000', '#d4ff3f'],
            ['M-60 460 C 300 560, 600 180, 980 420 S 1320 700, 1520 520', '#ff2da8'],
            ['M620 -40 C 760 200, 520 420, 820 620 S 1100 900, 1160 1000', '#d4ff3f'],
            ['M-40 60 C 240 300, 460 120, 700 360 S 1000 820, 1300 960', '#ff2da8'],
          ].map(([d, c], i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={c} strokeOpacity="0.22" strokeWidth="14" filter="url(#line-glow)" />
              <path d={d} fill="none" stroke={c} strokeOpacity="0.55" strokeWidth="1.3" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">(02) Selected work</p>

        <div className="absolute inset-0 z-0 [perspective:1600px] [perspective-origin:50%_50%]">
          <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
            {/* The title sits mid-stream: far cards pass behind it, near cards over it. */}
            <h2 id="work-title" className="pointer-events-none absolute left-0 top-0 [transform:translate(-50%,-50%)]">
              <span data-work-title className="block whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]">My Works</span>
            </h2>
            <div ref={flow} className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]">
              {FLOW.map((p, i) => (
                <Card key={i} c={CARDS[p.v]} />
              ))}
            </div>
          </div>
        </div>

        {/* Core skills; the ones used in the front card light up. */}
        <ul aria-label="Core skills" className="pointer-events-none absolute left-5 right-5 top-32 z-20 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] md:left-auto md:right-10 md:top-28 md:flex-col md:items-end md:gap-2 md:text-[11px]">
          {SKILLS.map((k) => (
            <li key={k} className={`transition-colors duration-500 ${active.skills.includes(k) ? 'text-accent' : 'text-ink/35'}`}>{k}</li>
          ))}
        </ul>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Highlight of the card facing front. */}
        <div aria-live="polite" className="pointer-events-none absolute bottom-14 left-5 right-5 z-20 md:bottom-10 md:left-10 md:right-auto md:max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="text-accent">{String(front + 1).padStart(2, '0')}</span> / {String(CARDS.length).padStart(2, '0')} · Highlight
          </p>
          <div key={front} className="animate-[work-in_0.7s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="mt-3 font-serif text-[26px] italic leading-none text-ink md:text-[30px]">{active.project}</p>
            <p className="mt-2 text-[14px] font-light leading-relaxed text-ink/65 md:text-[15px]">{active.highlight}</p>
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-6 right-5 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:bottom-10 md:right-10">Scroll ↓</p>
      </div>
    </section>
  )
}
