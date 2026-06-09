import { useRef, useLayoutEffect } from 'react'
import { BANDS } from '../lib/timeline'

// One dot per pastry; the dot for whichever read band you're in lights up.
export default function ChapterIndicator({ chapters, progressRef }) {
  const dotsRef = useRef([])

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      chapters.forEach((c, i) => {
        const b = BANDS[i]
        const active = p >= b.start - 0.02 && p <= b.end + 0.02
        const dot = dotsRef.current[i]
        if (dot) {
          dot.style.backgroundColor = active ? '#9a5e2e' : 'transparent'
          dot.style.borderColor = active
            ? 'rgba(154,94,46,0.9)'
            : 'rgba(80,60,45,0.35)'
          dot.style.transform = active ? 'scale(1.5)' : 'scale(1)'
        }
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapters, progressRef])

  return (
    <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col gap-4">
      {chapters.map((c, i) => (
        <div
          key={c.id}
          ref={(el) => (dotsRef.current[i] = el)}
          className="w-2 h-2 rounded-full border transition-transform duration-300"
          style={{ borderColor: 'rgba(80,60,45,0.35)' }}
        />
      ))}
    </div>
  )
}
