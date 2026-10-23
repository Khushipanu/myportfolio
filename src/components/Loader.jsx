import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

// Intro: a small terminal "boots" the site — a command types out, build steps
// tick off with a green ok, and a launch line pulses. Then, after the Mike
// Wilcock reference, a green column opens from the centre to fill the screen
// and folds away into the top-left corner to reveal the hero.
const COMMAND = 'npm run portfolio'
const STEPS = [
  'resolving modules',
  'compiling react components',
  'connecting rest apis',
  'mounting interface',
]

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
      gsap.utils.toArray('[data-step]', root.current).forEach((el, i) => {
        const t = 1.0 + i * 0.24
        tl.from(el, { autoAlpha: 0, x: -6, duration: 0.25, ease: 'power2.out' }, t)
          .from(el.querySelector('[data-ok]'), { autoAlpha: 0, duration: 0.15 }, t + 0.16)
      })
      tl.from('[data-launch]', { autoAlpha: 0, duration: 0.3 }, 2.0)
        .to('[data-term], [data-loader-meta]', { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 2.7)
        .fromTo('[data-panel]', { scaleX: 0 }, { scaleX: 0.25, duration: 0.45, ease: 'power3.out' }, 2.9)
        .to('[data-panel]', { scaleX: 1, duration: 0.55, ease: 'expo.inOut' }, 3.3)
        .set('[data-loader-bg]', { autoAlpha: 0 }, 3.9)
        .call(release, null, 3.9)
        .to('[data-panel]', { scaleX: 0.3, scaleY: 0.45, transformOrigin: '0% 0%', duration: 0.55, ease: 'expo.in' }, 3.95)
        .to('[data-panel]', { scaleX: 0, scaleY: 0, duration: 0.35, ease: 'expo.out' }, 4.5)
    },
    { scope: root },
  )

  if (hidden) return null

  return (
    <div ref={root} className="fixed inset-0 z-[80]" role="status" aria-label="Loading">
      <div data-loader-bg className="absolute inset-0 bg-paper" />
      <div className="absolute inset-0 flex items-center justify-center px-5 text-ink">
        <div
          data-term
          aria-hidden="true"
          className="w-full max-w-[34rem] rounded-xl border border-ink/12 bg-[#101211]/90 font-mono text-[12px] leading-relaxed md:max-w-[40rem] lg:text-[14px] shadow-[0_0_80px_-20px_rgba(111,220,155,0.25)] md:text-[13px]"
        >
          <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="ml-3 text-[11px] tracking-[0.08em] text-muted">~/portfolio</span>
          </div>
          <div className="space-y-1.5 px-4 py-4 md:px-5 md:py-5">
            <p className="flex whitespace-nowrap">
              <span className="mr-2 text-accent">$</span>
              <span data-cmd className="inline-block">{COMMAND}</span>
            </p>
            {STEPS.map((s) => (
              <p key={s} data-step className="flex items-baseline gap-2 text-ink/70">
                <span className="text-accent/70">▸</span>
                <span className="truncate">{s}</span>
                <span aria-hidden="true" className="min-w-4 flex-1 overflow-hidden whitespace-nowrap text-ink/20">
                  ........................................................
                </span>
                <span data-ok className="text-accent">ok</span>
              </p>
            ))}
            <p data-launch className="flex items-center gap-2 pt-2 text-ink">
              <span className="text-accent">●</span>
              launching portfolio
              <span className="ml-1 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="loader-dot h-1.5 w-1.5 rounded-full bg-accent" style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div data-loader-meta className="absolute bottom-6 left-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted md:bottom-8 md:left-10">
        Full Stack Developer<br />Haldwani, IN
      </div>
      <div data-panel className="absolute inset-0 origin-center scale-x-0 bg-accent-gradient" />
    </div>
  )
}
