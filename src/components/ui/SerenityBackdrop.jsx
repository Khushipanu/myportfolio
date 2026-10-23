import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

// Adapted from the "Digital Serenity" landing component: a faint 60px grid,
// guide lines that draw themselves in, pulsing intersection dots, corner
// brackets and a few drifting particles. Rewritten for this site's theme
// (green on near-black) and kept purely decorative.
//
// `start` delays the draw-in so it can wait for the intro loader.
export default function SerenityBackdrop({ start = true, id = 'grid', className = '' }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!start) return
    const t = setTimeout(() => setOn(true), prefersReducedMotion() ? 0 : 150)
    return () => clearTimeout(t)
  }, [start])

  const lines = [
    { x1: '0', y1: '22%', x2: '100%', y2: '22%', d: 0.2 },
    { x1: '0', y1: '82%', x2: '100%', y2: '82%', d: 0.5 },
    { x1: '18%', y1: '0', x2: '18%', y2: '100%', d: 0.8 },
    { x1: '82%', y1: '0', x2: '82%', y2: '100%', d: 1.1 },
    { x1: '50%', y1: '0', x2: '50%', y2: '100%', d: 1.4, faint: true },
  ]
  const dots = [
    ['18%', '22%', 1.6], ['82%', '22%', 1.8], ['18%', '82%', 2], ['82%', '82%', 2.2], ['50%', '22%', 2.4],
  ]
  const floaters = [
    ['26%', '12%', 0], ['62%', '88%', 0.6], ['44%', '7%', 1.2], ['72%', '92%', 1.8], ['33%', '64%', 2.4], ['90%', '38%', 3],
  ]

  return (
    <div aria-hidden="true" className={`serenity pointer-events-none absolute inset-0 overflow-hidden ${on ? 'is-on' : ''} ${className}`}>
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id={`${id}-p`} width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(233,228,223,0.06)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id={`${id}-fade`} cx="50%" cy="45%" r="75%">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-m)`}>
          <rect width="100%" height="100%" fill={`url(#${id}-p)`} />
          {lines.map((l, i) => (
            <line key={i} {...{ x1: l.x1, y1: l.y1, x2: l.x2, y2: l.y2 }} className={`s-line ${l.faint ? 's-faint' : ''}`} style={{ animationDelay: `${l.d}s` }} />
          ))}
          {dots.map(([cx, cy, d], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" className="s-dot" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
      </svg>

      {['left-4 top-20 md:left-8 md:top-24', 'right-4 top-20 md:right-8 md:top-24', 'bottom-4 left-4 md:bottom-8 md:left-8', 'bottom-4 right-4 md:bottom-8 md:right-8'].map((pos, i) => (
        <span key={pos} className={`s-corner ${pos} s-c${i}`} style={{ animationDelay: `${2.4 + i * 0.15}s` }} />
      ))}

      {floaters.map(([left, top, d], i) => (
        <span key={i} className="s-float" style={{ left, top, animationDelay: `${d}s` }} />
      ))}
    </div>
  )
}
