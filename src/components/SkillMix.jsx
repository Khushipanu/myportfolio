import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { skillWords, skillGroups } from '../data/content'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}<>/=*+#'

// Large word that "mixes" its letters before resolving into the next skill.
function useScrambleCycle(words, active) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (!active || prefersReducedMotion()) return
    let i = 0
    let frame
    let timer
    const scrambleTo = (target) => {
      const from = text.length
      const len = Math.max(from, target.length)
      const start = performance.now()
      const dur = 750
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur)
        let out = ''
        for (let k = 0; k < len; k++) {
          const settle = k / len
          if (p > settle * 0.7 + 0.3) out += target[k] ?? ''
          else if (target[k] === ' ' || target[k] === '.') out += target[k]
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        setText(out)
        if (p < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    timer = setInterval(() => {
      i = (i + 1) % words.length
      scrambleTo(words[i])
    }, 2100)
    return () => {
      clearInterval(timer)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, words])
  return text
}

export default function SkillMix() {
  const root = useRef(null)
  const [inView, setInView] = useState(false)
  const word = useScrambleCycle(skillWords, inView)

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setInView(self.isActive),
      })
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-mix-head]', {
          yPercent: 105,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
        gsap.from('[data-group]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-groups]', start: 'top 85%' },
        })
      })
      return () => {
        st.kill()
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="skills-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-deep -z-10 left-[10%] top-[8%] h-[50vh] w-[45vw]" />
      <div aria-hidden="true" className="glow glow-mint -z-10 right-[5%] top-[20%] h-[40vh] w-[35vw]" />
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(05) Toolkit</p>
      <h2 id="skills-title" className="mt-8 text-center font-display uppercase leading-[0.9]">
        <span className="mask text-[7vw] md:text-[3.6vw]"><span data-mix-head>I build with</span></span>
        <span className="mask">
          <span data-mix-head className="text-accent mx-auto block min-h-[1em] w-fit px-[0.05em] whitespace-nowrap text-[9vw] md:text-[7.4vw]" aria-live="off">
            {word}
          </span>
        </span>
        <span className="sr-only">{skillWords.join(', ')}</span>
      </h2>

      <div data-groups className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-x-5 gap-y-10 md:mt-28 md:grid-cols-3">
        {skillGroups.map((g) => (
          <div key={g.label} data-group className="border-t border-ink/20 pt-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{g.label}</h3>
            <ul className="mt-3 space-y-1 text-[15px] md:text-base">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
