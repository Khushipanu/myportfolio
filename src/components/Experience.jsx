import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { experience, education } from '../data/content'
import SerenityBackdrop from './ui/SerenityBackdrop'

// Experience, after the "Digital Serenity" landing component: a quiet grid
// that draws itself in, mono captions top and bottom, and each role as a
// centred chapter whose words lift out of a blur as it scrolls into view.
const Words = ({ text, className = '' }) =>
  text.split(' ').map((w, i) => (
    <span key={i} data-word className={`inline-block ${className}`}>
      {w}
      {' '}
    </span>
  ))

const Rule = ({ className = '' }) => (
  <span aria-hidden="true" data-rule className={`mx-auto block h-px w-14 bg-gradient-to-r from-transparent via-ink/50 to-transparent md:w-20 ${className}`} />
)

function Role({ e, i, total }) {
  return (
    <article data-role className="relative mx-auto flex min-h-[88svh] max-w-4xl flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
        <Words text={`${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`} />
        <span data-word className="mx-3 inline-block text-accent">·</span>
        <Words text={e.period} />
      </p>
      <Rule className="mt-5" />

      <div className="relative mt-10 md:mt-12">
        <h3 className="text-[11vw] font-extralight leading-[1.02] tracking-[-0.03em] text-ink md:text-[5.6vw]">
          <Words text={e.role} />
        </h3>
        <p className="mt-3 font-serif text-[7vw] italic leading-tight text-accent md:mt-4 md:text-[2.6vw]">
          <Words text={`at ${e.company}`} />
        </p>
        <span aria-hidden="true" data-side className="absolute -left-8 top-1/2 hidden h-px w-5 bg-ink/40 md:block" />
        <span aria-hidden="true" data-side className="absolute -right-8 top-1/2 hidden h-px w-5 bg-ink/40 md:block" />
      </div>

      <ul className="mt-12 max-w-2xl space-y-5 text-[16px] font-light leading-relaxed text-ink/70 md:mt-14 md:text-[18px]">
        {e.points.map((pt) => (
          <li key={pt} data-point>
            {pt}
          </li>
        ))}
      </ul>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45" aria-label="Stack">
        {e.stack.map((t) => (
          <li key={t} data-point>{t}</li>
        ))}
      </ul>
    </article>
  )
}

export default function Experience() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const reveal = (scope, start = 'top 72%') => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: scope, start, once: true } })
          tl.from(scope.querySelectorAll('[data-word]'), {
            autoAlpha: 0,
            y: 30,
            scale: 0.8,
            filter: 'blur(10px)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.06,
            clearProps: 'filter,transform',
          })
            .from(scope.querySelectorAll('[data-rule]'), { scaleX: 0, autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.1)
            .from(scope.querySelectorAll('[data-side]'), { scaleX: 0, autoAlpha: 0, duration: 0.8, ease: 'power2.out' }, 0.6)
            .from(scope.querySelectorAll('[data-point]'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.55)
        }
        gsap.utils.toArray('[data-chapter]', root.current).forEach((el) => reveal(el))

        // Roles drift gently and fade as they leave, so chapters hand over softly.
        gsap.utils.toArray('[data-role]', root.current).forEach((el) => {
          gsap.to(el, {
            autoAlpha: 0.15,
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'bottom 55%', end: 'bottom top', scrub: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="experience"
      ref={root}
      aria-labelledby="exp-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#101211_0%,#0b0c0c_45%,#141716_100%)] px-6 md:px-16"
    >
      <SerenityBackdrop start id="exp-grid" className="-z-10" />

      <header data-chapter className="mx-auto flex max-w-4xl flex-col items-center pt-28 text-center md:pt-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
          <Words text="(04) Experience" />
        </p>
        <Rule className="mt-4" />
        <h2 id="exp-title" className="mt-10 text-[9vw] font-extralight leading-[1.05] tracking-[-0.03em] md:text-[4.4vw]">
          <Words text="Where I've been" />
          <Words text="building." className="font-serif italic text-accent" />
        </h2>
      </header>

      {experience.map((e, i) => (
        <div key={e.company} data-chapter>
          <Role e={e} i={i} total={experience.length} />
        </div>
      ))}

      <div data-chapter className="mx-auto max-w-5xl pb-28 pt-6 text-center md:pb-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
          <Words text="Education" />
        </p>
        <Rule className="mt-4" />
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {education.map((ed) => (
            <li key={ed.degree} data-point className="flex flex-col items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{ed.period}</span>
              <span className="text-[18px] font-light leading-snug text-ink md:text-[19px]">{ed.degree}</span>
              <span className="text-[14px] text-ink/55">{ed.school}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40">{ed.note}</span>
            </li>
          ))}
        </ul>

        <Rule className="mt-20" />
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
          <Words text="Learn, build, ship." />
        </p>
        <div data-point aria-hidden="true" className="mt-6 flex justify-center gap-4">
          <span className="h-1 w-1 rounded-full bg-ink/40" />
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="h-1 w-1 rounded-full bg-ink/40" />
        </div>
      </div>
    </section>
  )
}
