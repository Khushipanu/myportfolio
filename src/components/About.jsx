import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { about, experience, resume } from '../data/content'
import WorkPoster from './WorkPoster'

// A small screen for each role, drawn in code: the ERP product, a course
// platform for the Sheryians internship, and a lesson player for the content.
const XP_SCREENS = ['erp', 'lms', 'lmsPlayer']

// Experience as a fanned row of 3D cards, after the reference the user shared:
// heading and a call to action on the left, the roles on the right. The card
// in front glows chartreuse; hovering (or tapping) another lifts it up and
// brings it to the front. Arrows, a counter and a progress bar sit below.
function ExperienceShowcase() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const count = experience.length
  const step = (d) => setActive((a) => (a + d + count) % count)
  // Hovering brings a card forward. After a switch the pointer must travel a
  // little before it can switch again, so a card sliding under a resting
  // pointer doesn't set off another change.
  const lastSwitch = useRef({ t: 0, x: -999, y: -999 })
  const hover = (ev, i) => {
    if (ev.pointerType !== 'mouse' || i === active) return
    const last = lastSwitch.current
    if (performance.now() - last.t < 700 || Math.hypot(ev.clientX - last.x, ev.clientY - last.y) < 60) return
    lastSwitch.current = { t: performance.now(), x: ev.clientX, y: ev.clientY }
    setActive(i)
  }
  const n = (i) => String(i + 1).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-xp-in]', {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
        gsap.from('[data-xp-fan]', {
          rotateX: 25,
          y: 120,
          autoAlpha: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-6">
      {/* Left: heading, text and call to action. */}
      <div className="relative z-10">
        <p data-xp-in className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ink/70">
          <span className="h-px w-14 bg-accent" />
          My experience
        </p>
        <h2 data-xp-in className="mt-6 text-[13vw] font-bold leading-[0.95] tracking-[-0.04em] md:text-[7vw] lg:text-[4.6vw]">
          Roles that
          <br />
          <span className="font-medium text-ink/90">shaped my</span>{' '}
          <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">craft.</span>
        </h2>
        <p data-xp-in className="mt-6 max-w-sm text-[16px] leading-relaxed text-ink/65 md:text-[17px]">
          From a production ERP to full-stack websites and developer content — the places where I&apos;ve been writing code.
        </p>
        <div data-xp-in className="relative mt-9 inline-flex items-center">
          <a
            href={resume.href}
            download={resume.file}
            className="group flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-jet shadow-[0_0_40px_-8px_rgba(212,255,63,0.6)] transition-[translate] duration-300 hover:-translate-y-0.5"
          >
            Download resume
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <svg aria-hidden="true" viewBox="0 0 120 50" className="absolute -right-32 top-6 hidden h-12 w-28 text-accent md:block">
            <path d="M4 34 C 30 48, 70 44, 104 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M92 14 L106 16 L101 29" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Right: the fanned cards. */}
      <div className="relative">
        <div data-xp-fan className="relative mx-auto h-[33rem] w-full [perspective:1600px] md:h-[35rem]">
          {experience.map((e, i) => {
            // Position relative to the card in front: -1 left, 0 front, 1 right.
            let d = i - active
            if (d > count / 2) d -= count
            if (d < -count / 2) d += count
            const front = d === 0
            return (
              <button
                key={e.role}
                type="button"
                onPointerMove={(ev) => hover(ev, i)}
                onClick={() => setActive(i)}
                aria-pressed={front}
                aria-label={`${e.role} at ${e.company}`}
                className="group absolute left-1/2 top-1/2 w-[min(74vw,20rem)] text-left transition-[transform,filter] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] md:w-[21rem]"
                style={{
                  transform: `translate(-50%, -50%) translateX(${d * 74}%) translateY(${front ? -18 : 14}px) translateZ(${front ? 60 : -90}px) rotateY(${d * -24}deg) rotateZ(${d * 3}deg) scale(${front ? 1.04 : 0.9})`,
                  zIndex: front ? 30 : 20 - Math.abs(d),
                  filter: front ? 'none' : 'brightness(0.72)',
                }}
              >
                <article
                  className="relative overflow-hidden rounded-[26px] border p-5 backdrop-blur-xl transition-[border-color,box-shadow,translate] duration-500 group-hover:-translate-y-2"
                  style={{
                    borderColor: front ? 'rgba(212,255,63,0.85)' : 'rgba(244,241,234,0.12)',
                    background: 'linear-gradient(160deg, rgba(30,30,30,0.92), rgba(12,12,12,0.96))',
                    boxShadow: front
                      ? '0 0 0 1px rgba(212,255,63,0.25), 0 0 50px -6px rgba(212,255,63,0.55), 0 50px 80px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)'
                      : '0 40px 70px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{n(i)} · {e.period}</p>
                      <h3 className="mt-1.5 text-[21px] font-semibold leading-tight tracking-[-0.02em] text-ink">{e.role}</h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[14px] transition-colors duration-500"
                      style={{ borderColor: front ? '#d4ff3f' : 'rgba(244,241,234,0.25)', color: front ? '#d4ff3f' : 'rgba(244,241,234,0.6)' }}
                    >
                      ↗
                    </span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[14px] border border-white/10">
                    <WorkPoster variant={XP_SCREENS[i % XP_SCREENS.length]} className="aspect-[16/10] w-full text-[calc(min(74vw,20rem)/19)] md:text-[calc(21rem/19)]" />
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map((t) => (
                      <li key={t} className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-ink/80">{t}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">{e.summary}</p>
                  <p className="mt-3 font-serif text-[15px] italic text-accent/90">{e.company}</p>
                </article>
              </button>
            )
          })}
          {/* Coloured light pooling under the cards. */}
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[0%] left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.35),transparent)] blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[2%] left-[14%] h-12 w-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(120,110,255,0.25),transparent)] blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[2%] right-[12%] h-12 w-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(255,45,168,0.25),transparent)] blur-2xl" />
        </div>

        {/* Arrows, counter and progress. */}
        <div className="mt-2 flex items-center justify-end gap-4 md:gap-5">
          <button type="button" onClick={() => step(-1)} aria-label="Previous role" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-ink transition-colors hover:border-white/50">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next role" className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-jet shadow-[0_0_24px_-4px_rgba(212,255,63,0.7)] transition-[translate] hover:-translate-y-0.5">→</button>
          <div className="ml-3 w-32">
            <p className="font-mono text-[13px] text-ink"><span className="font-semibold">{n(active)}</span> <span className="text-ink/40">/ {n(count - 1)}</span></p>
            <div className="mt-2 h-[3px] w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${((active + 1) / count) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <p data-xp-in className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 lg:col-span-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#d4ff3f]" />
        Currently · {experience[0].role} at {experience[0].company}
      </p>
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

      {/* Experience sits on jet black lit by soft chartreuse and hot pink light. */}
      <div id="experience" className="relative -mx-5 -mb-24 mt-24 scroll-mt-24 overflow-clip bg-[linear-gradient(180deg,#0b0b0b_0%,#0d0d0d_60%,#0b0b0b_100%)] px-5 py-20 text-ink md:-mx-10 md:-mb-40 md:mt-36 md:px-10 md:py-28">
        {/* Jet black with chartreuse light at the edges and thin glowing curves. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[15%] top-[10%] h-[80vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.16),transparent)] blur-3xl" />
          <div className="absolute -right-[15%] top-[20%] h-[80vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.14),transparent)] blur-3xl" />
          <svg viewBox="0 0 1440 800" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M-20 640 C 260 520, 420 260, 640 300 S 1040 120, 1460 60" fill="none" stroke="rgba(212,255,63,0.22)" strokeWidth="1.2" />
            <path d="M-20 760 C 340 700, 760 560, 1100 620 S 1380 520, 1460 470" fill="none" stroke="rgba(212,255,63,0.12)" strokeWidth="1" />
          </svg>
        </div>
        <ExperienceShowcase />
      </div>
    </section>
  )
}
