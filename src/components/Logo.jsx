// Wordmark from the mockup: "KHUSHI" in heavy caps, an orange sparkle, and
// "Panu" in light italic serif. `split` wraps each glyph for reveal animations.
const Sparkle = () => (
  <svg viewBox="0 0 24 24" className="h-[0.62em] w-[0.62em] text-accent" aria-hidden="true">
    <path fill="currentColor" d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z" />
  </svg>
)

const wrap = (key, node) => (
  <span key={key} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
    <span data-logo-char className="inline-block">{node}</span>
  </span>
)

export default function Logo({ className = '', split = false }) {
  const first = <span className="font-display font-extrabold tracking-[-0.02em] [font-stretch:100%]">KHUSHI</span>
  const mark = <span className="mx-[0.28em] inline-flex items-center self-center"><Sparkle /></span>
  const last = <span className="font-serif text-[1.08em] italic">Panu</span>
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`} aria-label="Khushi Panu">
      {split ? (
        <>
          {'KHUSHI'.split('').map((c, i) =>
            wrap(`f${i}`, <span className="font-display font-extrabold tracking-[-0.02em] [font-stretch:100%]">{c}</span>),
          )}
          <span aria-hidden="true" className="mx-[0.28em] inline-flex items-center self-center" data-logo-mark><Sparkle /></span>
          {'Panu'.split('').map((c, i) => wrap(`l${i}`, <span className="font-serif text-[1.08em] italic">{c}</span>))}
        </>
      ) : (
        <span aria-hidden="true" className="inline-flex items-baseline">{first}{mark}{last}</span>
      )}
    </span>
  )
}
