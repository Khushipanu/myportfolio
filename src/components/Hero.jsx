import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, resume } from '../data/content'
import Orb3D from './ui/Orb3D'

// Minimal hero: the name, one line about the work and two actions on the left,
// with a glossy 3D liquid orb on the right.
function Line({ word, className = '' }) {
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {word.toUpperCase().split('').map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-char className="inline-block">{c}</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready }) {
  const root = useRef(null)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.3 })
          .from('[data-char]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05 })
          .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.5)

        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-hero-name]', { yPercent: -18, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-jet px-5 pb-8 pt-28 text-ink md:px-10 md:pt-32">
      <Orb3D
        start={ready}
        className="pointer-events-none absolute right-[-34%] top-[1%] -z-10 aspect-square w-[78vw] md:right-[-4%] md:top-1/2 md:w-[min(52vw,92svh)] md:-translate-y-1/2"
      />

      <div className="relative z-10 my-auto max-w-[60rem]">
        <span data-hero-fade className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
            <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
          </span>
          Available for work
        </span>

        <h1
          data-hero-name
          aria-label={profile.name}
          className="mt-8 font-display uppercase leading-[0.86] tracking-[-0.03em] [font-stretch:100%] [font-weight:800] text-[19vw] md:text-[min(12.5vw,24svh)]"
        >
          <Line word={profile.firstName} />
          <Line word={profile.lastName} className="text-chartreuse" />
        </h1>

        <p data-hero-fade className="mt-8 max-w-md text-[18px] leading-relaxed text-ink/70 md:text-[20px]">
          Full Stack Developer. I turn ideas into <span className="text-ink">interactive digital experiences.</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-hero-fade
            onClick={() => scrollToTarget('#work')}
            className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet transition-[translate] duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:-rotate-45">→</span>
            Explore my work
          </button>
          <a
            href={resume.href}
            download={resume.file}
            data-hero-fade
            className="flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-chartreuse hover:text-chartreuse"
          >
            Resume <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <p data-hero-fade className="relative z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
        <span className="h-px w-10 bg-ink/30" />
        Scroll to explore
      </p>
    </section>
  )
}
