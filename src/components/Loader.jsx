import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Intro: one terminal line — a command types out and three dots pulse while
// the site loads. Then, after the Mike
// Wilcock reference, a green column opens from the centre to fill the screen
// and folds away into the top-left corner to reveal the hero.
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
        .to('[data-term], [data-loader-meta]', { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 2.1)
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
      <div className="absolute inset-0 flex items-center justify-center px-5 text-ink">
        <p data-term aria-hidden="true" className="flex items-center whitespace-nowrap font-mono text-[14px] tracking-[0.02em] md:text-[18px]">
          <span className="mr-3 text-accent">$</span>
          <span data-cmd className="inline-block">{COMMAND}</span>
          <span data-launch className="ml-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="loader-dot h-2 w-2 rounded-full bg-accent" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        </p>
      </div>
      <div data-loader-meta className="absolute bottom-6 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted md:bottom-8 md:left-10">
        Full Stack Developer<br />Haldwani, IN
      </div>
      <div data-panel className="absolute inset-0 origin-center scale-x-0 bg-accent-gradient" />
    </div>
  )
}
