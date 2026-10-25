import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import WorkPoster from './WorkPoster'

// Visuvate-style works: the five project cards sit on an S-shaped wave that
// winds down the page, swinging right, left, right… Each card is curved like
// a sheet of paper and turned towards the middle. While the section is held,
// scrolling carries the wave upwards so the cards come to the front one by
// one (1 → 5), then the page moves on. The card at the front drives the
// highlight and lights up its skills. Each card is a link: add a project's
// URL as `href` and it opens.
const CARDS = [
  { variant: 'movie', label: 'MovieThrill — home', project: 'MovieThrill', highlight: 'Movie data from The Movie Database (TMDB) API, fetched with Axios.', skills: ['React.js', 'Tailwind CSS', 'JavaScript'], href: null },
  { variant: 'lms', label: 'LMS — courses', project: 'Learning Management System', highlight: 'JWT authentication with student and instructor roles (RBAC).', skills: ['Node.js', 'Express.js', 'MongoDB'], href: null },
  { variant: 'erp', label: 'ERP — records', project: 'ERP · Ruhanix', highlight: 'Reusable React.js components for ERP modules, forms and data views.', skills: ['React.js', 'JavaScript'], href: null },
  { variant: 'movieDetail', label: 'MovieThrill — details', project: 'MovieThrill', highlight: 'App-wide state managed with Redux Toolkit and React-Redux.', skills: ['React.js', 'Redux Toolkit'], href: null },
  { variant: 'lmsPlayer', label: 'LMS — lesson', project: 'Learning Management System', highlight: 'Course purchasing and streaming on a full MERN stack.', skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'], href: null },
]
const SKILLS = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript']
const SLICES = 7
const RAD = Math.PI / 180
const smooth = (k) => k * k * (3 - 2 * k)

function useWave(stageRef, trackRef, progressRef, onFront) {
  useEffect(() => {
    const stage = stageRef.current
    const cards = [...trackRef.current.querySelectorAll('[data-card]')]
    const shades = cards.map((c) => [...c.querySelectorAll('[data-shade]')])
    const still = prefersReducedMotion()
    const g = { w: 0, h: 0, cw: 0, ch: 0, bend: [] }

    const layout = () => {
      g.w = stage.clientWidth
      g.h = stage.clientHeight
      const mobile = g.w < 768
      g.cw = mobile ? g.w * 0.6 : Math.min(g.w * 0.25, g.h * 0.46)
      g.ch = g.cw * 0.7
      // Each card bends round a vertical cylinder, like a sheet of paper.
      const r = g.cw * 1.15
      const d = (g.cw / SLICES) / r / RAD
      g.bend = Array.from({ length: SLICES }, (_, j) => (j - (SLICES - 1) / 2) * d)
      const el = trackRef.current
      el.style.setProperty('--cw', `${g.cw}px`)
      el.style.setProperty('--ch', `${g.ch}px`)
      el.style.setProperty('--sw', `${g.cw / SLICES + 1.2}px`)
      cards.forEach((c) => {
        ;[...c.querySelectorAll('[data-slice]')].forEach((sl, j) => {
          sl.style.transform = `rotateY(${g.bend[j].toFixed(3)}deg) translateZ(${r.toFixed(1)}px) translate(-50%, -50%)`
        })
        c.style.setProperty('--r', `${r}px`)
      })
      draw()
    }

    const s = { u: 0 }
    let front = -1
    const draw = () => {
      const { w, h, cw } = g
      const mobile = w < 768
      // Cards sit close together, so the ones above and below stay in view.
      const amp = mobile ? w * 0.16 : w * 0.19
      const gap = mobile ? h * 0.25 : h * 0.27
      let best = 0
      let bestD = 9
      cards.forEach((c, i) => {
        const d = i - s.u // 0 = at the front; 1 = next one down
        const a = Math.min(1, Math.abs(d))
        const side = i % 2 ? -1 : 1
        // The wave: away from the front, cards swing out to alternate sides.
        const x = side * amp * smooth(a) + Math.sin(d * Math.PI) * amp * 0.25
        const y = d * gap
        const z = (1 - smooth(a)) * cw * 0.45 - Math.min(2.5, Math.abs(d)) * cw * 0.12
        const ry = -side * 34 * smooth(a)
        const rz = side * 5 * smooth(a)
        const rx = -d * 8
        c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${(z - cw * 1.15).toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`
        c.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(d) - 2.2) * 1.5))
        shades[i].forEach((el, j) => {
          const turn = Math.abs(ry + g.bend[j])
          el.style.opacity = Math.min(0.7, Math.min(2, Math.abs(d)) * 0.18 + (1 - Math.cos(turn * RAD)) * 1.1).toFixed(3)
        })
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i }
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
      const target = progressRef.current * (cards.length - 1)
      if (Math.abs(target - s.u) < 0.0005) return
      s.u = still ? target : s.u + (target - s.u) * (1 - Math.pow(1 - 0.1, dt / 16.7))
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
  }, [stageRef, trackRef, progressRef, onFront])
}

function Card({ c, i }) {
  const Tag = c.href ? 'a' : 'div'
  const link = c.href ? { href: c.href, target: '_blank', rel: 'noreferrer' } : { title: `${c.project} — link coming soon` }
  return (
    <Tag data-card data-cursor={c.href ? 'Open' : 'Soon'} aria-label={c.label} {...link} className="absolute left-0 top-0 block cursor-pointer [transform-style:preserve-3d]">
      {Array.from({ length: SLICES }).map((_, j) => (
        <div
          key={j}
          data-slice
          className="absolute left-0 top-0 overflow-hidden [backface-visibility:visible]"
          style={{ width: 'var(--sw)', height: 'var(--ch)' }}
        >
          <div className="absolute top-0 h-full" style={{ width: 'var(--cw)', left: `calc(var(--cw) / ${SLICES} * ${-j})` }}>
            <WorkPoster
              variant={c.variant}
              className={`h-full w-full border-y border-white/30 text-[calc(var(--cw)/19)] ${j === 0 ? 'rounded-l-[14px] border-l' : ''} ${j === SLICES - 1 ? 'rounded-r-[14px] border-r' : ''}`}
            />
          </div>
          <div data-shade className="pointer-events-none absolute inset-0 bg-black" />
        </div>
      ))}
      {/* Card number, floating just above its top edge. */}
      <span
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70"
        style={{ transform: `translate(calc(var(--cw) / -2), calc(var(--ch) / -2 - 26px)) translateZ(var(--r))` }}
      >
        <span className="text-accent">0{i + 1}</span> · {c.project}
      </span>
    </Tag>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const track = useRef(null)
  const [front, setFront] = useState(0)
  const progress = useRef(0)
  useWave(stage, track, progress, setFront)
  const active = CARDS[front]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${CARDS.length * 38}%`,
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
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-[radial-gradient(ellipse_at_50%_45%,#06122b_0%,#030818_55%,#01030a_100%)] text-ink">
      <div
        ref={stage}
        className="relative h-[100svh] select-none overflow-hidden"
      >
        {/* A web of glowing, electric lines behind the cards, drifting slowly. */}
        <svg aria-hidden="true" className="work-lines pointer-events-none absolute inset-[-6%] h-[112%] w-[112%]" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="line-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          {[
            ['M-60 700 C 220 380, 520 900, 820 540 S 1260 220, 1520 360', '#2d6bff'],
            ['M-80 210 C 260 60, 540 520, 900 280 S 1300 80, 1520 220', '#2d6bff'],
            ['M-40 880 C 360 620, 700 1000, 1060 700 S 1380 500, 1520 600', '#2d6bff'],
            ['M180 -40 C 420 240, 120 560, 520 760 S 860 980, 980 1000', '#2d6bff'],
            ['M1500 -20 C 1160 240, 1400 560, 1040 760 S 760 980, 620 1000', '#2d6bff'],
            ['M-60 460 C 300 560, 600 180, 980 420 S 1320 700, 1520 520', '#2d6bff'],
            ['M620 -40 C 760 200, 520 420, 820 620 S 1100 900, 1160 1000', '#2d6bff'],
            ['M-40 60 C 240 300, 460 120, 700 360 S 1000 820, 1300 960', '#2d6bff'],
          ].map(([d, c], i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={c} strokeOpacity="0.45" strokeWidth="16" filter="url(#line-glow)" />
              <path d={d} fill="none" stroke={c} strokeOpacity="0.9" strokeWidth="1.6" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">(02) Selected work</p>

        <div className="absolute inset-0 z-0 [perspective:1600px] [perspective-origin:50%_50%]">
          <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
            {/* The title stays behind the cards as they pass. */}
            <h2 id="work-title" className="pointer-events-none absolute left-0 top-0 [transform:translate(-50%,-50%)_translateZ(-900px)] opacity-60">
              <span data-work-title className="block whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]">My Works</span>
            </h2>
            <div ref={track} className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]">
              {CARDS.map((c, i) => (
                <Card key={i} c={c} i={i} />
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
