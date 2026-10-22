import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Art from './Art'

// Kota-inspired: a few images float up through the frame while the statement
// rises into place line by line from below.
const tiles = [
  { variant: 'code', className: 'left-[4%] w-[30vw] md:left-[6%] md:w-[17vw]', aspect: 'aspect-[4/5]', speed: 1.25, start: 0 },
  { variant: 'ui', className: 'right-[3%] w-[34vw] md:right-[10%] md:w-[15vw]', aspect: 'aspect-square', speed: 1, start: 0.08 },
  { variant: 'erp', className: 'left-[52%] w-[30vw] md:left-[30%] md:w-[13vw]', aspect: 'aspect-[3/4]', speed: 1.45, start: 0.25 },
  { variant: 'mark', className: 'right-[30%] w-[22vw] md:right-[26%] md:w-[10vw]', aspect: 'aspect-square', speed: 0.85, start: 0.35 },
]

const lines = [
  [{ t: 'Turning' }],
  [{ t: 'ideas', serif: true }, { t: ' into' }],
  [{ t: 'impact' }, { t: '.', accent: true }],
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
    <section ref={root} aria-labelledby="statement-title" className="relative">
      <div ref={stage} className="relative flex h-[100svh] items-center justify-center overflow-hidden px-5">
        {tiles.map((t, i) => (
          <div key={i} data-tile className={`absolute top-0 z-0 text-[1.05vw] ${t.className} max-md:hidden md:block`} style={{ transform: 'translateY(110vh)' }}>
            <Art variant={t.variant} className={`${t.aspect} w-full rounded-[4px] shadow-[0_30px_60px_-30px_rgba(20,18,16,0.5)]`} />
          </div>
        ))}

        <div className="relative z-10 text-center">
          <h2 id="statement-title" className="font-display text-[19vw] uppercase leading-[0.88] md:text-[11.5vw]">
            {lines.map((line, i) => (
              <span key={i} className="mask">
                <span data-st-line>
                  {line.map((w, j) =>
                    w.serif ? (
                      <em key={j} className="font-serif font-normal normal-case italic tracking-[-0.02em]">{w.t}</em>
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

        {/* On small screens the tiles sit in a simple row instead of floating. */}
        <div className="absolute bottom-6 left-5 right-5 grid grid-cols-3 gap-3 md:hidden" aria-hidden="true">
          {['code', 'ui', 'erp'].map((v) => (
            <Art key={v} variant={v} className="aspect-[4/5] rounded-[4px] text-[9px]" />
          ))}
        </div>
      </div>
    </section>
  )
}
