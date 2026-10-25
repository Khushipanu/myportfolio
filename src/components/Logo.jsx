// Wordmark: "Khushi Panu" set in the display face with a green full stop.
// `split` wraps each glyph so the intro loader can animate them.
const NAME = 'Khushi Panu'

export default function Logo({ className = '', split = false }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap font-display font-bold tracking-[-0.03em] ${className}`} aria-label="Khushi Panu">
      {split ? (
        <>
          {NAME.split('').map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
              <span data-logo-char className="inline-block">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
          <span aria-hidden="true" className="inline-block overflow-hidden align-bottom">
            <span data-logo-char className="inline-block text-accent-deep">.</span>
          </span>
        </>
      ) : (
        <span aria-hidden="true">
          {NAME}<span className="text-accent-deep">.</span>
        </span>
      )}
    </span>
  )
}
