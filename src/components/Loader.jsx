import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Intro after the Mike Wilcock reference: the name rises in letter by letter
// (bold KHUSHI, light PANU, as in the hero) over three pulsing loading dots,
// then a green column opens from the centre to fill the screen and folds away
// into the top-left corner to reveal the hero.
const Chars = ({ word, className = '' }) => (
  <span className={`inline-block whitespace-nowrap ${className}`}>
    {word.split('').map((c, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <span data-logo-char className="inline-block">{c}</span>
      </span>
    ))}
  </span>
)
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

      gsap.timeline({ onComplete: () => setHidden(true) })
        .from('[data-logo-char]', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.045 }, 0.15)
        .from('[data-loader-meta]', { autoAlpha: 0, duration: 0.6 }, 0.3)
        .from('[data-dots]', { autoAlpha: 0, y: 8, duration: 0.5, ease: 'power2.out' }, 0.5)
        .to('[data-logo-char]', { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.02 }, 2.05)
        .to('[data-loader-meta], [data-dots]', { autoAlpha: 0, duration: 0.3 }, 2.1)
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
        <div className="flex flex-col items-center">
          <p aria-hidden="true" className="flex items-baseline gap-[0.28em] text-[15vw] uppercase leading-none tracking-[0.04em] md:text-[7.5vw]">
            <Chars word="Khushi" className="hero-name" />
            <Chars word="Panu" className="hero-name-light text-ink" />
          </p>
          <span data-dots aria-hidden="true" className="mt-8 flex gap-2.5 md:mt-10">
            {[0, 1, 2].map((i) => (
              <span key={i} className="loader-dot h-2 w-2 rounded-full bg-accent" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        </div>
      </div>
      <div data-loader-meta className="absolute bottom-6 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted md:bottom-8 md:left-10">
        Full Stack Developer<br />Haldwani, IN
      </div>
      <div data-panel className="absolute inset-0 origin-center scale-x-0 bg-accent-gradient" />
    </div>
  )
}
