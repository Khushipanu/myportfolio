import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, resume } from '../data/content'
import Shapes3D from './ui/Shapes3D'

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
  const name = useRef(null)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.35 })
          .from('[data-char]', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.06 })
          .from('[data-hero-fade]', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 0.4)
          .from('[data-word]', { autoAlpha: 0, y: 30, scale: 0.85, filter: 'blur(10px)', duration: 0.9, ease: 'power3.out', stagger: 0.09, clearProps: 'filter,transform' }, 0.7)
          .from('[data-hero-rule]', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.3)
          .from('[data-hero-cta]', { y: 20, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 1.1)


        // On scroll away the two lines drift apart.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-line="1"]', { xPercent: -8, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to(name.current, { yPercent: -10, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-5 pb-6 pt-24 md:px-10 md:pb-8 md:pt-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow glow-soft drift left-[-10%] top-[-10%] h-[70vh] w-[55vw]" />
        <div className="glow glow-deep drift-slow bottom-[-30%] right-[-10%] h-[80vh] w-[60vw]" />
        <div className="glow glow-mint drift bottom-[0%] left-[25%] h-[45vh] w-[35vw]" />
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span className="mask">
          <span data-hero-fade className="flex items-center gap-2.5 rounded-full border border-ink/12 bg-white/50 px-3.5 py-1.5 uppercase tracking-[0.14em] text-ink/70 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
        </span>
        <span className="relative hidden h-px w-40 bg-ink/15 sm:block">
          <span data-hero-rule className="absolute inset-y-0 left-0 w-1/4 origin-left bg-ink/80" />
        </span>
      </div>

      <div className="relative my-auto py-6">
        {/* Floating 3D shapes that tilt with the pointer. */}
        <Shapes3D
          start={ready}
          className="pointer-events-none absolute right-[-16%] top-[-10%] aspect-square w-[54vw] md:right-[-5%] md:top-[-12%] md:w-[min(46vw,80svh)]"
        />


        {/* KHUSHI sits on the left in bold; PANU, in a light condensed face,
            starts under the second H (an invisible "KHUS" spacer sets the indent). */}
        <h1
          ref={name}
          aria-label={profile.name}
          className="hero-name relative z-10 uppercase leading-[0.9] tracking-[0.05em] text-[min(21vw,30svh)] md:text-[min(15vw,22svh)]"
        >
          <span data-line="1" className="relative block">
            <Line word={profile.firstName} />
          </span>
          <span data-line="2" className="mt-[0.08em] block whitespace-nowrap">
            <span aria-hidden="true" className="invisible">{profile.firstName.slice(0, 4).toUpperCase()}</span>
            <Line word={profile.lastName} className="hero-name-light !inline-block text-accent" />
          </span>
        </h1>


        <div className="mt-8 md:mt-10">
          <p className="text-[22px] leading-tight tracking-[-0.01em] md:text-[2.3vw]">
            {'I turn ideas into'.split(' ').map((w, i) => (
              <span key={i} data-word className="word mr-[0.25em]">{w}</span>
            ))}
          </p>
          <p className="w-fit font-serif text-accent text-[26px] italic leading-tight md:text-[2.7vw]">
            {'interactive digital experiences.'.split(' ').map((w, i) => (
              <span key={i} data-word className="word mr-[0.22em]">{w}</span>
            ))}
          </p>
          <div className="mt-6 flex flex-col gap-8 md:mt-7 md:flex-row md:items-center md:gap-12">
          <div className="mask border-l-2 border-accent/70 pl-4">
            <p data-hero-fade className="max-w-xs text-[13px] leading-relaxed text-ink/60">
              <span className="text-ink/85">Developer. Builder. Problem Solver.</span><br />Full Stack Developer passionate about building modern web applications, clean code and meaningful user experiences.
            </p>
          </div>
          <div className="relative z-20 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-hero-cta
              onClick={() => scrollToTarget('#work')}
              className="group flex items-center gap-2.5 rounded-full bg-forest px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-paper shadow-[0_14px_30px_-14px_rgba(31,77,58,0.7)] transition-[translate] duration-300 hover:-translate-y-0.5"
            >
              View my work
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <a
              href={resume.href}
              download={resume.file}
              data-hero-cta
              className="group flex items-center gap-2.5 rounded-full border border-ink/20 bg-white/40 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink backdrop-blur-sm transition-colors duration-300 hover:border-ink/50"
            >
              Download resume
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
          </div>
        </div>
      </div>


      <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="mask shrink-0">
          <span data-hero-fade className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border border-ink/20 border-t-accent [animation-duration:2.4s]" aria-hidden="true" />
            Scroll to explore
          </span>
        </span>
        <span className="h-px flex-1 bg-ink/10" />
        <span className="mask shrink-0">
          <button
            type="button"
            data-hero-fade
            onClick={() => scrollToTarget('#work')}
            className="group flex items-center gap-3 border-b border-accent/60 pb-1.5 uppercase tracking-[0.14em] hover:text-ink"
          >
            Based in India
            <span aria-hidden="true" className="text-lg leading-none text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </button>
        </span>
      </div>
    </section>
  )
}
