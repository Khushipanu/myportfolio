import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, resume } from '../data/content'
import Art from './Art'

// Poster-style hero after the "Sound Waves" reference: a huge heavy name in
// hot pink and chartreuse over slowly morphing blobs with a halftone dot
// texture, editorial side labels, a numbered section index and a small
// "latest work" card. Blobs drift with the pointer.
const index = [
  { n: '01', label: 'Work', href: '#work' },
  { n: '02', label: 'About', href: '#about' },
  { n: '03', label: 'Experience', href: '#experience' },
  { n: '04', label: 'Contact', href: '#contact' },
]

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

// A blob whose outline morphs between three shapes (SMIL keeps it smooth and
// works everywhere). All three paths share the same commands so they blend.
function Blob({ fill, paths, dur = '14s', className = '', style }) {
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true" className={className} style={style}>
      <path fill={fill} d={paths[0]}>
        <animate attributeName="d" dur={dur} repeatCount="indefinite" values={`${paths[0]};${paths[1]};${paths[2]};${paths[0]}`} calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" />
      </path>
    </svg>
  )
}

const limeBlob = [
  'M421 92c58 39 104 104 98 170-6 67-64 135-130 182-66 48-140 75-203 54-63-22-115-91-121-162-6-72 34-146 93-196 59-49 136-74 199-60 21 4 44 1 64 12z',
  'M445 120c50 49 82 113 66 177-16 63-81 126-150 164-69 39-142 52-199 22-57-29-98-102-95-171 3-70 50-136 108-178 59-41 128-58 186-44 30 7 61 10 84 30z',
  'M402 82c66 30 117 92 120 160 3 69-41 145-104 190-62 45-144 60-208 33-64-26-111-94-115-163-5-69 33-140 92-185 59-46 140-66 215-35z',
]
const pinkBlob = [
  'M398 110c52 34 86 96 82 157-4 62-46 123-104 155-58 33-132 37-187 7-55-31-91-97-87-160 4-64 48-125 104-155 55-31 140-38 192-4z',
  'M410 140c40 45 61 103 47 158-14 56-63 108-123 132-60 23-131 19-180-17-49-37-76-106-63-167 13-60 66-112 128-133 63-22 151-18 191 27z',
  'M380 96c60 26 105 84 108 146 4 62-35 128-95 164-60 37-141 44-197 12-56-31-87-102-79-167 8-64 55-122 114-150 59-27 107-31 149-5z',
]

export default function Hero({ ready }) {
  const root = useRef(null)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({ delay: 0.3 })
          .from('[data-blob]', { scale: 0.4, autoAlpha: 0, duration: 1.6, ease: 'expo.out', stagger: 0.12 })
          .from('[data-char]', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05 }, 0.25)
          .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, 0.7)

        // Blobs drift against the pointer, each at its own depth.
        const blobs = gsap.utils.toArray('[data-blob]', root.current)
        const onMove = (e) => {
          const x = e.clientX / window.innerWidth - 0.5
          const y = e.clientY / window.innerHeight - 0.5
          blobs.forEach((b, i) => gsap.to(b, { x: x * (i ? -40 : 30), y: y * (i ? -30 : 24), duration: 1.4, ease: 'power3.out' }))
        }
        window.addEventListener('pointermove', onMove, { passive: true })

        // On scroll away the name lines slide apart.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-line="1"]', { xPercent: -10, ease: 'none', scrollTrigger: st })
        gsap.to('[data-line="2"]', { xPercent: 10, ease: 'none', scrollTrigger: st })
        return () => window.removeEventListener('pointermove', onMove)
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-jet px-5 pb-6 pt-24 text-ink md:px-10 md:pb-8 md:pt-28">
      {/* Morphing blobs with a halftone dot texture. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-blob className="absolute right-[-30%] top-[6%] w-[110vw] md:right-[2%] md:top-[4%] md:w-[min(62vw,110svh)]">
          <Blob fill="#d4ff3f" paths={limeBlob} dur="16s" className="w-full" />
          <div className="absolute inset-[12%] rounded-full opacity-40 mix-blend-multiply [background-image:radial-gradient(#0b0b0b_1.2px,transparent_1.4px)] [background-size:9px_9px] [mask-image:radial-gradient(closest-side,#000_30%,transparent)]" />
        </div>
        <div data-blob className="absolute left-[-35%] top-[56%] w-[80vw] md:left-[24%] md:top-[30%] md:w-[min(40vw,72svh)]">
          <Blob fill="#ff2da8" paths={pinkBlob} dur="12s" className="w-full" />
        </div>
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(244,241,234,0.5)_1px,transparent_1.2px)] [background-size:4px_4px] [mask-image:linear-gradient(180deg,transparent,#000_30%,transparent)]" />
      </div>

      {/* Top row: status and tagline. */}
      <div className="flex items-start justify-between gap-6">
        <span data-hero-fade className="flex items-center gap-2.5 rounded-full border border-ink/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
            <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
          </span>
          Available for work
        </span>
        <p data-hero-fade className="hidden max-w-[16rem] text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink/60 md:block">
          Full Stack Developer<br />MERN · React · Node<br />Based in India
        </p>
      </div>

      {/* The name. */}
      <h1
        aria-label={profile.name}
        className="relative z-10 my-auto py-8 font-display uppercase leading-[0.84] tracking-[-0.035em] [font-stretch:115%] [font-weight:900] text-[16.5vw] md:text-[min(17vw,30svh)]"
      >
        <span data-line="1" className="block text-pink drop-shadow-[0_6px_0_rgba(0,0,0,0.25)]">
          <Line word={profile.firstName} />
        </span>
        <span data-line="2" className="block pl-[8vw] text-chartreuse [-webkit-text-stroke:2px_#0b0b0b] md:pl-[18vw]">
          <Line word={profile.lastName} />
        </span>
      </h1>

      {/* Numbered section index, like the poster's 01–04. */}
      <nav aria-label="Sections" className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 md:right-10 md:block">
        <ul className="space-y-2 font-mono text-[11px] uppercase tracking-[0.14em]">
          {index.map((s) => (
            <li key={s.n} data-hero-fade>
              <a href={s.href} onClick={(e) => { e.preventDefault(); scrollToTarget(s.href) }} className="group flex items-center justify-end gap-3 text-ink/60 transition-colors hover:text-chartreuse">
                {s.label}
                <span className="text-chartreuse">{s.n}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom row: intro and actions on the left, latest work on the right. */}
      <div className="relative z-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p data-hero-fade className="text-[20px] leading-snug text-ink md:text-[24px]">
            I turn ideas into <span className="font-serif text-[1.15em] italic text-chartreuse">interactive digital experiences.</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-hero-fade
              onClick={() => scrollToTarget('#work')}
              className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet transition-[translate] duration-300 hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:rotate-[-45deg]">→</span>
              Explore my work
            </button>
            <a
              href={resume.href}
              download={resume.file}
              data-hero-fade
              className="flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-pink hover:text-pink"
            >
              Resume <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          data-hero-fade
          onClick={() => scrollToTarget('#work')}
          className="group hidden w-[min(22rem,26vw)] overflow-hidden rounded-[14px] border border-ink/15 bg-paper-2 text-left md:block"
        >
          <Art variant="movie" className="aspect-[16/9] w-full text-[0.7vw] transition-transform duration-700 group-hover:scale-105" />
          <span className="flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70">
            Latest · MovieThrill
            <span className="text-pink transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </button>
      </div>
    </section>
  )
}
