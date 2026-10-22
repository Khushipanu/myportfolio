import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget, getLenis } from '../hooks/useLenis'
import { profile, socials } from '../data/content'
import { useLocalTime } from '../hooks/useLocalTime'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
]

// Menu styled after the Mike Wilcock reference: monospaced uppercase links
// that turn blue on hover, and a pill button that flips from blue to cream.
export default function Nav({ ready }) {
  const root = useRef(null)
  const time = useLocalTime(profile.timeZone)
  const [open, setOpen] = useState(false)

  // Phone menu: lock scrolling while open and close on Escape.
  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useGSAP(
    () => {
      if (!ready) return
      gsap.from('[data-nav-item]', { yPercent: 120, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.5 })
    },
    { scope: root, dependencies: [ready] },
  )

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    // Wait a frame so the scroll lock is released before scrolling.
    requestAnimationFrame(() => scrollToTarget(href))
  }

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-paper/80 to-transparent px-5 py-4 md:px-10 md:py-6"
    >
      <a
        href="#top"
        onClick={(e) => go(e, '#top')}
        className="mask whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] transition-colors hover:text-accent"
        aria-label="Khushi Panu — back to top"
      >
        <span data-nav-item className="flex items-center gap-1">
          KHUSHI<span className="rounded-[3px] bg-accent px-1 text-[13px] font-medium leading-[1.35] text-coal">panu</span>
        </span>
      </a>

      <p className="mask hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted lg:block">
        <span data-nav-item>
          Haldwani, IN <span className="mx-1.5">·</span> <span className="tabular-nums">{time}</span>
        </span>
      </p>

      <nav aria-label="Primary" className="flex items-center gap-5 md:gap-9">
        <ul className="hidden items-center gap-9 sm:flex">
          {links.map((l) => (
            <li key={l.href} className="mask">
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-nav-item
                className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:text-accent focus-visible:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="font-mono text-[12px] uppercase tracking-[0.1em] sm:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <a
          href="#contact"
          onClick={(e) => go(e, '#contact')}
          data-nav-item
          data-cursor-tone="dark"
          className="rounded-full bg-accent px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-coal transition-colors duration-300 hover:bg-cream focus-visible:bg-cream md:px-6 md:py-3"
        >
          Let's talk
        </a>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 -z-10 flex flex-col justify-between bg-paper px-5 pb-8 pt-24 sm:hidden"
      >
        <ul className="space-y-1">
          {[...links, { label: 'Contact', href: '#contact' }].map((l, i) => (
            <li key={l.href} className="border-b border-ink/15">
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="flex items-baseline justify-between py-3 font-display text-[13vw] uppercase leading-none transition-colors active:text-accent"
              >
                {l.label}
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-accent">{s.label} ↗</a>
          ))}
        </div>
      </div>
    </header>
  )
}
