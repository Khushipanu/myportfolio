import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { about, experience } from '../data/content'

// Stroke icons for the experience cards, in the same order as `experience`.
const icons = [
  'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', // ERP modules
  'M3 5h18v14H3zM3 9h18M7 13h5M7 16h3', // websites
  'M4 5h16v11H8l-4 3zM8 9h8M8 12h5', // content
]

// Experience as expanding panels: on wide screens the roles stand side by
// side; the one hovered, focused or clicked widens to show its detail while
// the others keep a short horizontal summary. On phones they become an
// accordion of rows that open on tap.
function Icon({ i, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[i % icons.length]} />
    </svg>
  )
}

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

function ExperiencePanels() {
  const [open, setOpen] = useState(0)
  // Panels open as soon as the pointer reaches them.
  const hoverOpen = (i) => setOpen(i)
  const n = (i) => String(i + 1).padStart(2, '0')
  // Cards tilt in 3D towards the pointer and settle back when it leaves.
  const tilt = (ev) => {
    const el = ev.currentTarget
    const r = el.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width - 0.5
    const y = (ev.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--mx', `${ev.clientX - r.left}px`)
    el.style.setProperty('--my', `${ev.clientY - r.top}px`)
    el.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
  }
  const untilt = (ev) => {
    ev.currentTarget.style.setProperty('--rx', '0deg')
    ev.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <>
      {/* Wide screens: glass panels side by side, each glowing in its own colour. */}
      <ul data-panels className="mx-auto hidden h-[30rem] max-w-6xl gap-4 lg:flex" aria-label="Experience">
        {experience.map((e, i) => {
          const on = open === i
          const c = tones[i % tones.length]
          return (
            <li
              key={e.role}
              data-panel
              onPointerEnter={(ev) => ev.pointerType === 'mouse' && hoverOpen(i)}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className={`group relative min-w-0 rounded-[22px] transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] [perspective:1400px] ${on ? 'grow-[2.6]' : 'grow'}`}
              style={{ flexBasis: 0 }}
            >
              <div className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d]" style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}>
              {/* Glow that spills out behind the card. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-3 rounded-[30px] blur-2xl transition-opacity duration-[650ms] ${on ? 'opacity-70' : 'opacity-0 group-hover:opacity-30'}`}
                style={{ background: `radial-gradient(60% 60% at 30% 0%, ${c}, transparent 70%)`, transform: 'translateZ(-40px)' }}
              />
              {/* The glass card. */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[22px] border backdrop-blur-xl transition-[border-color,box-shadow] duration-[650ms]"
                style={{
                  borderColor: on ? `color-mix(in srgb, ${c} 70%, transparent)` : `color-mix(in srgb, ${c} 28%, transparent)`,
                  background: `linear-gradient(160deg, color-mix(in srgb, ${c} ${on ? 16 : 10}%, #0e1220) 0%, #0b0e18 55%, color-mix(in srgb, ${c} 8%, #07090f) 100%)`,
                  boxShadow: on
                    ? `0 40px 80px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px -10px ${c}`
                    : '0 30px 60px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(340px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.08),transparent_60%)]" />
                <Ribbon c={c} className={`pointer-events-none absolute -right-28 bottom-[-22%] h-[78%] transition-opacity duration-700 ${on ? 'opacity-60' : 'opacity-0'}`} />
              </div>

              <button
                type="button"
                onClick={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-expanded={on}
                className="absolute inset-0 z-10 cursor-pointer rounded-[22px] text-left"
              >
                <span className="sr-only">{`${e.role} at ${e.company}`}</span>
              </button>

              {/* Content floats a little in front of the glass. */}
              <div className="pointer-events-none absolute inset-0 [transform:translateZ(30px)] [transform-style:preserve-3d]">
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-semibold tracking-[0.14em] text-ink/90">{n(i)}</span>
                  {on ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border text-[16px]" style={{ borderColor: c, color: c }}>→</span>
                  ) : (
                    <span style={{ color: c }}><Icon i={i} className="h-5 w-5" /></span>
                  )}
                </div>

                {/* Closed: a large glowing number and a short summary. */}
                <span
                  aria-hidden="true"
                  className={`absolute left-6 top-16 bg-clip-text pr-4 font-serif text-[6.5rem] italic leading-none text-transparent transition-opacity duration-300 ${on ? 'opacity-0' : 'opacity-100 delay-150'}`}
                  style={{ backgroundImage: `linear-gradient(160deg, #fff, ${c} 60%)`, filter: `drop-shadow(0 0 18px color-mix(in srgb, ${c} 45%, transparent))` }}
                >
                  {n(i)}
                </span>
                <div
                  aria-hidden={on}
                  className={`absolute bottom-6 left-6 right-6 transition-[opacity,transform] duration-300 ease-out ${on ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100 delay-150'}`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{e.period}</p>
                  <h3 className="mt-2 text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-ink">{e.role}</h3>
                  <p className="mt-1 font-serif text-[16px] italic leading-snug" style={{ color: c }}>{e.company}</p>
                </div>

                {/* Open: full detail, at a fixed width so it never reflows while the panel resizes. */}
                <div
                  aria-hidden={!on}
                  className={`absolute bottom-0 left-0 top-0 flex w-[clamp(24rem,36vw,33rem)] flex-col justify-end p-7 transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? 'translate-y-0 opacity-100 duration-500 delay-150' : 'translate-y-2 opacity-0 duration-150'
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">{e.period}</p>
                  <h3 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">{e.role}</h3>
                  <p className="mt-0.5 font-serif text-[18px] italic leading-snug" style={{ color: c }}>at {e.company}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/65">{e.summary}</p>
                  <div className="mt-4">
                    <Detail e={e} on={on} tone={c} />
                  </div>
                </div>
              </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Phones and tablets: accordion rows. */}
      <ul data-panels className="border-t border-white/10 lg:hidden" aria-label="Experience">
        {experience.map((e, i) => {
          const on = open === i
          const c = tones[i % tones.length]
          return (
            <li key={e.role} data-panel className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpen(on ? -1 : i)}
                aria-expanded={on}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className="self-start pt-1.5 font-mono text-[11px] tracking-[0.12em]" style={{ color: c }}>{n(i)}</span>
                <span className="flex-1">
                  <span className="block text-[20px] font-medium leading-tight tracking-[-0.01em] text-ink">{e.role}</span>
                  <span className="mt-1 block font-serif text-[16px] italic" style={{ color: c }}>{e.company}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{e.period}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${on ? 'rotate-45 text-jet' : 'text-ink'}`}
                  style={{ borderColor: on ? c : 'rgba(244,241,234,0.3)', background: on ? c : 'transparent' }}
                >
                  +
                </span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="pb-6 pl-9">
                    <p className="mb-4 text-[15px] leading-relaxed text-ink/65">{e.summary}</p>
                    <Detail e={e} tone={c} />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
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
        gsap.from('#experience [data-focus-fade]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '#experience', start: 'top 80%' },
        })
        gsap.utils.toArray('#experience [data-panels]').forEach((list) =>
          gsap.from(list.children, {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: list, start: 'top 85%' },
          }),
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
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
      <div id="experience" className="relative -mx-5 -mb-24 mt-24 scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#0b0f1a_0%,#090c16_60%,#07090f_100%)] px-5 py-20 text-ink md:-mx-10 md:-mb-40 md:mt-36 md:px-10 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-[-20%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(245,181,68,0.22),transparent)] blur-3xl" />
          <div className="absolute -right-[10%] top-[30%] h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(94,234,212,0.12),transparent)] blur-3xl" />
          <div className="absolute -left-[10%] bottom-[-10%] h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,79,184,0.12),transparent)] blur-3xl" />
        </div>
        <div data-focus-fade className="relative mb-10 flex items-end justify-between gap-6 md:mb-14">
          <h2 className="text-[9vw] font-extralight leading-[1.05] tracking-[-0.03em] md:text-[4.4vw]">
            <span className="text-ink/60">My</span>{' '}
            <span className="bg-[linear-gradient(100deg,#ffe2a3,#f5b544_45%,#ff8a3d)] bg-clip-text font-normal text-transparent">Experience.</span>
          </h2>
          <p className="hidden shrink-0 pb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45 md:block">(04) Experience</p>
        </div>
        <div className="relative">
          <ExperiencePanels />
        </div>
      </div>
    </section>
  )
}
