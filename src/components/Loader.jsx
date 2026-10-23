import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import Logo from './Logo'

// Intro after the Mike Wilcock reference: the wordmark rises in letter by
// letter while a counter runs to 100, a blue column opens from the centre to
// fill the screen, then folds away into the top-left corner to reveal the hero.
export default function Loader({ onDone }) {
  const root = useRef(null)
  const [hidden, setHidden] = useState(false)

  useGSAP(
    () => {
      document.documentElement.style.overflow = 'hidden'
      let released = false
      const release = () => {
        if (released) return
        released = true
        document.documentElement.style.overflow = ''
        onDone()
      }

      if (prefersReducedMotion()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: () => { release(); setHidden(true) } })
        return
      }

      const counter = { v: 0 }
      const num = root.current.querySelector('[data-count]')
      gsap.timeline({ onComplete: () => setHidden(true) })
        .from('[data-logo-char]', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.045 }, 0.15)
        .from('[data-loader-meta]', { autoAlpha: 0, duration: 0.6 }, 0.3)
        .to(counter, {
          v: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
        }, 0)
        .to('[data-logo-char]', { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.02 }, 2.05)
        .to('[data-loader-meta], [data-count]', { autoAlpha: 0, duration: 0.3 }, 2.1)
        .fromTo('[data-panel]', { scaleX: 0 }, { scaleX: 0.25, duration: 0.45, ease: 'power3.out' }, 2.3)
        .to('[data-panel]', { scaleX: 1, duration: 0.55, ease: 'expo.inOut' }, 2.7)
        .set('[data-loader-bg]', { autoAlpha: 0 }, 3.3)
        .call(release, null, 3.3)
        .to('[data-panel]', { scaleX: 0.3, scaleY: 0.45, transformOrigin: '0% 0%', duration: 0.55, ease: 'expo.in' }, 3.35)
        .to('[data-panel]', { scaleX: 0, scaleY: 0, duration: 0.35, ease: 'expo.out' }, 3.9)
    },
    { scope: root },
  )

  if (hidden) return null

  return (
    <div ref={root} className="fixed inset-0 z-[80]" role="status" aria-label="Loading">
      <div data-loader-bg className="absolute inset-0 bg-paper" />
      <div className="absolute inset-0 flex items-center justify-center text-ink">
        <Logo split className="text-[11vw] leading-none md:text-[6.4vw]" />
      </div>
      <div data-loader-meta className="absolute bottom-6 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted md:bottom-8 md:left-10">
        Full Stack Developer<br />Haldwani, IN
      </div>
      <span data-count className="absolute bottom-4 right-5 font-display text-[14vw] leading-none text-ink/85 md:bottom-6 md:right-10 md:text-[5.5vw]">000</span>
      <div data-panel className="absolute inset-0 origin-center scale-x-0 bg-accent" />
    </div>
  )
}
