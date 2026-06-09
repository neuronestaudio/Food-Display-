import { useRef, useLayoutEffect } from 'react'
import { BANDS } from '../lib/timeline'

const clamp01 = (x) => Math.min(1, Math.max(0, x))

// A white "content bubble" per pastry. It pops in (overshoot ease via CSS) once
// the pastry has settled in its read band, drifts gently with the scroll for
// depth, then pops out as the dissolve to the next pastry begins — so the cards
// animate in and out between each item.
export default function Chapter({ chapter }) {
  const cardRef = useRef(null)
  const parRef = useRef(null)
  const activeRef = useRef(false)
  const band = BANDS[chapter.index]

  useLayoutEffect(() => {
    let raf
    // sit just inside the band so the card appears after the incoming dissolve
    // lands and leaves before the outgoing one starts
    const inEdge = band.start + 0.012
    const outEdge = band.end - 0.012
    const span = band.end - band.start

    const tick = () => {
      const p = chapter.progressRef.current
      const active = p >= inEdge && p <= outEdge
      if (active !== activeRef.current) {
        activeRef.current = active
        cardRef.current?.classList.toggle('bubble-in', active)
      }
      // subtle parallax: the card content drifts up as you scroll the band
      if (parRef.current) {
        const local = clamp01((p - band.start) / span)
        parRef.current.style.transform = `translateY(${(local - 0.5) * -20}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapter, band])

  // Mobile: a bottom-centred sheet that clears the centred pastry above it.
  // Desktop: anchored to the outer edge, vertically centred, in the side
  // negative space so it never overlaps the subject.
  const desktopSide =
    chapter.align === 'right'
      ? 'md:left-auto md:right-[3.5%]'
      : 'md:right-auto md:left-[4.5%]'

  return (
    <div
      className={`absolute z-30 left-1/2 -translate-x-1/2 bottom-[4.5%] w-[min(90vw,29rem)] md:bottom-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:w-[clamp(15.5rem,23vw,19.5rem)] ${desktopSide}`}
    >
      <div ref={cardRef} className="bubble">
        <div ref={parRef} className="will-change-transform">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c08a52]" />
            <p className="text-[10.5px] tracking-[0.34em] uppercase text-[#a06a3c]">
              {chapter.kicker}
            </p>
          </div>

          <h2 className="font-[Fraunces] text-[1.7rem] md:text-[2.05rem] font-light leading-[1.08] text-[#2c2118] text-balance">
            {chapter.title}
          </h2>

          <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#5d4c3e]">
            {chapter.body}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[#ece0cf] pt-4">
            <span className="text-[10.5px] tracking-[0.28em] uppercase text-[#9a8a76]">
              La Villa
            </span>
            <span className="font-[Fraunces] text-lg text-[#7a5230]">
              {chapter.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
