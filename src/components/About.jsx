import { useRef } from 'react'
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/gsap'
import { about, services } from '../data/content'

// Mike Wilcock-inspired service rows: on hover an ink panel rises from the
// bottom of the row, the title slides over and the detail fades in.
function ServiceRow({ s, i }) {
  return (
    <li className="group relative border-t border-ink/20 last:border-b">
      <div
        tabIndex={0}
        data-cursor-tone="dark"
        className="relative grid grid-cols-12 items-center gap-x-5 overflow-hidden px-1 py-6 outline-none transition-colors duration-500 group-hover:text-paper focus-visible:text-paper md:px-4 md:py-9"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[650ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100 group-focus-within:scale-y-100"
        />
        <span className="relative col-span-2 text-xs tabular-nums text-muted transition-colors duration-500 group-hover:text-accent md:col-span-1">
          0{i + 1}
        </span>
        <h3 className="relative col-span-10 font-display text-[7vw] uppercase leading-[0.95] transition-transform duration-[650ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-x-3 md:col-span-6 md:text-[3.1vw] md:group-hover:translate-x-6">
          {s.title}
        </h3>
        <div className="relative col-span-12 mt-3 md:col-span-4 md:mt-0 md:translate-y-3 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <p className="text-[15px] leading-snug">{s.description}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted group-hover:text-paper/60">{s.tags.join(' · ')}</p>
        </div>
        <span aria-hidden="true" className="relative hidden justify-self-end text-2xl transition-transform duration-500 group-hover:-rotate-45 group-hover:text-accent md:col-span-1 md:block">
          →
        </span>
      </div>
    </li>
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
        gsap.from('[data-service-list] > li', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-service-list]', start: 'top 80%' },
        })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-violet -z-10 -left-[10%] top-[5%] h-[55vh] w-[45vw]" />
      <div className="grid grid-cols-12 gap-x-5 gap-y-10">
        <h2 id="about-title" className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:col-span-3">
          (03) About
        </h2>
        <div className="col-span-12 md:col-span-9">
          <p data-about-lead className="text-[8.5vw] font-medium leading-[1.02] tracking-[-0.03em] md:text-[4.2vw]">
            {about.lead.map((part, i) =>
              part.serif ? (
                <em key={i} className="text-gradient pr-[0.05em] font-serif font-normal italic tracking-[-0.01em]">{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink/75">{about.body}</p>
        </div>
      </div>

      <div id="focus" className="mt-24 scroll-mt-24 md:mt-36">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-[13vw] uppercase leading-[0.88] md:text-[6.4vw]">What I do</h2>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:block">(Hover to explore)</p>
        </div>
        <ul data-service-list>
          {services.map((s, i) => (
            <ServiceRow key={s.title} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
