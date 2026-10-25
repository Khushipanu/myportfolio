import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Intro: one terminal line — a command types out and three dots pulse while
// a thin green line fills beneath it. Then the dark screen lifts away like a
// curtain to reveal the hero.
const COMMAND = 'npm run portfolio'

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

      const tl = gsap.timeline({ onComplete: () => setHidden(true) })
      tl.from('[data-term]', { autoAlpha: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.1)
        .from('[data-loader-meta]', { autoAlpha: 0, duration: 0.6 }, 0.3)
        // Type the command one character at a time.
        .fromTo('[data-cmd]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: `steps(${COMMAND.length})` }, 0.35)
      tl.from('[data-launch]', { autoAlpha: 0, duration: 0.3 }, 0.95)
        .fromTo('[data-bar]', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.6)
        .to('[data-term], [data-bar-track], [data-loader-meta]', { autoAlpha: 0, y: -14, duration: 0.4, ease: 'power2.in', stagger: 0.04 }, 2.0)
        .call(release, null, 2.35)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 2.35)
    },
    { scope: root },
  )

  if (hidden) return null

  return (
    <div ref={root} className="fixed inset-0 z-[80]" role="status" aria-label="Loading">
      <div className="absolute inset-0 bg-paper" />
      {/* Soft green edge along the bottom of the curtain as it lifts. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-accent/60 shadow-[0_0_24px_2px_rgba(111,220,155,0.35)]" />
      <div className="absolute inset-0 flex items-center justify-center px-5 text-ink">
        <p data-term aria-hidden="true" className="flex items-center whitespace-nowrap font-mono text-[14px] tracking-[0.02em] md:text-[18px]">
          <span className="mr-3 text-accent-deep">$</span>
          <span data-cmd className="inline-block">{COMMAND}</span>
          <span data-launch className="ml-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="loader-dot h-2 w-2 rounded-full bg-accent" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        </p>
        <span data-bar-track aria-hidden="true" className="absolute left-1/2 top-1/2 mt-8 h-px w-[min(18rem,60vw)] -translate-x-1/2 bg-ink/10 md:mt-10">
          <span data-bar className="block h-full w-full origin-left bg-accent" />
        </span>
      </div>
      <div data-loader-meta className="absolute bottom-6 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted md:bottom-8 md:left-10">
        Full Stack Developer<br />Haldwani, IN
      </div>
    </div>
  )
}
