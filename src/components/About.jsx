import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { about, experience } from '../data/content'

function Detail({ e, on = true, tone = '#f5b544' }) {
  return (
    <>
      <ul className="space-y-2 text-[13.5px] leading-snug text-ink/80 md:text-[14px]">
        {e.points.map((pt, k) => (
          <li
            key={pt}
            className={`flex gap-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
            style={{ transitionDelay: on ? `${0.2 + k * 0.05}s` : '0s' }}
          >
            <span aria-hidden="true" className="mt-[0.1em] flex h-[1.05em] w-[1.05em] shrink-0 items-center justify-center rounded-full text-[0.7em] font-bold text-jet" style={{ background: tone }}>✓</span>
            {pt}
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
        {e.stack.map((t) => (
          <li key={t} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/75 backdrop-blur">{t}</li>
        ))}
      </ul>
    </>
  )
}

// Glowing accents, in the same order as `experience`: amber, magenta, mint.
const tones = ['#f5b544', '#ff4fb8', '#5eead4']

// A slowly turning 3D ribbon drawn from tilted rings, in the panel's accent.
function Ribbon({ c, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="-110 -110 220 220" className={`exp-ribbon ${className}`}>
      <defs>
        <linearGradient id={`rb-${c.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.95" />
          <stop offset="1" stopColor={c} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {Array.from({ length: 22 }, (_, k) => (
        <ellipse
          key={k}
          rx={92 - k * 1.6}
          ry={30 + k * 2.2}
          fill="none"
          stroke={`url(#rb-${c.slice(1)})`}
          strokeWidth="0.9"
          transform={`rotate(${k * 8.2})`}
          opacity={0.25 + (k / 22) * 0.6}
        />
      ))}
    </svg>
  )
}

// Experience as a scroll timeline. On wide screens the heading and a list of
// the roles stay pinned on the left while the role cards scroll past on the
// right; each card swings up out of the page in 3D as it arrives, glows in its
// own colour, and lights up its entry in the list. Cards also tilt towards
// the pointer. On phones the cards simply stack.
function ExperienceTimeline() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const n = (i) => String(i + 1).padStart(2, '0')

  useGSAP(
    () => {
      const cards = gsap.utils.toArray('[data-xp-card]', root.current)
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      })
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-xp-head] > *', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector('[data-xp-swing]'),
            { rotateX: 28, y: 90, z: -160, autoAlpha: 0.2 },
            { rotateX: 0, y: 0, z: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 55%', scrub: 0.6 } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const tilt = (ev) => {
    if (ev.pointerType !== 'mouse') return
    const el = ev.currentTarget
    const r = el.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width - 0.5
    const y = (ev.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--mx', `${ev.clientX - r.left}px`)
    el.style.setProperty('--my', `${ev.clientY - r.top}px`)
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
  }
  const untilt = (ev) => {
    ev.currentTarget.style.setProperty('--rx', '0deg')
    ev.currentTarget.style.setProperty('--ry', '0deg')
  }
  const go = (i) => root.current.querySelectorAll('[data-xp-card]')[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div ref={root} className="relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
      {/* Left: heading and the roles, pinned while the cards scroll. */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div data-xp-head>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">(04) Experience</p>
          <h2 className="mt-5 text-[13vw] font-extralight leading-[0.95] tracking-[-0.04em] md:text-[7vw] lg:text-[5.2vw]">
            <span className="text-ink/60">My</span>
            <br />
            <span className="bg-[linear-gradient(100deg,#ffe2a3,#f5b544_45%,#ff8a3d)] bg-clip-text font-normal text-transparent">Experience.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-ink/60">
            Full-stack roles across an ERP product, web development and technical content.
          </p>
        </div>

        <ol className="relative mt-10 hidden space-y-1 lg:block">
          <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-white/10" />
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-3 w-px transition-[height,background-color] duration-500 ease-out"
            style={{ height: `${(active / Math.max(1, experience.length - 1)) * 100}%`, maxHeight: 'calc(100% - 1.5rem)', background: tones[active] }}
          />
          {experience.map((e, i) => {
            const on = active === i
            const c = tones[i % tones.length]
            return (
              <li key={e.role}>
                <button type="button" onClick={() => go(i)} className="group relative flex w-full items-start gap-5 rounded-[12px] py-3 pr-3 text-left">
                  <span
                    aria-hidden="true"
                    className="relative mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-all duration-500"
                    style={{ borderColor: on ? c : 'rgba(244,241,234,0.25)', background: on ? c : '#0a0d16', boxShadow: on ? `0 0 16px ${c}` : 'none' }}
                  />
                  <span>
                    <span className={`block text-[17px] font-medium tracking-[-0.01em] transition-colors duration-300 ${on ? 'text-ink' : 'text-ink/45 group-hover:text-ink/75'}`}>{e.role}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300" style={{ color: on ? c : 'rgba(244,241,234,0.35)' }}>
                      {e.company} · {e.period}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Right: one glass card per role. */}
      <ol className="relative space-y-8 lg:space-y-12 lg:pb-[12vh]" aria-label="Experience">
        {experience.map((e, i) => {
          const c = tones[i % tones.length]
          const on = active === i
          return (
            <li key={e.role} data-xp-card className="[perspective:1400px]">
              <div data-xp-swing className="[transform-style:preserve-3d]">
                <article
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  className="group relative overflow-hidden rounded-[24px] border p-7 backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-out md:p-9"
                  style={{
                    transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
                    borderColor: on ? `color-mix(in srgb, ${c} 65%, transparent)` : `color-mix(in srgb, ${c} 25%, transparent)`,
                    background: `linear-gradient(155deg, color-mix(in srgb, ${c} 14%, #0e1220) 0%, #0b0e18 55%, color-mix(in srgb, ${c} 7%, #07090f) 100%)`,
                    boxShadow: on
                      ? `0 50px 90px -40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 60px -20px ${c}`
                      : '0 40px 70px -40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(380px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.07),transparent_60%)]" />
                  <Ribbon c={c} className={`pointer-events-none absolute -right-24 -top-20 h-[22rem] transition-opacity duration-700 ${on ? 'opacity-50' : 'opacity-20'}`} />

                  <div className="relative flex items-start justify-between gap-6">
                    <span
                      aria-hidden="true"
                      className="bg-clip-text pr-2 font-serif text-[4.5rem] italic leading-none text-transparent md:text-[5.5rem]"
                      style={{ backgroundImage: `linear-gradient(160deg, #fff, ${c} 65%)`, filter: `drop-shadow(0 0 18px color-mix(in srgb, ${c} 40%, transparent))` }}
                    >
                      {n(i)}
                    </span>
                    <span className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/75">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                      {e.period}
                    </span>
                  </div>

                  <h3 className="relative mt-5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[32px]">{e.role}</h3>
                  <p className="relative mt-1 font-serif text-[19px] italic leading-snug" style={{ color: c }}>at {e.company}</p>
                  <p className="relative mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">{e.summary}</p>
                  <div className="relative mt-6 max-w-2xl">
                    <Detail e={e} tone={c} />
                  </div>
                </article>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// Sticky notes beside the About statement (after the reference the user
// shared). They can be dragged around with a mouse or finger.
const notes = [
  { text: 'Full Stack Developer at Ruhanix — building an ERP right now.', tag: 'Now · 2026', bg: 'var(--color-butter)', rot: -3 },
  { text: 'Interned at Sheryians: full-stack sites, web animations & dev content.', tag: 'Dec 2025 — Feb 2026', bg: 'var(--color-blush)', rot: 2.5 },
  { text: 'MERN all the way.', chips: ['React', 'Node', 'Express', 'MongoDB'], tag: 'Stack', bg: 'var(--color-sky)', rot: -1.5 },
]

function Note({ n, className = '' }) {
  const el = useRef(null)
  const onDown = (e) => {
    const node = el.current
    node.setPointerCapture(e.pointerId)
    const sx = e.clientX - (Number(node.dataset.x) || 0)
    const sy = e.clientY - (Number(node.dataset.y) || 0)
    gsap.to(node, { scale: 1.05, rotate: 0, duration: 0.3, ease: 'power3.out' })
    const move = (ev) => {
      node.dataset.x = ev.clientX - sx
      node.dataset.y = ev.clientY - sy
      gsap.to(node, { x: node.dataset.x, y: node.dataset.y, duration: 0.25, ease: 'power3.out' })
    }
    const up = () => {
      gsap.to(node, { scale: 1, rotate: n.rot, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerup', up)
      node.removeEventListener('pointercancel', up)
    }
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerup', up)
    node.addEventListener('pointercancel', up)
  }
  return (
    <div
      ref={el}
      data-note
      onPointerDown={onDown}
      style={{ background: n.bg, rotate: `${n.rot}deg` }}
      className={`relative w-[15.5rem] cursor-grab touch-none select-none rounded-[6px] px-5 pb-4 pt-6 text-coal shadow-[0_18px_40px_-14px_rgba(26,25,23,0.35)] active:cursor-grabbing ${className}`}
    >
      <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 rotate-[-2deg] bg-white/35 backdrop-blur-[1px]" />
      <p className="font-serif text-[21px] italic leading-[1.2]">{n.text}</p>
      {n.chips && (
        <p className="mt-3 flex flex-wrap gap-1.5">
          {n.chips.map((c) => (
            <span key={c} className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper">{c}</span>
          ))}
        </p>
      )}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-coal/55">{n.tag}</p>
    </div>
  )
}

// Statement with hand-drawn marks: a circled word, green marker highlights
// and a squiggle underline, drawn in once the paragraph scrolls into view.
const Mark = ({ children, delay = 0, tone = 'sky' }) => (
  <span className={`mark mark-${tone}`} style={{ transitionDelay: `${delay}s` }}>{children}</span>
)

function Statement() {
  return (
    <p data-story className="text-[8vw] font-semibold leading-[1.12] tracking-[-0.035em] md:text-[4vw] lg:text-[3.6vw]">
      I turn{' '}
      <span className="relative inline-block">
        ideas
        <svg aria-hidden="true" viewBox="0 0 200 90" preserveAspectRatio="none" className="draw pointer-events-none absolute -left-[16%] -top-[22%] h-[150%] w-[132%] overflow-visible">
          <path pathLength="1" d="M18 52 C 14 18, 182 6, 190 40 C 198 74, 40 86, 14 58 C 4 46, 26 26, 70 20" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transitionDelay: '0.2s' }} />
        </svg>
      </span>{' '}
      into <Mark delay={0.5} tone="sky">fast, maintainable web apps</Mark> — from <Mark delay={0.9} tone="butter">interfaces people enjoy</Mark> to the{' '}
      <span className="relative inline-block">
        APIs and data
        <svg aria-hidden="true" viewBox="0 0 300 20" preserveAspectRatio="none" className="draw pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.32em] w-full overflow-visible">
          <path pathLength="1" d="M2 10 C 20 2, 30 18, 48 10 S 76 2, 94 10 S 122 18, 140 10 S 168 2, 186 10 S 214 18, 232 10 S 260 2, 278 10 S 292 14, 298 9" fill="none" stroke="var(--color-coral)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transitionDelay: '1.3s' }} />
        </svg>
      </span>{' '}
      that power them.
    </p>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: '[data-story]',
          start: 'top 75%',
          once: true,
          onEnter: () => root.current.querySelector('[data-story]').classList.add('is-on'),
        })
        gsap.from('[data-note]', {
          y: 80,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-notes]', start: 'top 80%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-clip px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-deep -z-10 -left-[10%] top-[5%] h-[55vh] w-[45vw]" />
      <div className="grid grid-cols-12 gap-x-5 gap-y-14">
        <div className="col-span-12 lg:col-span-8">
          <h2 id="about-title" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(03) How I build</h2>
          <div className="mt-8 md:mt-10">
            <Statement />
          </div>
          <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink/70">{about.body}</p>
        </div>

        <div data-notes className="relative col-span-12 flex flex-wrap items-start justify-center gap-8 pt-2 sm:justify-start lg:col-span-4 lg:flex-col lg:items-end lg:gap-10 lg:pt-16">
          <p className="hidden items-center gap-2 self-start rounded-full border border-ink/15 px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-ink/70 lg:flex lg:self-auto lg:-mb-4 lg:mr-40">
            these notes move ;) <span aria-hidden="true" className="text-accent">↷</span>
          </p>
          {notes.map((n, i) => (
            <Note key={n.tag} n={n} className={i === 1 ? 'lg:mr-10' : ''} />
          ))}
        </div>
      </div>

      {/* Experience sits on a deep navy band lit by warm amber, magenta and mint light. */}
      <div id="experience" className="relative -mx-5 -mb-24 mt-24 scroll-mt-24 overflow-clip bg-[linear-gradient(180deg,#0b0f1a_0%,#090c16_60%,#07090f_100%)] px-5 py-20 text-ink md:-mx-10 md:-mb-40 md:mt-36 md:px-10 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-[-20%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(245,181,68,0.22),transparent)] blur-3xl" />
          <div className="absolute -right-[10%] top-[30%] h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(94,234,212,0.12),transparent)] blur-3xl" />
          <div className="absolute -left-[10%] bottom-[-10%] h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,79,184,0.12),transparent)] blur-3xl" />
        </div>
        <ExperienceTimeline />
      </div>
    </section>
  )
}
