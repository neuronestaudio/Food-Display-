import { useRef, useLayoutEffect } from 'react'

// Fades the pinned scene out to the outro background over the last stretch of
// scroll, so the final pastry dissolves into the closing section instead of
// hard-cutting to it. Background matches the outro exactly (#f1e8da).
const START = 0.95

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

export default function OutroFade({ progressRef }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      if (ref.current) ref.current.style.opacity = String(smooth((p - START) / (1 - START)))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-[41] pointer-events-none"
      style={{ opacity: 0, background: '#f1e8da' }}
    />
  )
}
