import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'
import SerenityBackdrop from './ui/SerenityBackdrop'

const dots = [
  { href: '#top', label: 'Intro' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
]

// Tilted skill stickers floating around the name; `depth` sets how far each
// one drifts with the pointer.
const stickers = [
  { t: 'React.js', cls: 'right-[4%] -top-[6%] md:right-auto md:left-[52%] md:top-[12%] -rotate-[8deg] bg-sand text-ink', depth: 18 },
  { t: 'Node.js', cls: 'right-[6%] top-[58%] rotate-[6deg] bg-forest text-paper hidden md:block', depth: 28 },
  { t: 'MongoDB', cls: 'right-[30%] bottom-[6%] -rotate-[4deg] bg-ink text-paper hidden md:block', depth: 22 },
  { t: 'Express.js', cls: 'right-[3%] top-[6%] rotate-[10deg] bg-blush text-ink hidden md:block', depth: 14 },
]
const band = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript', 'REST APIs']

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

        gsap.from('[data-sun]', { scale: 0.6, autoAlpha: 0, duration: 1.8, ease: 'expo.out', delay: 0.5 })
        gsap.from('[data-sticker]', { scale: 0, autoAlpha: 0, duration: 1, ease: 'back.out(1.8)', stagger: 0.12, delay: 1.1 })
        gsap.from('[data-band]', { yPercent: 120, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 1 })

        // Stickers drift with the pointer, each at its own depth.
        const els = gsap.utils.toArray('[data-sticker]', root.current)
        const onMove = (e) => {
          const x = e.clientX / window.innerWidth - 0.5
          const y = e.clientY / window.innerHeight - 0.5
          els.forEach((el) => {
            const d = Number(el.dataset.depth)
            gsap.to(el, { x: x * d * 2, y: y * d * 2, duration: 1.2, ease: 'power3.out' })
          })
          gsap.to('[data-sun]', { x: x * -14, y: y * -14, duration: 1.6, ease: 'power3.out' })
        }
        window.addEventListener('pointermove', onMove, { passive: true })

        // On scroll away the two lines drift apart.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-line="1"]', { xPercent: -8, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to(name.current, { yPercent: -10, ease: 'none', scrollTrigger: st })
        return () => window.removeEventListener('pointermove', onMove)
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
      <SerenityBackdrop start={ready} id="hero-grid" className="-z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow glow-soft drift left-[-10%] top-[-10%] h-[70vh] w-[55vw]" />
        <div className="glow glow-deep drift-slow bottom-[-30%] right-[-10%] h-[80vh] w-[60vw]" />
        <div className="glow glow-mint drift bottom-[0%] left-[25%] h-[45vh] w-[35vw]" />
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-muted">
        <span className="mask"><span data-hero-fade>// 01</span></span>
        <span className="relative block h-px w-40 bg-ink/15">
          <span data-hero-rule className="absolute inset-y-0 left-0 w-1/4 origin-left bg-ink/80" />
        </span>
      </div>

      <div className="relative my-auto py-6">
        {/* Terracotta sun with a slowly turning ring of text. */}
        <div
          data-sun
          aria-hidden="true"
          className="pointer-events-none absolute right-[-14%] top-[-34%] aspect-square w-[52vw] md:right-[4%] md:top-[2%] md:w-[min(30vw,56svh)]"
        >
          <div className="absolute inset-[9%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_32%_28%,#e5865c,#cf6236_52%,#a9492a)] shadow-[0_40px_120px_-30px_rgba(207,98,54,0.6)]">
            <div className="absolute inset-0 opacity-30 mix-blend-multiply [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
          </div>
          <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <path id="sun-ring" d="M100,100 m-94,0 a94,94 0 1,1 188,0 a94,94 0 1,1 -188,0" />
            </defs>
            <text className="fill-ink font-mono text-[8.4px] uppercase tracking-[0.32em]">
              <textPath href="#sun-ring">Full Stack Developer ✦ MERN Stack ✦ Based in India ✦ </textPath>
            </text>
          </svg>
        </div>

        {stickers.map((st) => (
          <span
            key={st.t}
            data-sticker
            data-depth={st.depth}
            aria-hidden="true"
            className={`pointer-events-none absolute z-20 rounded-full px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] shadow-[0_12px_30px_-12px_rgba(23,21,18,0.45)] md:px-5 md:py-2.5 md:text-[12px] ${st.cls}`}
          >
            {st.t}
          </span>
        ))}

        {/* KHUSHI sits on the left in bold; PANU, in a light condensed face,
            starts under the second H (an invisible "KHUS" spacer sets the indent). */}
        <h1
          ref={name}
          aria-label={profile.name}
          className="hero-name relative z-10 uppercase leading-[0.9] tracking-[0.05em] text-[min(21vw,30svh)] md:text-[min(15vw,24svh)]"
        >
          <span data-line="1" className="relative block">
            <Line word={profile.firstName} />
          </span>
          <span data-line="2" className="mt-[0.08em] block whitespace-nowrap">
            <span aria-hidden="true" className="invisible">{profile.firstName.slice(0, 4).toUpperCase()}</span>
            <Line word={profile.lastName} className="hero-name-light !inline-block text-accent" />
          </span>
        </h1>


        <div className="mt-8 max-w-xl md:mt-12">
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
          <div className="mask mt-6 border-l-2 border-accent/70 pl-4">
            <p data-hero-fade className="max-w-xs text-[13px] leading-relaxed text-ink/60">
              <span className="text-ink/85">Developer. Builder. Problem Solver.</span><br />Full Stack Developer passionate about building modern web applications, clean code and meaningful user experiences.
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Sections" className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:right-10 md:flex">
        {dots.map((d, i) => (
          <a
            key={d.href}
            href={d.href}
            onClick={(e) => { e.preventDefault(); scrollToTarget(d.href) }}
            aria-label={d.label}
            className={`block h-1.5 w-1.5 rounded-full transition-colors hover:bg-accent ${i === 0 ? 'bg-accent' : 'bg-ink/30'}`}
          />
        ))}
        <span className="mt-2 block h-40 w-px bg-ink/15" />
      </nav>

      {/* Skills band running across the foot of the hero. */}
      <div data-band aria-hidden="true" className="-mx-5 mb-6 -rotate-[1.2deg] overflow-hidden bg-forest py-3 text-paper md:-mx-10 md:mb-8 md:py-4">
        <div className="marquee flex w-max gap-8 whitespace-nowrap font-tall text-[22px] uppercase tracking-[0.04em] md:text-[30px]">
          {[...band, ...band].map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              {t}
              <span className="text-[0.7em] text-terracotta">✦</span>
            </span>
          ))}
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
