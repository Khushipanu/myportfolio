import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section: a navy contact card on the cream page — a "Let's connect"
// heading, a magnetic email link and the links list — then the footer bar.
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
    <footer id="contact" ref={root} className="relative overflow-hidden bg-paper px-3 pb-8 pt-16 text-ink md:px-6 md:pt-24">
      {/* Contact card: deep navy with soft glows and a fine grain. */}
      <div
        data-lc-fade
        className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#26304a_0%,#1d2433_55%,#161b27_100%)] px-6 py-14 text-paper shadow-[0_40px_80px_-40px_rgba(23,21,18,0.6)] md:rounded-[36px] md:px-14 md:py-20"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(227,166,68,0.28),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(closest-side,rgba(207,98,54,0.22),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />

        <div className="relative grid grid-cols-12 gap-x-5 gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">(06) Contact</p>
            <h2 className="mt-6 text-[clamp(40px,5vw,72px)] font-semibold leading-none tracking-[-0.04em]">
              <a href={gmail} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-4">
                Let&apos;s connect
                <span aria-hidden="true" className="inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-full bg-terracotta text-paper transition-transform duration-500 group-hover:rotate-45"><span className="text-[0.45em] leading-none">↗</span></span>
              </a>
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-paper/65">Open to new opportunities. Feel free to reach out.</p>

            <Magnetic
              href={gmail}
              target="_blank"
              rel="noreferrer"
              data-cursor="Email"
              className="link-underline mt-10 font-serif text-[clamp(26px,2.8vw,40px)] italic leading-none text-[#f3d08a] transition-colors hover:text-paper"
            >
              {profile.email}
            </Magnetic>
            <p className="mt-4 text-[15px] text-paper/55">
              or call <a className="link-underline text-paper" href={profile.phoneHref}>{profile.phone}</a>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Elsewhere</p>
            <ul className="mt-4 border-t border-paper/15">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-paper/15">
                  <a
                    href={r.href}
                    {...(r.external ? { target: '_blank', rel: 'noreferrer' } : { download: r.download })}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-[#f3d08a]"
                  >
                    <span className="text-[17px] font-medium">{r.label}</span>
                    <span className="flex min-w-0 items-center gap-2 text-[13px] text-paper/50 transition-colors group-hover:text-[#f3d08a]">
                      <span className="truncate">{r.note}</span>
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">{r.external ? '↗' : '↓'}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 px-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:flex-row md:items-center md:justify-between md:px-8">
        <span>© 2026 {profile.name}</span>
        <span>{profile.location}</span>
        <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-ink md:self-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
