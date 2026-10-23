import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { education } from '../data/content'
import SerenityBackdrop from './ui/SerenityBackdrop'

// Education, after the "Digital Serenity" landing component: a quiet grid
// that draws itself in and words that lift out of a blur as they arrive.
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

export default function Education() {
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

      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="education"
      ref={root}
      aria-label="Education"
      className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#101211_0%,#0b0c0c_45%,#141716_100%)] px-6 md:px-16"
    >
      <SerenityBackdrop start id="edu-grid" className="-z-10" />

      <div data-chapter className="mx-auto max-w-5xl py-28 text-center md:py-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
          <Words text="(05) Education" />
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
