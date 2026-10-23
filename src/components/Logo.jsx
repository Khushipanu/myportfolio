// "KHUSHI" in heavy caps, then a blue box around "p" and a light italic "anu",
// after the Mike Wilcock wordmark.
export default function Logo({ className = '', split = false }) {
  const parts = [
    { key: 'first', node: <span className="font-extrabold tracking-[-0.02em]">KHUSHI</span> },
    { key: 'box', node: <span className="ml-[0.18em] inline-block bg-accent px-[0.08em] font-light italic leading-[1.05] text-coal">p</span> },
    { key: 'last', node: <span className="font-light italic tracking-[-0.01em]">anu</span> },
  ]
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`} aria-label="Khushi Panu">
      {split
        ? 'KHUSHI'.split('').map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
              <span data-logo-char className="inline-block font-extrabold tracking-[-0.02em]">{c}</span>
            </span>
          ))
            .concat([
              <span key="box" aria-hidden="true" className="ml-[0.18em] inline-block overflow-hidden align-bottom">
                <span data-logo-char className="inline-block bg-accent px-[0.08em] font-light italic leading-[1.05] text-coal">p</span>
              </span>,
              ...'anu'.split('').map((c, i) => (
                <span key={`l${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
                  <span data-logo-char className="inline-block font-light italic">{c}</span>
                </span>
              )),
            ])
        : parts.map((p) => <span key={p.key} aria-hidden="true">{p.node}</span>)}
    </span>
  )
}
