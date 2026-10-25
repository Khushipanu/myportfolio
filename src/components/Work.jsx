import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import WorkPoster from './WorkPoster'

// Visuvate-style works: project cards wind round a leaning spiral, each one
// curved along it. One card faces the viewer in the middle while its
// neighbours sit just above-right and below-left, and cards at the sides
// bend away. While the section is held, scrolling turns the spiral so the
// cards climb from the lower left to the upper right and projects 1 → 5 pass
// the front in turn. The card at the front drives the highlight and lights up
// its skills. Each card is a link: add a project's URL as `href` and it opens.
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
// Fifteen cards — the five projects three times over — wind round a spiral.
const PER = 15
const STEP = 52 // degrees between neighbouring cards round the spiral
const SPIRAL = Array.from({ length: PER }, (_, i) => i % CARDS.length)
// Cards 5–9 (projects 1 → 5) pass the front while the section is held.
const FIRST = 5

function useSpiral(stageRef, trackRef, progressRef, onFront) {
  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    const cards = [...track.querySelectorAll('[data-card]')]
    const shades = cards.map((c) => [...c.querySelectorAll('[data-shade]')])
    const still = prefersReducedMotion()
    const g = { w: 0, h: 0, R: 0, pitch: 0, bend: [] }

    const layout = () => {
      g.w = stage.clientWidth
      g.h = stage.clientHeight
      const mobile = g.w < 768
      g.R = mobile ? g.w * 0.42 : Math.min(g.w * 0.25, g.h * 0.5)
      const cw = g.R * (mobile ? 1 : 0.86)
      const ch = cw * 0.7
      // Each turn of the spiral climbs a little more than one card's height.
      g.pitch = ch * 0.42
      // Cards bend round the spiral's own cylinder.
      const d = (cw / SLICES) / g.R / RAD
      g.bend = Array.from({ length: SLICES }, (_, j) => (j - (SLICES - 1) / 2) * d)
      track.style.setProperty('--cw', `${cw}px`)
      track.style.setProperty('--ch', `${ch}px`)
      track.style.setProperty('--sw', `${cw / SLICES + 1.2}px`)
      cards.forEach((c) => {
        ;[...c.querySelectorAll('[data-slice]')].forEach((sl, j) => {
          sl.style.transform = `rotateY(${g.bend[j].toFixed(3)}deg) translateZ(${g.R.toFixed(1)}px) translate(-50%, -50%)`
        })
        c.style.setProperty('--r', `${g.R}px`)
      })
      draw()
    }

    // The spiral leans so cards travel from the lower left to the upper right.
    const LEAN = 28
    const TILT = -10
    const s = { u: FIRST }
    let front = -1
    const draw = () => {
      const { h, pitch } = g
      const phi = s.u * STEP
      track.style.transform = `rotateZ(${LEAN}deg) rotateX(${TILT}deg) rotateY(${phi.toFixed(3)}deg) translateY(${(-s.u * pitch).toFixed(1)}px)`
      let best = 0
      let bestZ = -2
      cards.forEach((c, i) => {
        const theta = -i * STEP
        const y = i * pitch
        // Each card turns back about its own centre so it stands upright,
        // even though the spiral leans.
        c.style.transform = `translateY(${y.toFixed(1)}px) rotateY(${theta}deg) rotateZ(${-LEAN * 0.85}deg)`
        // Fade cards far along the spiral, above or below the view.
        const along = Math.abs(y - s.u * pitch)
        c.style.opacity = String(Math.max(0, Math.min(1, 1 - (along - h * 0.55) / (h * 0.3))))
        shades[i].forEach((el, j) => {
          // How squarely this slice faces the viewer: 1 front, -1 away.
          const z = Math.cos((theta + phi + g.bend[j]) * RAD) * Math.cos(TILT * RAD)
          el.style.opacity = (z < 0 ? 0.6 + 0.35 * Math.min(1, -z * 2) : (1 - z) * 0.55).toFixed(3)
          if (j === (SLICES - 1) / 2 && z > bestZ && along < pitch * 2) { bestZ = z; best = SPIRAL[i] }
        })
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
      const target = FIRST + progressRef.current * (CARDS.length - 1)
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
              className={`h-full w-full border-y border-jet/15 text-[calc(var(--cw)/19)] ${j === 0 ? 'rounded-l-[14px] border-l' : ''} ${j === SLICES - 1 ? 'rounded-r-[14px] border-r' : ''}`}
            />
          </div>
          <div data-shade className="pointer-events-none absolute inset-0 bg-[#F5F0FF]" />
        </div>
      ))}
      <span className="sr-only">{`0${i + 1} · ${c.project}`}</span>
    </Tag>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const track = useRef(null)
  const [front, setFront] = useState(0)
  const progress = useRef(0)
  useSpiral(stage, track, progress, setFront)
  const active = CARDS[front]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${CARDS.length * 45}%`,
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
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-[radial-gradient(ellipse_at_50%_40%,#FBF8FF_0%,#F5F0FF_55%,#F5F0FF_100%)] text-ink">
      <div
        ref={stage}
        className="relative h-[100svh] select-none overflow-hidden"
      >
        {/* Backdrop in the site palette: drifting hot pink and chartreuse light
            over jet black, a glowing grid floor, giant outlined type and grain. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="mesh-a absolute -left-[12%] -top-[18%] h-[75vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(113,81,181,0.20),transparent)] blur-3xl" />
          <div className="mesh-b absolute -right-[14%] top-[2%] h-[70vh] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.14),transparent)] blur-3xl" />
          <div className="mesh-c absolute -bottom-[25%] left-[20%] h-[75vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(36,27,53,0.07),transparent)] blur-3xl" />

          {/* Grid floor receding into the distance. */}
          <div className="absolute inset-x-[-25%] bottom-[-8%] h-[55%] origin-bottom [transform:perspective(700px)_rotateX(62deg)] [background-image:linear-gradient(rgba(167,139,250,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.14)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_top,black_10%,transparent_85%)]" />

          {/* Giant outlined word sitting behind everything. */}
          <p className="absolute left-1/2 top-[6%] -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-black uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(36,27,53,0.06)]">
            Projects
          </p>

          {/* Fine grain and a soft vignette. */}
          <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(36,27,53,0.16)_100%)]" />
        </div>

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45 md:left-10 md:top-28">(02) Selected work</p>

        <div className="absolute inset-0 z-0 [perspective:1600px] [perspective-origin:50%_50%]">
          <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
            {/* The title stays behind the cards as they pass. */}
            <h2 id="work-title" className="pointer-events-none absolute left-0 top-0 [transform:translate(-50%,-50%)_translateZ(-900px)] opacity-80">
              <span data-work-title className="block whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]">My Works</span>
            </h2>
            <div ref={track} className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]">
              {SPIRAL.map((v, i) => (
                <Card key={i} c={CARDS[v]} i={v} />
              ))}
            </div>
          </div>
        </div>

        {/* Core skills; the ones used in the front card light up. */}
        <ul aria-label="Core skills" className="pointer-events-none absolute left-5 right-5 top-32 z-20 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] md:left-auto md:right-10 md:top-28 md:flex-col md:items-end md:gap-2 md:text-[11px]">
          {SKILLS.map((k) => (
            <li key={k} className={`transition-colors duration-500 ${active.skills.includes(k) ? 'font-semibold text-accent-deep' : 'text-ink/35'}`}>{k}</li>
          ))}
        </ul>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-[#F5F0FF] via-[#F5F0FF]/70 to-transparent" />

        {/* Highlight of the card facing front. */}
        <div aria-live="polite" className="pointer-events-none absolute bottom-14 left-5 right-5 z-20 md:bottom-10 md:left-10 md:right-auto md:max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
            <span className="text-accent-deep">{String(front + 1).padStart(2, '0')}</span> / {String(CARDS.length).padStart(2, '0')} · Highlight
          </p>
          <div key={front} className="animate-[work-in_0.7s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="mt-3 font-serif text-[26px] italic leading-none text-ink md:text-[30px]">{active.project}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/65 md:text-[15px]">{active.highlight}</p>
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-6 right-5 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:bottom-10 md:right-10">Scroll ↓</p>
      </div>
    </section>
  )
}
