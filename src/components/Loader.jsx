import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

export default function Loader({ onDone }) {
  const root = useRef(null)
  const [hidden, setHidden] = useState(false)

  useGSAP(
    () => {
      document.documentElement.style.overflow = 'hidden'
      const finish = () => {
        document.documentElement.style.overflow = ''
        setHidden(true)
        onDone()
      }

      if (prefersReducedMotion()) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish })
        return
      }

      const counter = { v: 0 }
      const num = root.current.querySelector('[data-count]')
      const tl = gsap.timeline({ onComplete: finish })
      tl.from('[data-loader-line]', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.08 })
        .to(counter, {
          v: 100,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
        }, 0.1)
        .to('[data-loader-bar]', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0.1)
        .to('[data-loader-line]', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, '+=0.1')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
    },
    { scope: root },
  )

  if (hidden) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-paper-2 px-5 py-6 text-ink md:px-10 md:py-8"
      role="status"
      aria-label="Loading"
    >
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-ink/60">
        <span className="mask"><span data-loader-line>Portfolio</span></span>
        <span className="mask"><span data-loader-line>©2026</span></span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="font-display text-[13vw] uppercase leading-[0.88] md:text-[7vw]">
          <span className="mask"><span data-loader-line>Khushi</span></span>
          <span className="mask"><span data-loader-line>Panu</span></span>
        </div>
        <span className="mask font-display text-[11vw] leading-[0.88] text-accent md:text-[5.5vw]">
          <span data-loader-line data-count>000</span>
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent" data-loader-bar />
    </div>
  )
}
