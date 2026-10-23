import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Visuvate-inspired closing section: oversized "Let's Connect" type that
// assembles as you arrive, a magnetic email link and the contact details.
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

const links = [
  { label: 'Gmail', handle: profile.email, href: gmail },
  ...socials.map((s) => ({ label: s.label, handle: `@${s.handle}`, href: s.href })),
]

export default function Connect() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: '[data-lc-card]',
          start: 'top 70%',
          once: true,
          onEnter: () => root.current.querySelector('[data-lc-card]').classList.add('is-on'),
        })
        gsap.from('[data-lc-card]', {
          y: 80,
          autoAlpha: 0,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 80%' },
        })
        gsap.from('[data-lc-tile]', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-lc-tiles]', start: 'top 90%' },
        })
        gsap.fromTo('[data-lc-word]', { yPercent: 40 }, {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: '[data-lc-word]', start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <footer id="contact" ref={root} className="relative overflow-hidden bg-paper px-5 pb-8 pt-24 text-ink md:px-10 md:pt-36">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">(06) Contact</p>

      {/* Main call to action. */}
      <div
        data-lc-card
        className="relative mt-8 overflow-hidden rounded-[28px] border border-accent/20 bg-[linear-gradient(140deg,#16201a_0%,#111412_55%,#0f1110_100%)] px-6 py-12 md:mt-10 md:px-14 md:py-20"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(111,220,155,0.18),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(233,228,223,1)_1px,transparent_1px),linear-gradient(90deg,rgba(233,228,223,1)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]" />

        <p className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(111,220,155,0.6)]" />
          Open to work
        </p>
        <h2 className="relative mt-6 max-w-5xl text-[10vw] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[5.6vw]">
          Let&apos;s <span className="mark" style={{ transitionDelay: '0.3s' }}>work together</span>.
        </h2>
        <p className="relative mt-6 max-w-xl text-[16px] leading-relaxed text-ink/65 md:text-[18px]">
          I&apos;m open to new opportunities. Feel free to reach out.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center gap-4">
          <Magnetic
            href={gmail}
            target="_blank"
            rel="noreferrer"
            data-cursor="Email"
            className="group relative overflow-hidden rounded-full bg-accent px-7 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-coal md:px-9 md:py-5 md:text-[13px]"
          >
            <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
            <span className="relative flex items-center gap-3">
              Say hello on Gmail
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45">↗</span>
            </span>
          </Magnetic>
          <a
            href={resume.href}
            download={resume.file}
            className="group flex items-center gap-3 rounded-full border border-ink/25 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:px-9 md:py-5 md:text-[13px]"
          >
            Download resume
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
        <p className="relative mt-8 text-[14px] text-ink/50">
          or call <a className="link-underline text-ink/80 hover:text-accent" href={profile.phoneHref}>{profile.phone}</a>
        </p>
      </div>

      {/* Links as tiles that fill green from the bottom on hover. */}
      <ul data-lc-tiles className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {links.map((l) => (
          <li key={l.label} data-lc-tile>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-full min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-[20px] border border-ink/12 bg-[#161616] p-5 transition-colors duration-500 hover:border-accent md:min-h-[10rem] md:p-6"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-[650ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100" />
              <span className="relative flex items-start justify-between">
                <span className="text-[20px] font-medium tracking-[-0.01em] transition-colors duration-500 group-hover:text-coal md:text-[24px]">{l.label}</span>
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-coal/30 group-hover:text-coal">↗</span>
              </span>
              <span className="relative truncate font-mono text-[11px] tracking-[0.04em] text-ink/50 transition-colors duration-500 group-hover:text-coal/70 md:text-[12px]">{l.handle}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Oversized outlined wordmark. */}
      <p aria-hidden="true" className="mt-20 overflow-hidden md:mt-28">
        <span data-lc-word className="block whitespace-nowrap text-center font-tall text-[16.5vw] uppercase leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(111,220,155,0.35)]">
          Let&apos;s connect
        </span>
      </p>

      <div className="mt-8 flex flex-col gap-4 border-t border-ink/15 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:flex-row md:items-center md:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>{profile.location}</span>
        <button type="button" onClick={() => scrollToTarget('#top')} className="self-start uppercase tracking-[0.12em] transition-colors hover:text-accent md:self-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
