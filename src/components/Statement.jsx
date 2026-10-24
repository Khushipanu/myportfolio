import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Art from './Art'

// Kota-inspired: a few screens of the work and the stack it's built with float
// up through the frame while the statement rises into place line by line.
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

const lines = [
  [{ t: 'Building' }, { t: ' digital', serif: true }],
  [{ t: 'experiences' }],
  [{ t: 'that matter' }, { t: '.', accent: true }],
]

export default function Statement() {
  const root = useRef(null)
  const stage = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', scrub: 1, pin: stage.current },
        })
        gsap.utils.toArray('[data-tile]', root.current).forEach((el, i) => {
          tl.fromTo(el, { y: '110vh' }, { y: () => `${-60 * tiles[i].speed - 40}vh`, duration: 1 }, tiles[i].start)
        })
        tl.fromTo('[data-st-line]', { yPercent: 105 }, { yPercent: 0, duration: 0.22, stagger: 0.1, ease: 'power2.out' }, 0.12)
          .fromTo('[data-st-sub]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.55)
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
            {t.kind === 'art' ? (
              <Art variant={t.variant} className="aspect-[4/3] w-full rounded-[10px] text-[0.8vw] shadow-[0_40px_80px_-30px_rgba(26,25,23,0.45)] ring-1 ring-ink/10" />
            ) : (
              <Tag label={t.label} />
            )}
          </div>
        ))}

        <div className="relative z-10 text-center">
          <h2 id="statement-title" className="font-display text-[13vw] uppercase leading-[0.9] md:text-[8.6vw]">
            {lines.map((line, i) => (
              <span key={i} className="mask">
                <span data-st-line>
                  {line.map((w, j) =>
                    w.serif ? (
                      <em key={j} className="pr-[0.06em] font-serif font-normal normal-case italic tracking-[-0.02em] text-accent">{w.t}</em>
                    ) : (
                      <span key={j} className={w.accent ? 'text-accent' : ''}>{w.t}</span>
                    ),
                  )}
                </span>
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
