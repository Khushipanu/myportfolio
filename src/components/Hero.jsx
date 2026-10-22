import { useLayoutEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { profile } from '../data/content'

// Scale a single line of text so it spans the full width of its container.
function useFitText(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const ratio = el.parentElement.clientWidth / el.scrollWidth
      el.style.fontSize = `${Math.floor(100 * ratio * 0.995 * 100) / 100}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [ref])
}

export default function Hero({ ready }) {
  const root = useRef(null)
  const name = useRef(null)
  useFitText(name)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.1 })
          .from('[data-char]', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.045 })
          .from('[data-hero-fade]', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.35)
          .from('[data-hero-rule]', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.2)

        // As the page scrolls away, the name drifts up and the letters spread apart slightly.
        gsap.to(name.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-char]', {
          yPercent: (i) => (i % 2 ? -14 : 8),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  const words = [profile.firstName, profile.lastName].map((w) => w.toUpperCase().split(''))

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-6 pt-28 md:px-10 md:pb-8"
    >
      <div className="grid grid-cols-12 gap-x-5 gap-y-8 pb-10 md:pb-14">
        <div className="col-span-12 md:col-span-5">
          <p className="mask font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <span data-hero-fade>(Portfolio — 2026)</span>
          </p>
          <p className="mt-5 max-w-md text-[17px] leading-snug md:text-xl">
            <span className="mask"><span data-hero-fade>Full Stack Developer building</span></span>
            <span className="mask"><span data-hero-fade>web applications with the MERN stack —</span></span>
            <span className="mask"><span data-hero-fade>from <em className="font-serif text-[1.15em] italic">interfaces</em> to <em className="font-serif text-[1.15em] italic">APIs</em>.</span></span>
          </p>
        </div>
        <div className="col-span-6 md:col-span-3 md:col-start-8">
          <p className="mask font-mono text-[11px] uppercase tracking-[0.12em] text-muted"><span data-hero-fade>Currently</span></p>
          <p className="mask mt-2 text-[15px]"><span data-hero-fade>Full Stack Developer</span></p>
          <p className="mask text-[15px] text-muted"><span data-hero-fade>Ruhanix OPC Pvt. Ltd.</span></p>
        </div>
        <div className="col-span-6 md:col-span-2">
          <p className="mask font-mono text-[11px] uppercase tracking-[0.12em] text-muted"><span data-hero-fade>Stack</span></p>
          <p className="mask mt-2 text-[15px]"><span data-hero-fade>React.js · Node.js</span></p>
          <p className="mask text-[15px] text-muted"><span data-hero-fade>Express.js · MongoDB</span></p>
        </div>
      </div>

      <div className="h-px w-full origin-left bg-ink/25" data-hero-rule />

      <div className="relative w-full pt-3">
        <h1
          ref={name}
          aria-label={profile.name}
          className="inline-block whitespace-nowrap font-display uppercase leading-[0.8] tracking-[-0.01em] will-change-transform"
        >
          {/* One line on desktop; on phones each word gets its own full-width line. */}
          {words.map((word, w) => (
            <span key={w} aria-hidden="true" className="max-md:block">
              {word.map((c, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <span data-char className="inline-block">{c}</span>
                </span>
              ))}
              {w === 0 && <span className="max-md:hidden">{'\u00A0'}</span>}
            </span>
          ))}
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span className="mask"><span data-hero-fade>{profile.location}</span></span>
        <span className="mask max-md:hidden"><span data-hero-fade>Scroll ↓</span></span>
      </div>
    </section>
  )
}
