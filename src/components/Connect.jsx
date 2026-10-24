import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section. First, after guillaumezhu.com, a giant "Let's connect"
// slides across as you scroll, its letters falling into line as they reach the
// middle. Then a large contact panel, followed by the links and the footer bar.
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`
function Magnetic({ children, className = '', ...props }) {
  const el = useRef(null)
  const onMove = (e) => {
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
  const onLeave = () => gsap.to(el.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  return (
    <a ref={el} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block ${className}`} {...props}>
      {children}
    </a>
  )
}

const LINE = "Let's connect →"
// Fixed pseudo-random scatter per letter, so it is the same on every render.
const jitter = (i) => {
  const r = (n) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { y: (r(1) - 0.5) * 2, rot: (r(2) - 0.5) * 2 }
}

export default function Connect() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Wide screens: the sentence slides across while the section is held,
      // and letters still on the right are scattered until they reach the
      // middle, where they settle into line.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chars = gsap.utils.toArray('[data-lc-char]', track.current)
        const jit = chars.map((_, i) => jitter(i))
        let offsets = []
        const measure = () => { offsets = chars.map((c) => c.offsetLeft + c.offsetWidth / 2) }
        measure()
        const place = (x) => {
          const vw = window.innerWidth
          track.current.style.transform = `translate3d(${x}px,0,0)`
          chars.forEach((c, i) => {
            const sx = x + offsets[i]
            const k = gsap.utils.clamp(0, 1, (sx - vw * 0.5) / (vw * 0.45))
            const e = k * k * (3 - 2 * k)
            c.style.transform = `translate3d(0, ${(jit[i].y * e * 0.55).toFixed(3)}em, 0) rotate(${(jit[i].rot * e * 28).toFixed(2)}deg)`
          })
        }
        // From just right of centre to where the last letter has passed the middle.
        const start = () => window.innerWidth * 0.75
        const end = () => window.innerWidth * 0.42 - track.current.scrollWidth
        const distance = () => start() - end()
        place(start())
        ScrollTrigger.create({
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: (self) => place(start() - self.progress * distance()),
        })
      })
      mm.add(MOTION_OK, () => {
        gsap.from('[data-lc-panel] > *', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-lc-stage]', start: 'top 45%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const links = [
    { label: 'Gmail', href: gmail },
    ...socials.map((s) => ({ label: s.label, href: s.href })),
  ]

  return (
    <footer id="contact" ref={root} className="relative bg-jet text-ink">
      {/* Part 1: giant sentence that slides across and falls into place. */}
      <div ref={pin} className="relative flex min-h-[60svh] items-center overflow-hidden md:h-[100svh]">
        <p className="absolute left-5 top-24 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:top-28">(06) Contact</p>
        <a href={gmail} target="_blank" rel="noreferrer" aria-label="Let's connect — write to me on Gmail" className="block w-full">
          <span
            ref={track}
            aria-hidden="true"
            className="block px-5 py-24 text-[19vw] font-black leading-[0.95] tracking-[-0.05em] md:inline-block md:whitespace-nowrap md:px-0 md:py-0 md:text-[17vw] md:will-change-transform"
          >
            {/* Words stay whole when the line wraps on small screens. */}
            {LINE.split(' ').map((word, w, words) => (
              <span key={w} className={`inline-block whitespace-nowrap ${word === '→' ? 'text-chartreuse' : ''}`}>
                {word.split('').map((c, i) => (
                  <span key={i} data-lc-char className="inline-block">{c}</span>
                ))}
                {w < words.length - 1 && <span data-lc-char className="inline-block whitespace-pre"> </span>}
              </span>
            ))}
          </span>
        </a>
        <p className="absolute bottom-8 left-5 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:block">Keep scrolling ↓</p>
      </div>

      {/* Part 2: the contact panel. */}
      <div data-lc-stage className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-24 md:px-10">
        <div aria-hidden="true" className="glow glow-deep left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2" />

        <div data-lc-panel className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <p className="flex items-center gap-2.5 rounded-full border border-chartreuse/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-chartreuse">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
              <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
            </span>
            Available for work
          </p>
          <h2 className="mt-7 text-[clamp(38px,5.4vw,80px)] font-black leading-[0.98] tracking-[-0.04em]">
            Open to new <span className="text-chartreuse">opportunities.</span>
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/70 md:text-[19px]">
            Hiring, or have a project in mind? I&apos;d love to hear from you.
          </p>
          <Magnetic
            href={gmail}
            target="_blank"
            rel="noreferrer"
            data-cursor="Email"
            className="link-underline mt-8 text-[clamp(22px,2.8vw,38px)] font-semibold tracking-[-0.02em] text-ink hover:text-chartreuse"
          >
            {profile.email}
          </Magnetic>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={gmail}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-7 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-jet shadow-[0_0_40px_-6px_rgba(212,255,63,0.55)] transition-[translate] duration-300 hover:-translate-y-0.5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:rotate-45">↗</span>
              Say hello on Gmail
            </a>
            <a
              href={resume.href}
              download={resume.file}
              className="flex items-center gap-2.5 rounded-full border border-ink/30 px-7 py-[1.05rem] font-mono text-[13px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-ink/60 hover:bg-ink/5"
            >
              Download resume <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="mt-6 text-[15px] text-ink/60">
            or call <a className="link-underline text-ink hover:text-chartreuse" href={profile.phoneHref}>{profile.phone}</a>
          </p>
        </div>
      </div>

      {/* Links and footer bar. */}
      <div className="relative px-5 pb-8 md:px-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {links.map((l, i) => (
            <li key={l.label} className={i === links.length - 1 ? 'col-span-2 md:col-span-1' : ''}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center justify-between overflow-hidden rounded-full border border-ink/20 px-6 py-5 text-[17px] font-semibold transition-colors duration-500 hover:border-chartreuse hover:text-jet md:text-[20px]"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-chartreuse transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100" />
                <span className="relative">{l.label}</span>
                <span aria-hidden="true" className="relative transition-transform duration-500 group-hover:rotate-45">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/15 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:flex-row md:items-center md:justify-between">
          <span>© 2026 {profile.name}</span>
          <span>{profile.location}</span>
          <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-chartreuse md:self-auto">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
