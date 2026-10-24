import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import Art from './Art'

// Visuvate-style "works" ring: five project screens stand on a circle around
// the "My Works" title, each card curved onto the cylinder (built from thin
// vertical slices) with its back showing as it turns away. The section is
// held while scrolling turns the circle through every card, and the card
// facing front drives the highlight and lights up its skills.
const CARDS = [
  { variant: 'movie', label: 'MovieThrill — home', project: 'MovieThrill', highlight: 'Movie data from The Movie Database (TMDB) API, fetched with Axios.', skills: ['React.js', 'Tailwind CSS', 'JavaScript'] },
  { variant: 'lms', label: 'LMS — courses', project: 'Learning Management System', highlight: 'JWT authentication with student and instructor roles (RBAC).', skills: ['Node.js', 'Express.js', 'MongoDB'] },
  { variant: 'erp', label: 'ERP — records', project: 'ERP · Ruhanix', highlight: 'Reusable React.js components for ERP modules, forms and data views.', skills: ['React.js', 'JavaScript'] },
  { variant: 'movieDetail', label: 'MovieThrill — details', project: 'MovieThrill', highlight: 'App-wide state managed with Redux Toolkit and React-Redux.', skills: ['React.js', 'Redux Toolkit'] },
  { variant: 'lmsPlayer', label: 'LMS — lesson', project: 'Learning Management System', highlight: 'Course purchasing and streaming on a full MERN stack.', skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'] },
]
const SKILLS = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript']
const COUNT = CARDS.length
const STEP = 360 / COUNT
const SLICES = 5

// The ring turns with scroll: while the section is pinned, its progress maps
// to one full pass through the cards, eased per frame so it glides.
function useRing(stageRef, ringRef, progressRef, onFront) {
  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const cards = [...ring.querySelectorAll('[data-card]')]
    const slices = cards.map((c) => [...c.querySelectorAll('[data-slice]')])
    const shades = cards.map((c) => [...c.querySelectorAll('[data-shade]')])
    const still = prefersReducedMotion()

    const g = { cw: 260, ch: 187, r: 340, dSlice: 0 }
    const layout = () => {
      const w = stage.clientWidth
      // Sized by width, but capped by height so short screens keep room for the text.
      g.cw = Math.max(150, Math.min(340, w * (w < 768 ? 0.5 : 0.2), stage.clientHeight * 0.3))
      g.ch = g.cw * 0.72
      g.r = g.cw * 1.5
      g.dSlice = ((g.cw / SLICES) / g.r) * (180 / Math.PI)
      ring.style.setProperty('--cw', `${g.cw}px`)
      ring.style.setProperty('--ch', `${g.ch}px`)
      ring.style.setProperty('--sw', `${g.cw / SLICES + 0.6}px`)
      draw()
    }

    // Angle in [-180, 180); 0 is facing the viewer.
    const wrap = (v) => ((((v + 180) % 360) + 360) % 360) - 180
    const s = { offset: 0, target: 0 }
    let front = -1
    const draw = () => {
      let best = 0
      for (let i = 0; i < COUNT; i++) {
        const a = wrap(i * STEP - s.offset)
        if (Math.abs(a) < Math.abs(wrap(best * STEP - s.offset))) best = i
        // Shading goes on the slices: on the card it would flatten its 3D curve.
        const sl = slices[i]
        for (let j = 0; j < SLICES; j++) {
          const sa = a + (j - (SLICES - 1) / 2) * g.dSlice
          const ks = (Math.cos((sa * Math.PI) / 180) + 1) / 2
          shades[i][j].style.opacity = ((1 - ks) * 0.7).toFixed(3)
          sl[j].style.transform = `translate3d(-50%, -50%, 0) rotateY(${sa.toFixed(3)}deg) translateZ(${g.r.toFixed(1)}px)`
        }
      }
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
      s.target = progressRef.current * STEP * (COUNT - 1)
      if (Math.abs(s.target - s.offset) < 0.01) return
      s.offset = still ? s.target : s.offset + (s.target - s.offset) * (1 - Math.pow(1 - 0.1, dt / 16.7))
      draw()
    }
    raf = requestAnimationFrame(tick)

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(stage)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [stageRef, ringRef, progressRef, onFront])
}

function Card({ c, i }) {
  return (
    <div data-card data-index={i} className="absolute left-0 top-0 [transform-style:preserve-3d]">
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
          <div data-shade className="pointer-events-none absolute inset-0 bg-[#c9bba1]" />
        </div>
      ))}
    </div>
  )
}

export default function Work() {
  const root = useRef(null)
  const stage = useRef(null)
  const ring = useRef(null)
  const [front, setFront] = useState(0)
  const progress = useRef(0)
  useRing(stage, ring, progress, setFront)
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
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate bg-paper-2 text-ink">
      <div
        ref={stage}
        className="relative h-[100svh] select-none overflow-hidden"
      >
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
            <g key={i} opacity={i > 2 ? 0.7 : 1}>
              <path d={d} fill="none" stroke={['#c8dcf1', '#f3e08a', '#f4c9bf', '#cfe6d6', '#d8cdea'][i]} strokeWidth="14" filter="url(#ribbon-glow)" />
              <path d={d} fill="none" stroke="rgba(26,25,23,0.18)" strokeWidth="1" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(235,229,217,0.9)_85%)]" />

        <p className="pointer-events-none absolute left-5 top-24 z-20 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">(02) Selected work</p>

        <div className="absolute inset-0 [perspective:1500px] [perspective-origin:50%_50%]">
          <div
            ref={ring}
            className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
            style={{ transform: 'rotateX(-18deg)' }}
          >
            {/* The title sits at the ring's centre: back cards pass behind it, front cards over it. */}
            <h2
              id="work-title"
              className="pointer-events-none absolute left-0 top-0 [transform:translate(-50%,-50%)_rotateX(18deg)]"
            >
              <span data-work-title className="block whitespace-nowrap font-serif text-[16vw] leading-none text-ink md:text-[11vw]">My Works</span>
            </h2>
            {CARDS.map((c, i) => (
              <Card key={i} c={c} i={i} />
            ))}
          </div>
        </div>

        {/* Core skills; the ones used in the front card light up. */}
        <ul aria-label="Core skills" className="pointer-events-none absolute left-5 right-5 top-32 z-20 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] md:left-auto md:right-10 md:top-28 md:flex-col md:items-end md:gap-2 md:text-[11px]">
          {SKILLS.map((k) => (
            <li key={k} className={`transition-colors duration-500 ${active.skills.includes(k) ? 'text-accent' : 'text-ink/35'}`}>{k}</li>
          ))}
        </ul>

        {/* Highlight of the card facing front. */}
        <div aria-live="polite" className="pointer-events-none absolute bottom-14 left-5 right-5 z-20 md:bottom-10 md:left-10 md:right-auto md:max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="text-accent">{String(front + 1).padStart(2, '0')}</span> / {String(COUNT).padStart(2, '0')} · Highlight
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
