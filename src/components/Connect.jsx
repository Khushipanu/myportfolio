import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { useLocalTime } from '../hooks/useLocalTime'
import { profile, socials } from '../data/content'

// Visuvate-inspired closing section: oversized "Let's Connect" type that
// assembles as you arrive, a magnetic email link and the contact details.
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

export default function Connect() {
  const root = useRef(null)
  const time = useLocalTime(profile.timeZone)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 15%', scrub: 1 },
        })
          .fromTo('[data-lc-a]', { xPercent: -45 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo('[data-lc-b]', { xPercent: 45 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo('[data-lc-dot]', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, ease: 'none' }, 0.2)

        gsap.from('[data-lc-fade]', {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-lc-details]', start: 'top 90%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <footer id="contact" ref={root} className="relative overflow-hidden bg-ink px-5 pb-8 pt-24 text-paper md:px-10 md:pt-36">
      <p className="text-xs uppercase tracking-[0.2em] text-paper/50">(06) Contact</p>

      <h2 className="mt-10 font-display uppercase leading-[0.82] md:mt-14" aria-label="Let's connect">
        <span aria-hidden="true" data-lc-a className="block text-[24vw] md:text-[17vw]">Let's</span>
        <span aria-hidden="true" className="flex items-center justify-end gap-[2vw]">
          <span data-lc-dot className="inline-flex h-[12vw] w-[12vw] shrink-0 items-center justify-center rounded-full bg-accent text-[6vw] text-ink md:h-[9vw] md:w-[9vw] md:text-[4.5vw]">
            ↗
          </span>
          <span data-lc-b className="block text-[24vw] md:text-[17vw]">Connect</span>
        </span>
      </h2>

      <div data-lc-details className="mt-16 grid grid-cols-12 gap-x-5 gap-y-12 md:mt-24">
        <div className="col-span-12 md:col-span-7" data-lc-fade>
          <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Write to me</p>
          <Magnetic
            href={`mailto:${profile.email}`}
            data-cursor="Email"
            className="mt-4 font-serif text-[7.6vw] italic leading-none transition-colors hover:text-accent md:text-[4.6vw]"
          >
            {profile.email}
          </Magnetic>
          <p className="mt-6 text-paper/60">
            or call <a className="link-underline text-paper" href={profile.phoneHref}>{profile.phone}</a>
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9" data-lc-fade>
          <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Elsewhere</p>
          <ul className="mt-4 border-t border-paper/15">
            {socials.map((s) => (
              <li key={s.label} className="border-b border-paper/15">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-4 text-lg transition-colors hover:text-accent"
                >
                  <span>{s.label}</span>
                  <span className="text-sm text-paper/50 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-accent">
                    @{s.handle} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-4 border-t border-paper/15 pt-6 text-xs uppercase tracking-[0.2em] text-paper/50 md:flex-row md:items-center md:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>{profile.location} — <span className="tabular-nums">{time}</span> IST</span>
        <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.2em] md:self-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
