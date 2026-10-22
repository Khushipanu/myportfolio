import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile } from '../data/content'
import { useLocalTime } from '../hooks/useLocalTime'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav({ ready }) {
  const root = useRef(null)
  const time = useLocalTime(profile.timeZone)

  useGSAP(
    () => {
      if (!ready) return
      gsap.from('[data-nav-item]', { yPercent: 120, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.5 })
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
      className="fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 text-[13px] text-paper mix-blend-difference md:px-10 md:pt-7"
    >
      <a href="#top" onClick={(e) => go(e, '#top')} className="mask whitespace-nowrap font-medium" aria-label="Khushi Panu — back to top">
        <span data-nav-item>Khushi Panu<sup className="ml-0.5 text-[9px]">©</sup></span>
      </a>
      <div className="mask hidden md:block">
        <span data-nav-item className="text-paper/70">
          {profile.role} — Haldwani, IN <span className="tabular-nums">{time}</span>
        </span>
      </div>
      <nav aria-label="Primary">
        <ul className="flex gap-5 md:gap-8">
          {links.map((l) => (
            <li key={l.href} className="mask">
              <a href={l.href} onClick={(e) => go(e, l.href)} className="link-underline" data-nav-item>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
