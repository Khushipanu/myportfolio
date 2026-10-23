import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { experience, education } from '../data/content'

export default function Experience() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-exp]', root.current).forEach((el) => {
          gsap.from(el.children, {
            y: 50,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          })
        })
        gsap.from('[data-exp-line]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.4,
          ease: 'expo.inOut',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} aria-labelledby="exp-title" className="relative isolate overflow-hidden bg-paper-2 px-5 py-24 md:px-10 md:py-36">
      <div aria-hidden="true" className="glow glow-orange -z-10 -right-[10%] top-[-10%] h-[60vh] w-[45vw]" />
      <div aria-hidden="true" className="glow glow-violet -z-10 -left-[15%] bottom-[0%] h-[60vh] w-[45vw]" />
      <div className="mb-14 flex items-end justify-between md:mb-20">
        <h2 id="exp-title" className="font-display text-[12vw] uppercase leading-[0.88] md:text-[6.4vw]">Experience</h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(04)</p>
      </div>

      <ol>
        {experience.map((e) => (
          <li key={e.company} className="relative py-10 md:py-14">
            <span data-exp-line className="absolute left-0 top-0 h-px w-full bg-ink/25" />
            <div data-exp className="grid grid-cols-12 gap-x-5 gap-y-4">
              <p className="col-span-12 text-sm tabular-nums text-muted md:col-span-3">{e.period}</p>
              <div className="col-span-12 md:col-span-4">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] md:text-[2rem] md:leading-tight">{e.role}</h3>
                <p className="mt-1 font-serif text-xl italic text-ink/70 md:text-2xl">{e.company}</p>
              </div>
              <ul className="col-span-12 space-y-3 text-[15px] leading-relaxed text-ink/80 md:col-span-5">
                {e.points.map((pt) => (
                  <li key={pt} className="grid grid-cols-[1.25rem_1fr]">
                    <span className="text-accent">↳</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 md:mt-24">
        <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Education</h3>
        <ul>
          {education.map((ed) => (
            <li key={ed.degree} className="relative grid grid-cols-12 gap-x-5 gap-y-1 py-5">
              <span data-exp-line className="absolute left-0 top-0 h-px w-full bg-ink/20" />
              <p className="col-span-12 text-sm tabular-nums text-muted md:col-span-3">{ed.period}</p>
              <p className="col-span-12 text-lg font-medium md:col-span-4">{ed.degree}</p>
              <p className="col-span-8 text-[15px] text-ink/70 md:col-span-3">{ed.school}</p>
              <p className="col-span-4 text-right text-[15px] text-ink/70 md:col-span-2">{ed.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
