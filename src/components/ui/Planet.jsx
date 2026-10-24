// Hero planet: a glossy forest-green sphere with grooved bands, wrapped in a
// gold ring that passes behind it at the top and in front of it at the
// bottom, with two small moons. Pure SVG, so it stays crisp at any size;
// the moons drift with CSS animations.
export default function Planet({ className = '' }) {
  const ring = 'rotate(-20 100 100)'
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="pl-body" cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#7fb294" />
          <stop offset="22%" stopColor="#3b7a5a" />
          <stop offset="55%" stopColor="#1d4a37" />
          <stop offset="100%" stopColor="#0b1f17" />
        </radialGradient>
        <radialGradient id="pl-shine" cx="34%" cy="26%" r="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pl-rim" cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="#f0b25a" stopOpacity="0" />
          <stop offset="100%" stopColor="#f0b25a" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="pl-gold" x1="0" x2="1">
          <stop offset="0%" stopColor="#b9792a" />
          <stop offset="35%" stopColor="#f6d58c" />
          <stop offset="65%" stopColor="#e3a644" />
          <stop offset="100%" stopColor="#a8661f" />
        </linearGradient>
        <radialGradient id="pl-moon-o" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffd39a" />
          <stop offset="45%" stopColor="#f08a3a" />
          <stop offset="100%" stopColor="#b4501e" />
        </radialGradient>
        <radialGradient id="pl-moon-g" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8cc3a2" />
          <stop offset="50%" stopColor="#2c6a4e" />
          <stop offset="100%" stopColor="#0f2a1f" />
        </radialGradient>
        <clipPath id="pl-clip"><circle cx="100" cy="100" r="58" /></clipPath>
        <filter id="pl-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="pl-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      {/* Ground shadow. */}
      <ellipse cx="104" cy="178" rx="62" ry="8" fill="#3b2a17" opacity="0.18" filter="url(#pl-soft)" />

      {/* Back half of the ring, behind the planet. */}
      <g transform={ring}>
        <path d="M14 100 A86 26 0 0 1 186 100" fill="none" stroke="url(#pl-gold)" strokeWidth="3" opacity="0.55" />
      </g>

      {/* Planet body, grooved bands, shine and a warm rim from the ring. */}
      <circle cx="100" cy="100" r="58" fill="url(#pl-body)" />
      <g clipPath="url(#pl-clip)" className="planet-bands">
        {[-36, -18, 0, 18, 36].map((dy) => (
          <path key={dy} d={`M30 ${100 + dy} Q100 ${88 + dy} 170 ${100 + dy}`} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="5" transform="rotate(-24 100 100)" />
        ))}
      </g>
      <circle cx="100" cy="100" r="58" fill="url(#pl-rim)" />
      <circle cx="100" cy="100" r="58" fill="url(#pl-shine)" />

      {/* Front half of the ring, over the planet, with a soft glow. */}
      <g transform={ring}>
        <path d="M186 100 A86 26 0 0 1 14 100" fill="none" stroke="#f6c46a" strokeWidth="6" opacity="0.45" filter="url(#pl-glow)" />
        <path d="M186 100 A86 26 0 0 1 14 100" fill="none" stroke="url(#pl-gold)" strokeWidth="3.2" />
      </g>

      {/* Moons. */}
      <g className="moon-a"><circle cx="46" cy="150" r="10" fill="url(#pl-moon-o)" /></g>
      <g className="moon-b"><circle cx="168" cy="122" r="6.5" fill="url(#pl-moon-g)" /></g>

    </svg>
  )
}
