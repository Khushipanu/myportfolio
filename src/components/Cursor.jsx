import { useEffect, useRef } from 'react'

// Desktop-only cursor: one dot that sits exactly on the pointer (no easing, so
// it never lags) and inverts whatever is beneath it. Over links and buttons it
// grows into a disc; over elements with data-cursor="Label" it shows the label.
// The native cursor is only hidden once this has received a real pointer move.
export default function Cursor() {
  const root = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const el = root.current
    const html = document.documentElement
    let x = 0
    let y = 0
    let raf = 0
    let state = ''

    const paint = () => {
      raf = 0
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (!html.classList.contains('has-cursor')) {
        html.classList.add('has-cursor')
        el.dataset.visible = 'true'
      }
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const over = (e) => {
      const named = e.target.closest('[data-cursor]')
      const text = named?.getAttribute('data-cursor') || ''
      const link = e.target.closest('a, button, [role="button"], label, summary')
      const next = text ? 'label' : link ? 'link' : ''
      if (next === state && label.current.textContent === text) return
      state = next
      el.dataset.state = next
      label.current.textContent = text
    }
    const down = () => { el.dataset.pressed = 'true' }
    const up = () => { el.dataset.pressed = 'false' }
    const leave = () => { el.dataset.visible = 'false' }
    const enter = () => { el.dataset.visible = 'true' }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    html.addEventListener('pointerleave', leave)
    html.addEventListener('pointerenter', enter)
    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      html.removeEventListener('pointerleave', leave)
      html.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="kp-cursor" data-visible="false" data-state="" data-pressed="false">
      <div className="kp-cursor__disc">
        <span ref={label} className="kp-cursor__label" />
      </div>
    </div>
  )
}
