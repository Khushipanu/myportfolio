import Art from '../Art'

// Hero background: a tilted wall of Khushi's project screens drifting slowly
// upwards, faded into the page at every edge so the name in front stays crisp.
const columns = [
  ['movie', 'erpForm', 'lms', 'ui'],
  ['lmsPlayer', 'movieDetail', 'erp', 'lmsRoles'],
  ['erp', 'lms', 'movie', 'erpForm'],
  ['ui', 'lmsRoles', 'movieDetail', 'lmsPlayer'],
  ['movieDetail', 'movie', 'lmsPlayer', 'erp'],
]

export default function ScreenWall({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_75%_70%_at_70%_45%,#000_20%,transparent_75%)] ${className}`}
    >
      <div className="absolute left-[38%] top-1/2 flex -translate-y-1/2 gap-[1.2vw] opacity-[0.24] [transform:translateY(-50%)_perspective(1400px)_rotateX(38deg)_rotateZ(-14deg)] md:left-[36%]">
        {columns.map((col, i) => (
          <div key={i} className={`flex flex-col gap-[1.2vw] ${i % 2 ? 'wall-up' : 'wall-down'}`}>
            {/* Each column is doubled so the drift loops without a seam. */}
            {[...col, ...col].map((v, j) => (
              <Art key={j} variant={v} className="aspect-[4/3] w-[22vw] rounded-[0.6em] text-[1.15vw] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] md:w-[11.5vw] md:text-[0.62vw]" />
            ))}
          </div>
        ))}
      </div>
      {/* Darken the left side so the name and intro sit on a calm background. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-paper)_8%,rgba(19,19,19,0.6)_45%,transparent_80%)]" />
    </div>
  )
}
