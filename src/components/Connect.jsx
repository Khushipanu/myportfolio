import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section: a simple light footer — a "Let's connect" heading, a
// magnetic email link, the links list and the footer bar.
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

export default function Connect() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-lc-fade]', {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
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
    <footer id="contact" ref={root} className="relative overflow-hidden border-t border-ink/10 bg-paper-2 px-5 pb-8 pt-20 text-ink md:px-10 md:pt-28">
      <div aria-hidden="true" className="glow glow-soft -left-[10%] top-[10%] h-[50vh] w-[45vw]" />
      <div aria-hidden="true" className="glow glow-mint right-[0%] bottom-[0%] h-[45vh] w-[35vw]" />

      <div className="relative grid grid-cols-12 gap-x-5 gap-y-14">
        <div className="col-span-12 lg:col-span-7" data-lc-fade>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(06) Contact</p>
          <h2 className="mt-6 flex items-center gap-4 text-[clamp(40px,5.2vw,76px)] font-semibold leading-none tracking-[-0.04em]">
            <a href={gmail} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
              Let&apos;s connect
              <span aria-hidden="true" className="inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-full bg-terracotta text-paper transition-transform duration-500 group-hover:rotate-45"><span className="text-[0.45em] leading-none">↗</span></span>
            </a>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/65">Open to new opportunities. Feel free to reach out.</p>

          <Magnetic
            href={gmail}
            target="_blank"
            rel="noreferrer"
            data-cursor="Email"
            className="link-underline mt-10 font-serif text-[clamp(26px,2.8vw,40px)] italic leading-none transition-colors hover:text-terracotta"
          >
            {profile.email}
          </Magnetic>
          <p className="mt-4 text-[15px] text-ink/60">
            or call <a className="link-underline text-ink" href={profile.phoneHref}>{profile.phone}</a>
          </p>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9" data-lc-fade>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Elsewhere</p>
          <ul className="mt-4 border-t border-ink/12">
            {rows.map((r) => (
              <li key={r.label} className="border-b border-ink/12">
                <a
                  href={r.href}
                  {...(r.external ? { target: '_blank', rel: 'noreferrer' } : { download: r.download })}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-terracotta"
                >
                  <span className="text-[17px] font-medium">{r.label}</span>
                  <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink/50 transition-colors group-hover:text-terracotta">
                    <span className="truncate">{r.note}</span>
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">{r.external ? '↗' : '↓'}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-20 flex flex-col gap-4 border-t border-ink/12 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:flex-row md:items-center md:justify-between">
        <span>© 2026 {profile.name}</span>
        <span>{profile.location}</span>
        <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-ink md:self-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
