import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { projects } from '../data/content'
import Art from './Art'

function Project({ p, flip }) {
  return (
    <article id={`project-${p.id}`} data-project className="grid grid-cols-12 gap-x-5 gap-y-8 border-t border-ink/15 py-14 md:py-24">
      <div className={`col-span-12 md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        <div className="overflow-hidden rounded-[4px]" data-cursor={p.live ? 'Visit' : ''}>
          <div data-parallax className="text-[2.6vw] md:text-[1.25vw]">
            <Art variant={p.art} className="aspect-[16/11] w-full scale-[1.07]" />
          </div>
        </div>
      </div>

      <div className={`col-span-12 flex flex-col md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <span>({p.index})</span>
          <span>{p.kind}</span>
        </div>
        <h3 className="mt-6 font-display text-[13vw] uppercase leading-[0.9] md:text-[4.6vw]">
          <span className="mask"><span data-proj-title>{p.title}</span></span>
        </h3>
        <p className="mt-6 max-w-lg text-[17px] leading-snug md:text-lg">{p.summary}</p>

        <ul className="mt-8 space-y-3 border-t border-ink/15 pt-6 text-[15px] leading-relaxed text-ink/80">
          {p.points.map((pt) => (
            <li key={pt} className="grid grid-cols-[1.25rem_1fr]">
              <span className="text-accent">↳</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
          {p.tech.map((t) => (
            <li key={t} className="rounded-full border border-ink/20 px-3 py-1 text-[13px]">{t}</li>
          ))}
        </ul>

        {(p.live || p.code) && (
          <div className="mt-8 flex gap-6 text-sm font-medium">
            {p.live && <a className="link-underline" href={p.live} target="_blank" rel="noreferrer">Live site ↗</a>}
            {p.code && <a className="link-underline" href={p.code} target="_blank" rel="noreferrer">Source code ↗</a>}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-project]', root.current).forEach((el) => {
          gsap.from(el.querySelector('[data-proj-title]'), {
            yPercent: 105,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 70%' },
          })
          gsap.fromTo(el.querySelector('[data-parallax]'), { yPercent: -3.5 }, {
            yPercent: 3.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="projects-title" className="px-5 pt-24 md:px-10 md:pt-36">
      <div className="mb-10 flex items-end justify-between md:mb-16">
        <h2 id="projects-title" className="font-display text-[15vw] uppercase leading-[0.85] md:text-[8vw]">
          Projects<sup className="ml-2 align-top font-sans text-[0.18em] font-medium tracking-normal text-muted">(0{projects.length})</sup>
        </h2>
        <p className="hidden max-w-xs text-right text-sm text-muted md:block">
          Built with the MERN stack, Redux Toolkit and Tailwind CSS.
        </p>
      </div>
      {projects.map((p, i) => (
        <Project key={p.id} p={p} flip={i % 2 === 1} />
      ))}
    </section>
  )
}
