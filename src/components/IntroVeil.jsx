import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { LEAD } from '../lib/timeline'

// The opening "scene" is a modern gradient veil laid over the first pastry.
// As you scroll it rises and fades away — unveiling the Paris-Brest underneath
// and flowing straight into the crossfade sequence. Fully lifted a hair after
// the first pastry begins to turn, so the handoff reads as one motion.
const INTRO_END = LEAD + 0.025

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

export default function IntroVeil({ progressRef }) {
  const veilRef = useRef(null)
  const innerRef = useRef(null)

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      const v = Math.min(1, Math.max(0, p / INTRO_END))
      const e = smooth(v)
      if (veilRef.current) {
        // rise like a curtain, fading out over the final stretch of the lift
        veilRef.current.style.transform = `translateY(${-e * 100}%)`
        veilRef.current.style.opacity = String(1 - Math.max(0, (e - 0.65) / 0.35))
        veilRef.current.style.pointerEvents = e > 0.98 ? 'none' : 'auto'
      }
      if (innerRef.current) {
        // brand fades and drifts up faster than the veil, so it clears first
        innerRef.current.style.opacity = String(gsap.utils.clamp(0, 1, 1 - v * 1.8))
        innerRef.current.style.transform = `translateY(${-v * 44}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div
      ref={veilRef}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden will-change-[transform,opacity]"
      style={{
        background:
          'radial-gradient(110% 85% at 50% 22%, rgba(255,251,244,0.96) 0%, rgba(248,238,224,0.55) 42%, rgba(248,238,224,0) 70%), ' +
          'linear-gradient(158deg, #f5ecdb 0%, #ecdac0 44%, #cda37a 82%, #b98a5e 100%)',
        // soft feathered bottom edge so the rising reveal line is never hard
        maskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)',
      }}
    >
      <div
        ref={innerRef}
        className="relative flex flex-col items-center will-change-[transform,opacity]"
      >
        <p className="text-[11px] tracking-[0.55em] uppercase text-[#a06a3c] mb-7">
          Pâtisserie Fine
        </p>
        <h1 className="font-[Fraunces] text-6xl md:text-9xl font-light text-center text-balance max-w-4xl px-6 leading-[1.0] text-[#2c2118]">
          La Villa
        </h1>
        <p className="mt-8 max-w-md text-center text-[#5a4a3b] text-sm md:text-base leading-relaxed px-6">
          Five creations, turned slowly in the morning light — each one made by
          hand, each one worth lingering over.
        </p>
        <p className="mt-14 text-[11px] tracking-[0.35em] uppercase text-[#7a6650] animate-pulse">
          Scroll to enter
        </p>
      </div>
    </div>
  )
}
