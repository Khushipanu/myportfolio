import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import WorkPoster from './WorkPoster'

// Visuvate-style "works" globe: the five project screens, repeated, sit on a
// sphere around the "My Works" title, each card curved along the globe (built
// from thin vertical slices) with its back showing as it turns away. The
// section is held while scrolling spins and tilts the globe, which also
// drifts slowly on its own. The card facing front drives the highlight and
// lights up its skills. Each card is a link: add a project's URL as `href`
// and its cards open it.
const CARDS = [
  { variant: 'movie', label: 'MovieThrill — home', project: 'MovieThrill', highlight: 'Movie data from The Movie Database (TMDB) API, fetched with Axios.', skills: ['React.js', 'Tailwind CSS', 'JavaScript'], href: null },
  { variant: 'lms', label: 'LMS — courses', project: 'Learning Management System', highlight: 'JWT authentication with student and instructor roles (RBAC).', skills: ['Node.js', 'Express.js', 'MongoDB'], href: null },
  { variant: 'erp', label: 'ERP — records', project: 'ERP · Ruhanix', highlight: 'Reusable React.js components for ERP modules, forms and data views.', skills: ['React.js', 'JavaScript'], href: null },
  { variant: 'movieDetail', label: 'MovieThrill — details', project: 'MovieThrill', highlight: 'App-wide state managed with Redux Toolkit and React-Redux.', skills: ['React.js', 'Redux Toolkit'], href: null },
  { variant: 'lmsPlayer', label: 'LMS — lesson', project: 'Learning Management System', highlight: 'Course purchasing and streaming on a full MERN stack.', skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'], href: null },
]
const SKILLS = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript']
const SLICES = 5
// Five bands of cards wrap the globe, as in the reference.
const ROWS = [
  { lat: 58, n: 4, off: 0.25 },
  { lat: 29, n: 6, off: 0.5 },
  { lat: 0, n: 7, off: 0 },
  { lat: -29, n: 6, off: 0.5 },
  { lat: -58, n: 4, off: 0.75 },
]
const SPOTS = ROWS.flatMap((r, ri) =>
  Array.from({ length: r.n }, (_, k) => ({ lat: r.lat, lon: ((k + r.off) / r.n) * 360, v: (ri * 2 + k) % CARDS.length })),
)
const RAD = Math.PI / 180

function useGlobe(stageRef, globeRef, progressRef, onFront) {
  useEffect(() => {
    const stage = stageRef.current
    const globe = globeRef.current
    const cards = [...globe.querySelectorAll('[data-card]')]
    const slices = cards.map((c) => [...c.querySelectorAll('[data-slice]')])
    const shades = cards.map((c) => [...c.querySelectorAll('[data-shade]')])
    const still = prefersReducedMotion()
    // Each card bends around its own axis through the globe's centre; this
    // is each slice's angle along that bend.
    let bend = []

    const layout = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      const R = w < 768 ? Math.min(w * 0.62, h * 0.4) : Math.min(w * 0.34, h * 0.62)
      const cw = R * 0.6
      const ch = cw * 0.7
      globe.style.setProperty('--cw', `${cw}px`)
      globe.style.setProperty('--ch', `${ch}px`)
      globe.style.setProperty('--sw', `${cw / SLICES + 1.2}px`)
      const d = (cw / SLICES) / R / RAD
      bend = Array.from({ length: SLICES }, (_, j) => (j - (SLICES - 1) / 2) * d)
      SPOTS.forEach((p, i) => {
        slices[i].forEach((el, j) => {
          el.style.transform = `rotateY(${p.lon}deg) rotateX(${p.lat}deg) rotateY(${bend[j].toFixed(3)}deg) translateZ(${R.toFixed(1)}px) translate(-50%, -50%)`
        })
      })
      draw()
    }

    const s = { rot: 0, tilt: 12, drift: 0 }
    let front = -1
    const draw = () => {
      globe.style.transform = `rotateZ(-14deg) rotateX(${s.tilt.toFixed(3)}deg) rotateY(${(s.rot + s.drift).toFixed(3)}deg)`
      const st = Math.sin(s.tilt * RAD)
      const ct = Math.cos(s.tilt * RAD)
      let best = -1
      let bestZ = -2
      SPOTS.forEach((p, i) => {
        const sl = Math.sin(p.lat * RAD)
        const cl = Math.cos(p.lat * RAD)
        const l = (p.lon + s.rot + s.drift) * RAD
        for (let j = 0; j < SLICES; j++) {
          // How squarely this slice faces the viewer, from -1 (away) to 1.
          const sd = Math.sin(bend[j] * RAD)
          const cd = Math.cos(bend[j] * RAD)
          const z = -cd * sl * st + (-sd * Math.sin(l) + cd * cl * Math.cos(l)) * ct
          shades[i][j].style.opacity = (z < 0 ? 0.55 + 0.4 * Math.min(1, -z * 2) : (1 - z) * 0.55).toFixed(3)
          if (j === 1 && p.lat === 0 && z > bestZ) { bestZ = z; best = p.v }
        }
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
      const p = progressRef.current
      const k = still ? 1 : 1 - Math.pow(1 - 0.08, dt / 16.7)
      s.rot += (p * 300 - s.rot) * k
      s.tilt += (12 - p * 26 - s.tilt) * k
      if (!still) s.drift += dt * 0.005
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
  }, [stageRef, globeRef, progressRef, onFront])
}

function Card({ c }) {
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
              className={`h-full w-full border-y border-white/30 text-[calc(var(--cw)/19)] ${j === 0 ? 'rounded-l-[12px] border-l' : ''} ${j === SLICES - 1 ? 'rounded-r-[12px] border-r' : ''}`}
            />
          </div>
          <div data-shade className="pointer-events-none absolute inset-0 bg-black" />
        </div>
      ))}
    </Tag>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const globe = useRef(null)
  const [front, setFront] = useState(0)
  const progress = useRef(0)
  useGlobe(stage, globe, progress, setFront)
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
        {/* A web of glowing, electric lines behind the globe, drifting slowly. */}
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
              <path d={d} fill="none" stroke={c} strokeOpacity="0.35" strokeWidth="14" filter="url(#line-glow)" />
              <path d={d} fill="none" stroke={c} strokeOpacity="0.85" strokeWidth="1.4" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">(02) Selected work</p>

        <div className="absolute inset-0 z-0 [perspective:1600px] [perspective-origin:50%_50%]">
          <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
            {/* The title sits at the globe's centre: back cards pass behind it, front cards over it. */}
            <h2 id="work-title" className="pointer-events-none absolute left-0 top-0 [transform:translate(-50%,-50%)]">
              <span data-work-title className="block whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]">My Works</span>
            </h2>
            <div ref={globe} className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]">
              {SPOTS.map((p, i) => (
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
