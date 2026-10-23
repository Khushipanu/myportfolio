import { useRef, useState } from 'react'
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/gsap'
import { about, experience } from '../data/content'

// Stroke icons for the experience cards, in the same order as `experience`.
const icons = [
  'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', // ERP modules
  'M3 5h18v14H3zM3 9h18M7 13h5M7 16h3', // websites
  'M4 5h16v11H8l-4 3zM8 9h8M8 12h5', // content
]

// Experience as expanding panels: on wide screens the roles stand side by
// side; the one hovered, focused or clicked widens to show its detail while
// the others keep a short horizontal summary. On phones they become an
// accordion of rows that open on tap.
function Icon({ i, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[i % icons.length]} />
    </svg>
  )
}

function Detail({ e }) {
  return (
    <>
      <ul className="space-y-2.5 text-[14px] leading-snug text-ink/80 md:text-[15px]">
        {e.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-accent" />
            {pt}
          </li>
        ))}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools">
        {e.stack.map((t) => (
          <li key={t} className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">{t}</li>
        ))}
      </ul>
    </>
  )
}

function ExperiencePanels() {
  const [open, setOpen] = useState(0)
  const n = (i) => String(i + 1).padStart(2, '0')

  return (
    <>
      {/* Wide screens: side-by-side panels. */}
      <ul data-panels className="hidden h-[36rem] gap-3 lg:flex" aria-label="Experience">
        {experience.map((e, i) => {
          const on = open === i
          return (
            <li
              key={e.role}
              data-panel
              onPointerEnter={(ev) => ev.pointerType === 'mouse' && setOpen(i)}
              className={`relative min-w-0 overflow-hidden rounded-[18px] border transition-[flex-grow,border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                on ? 'grow-[3] border-accent/40 bg-[#151a17]' : 'grow border-ink/10 bg-[#161616] hover:border-ink/25'
              }`}
              style={{ flexBasis: 0 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-expanded={on}
                className="absolute inset-0 z-10 cursor-pointer text-left"
              >
                <span className="sr-only">{`${e.role} at ${e.company}`}</span>
              </button>

              {/* Soft green light in the open panel. */}
              <span aria-hidden="true" className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(111,220,155,0.18),transparent)] transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`} />

              <div className="pointer-events-none absolute left-6 right-6 top-6 flex items-center justify-between">
                <span className={`font-mono text-[11px] tracking-[0.12em] transition-colors duration-500 ${on ? 'text-accent' : 'text-muted'}`}>{n(i)}</span>
                <Icon i={i} className={`h-5 w-5 transition-colors duration-500 ${on ? 'text-accent' : 'text-ink/50'}`} />
              </div>

              {/* Closed: a short horizontal summary at the foot of the panel. */}
              <div
                aria-hidden={on}
                className={`pointer-events-none absolute bottom-6 left-6 right-6 transition-opacity duration-300 ${on ? 'opacity-0' : 'opacity-100 delay-300'}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{e.period}</p>
                <h3 className="mt-3 text-[22px] font-medium leading-[1.15] tracking-[-0.01em] text-ink/90">{e.role}</h3>
                <p className="mt-1.5 font-serif text-[18px] italic leading-snug text-ink/50">{e.company}</p>
              </div>

              {/* Open: full detail, at a fixed width so it never reflows while the panel resizes. */}
              <div
                aria-hidden={!on}
                className={`pointer-events-none absolute bottom-0 left-0 top-0 flex w-[clamp(27rem,42vw,40rem)] flex-col justify-end p-8 transition-[opacity,transform] duration-500 ${
                  on ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{e.period}</p>
                <h3 className="mt-3 text-[34px] font-medium leading-tight tracking-[-0.02em]">{e.role}</h3>
                <p className="mt-1 font-serif text-[22px] italic leading-snug text-accent">at {e.company}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/65">{e.summary}</p>
                <div className="mt-5">
                  <Detail e={e} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Phones and tablets: accordion rows. */}
      <ul data-panels className="border-t border-ink/15 lg:hidden" aria-label="Experience">
        {experience.map((e, i) => {
          const on = open === i
          return (
            <li key={e.role} data-panel className="border-b border-ink/15">
              <button
                type="button"
                onClick={() => setOpen(on ? -1 : i)}
                aria-expanded={on}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className={`self-start pt-1.5 font-mono text-[11px] tracking-[0.12em] ${on ? 'text-accent' : 'text-muted'}`}>{n(i)}</span>
                <span className="flex-1">
                  <span className={`block text-[20px] font-medium leading-tight tracking-[-0.01em] transition-colors ${on ? 'text-accent' : 'text-ink'}`}>{e.role}</span>
                  <span className="mt-1 block font-serif text-[16px] italic text-ink/55">{e.company}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{e.period}</span>
                </span>
                <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${on ? 'rotate-45 border-accent bg-accent text-coal' : 'border-ink/30 text-ink'}`}>+</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="pb-6 pl-9">
                    <p className="mb-4 text-[15px] leading-relaxed text-ink/65">{e.summary}</p>
                    <Detail e={e} />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // autoSplit re-splits once fonts load and on resize, so line breaks stay correct.
        const split = SplitText.create('[data-about-lead]', {
          type: 'words',
          mask: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 100,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.025,
              scrollTrigger: { trigger: '[data-about-lead]', start: 'top 75%' },
            }),
        })
        gsap.from('#experience [data-focus-fade]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '#experience', start: 'top 80%' },
        })
        gsap.utils.toArray('#experience [data-panels]').forEach((list) =>
          gsap.from(list.children, {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: list, start: 'top 85%' },
          }),
        )
        return () => split.revert()

      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-deep -z-10 -left-[10%] top-[5%] h-[55vh] w-[45vw]" />
      <div className="grid grid-cols-12 gap-x-5 gap-y-10">
        <h2 id="about-title" className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:col-span-3">
          (03) About
        </h2>
        <div className="col-span-12 md:col-span-9">
          <p data-about-lead className="text-[8.5vw] font-medium leading-[1.02] tracking-[-0.03em] md:text-[4.2vw]">
            {about.lead.map((part, i) =>
              part.serif ? (
                <em key={i} className="pr-[0.05em] text-accent font-serif font-normal italic tracking-[-0.01em]">{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink/75">{about.body}</p>
        </div>
      </div>

      <div id="experience" className="relative mt-24 scroll-mt-24 md:mt-36">
        <div data-focus-fade className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <h2 className="text-[9vw] font-extralight leading-[1.05] tracking-[-0.03em] md:text-[4.4vw]">
            Experience<span className="text-accent">.</span>
          </h2>
          <p className="hidden shrink-0 pb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:block">(04) Experience</p>
        </div>
        <ExperiencePanels />
      </div>
    </section>
  )
}
