import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { BANDS } from '../lib/timeline'

// Each chapter is tied to its pastry's read band: full opacity across the whole
// band (so you can stop and read), easing out only as the dissolve begins.
const EDGE = 0.03

export default function Chapter({ chapter }) {
  const elRef = useRef(null)
  const band = BANDS[chapter.index]

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = chapter.progressRef.current
      const inFromStart = (p - (band.start - EDGE)) / EDGE
      const inToEnd = (band.end + EDGE - p) / EDGE
      const opacity = gsap.utils.clamp(0, 1, Math.min(inFromStart, inToEnd))
      if (elRef.current) {
        elRef.current.style.opacity = opacity
        elRef.current.style.transform = `translateY(${(1 - opacity) * 24}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapter, band])

  const alignClass =
    chapter.align === 'right'
      ? 'items-end text-right right-[6%] md:right-[8%]'
      : 'items-start text-left left-[6%] md:left-[8%]'

  return (
    <div
      ref={elRef}
      className={`absolute top-1/2 -translate-y-1/2 ${alignClass} max-w-sm flex flex-col gap-4 will-change-[opacity,transform]`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3">
        {chapter.align !== 'right' && (
          <span className="h-px w-8 bg-[#b07d4e]/70" />
        )}
        <p className="text-[11px] tracking-[0.4em] uppercase text-[#a06a3c]">
          {chapter.kicker}
        </p>
        {chapter.align === 'right' && (
          <span className="h-px w-8 bg-[#b07d4e]/70" />
        )}
      </div>

      <h2
        className="font-[Fraunces] text-3xl md:text-5xl font-light text-balance leading-[1.08] text-[#33271d]"
        style={{ textShadow: '0 1px 18px rgba(247,240,229,0.7)' }}
      >
        {chapter.title}
      </h2>

      <p
        className="text-[#4f4034] text-sm md:text-[15px] leading-relaxed max-w-xs"
        style={{ textShadow: '0 1px 14px rgba(247,240,229,0.8)' }}
      >
        {chapter.body}
      </p>

      <p className="mt-1 font-[Fraunces] text-lg text-[#7a5230]">
        {chapter.price}
      </p>
    </div>
  )
}
