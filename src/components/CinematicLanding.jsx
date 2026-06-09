import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from '../lib/smoothScroll'
import FrameSequence from './FrameSequence'
import Chapter from './Chapter'
import ChapterIndicator from './ChapterIndicator'
import IntroVeil from './IntroVeil'
import OutroFade from './OutroFade'

// Five pastries, each its own readable "page". `index` ties the copy to its
// pastry's read band in src/lib/timeline.js; between bands the canvas
// crossfades one pastry into the next.
const CHAPTERS = [
  {
    id: 0,
    index: 0,
    align: 'left',
    kicker: '01 — Choux',
    title: 'Paris-Brest',
    body: 'Airy choux piped full of hazelnut praline cream, crowned with caramelised hazelnuts and a single dark cherry. A wheel of pastry, the way Paris has made it since 1910.',
    price: '9 €',
  },
  {
    id: 1,
    index: 1,
    align: 'right',
    kicker: '02 — Tarte',
    title: 'Tarte aux Fruits Rouges',
    body: 'A crisp pâte sucrée shell, vanilla-bean crème pâtissière, and a quiet riot of strawberries, raspberries and blueberries picked at their reddest.',
    price: '8 €',
  },
  {
    id: 2,
    index: 2,
    align: 'left',
    kicker: '03 — Entremet',
    title: "L'Entremet Chocolat",
    body: 'Layered dark-chocolate mousse over a thin sablé base, finished in a mirror glaze so clean it doubles the room — and a curl of tempered chocolate on top.',
    price: '10 €',
  },
  {
    id: 3,
    index: 3,
    align: 'right',
    kicker: '04 — Pistache',
    title: 'Tarte Pistache-Framboise',
    body: 'Sicilian pistachio cream under a ring of fresh raspberries, scattered with crushed pistachio. Sweet, green, and just sharp enough to keep you honest.',
    price: '9 €',
  },
  {
    id: 4,
    index: 4,
    align: 'left',
    kicker: '05 — Citron',
    title: 'Tarte au Citron Meringuée',
    body: 'Bright lemon curd in a buttery shell, hidden beneath peaks of Italian meringue torched to a slow gold. The last word of the counter, and usually the first to sell out.',
    price: '8 €',
  },
]

export default function CinematicLanding() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const frameRef = useRef(null)
  const progressRef = useRef(0)
  const barRef = useRef(null)

  useLayoutEffect(() => {
    initSmoothScroll()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=15000',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
          if (frameRef.current) frameRef.current(self.progress)
          if (barRef.current)
            barRef.current.style.transform = `scaleX(${self.progress})`
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const chapters = CHAPTERS.map((c) => ({ ...c, progressRef }))

  return (
    <div ref={rootRef}>
      {/* Pinned showcase — opens on the gradient veil, which lifts to unveil the
          first pastry and flows straight into the crossfade sequence. */}
      <section ref={pinRef} className="h-screen w-full relative overflow-hidden">
        <FrameSequence ref={frameRef} progressRef={progressRef} />

        {/* giant transparent brand watermark sitting behind the scene */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="font-[Fraunces] font-semibold uppercase whitespace-nowrap leading-none select-none text-[#2c2118]"
            style={{ fontSize: 'min(28vw, 34vh)', letterSpacing: '0.02em', opacity: 0.16 }}
          >
            La&nbsp;Villa
          </span>
        </div>

        {/* soft warm vignette for depth + text legibility on a light scene */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(125% 95% at 50% 42%, transparent 46%, rgba(74,52,32,0.16) 100%)',
          }}
        />

        {/* scroll progress bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#4a3420]/10">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#b07d4e] to-[#7a5230]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {chapters.map((c) => (
          <Chapter key={c.id} chapter={c} />
        ))}
        <ChapterIndicator chapters={chapters} progressRef={progressRef} />

        {/* Opening veil — sits above everything, then rises away on scroll */}
        <IntroVeil progressRef={progressRef} />

        {/* Closing fade — the last pastry dissolves into the outro background */}
        <OutroFade progressRef={progressRef} />
      </section>

      {/* Outro */}
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-8 py-32 overflow-hidden bg-[#f1e8da]">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[#a06a3c]">
          The Counter
        </p>
        <h2 className="font-[Fraunces] text-4xl md:text-7xl font-light text-center text-balance max-w-3xl px-6 leading-[1.08] text-[#2c2118]">
          Pastry is patience, made beautiful.
        </h2>
        <p className="text-[#5a4a3b] max-w-xl text-center px-6 leading-relaxed">
          Everything is baked the morning you eat it. Come early — the meringue
          rarely lasts past noon.
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-6 inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#7a5230] border border-[#b07d4e]/40 rounded-full px-7 py-3 hover:border-[#b07d4e] hover:text-[#5a3a1c] transition-colors"
        >
          See the collection again
        </a>
        <p className="mt-10 text-[11px] tracking-[0.3em] uppercase text-[#9a8a76]">
          La Villa · Pâtisserie Fine
        </p>
      </section>
    </div>
  )
}
