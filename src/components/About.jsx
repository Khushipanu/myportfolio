import { useRef } from 'react'
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { about, services } from '../data/content'

// Stroke icons for the service cards, in the same order as `services`.
const icons = [
  'M3 5h18v14H3zM3 9h18M7 13h5M7 16h3', // interface
  'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01', // server
  'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', // modules
  'M13 2 4 14h7l-1 8 9-12h-7z', // speed
  'M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', // nodes
  'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5', // layers
]

function ServiceCard({ s, i, last }) {
  return (
    <li
      data-service
      className={`relative overflow-hidden rounded-[14px] border will-change-transform ${
        last ? 'border-accent bg-accent text-coal' : 'border-ink/10 bg-[#1a1a1a] text-ink'
      }`}
    >
      <div data-service-body className="px-5 py-5 md:px-8 md:py-7">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 shrink-0 ${last ? 'text-coal' : 'text-accent'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[i % icons.length]} />
          </svg>
          <h3 className="text-[20px] font-medium leading-tight tracking-[-0.01em] md:text-[26px]">{s.title}</h3>
          <span className={`ml-auto font-mono text-[11px] tracking-[0.12em] ${last ? 'text-coal/60' : 'text-muted'}`}>0{i + 1}</span>
        </div>
        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-8">
          <p className={`text-[14px] leading-relaxed md:text-[15px] ${last ? 'text-coal/80' : 'text-ink/70'}`}>{s.description}</p>
          <ul className={`space-y-1.5 text-[13px] leading-snug md:text-[14px] ${last ? 'text-coal/85' : 'text-ink/80'}`}>
            {s.points.map((pt) => (
              <li key={pt} className="flex gap-2.5">
                <span aria-hidden="true" className={`mt-[0.45em] h-1 w-1 shrink-0 rounded-full ${last ? 'bg-coal' : 'bg-accent'}`} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <p className={`mt-4 font-mono text-[10px] uppercase tracking-[0.14em] md:mt-5 md:text-[11px] ${last ? 'text-coal/60' : 'text-muted'}`}>{s.tags.join(' · ')}</p>
      </div>
      {/* Darkens a card once newer ones have stacked over it. */}
      <span data-service-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
    </li>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // autoSplit re-splits once fonts load and on resize, so line breaks stay correct.
        const split = SplitText.create('[data-about-lead]', {
          type: 'words',
          mask: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 100,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.025,
              scrollTrigger: { trigger: '[data-about-lead]', start: 'top 75%' },
            }),
        })
        // Brilean-style stack: the section pins, each card slides up over the
        // last, and older cards fold back into thin edges above it.
        const stack = root.current.querySelector('[data-service-list]')
        const cards = gsap.utils.toArray('[data-service]', stack)
        const bodies = cards.map((c) => c.querySelector('[data-service-body]'))
        const dims = cards.map((c) => c.querySelector('[data-service-dim]'))
        const EDGE = 14
        const DEPTH = 5
        const TOP = EDGE * DEPTH
        let H = 0
        gsap.set(cards, { position: 'absolute', left: 0, right: 0, top: 0, transformOrigin: '50% 0%' })
        const measure = () => {
          gsap.set(cards, { height: 'auto' })
          H = Math.max(...cards.map((c) => c.offsetHeight))
          gsap.set(cards, { height: H })
          stack.style.height = `${TOP + H}px`
        }
        const state = { r: 0 }
        const hold = (t) => gsap.parseEase('power2.inOut')(gsap.utils.clamp(0, 1, (t - 0.2) / 0.6))
        const render = () => {
          const p = Math.floor(state.r) + hold(state.r % 1)
          cards.forEach((c, i) => {
            const d = i - p
            if (d >= 0) {
              c.style.transform = `translate3d(0, ${(TOP + d * (H + 24)).toFixed(1)}px, 0)`
              bodies[i].style.opacity = '1'
              dims[i].style.opacity = '0'
            } else {
              const k = Math.min(-d, DEPTH)
              c.style.transform = `translate3d(0, ${(TOP - k * EDGE).toFixed(1)}px, 0) scale(${(1 - k * 0.035).toFixed(4)})`
              bodies[i].style.opacity = gsap.utils.clamp(0, 1, 1 + d * 2.5).toFixed(3)
              dims[i].style.opacity = Math.min(0.55, k * 0.22).toFixed(3)
            }
          })
        }
        measure()
        render()
        ScrollTrigger.addEventListener('refreshInit', measure)
        gsap.to(state, {
          r: cards.length - 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: '[data-focus-pin]',
            start: 'top top',
            end: `+=${(cards.length - 1) * 70}%`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        gsap.from('[data-focus-pin] [data-focus-fade]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-focus-pin]', start: 'top 75%' },
        })
        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure)
          split.revert()
          stack.style.height = ''
        }

      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-deep -z-10 -left-[10%] top-[5%] h-[55vh] w-[45vw]" />
      <div className="grid grid-cols-12 gap-x-5 gap-y-10">
        <h2 id="about-title" className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:col-span-3">
          (03) About
        </h2>
        <div className="col-span-12 md:col-span-9">
          <p data-about-lead className="text-[8.5vw] font-medium leading-[1.02] tracking-[-0.03em] md:text-[4.2vw]">
            {about.lead.map((part, i) =>
              part.serif ? (
                <em key={i} className="pr-[0.05em] text-accent font-serif font-normal italic tracking-[-0.01em]">{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink/75">{about.body}</p>
        </div>
      </div>

      <div id="focus" data-focus-pin className="relative -mx-5 mt-24 flex min-h-[100svh] scroll-mt-0 flex-col justify-center px-5 pb-10 pt-24 md:-mx-10 md:mt-36 md:px-10 md:pt-28">
        <p data-focus-fade className="absolute left-5 top-24 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:left-10 md:top-28">What I do</p>
        <ul data-service-list className="relative mx-auto flex w-full max-w-[52rem] flex-col gap-4 overflow-hidden" aria-label="What I do">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} last={i === services.length - 1} />
          ))}
        </ul>
        <div data-focus-fade className="mx-auto mt-10 flex max-w-2xl flex-col items-center text-center md:mt-14">
          <p className="text-[20px] font-light leading-snug tracking-[-0.01em] text-ink md:text-[30px]">
            No fixed recipe. I build what the product needs — <em className="font-serif italic text-accent">frontend or backend</em>, from the first component to the last API call.
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget('#experience')}
            aria-label="Next: experience"
            className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-ink/40 text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}
