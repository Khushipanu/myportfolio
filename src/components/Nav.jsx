import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'
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

  useGSAP(
    () => {
      if (!ready) return
      gsap.from('[data-nav-item]', { yPercent: 120, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.5 })
    },
    { scope: root, dependencies: [ready] },
  )

  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
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
    </header>
  )
}
