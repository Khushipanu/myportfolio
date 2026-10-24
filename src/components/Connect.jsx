import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, after guillaumezhu.com: on a hot-pink background a giant
// sentence slides across as you scroll, its letters falling into line as they
// reach the middle; then the email, the links list and the footer bar.
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
        gsap.from('[data-lc-fade]', {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-lc-details]', start: 'top 85%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const rows = [
    { label: 'Gmail', note: profile.email, href: gmail, external: true },
    ...socials.map((s) => ({ label: s.label, note: `@${s.handle}`, href: s.href, external: true })),
    { label: 'Resume', note: 'Download PDF', href: resume.href, download: resume.file },
  ]

  return (
    <footer id="contact" ref={root} className="relative bg-pink text-jet">
      {/* Giant sentence that slides across and falls into place. */}
      <div ref={pin} className="relative flex min-h-[70svh] items-center overflow-hidden md:h-[100svh]">
        <p className="absolute left-5 top-24 font-mono text-[11px] uppercase tracking-[0.12em] text-jet/60 md:left-10 md:top-28">(06) Contact</p>
        <a href={gmail} target="_blank" rel="noreferrer" aria-label="Let's connect — write to me on Gmail" className="block w-full">
          <span
            ref={track}
            aria-hidden="true"
            className="block px-5 py-24 text-[19vw] font-black leading-[0.95] tracking-[-0.05em] md:inline-block md:whitespace-nowrap md:px-0 md:py-0 md:text-[17vw] md:will-change-transform"
          >
            {/* Words stay whole when the line wraps on small screens. */}
            {LINE.split(' ').map((word, w, words) => {
              return (
                <span key={w} className="inline-block whitespace-nowrap">
                  {word.split('').map((c, i) => (
                    <span key={i} data-lc-char className="inline-block">{c}</span>
                  ))}
                  {w < words.length - 1 && <span data-lc-char className="inline-block whitespace-pre"> </span>}
                </span>
              )
            })}
          </span>
        </a>
        <p className="absolute bottom-8 left-5 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-jet/60 md:left-10 md:block">Keep scrolling ↓</p>
      </div>

      {/* Contact details. */}
      <div data-lc-details className="relative px-5 pb-8 pt-10 md:px-10 md:pt-6">
        <div className="grid grid-cols-12 gap-x-5 gap-y-14 border-t border-jet/20 pt-14">
          <div className="col-span-12 lg:col-span-7" data-lc-fade>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-jet/60">Write to me</p>
            <Magnetic
              href={gmail}
              target="_blank"
              rel="noreferrer"
              data-cursor="Email"
              className="link-underline mt-5 text-[clamp(28px,4vw,60px)] font-semibold leading-none tracking-[-0.03em] transition-colors hover:text-white"
            >
              {profile.email}
            </Magnetic>
            <p className="mt-6 text-[16px] text-jet/70">
              Open to new opportunities. Or call <a className="link-underline text-jet" href={profile.phoneHref}>{profile.phone}</a>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9" data-lc-fade>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-jet/60">Elsewhere</p>
            <ul className="mt-4 border-t border-jet/20">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-jet/20">
                  <a
                    href={r.href}
                    {...(r.external ? { target: '_blank', rel: 'noreferrer' } : { download: r.download })}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-white"
                  >
                    <span className="text-[17px] font-medium">{r.label}</span>
                    <span className="flex min-w-0 items-center gap-2 text-[13px] text-jet/60 transition-colors group-hover:text-white">
                      <span className="truncate">{r.note}</span>
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">{r.external ? '↗' : '↓'}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-jet/20 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-jet/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 {profile.name}</span>
          <span>{profile.location}</span>
          <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-white md:self-auto">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
