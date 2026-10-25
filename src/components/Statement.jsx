import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Art from './Art'

// Kota-inspired: a few screens of the work and the stack it's built with float
// up through the frame while the statement rises into place letter by letter.
// "digital" gets a hand-drawn underline and the full stop pops in. On hover,
// letters hop and turn violet, the heading tilts towards the pointer with a
// soft glow behind it, and the screens lift.
const tiles = [
  { kind: 'art', variant: 'movieDetail', className: 'left-[5%] w-[20vw]', speed: 1.2, start: 0 },
  { kind: 'art', variant: 'lmsPlayer', className: 'right-[6%] w-[19vw]', speed: 1, start: 0.1 },
  { kind: 'art', variant: 'erp', className: 'left-[28%] w-[15vw]', speed: 1.45, start: 0.3 },
  { kind: 'tag', label: 'React.js', className: 'left-[14%]', speed: 0.9, start: 0.05 },
  { kind: 'tag', label: 'Node.js', className: 'right-[28%]', speed: 1.3, start: 0.12 },
  { kind: 'tag', label: 'MongoDB', className: 'right-[12%]', speed: 0.8, start: 0.24 },
  { kind: 'tag', label: 'Express.js', className: 'left-[40%]', speed: 1.1, start: 0.36 },
  { kind: 'tag', label: 'Redux Toolkit', className: 'left-[8%]', speed: 1.35, start: 0.42 },
  { kind: 'tag', label: 'Tailwind CSS', className: 'right-[20%]', speed: 1.05, start: 0.5 },
]

function Tag({ label }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/15 bg-ink/[0.04] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/80 backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  )
}

// Splits a word into letters that can animate and hop on hover.
function Letters({ text, className = '' }) {
  return text.split('').map((c, i) => (
    <span
      key={i}
      className={`inline-block whitespace-pre transition-[transform,color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[0.08em] hover:-rotate-3 hover:text-accent-deep ${className}`}
    >
      {/* GSAP animates the inner letter, the hover moves the outer one. */}
      <span data-st-char className="inline-block whitespace-pre">{c}</span>
    </span>
  ))
}

const lines = [
  [{ t: 'Building' }, { t: ' digital', serif: true }],
  [{ t: 'experiences' }],
  [{ t: 'that matter' }, { t: '.', accent: true }],
]

export default function Statement() {
  const root = useRef(null)
  const stage = useRef(null)
  const head = useRef(null)
  const spot = useRef(null)

  // The heading leans towards the pointer and a soft light follows it.
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = head.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    head.current.style.setProperty('--hx', `${(-y * 8).toFixed(2)}deg`)
    head.current.style.setProperty('--hy', `${(x * 10).toFixed(2)}deg`)
    const s = stage.current.getBoundingClientRect()
    spot.current.style.left = `${e.clientX - s.left}px`
    spot.current.style.top = `${e.clientY - s.top}px`
    spot.current.style.opacity = '1'
  }
  const untilt = () => {
    head.current.style.setProperty('--hx', '0deg')
    head.current.style.setProperty('--hy', '0deg')
    spot.current.style.opacity = '0'
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // A short hold: the heading is already visible as the section
        // arrives, and the tiles float up past it over about one screen.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=90%', scrub: 1, pin: stage.current },
        })
        gsap.utils.toArray('[data-tile]', root.current).forEach((el, i) => {
          tl.fromTo(el, { y: '70vh' }, { y: () => `${-60 * tiles[i].speed - 40}vh`, duration: 1 }, tiles[i].start * 0.5)
        })
        // Letters rise out of their lines, unblurring as they come.
        const intro = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
        intro
          .from('[data-st-char]', {
            yPercent: 110,
            rotateX: -70,
            filter: 'blur(8px)',
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.025,
          })
          .from('[data-st-digital]', { yPercent: 60, autoAlpha: 0, filter: 'blur(10px)', duration: 1.1, ease: 'expo.out' }, 0.25)
          .to('[data-st-scribble] path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.7)
          .from('[data-st-dot]', { scale: 0, duration: 0.7, ease: 'back.out(3)' }, 0.9)
        gsap.from('[data-st-sub]', {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          ease: 'expo.out',
          delay: 0.3,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="statement-title" className="relative isolate">
      <div ref={stage} className="relative flex h-[100svh] items-center justify-center overflow-hidden px-5">
        <div aria-hidden="true" className="glow glow-deep -z-10 left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2" />
        {tiles.map((t, i) => (
          <div key={i} data-tile className={`absolute top-0 z-0 hidden md:block ${t.className}`} style={{ transform: 'translateY(110vh)' }}>
            <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-3 hover:-rotate-1 hover:scale-[1.04]">
              {t.kind === 'art' ? (
                <Art variant={t.variant} className="aspect-[4/3] w-full rounded-[10px] text-[0.8vw] shadow-[0_40px_80px_-30px_rgba(36,27,53,0.45)] ring-1 ring-ink/10 transition-shadow duration-500 hover:shadow-[0_50px_90px_-30px_rgba(113,81,181,0.55)]" />
              ) : (
                <Tag label={t.label} />
              )}
            </div>
          </div>
        ))}

        {/* A soft violet light follows the pointer behind the heading. */}
        <div
          ref={spot}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -z-0 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 [background:radial-gradient(closest-side,rgba(167,139,250,0.55),transparent)]"
        />

        <div ref={head} onPointerMove={tilt} onPointerLeave={untilt} className="relative z-10 text-center [perspective:1200px]">
          <h2
            id="statement-title"
            aria-label="Building digital experiences that matter."
            className="font-display text-[13vw] uppercase leading-[0.9] transition-transform duration-500 ease-out [transform-style:preserve-3d] md:text-[8.6vw]"
            style={{ transform: 'rotateX(var(--hx,0deg)) rotateY(var(--hy,0deg))' }}
          >
            {lines.map((line, i) => (
              <span key={i} aria-hidden="true" className="block [perspective:800px]">
                {line.map((w, j) =>
                  w.serif ? (
                    <em key={j} data-st-digital className="relative inline-block pr-[0.06em] font-serif font-normal normal-case italic tracking-[-0.02em] text-accent-deep">
                      <Letters text={w.t} className="hover:text-ink" />
                      <svg data-st-scribble aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.06em] left-[6%] h-[0.22em] w-[92%] overflow-visible">
                        <path pathLength="1" d="M3 14 C 50 4, 90 22, 140 12 S 230 4, 297 11" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                      </svg>
                    </em>
                  ) : w.accent ? (
                    <span key={j} data-st-dot className="inline-block origin-bottom text-accent-deep">{w.t}</span>
                  ) : (
                    <Letters key={j} text={w.t} />
                  ),
                )}
              </span>
            ))}
          </h2>
          <p data-st-sub className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-muted md:text-base">
            I build responsive interfaces, reliable APIs and ERP modules — clean code that supports real business workflows.
          </p>
        </div>

        {/* On small screens the stack tags sit in a simple row instead of floating. */}
        <div className="absolute bottom-8 left-5 right-5 flex flex-wrap justify-center gap-2 md:hidden" aria-hidden="true">
          {tiles.filter((t) => t.kind === 'tag').map((t) => <Tag key={t.label} label={t.label} />)}
        </div>
      </div>
    </section>
  )
}
