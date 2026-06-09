import { useRef, useLayoutEffect, forwardRef } from 'react'
import { SEGMENTS, BANDS, DISSOLVE, ease } from '../lib/timeline'

// Warm ivory the canvas clears to — matches the patisserie wall so a dissolve
// never flashes a hard edge.
const BG = '#efe7da'

const frameUrl = (dir, i) => `/frames/${dir}/f${String(i).padStart(3, '0')}.jpg`

const FrameSequence = forwardRef(function FrameSequence({ progressRef }, ref) {
  const canvasRef = useRef(null)
  const segImagesRef = useRef([]) // [segIndex] -> [Image, ...]
  const loadedRef = useRef(0)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setCanvasSize()

    // Preload every segment's frames.
    const segImages = SEGMENTS.map((seg) => {
      const arr = []
      for (let i = 1; i <= seg.count; i++) {
        const img = new Image()
        img.src = frameUrl(seg.dir, i)
        img.onload = () => {
          loadedRef.current++
        }
        arr.push(img)
      }
      return arr
    })
    segImagesRef.current = segImages

    // cover-fit draw at a given alpha (alpha drives the crossfade).
    const drawCover = (img, alpha) => {
      if (!img || !img.complete || !img.naturalWidth) return
      const cw = window.innerWidth
      const ch = window.innerHeight
      const ir = img.width / img.height
      const cr = cw / ch
      let dw, dh, dx, dy
      if (ir > cr) {
        dh = ch
        dw = ch * ir
        dx = (cw - dw) / 2
        dy = 0
      } else {
        dw = cw
        dh = cw / ir
        dx = 0
        dy = (ch - dh) / 2
      }
      ctx.globalAlpha = alpha
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.globalAlpha = 1
    }

    // localT (0..1) -> the matching rotation frame of segment segIndex.
    const frameAt = (segIndex, localT) => {
      const arr = segImages[segIndex]
      const t = Math.min(1, Math.max(0, localT))
      return arr[Math.min(Math.round(t * (arr.length - 1)), arr.length - 1)]
    }

    const render = (p) => {
      const cw = window.innerWidth
      const ch = window.innerHeight
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, cw, ch)

      const last = BANDS.length - 1
      if (p <= BANDS[0].start) return drawCover(frameAt(0, 0), 1)
      if (p >= BANDS[last].end) return drawCover(frameAt(last, 1), 1)

      // Read band → one pastry, gently rotating, fully readable.
      for (let i = 0; i < BANDS.length; i++) {
        const b = BANDS[i]
        if (p >= b.start && p <= b.end) {
          return drawCover(frameAt(i, (p - b.start) / (b.end - b.start)), 1)
        }
      }

      // Dissolve band → outgoing pastry's last frame under the incoming
      // pastry's first frame fading in over it (clean direct crossfade).
      for (let i = 0; i < BANDS.length - 1; i++) {
        const dStart = BANDS[i].end
        const dEnd = BANDS[i + 1].start
        if (p > dStart && p < dEnd) {
          const x = ease((p - dStart) / DISSOLVE)
          drawCover(frameAt(i, 1), 1)
          drawCover(frameAt(i + 1, 0), x)
          return
        }
      }
    }

    const firstPaint = setInterval(() => {
      if (loadedRef.current > 0) {
        render(progressRef.current || 0)
        clearInterval(firstPaint)
      }
    }, 50)

    if (ref) ref.current = render
    // dev-only: lets the verify script drive the canvas to an exact progress
    if (import.meta.env.DEV) window.__renderFrame = render

    const onResize = () => {
      setCanvasSize()
      render(progressRef.current || 0)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearInterval(firstPaint)
    }
  }, [ref, progressRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: BG }}
    />
  )
})

export default FrameSequence
