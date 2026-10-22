// Hover/focus text roll: each letter slides up in turn while a copy of it
// rises from below. The parent link or button needs the `roll-trigger` class.
export default function RollText({ children, className = '' }) {
  const chars = [...String(children)]
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="roll-chars">
        {chars.map((c, i) => (
          <span key={i} className="roll-char" style={{ '--i': i }}>
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </span>
    </span>
  )
}
