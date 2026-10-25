import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { about, experience, resume } from '../data/content'
import WorkPoster from './WorkPoster'

// A small screen for each role, drawn in code: the ERP product, a course
// platform for the Sheryians internship, and a lesson player for the content.
const XP_SCREENS = ['erp', 'lms', 'lmsPlayer']

// Experience, after the reference the user shared: heading and a call to
// action on the left, three role cards fanned in 3D on the right. The cards
// keep their places — left, front, right — so they're easy to follow. The
// card in focus (the middle one at first) glows chartreuse; hovering, tapping
// or using the arrows focuses another, which rises, turns to face the viewer
// and glows. A counter and progress bar track which role is in focus.
const FAN = [
  { x: '-78%', y: '5%', z: -60, ry: 18, rz: -4, s: 0.82 },
  { x: '0%', y: '-3%', z: 40, ry: 0, rz: 0, s: 1 },
  { x: '78%', y: '9%', z: -60, ry: -18, rz: 5, s: 0.82 },
]
// Which slot each role takes: the current role stands in the middle.
const SLOT = [1, 0, 2]
const EDGE = ['rgba(198,181,232,0.45)', 'rgba(198,181,232,0.9)', 'rgba(180,120,255,0.55)']

function ExperienceShowcase() {
  const root = useRef(null)
  const [focus, setFocus] = useState(0)
  const count = experience.length
  const step = (d) => setFocus((a) => (a + d + count) % count)
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
        gsap.from('[data-xp-card]', {
          y: 140,
          autoAlpha: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-center">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-4">
        {/* Left: heading, text and call to action. */}
        <div className="relative z-10">
          <p data-xp-in className="flex items-center gap-5 text-[12px] font-medium uppercase tracking-[0.35em] text-ink/80">
            <span className="h-px w-16 bg-accent" />
            My experience
          </p>
          <h2 data-xp-in className="mt-7 text-[13vw] leading-[1.02] tracking-[-0.035em] md:text-[7.5vw] lg:text-[clamp(52px,4.9vw,84px)]">
            <span className="font-bold">Roles that</span>
            <br />
            <span className="font-medium">shaped my</span>{' '}
            <span className="font-serif font-normal italic tracking-[-0.01em] text-accent-deep">craft.</span>
          </h2>
          <p data-xp-in className="mt-7 max-w-[22rem] text-[17px] leading-[1.6] text-ink/80 md:text-[18px]">
            From a production ERP to full-stack websites and developer content — the places I&apos;ve been building.
          </p>
          <div data-xp-in className="relative mt-10 inline-flex">
            <a
              href={resume.href}
              download={resume.file}
              className="group flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-[16px] font-semibold text-jet shadow-[0_0_40px_-8px_rgba(198,181,232,0.65)] transition-[translate] duration-300 hover:-translate-y-0.5"
            >
              Download resume
              <span aria-hidden="true" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <svg aria-hidden="true" viewBox="0 0 140 60" className="absolute -right-44 top-8 hidden h-14 w-36 text-accent-deep md:block">
              <path d="M4 44 C 40 58, 92 52, 124 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M110 18 L126 19 L121 35" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right: three cards fanned in 3D, each staying in its place. */}
        <div className="relative h-[34rem] [perspective:1800px] md:h-[38rem] lg:h-[40rem]">
          {experience.map((e, i) => {
            const pose = FAN[SLOT[i]]
            const on = focus === i
            return (
              <button
                key={e.role}
                data-xp-card
                type="button"
                onPointerEnter={(ev) => ev.pointerType === 'mouse' && setFocus(i)}
                onClick={() => setFocus(i)}
                aria-pressed={on}
                aria-label={`${e.role} at ${e.company}`}
                className="absolute left-1/2 top-1/2 w-[min(58vw,22rem)] text-left md:w-[min(30vw,23rem)]"
                style={{ zIndex: on ? 30 : SLOT[i] === 1 ? 20 : 10 }}
              >
                <div
                  className="transition-[transform,filter] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
                  style={{
                    transform: on
                      ? `translate(-50%, -50%) translateX(${pose.x}) translateY(calc(${pose.y} - 26px)) translateZ(90px) rotateY(${pose.ry * 0.25}deg) rotateZ(${pose.rz * 0.3}deg) scale(${Math.max(pose.s, 0.9) + 0.04})`
                      : `translate(-50%, -50%) translateX(${pose.x}) translateY(${pose.y}) translateZ(${pose.z}px) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${pose.s})`,
                    filter: on ? 'none' : 'saturate(0.85) opacity(0.92)',
                  }}
                >
                  <article
                    className="relative overflow-hidden rounded-[28px] border-[1.5px] p-6 transition-[border-color,box-shadow] duration-500"
                    style={{
                      borderColor: on ? 'rgba(198,181,232,0.95)' : EDGE[SLOT[i]].replace(/[\d.]+\)$/, '0.35)'),
                      background: 'linear-gradient(165deg, #FFFCF7 0%, #FFFCF7 45%, #F8F4EE 100%)',
                      boxShadow: on
                        ? '0 0 0 1px rgba(198,181,232,0.35), 0 0 70px -10px rgba(198,181,232,0.7), 0 60px 90px -40px rgba(41,39,34,0.16), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : `0 0 40px -18px ${EDGE[SLOT[i]]}, 0 50px 80px -40px rgba(41,39,34,0.16), inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[24px]">{e.role}</h3>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{e.period}</p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[15px] transition-colors duration-500"
                        style={{ borderColor: on ? '#C6B5E8' : 'rgba(198,181,232,0.5)', color: '#C6B5E8' }}
                      >
                        ↗
                      </span>
                    </div>
                    <div className="mt-5 overflow-hidden rounded-[14px] border border-jet/10 shadow-[0_20px_40px_-20px_rgba(41,39,34,0.16)]">
                      <WorkPoster variant={XP_SCREENS[i % XP_SCREENS.length]} className="aspect-[16/10] w-full text-[calc(min(58vw,22rem)/22)] md:text-[calc(min(30vw,23rem)/22)]" />
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {e.stack.map((t) => (
                        <li key={t} className="rounded-full border border-jet/12 bg-white/[0.06] px-3.5 py-1.5 text-[12px] font-medium text-ink/90">{t}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-ink/80">{e.summary}</p>
                    <p className="mt-3 font-serif text-[16px] italic text-accent-deep">{e.company}</p>
                  </article>
                </div>
              </button>
            )
          })}
          {/* Coloured light pooling under the cards. */}
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[3%] left-1/2 h-20 w-[55%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,181,232,0.4),transparent)] blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[6%] left-[8%] h-14 w-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(110,110,255,0.3),transparent)] blur-2xl" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[6%] right-[4%] h-14 w-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(180,90,255,0.3),transparent)] blur-2xl" />
        </div>
      </div>

      {/* Bottom row: the current role on the left, arrows and progress on the right. */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p data-xp-in className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-ink/45">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_#C6B5E8]" />
          Currently · {experience[0].company}
        </p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => step(-1)} aria-label="Previous role" className="flex h-12 w-12 items-center justify-center rounded-full border border-jet/25 text-[18px] text-ink transition-colors hover:border-jet/60">←</button>
          <button type="button" onClick={() => step(1)} aria-label="Next role" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[18px] text-jet shadow-[0_0_24px_-4px_rgba(198,181,232,0.8)] transition-[translate] hover:-translate-y-0.5">→</button>
          <div className="ml-4 w-40">
            <p className="text-[15px] text-ink"><span className="font-semibold">{n(focus)}</span> <span className="text-ink/40">/ {n(count - 1)}</span></p>
            <div className="mt-2.5 h-[3px] w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${((focus + 1) / count) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
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
            these notes move ;) <span aria-hidden="true" className="text-accent-deep">↷</span>
          </p>
          {notes.map((n, i) => (
            <Note key={n.tag} n={n} className={i === 1 ? 'lg:mr-10' : ''} />
          ))}
        </div>
      </div>

      {/* Experience sits on jet black lit by soft chartreuse and hot pink light. */}
      <div id="experience" className="relative -mx-5 -mb-24 mt-24 scroll-mt-24 overflow-clip bg-[linear-gradient(180deg,#F8F4EE_0%,#F8F4EE_60%,#F8F4EE_100%)] px-5 py-16 text-ink md:-mx-10 md:-mb-40 md:mt-36 md:px-10 md:py-14 lg:px-16">
        {/* Jet black with chartreuse light at the edges and thin glowing curves. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[15%] top-[10%] h-[80vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(198,181,232,0.16),transparent)] blur-3xl" />
          <div className="absolute -right-[15%] top-[20%] h-[80vh] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(198,181,232,0.14),transparent)] blur-3xl" />
          <svg viewBox="0 0 1440 800" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M-20 640 C 260 520, 420 260, 640 300 S 1040 120, 1460 60" fill="none" stroke="rgba(198,181,232,0.22)" strokeWidth="1.2" />
            <path d="M-20 760 C 340 700, 760 560, 1100 620 S 1380 520, 1460 470" fill="none" stroke="rgba(198,181,232,0.12)" strokeWidth="1" />
          </svg>
        </div>
        <ExperienceShowcase />
      </div>
    </section>
  )
}
