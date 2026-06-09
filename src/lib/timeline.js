// The reel was split into five clean single-pastry rotations (every original
// slide-wipe transition was dropped). Each pastry owns a wide, readable scroll
// "band" where it turns gently while its copy holds steady; between bands a
// short DISSOLVE crossfades the last frame of one pastry into the first frame
// of the next. FrameSequence (canvas) and Chapter (copy) both read this map so
// the picture and the words stay perfectly in sync.

export const SEGMENTS = [
  { id: 'paris-brest', dir: 'p1', count: 30 },
  { id: 'berry-tart', dir: 'p2', count: 30 },
  { id: 'chocolate', dir: 'p3', count: 30 },
  { id: 'pistachio', dir: 'p4', count: 28 },
  { id: 'lemon', dir: 'p5', count: 20 },
]

export const N = SEGMENTS.length

// Scroll-progress width of each pastry→pastry crossfade (kept short so the fade
// feels deliberate, not sluggish) and the readable hold each pastry gets.
export const DISSOLVE = 0.045
// LEAD holds the first pastry static at the very top while the intro veil lifts
// off it — so the unveil and the start of the sequence are one continuous move.
export const LEAD = 0.06
export const READ = (1 - LEAD - (N - 1) * DISSOLVE) / N

// Read band [start,end] per pastry, in scroll progress 0..1.
export const BANDS = (() => {
  const bands = []
  let cursor = LEAD
  for (let i = 0; i < N; i++) {
    const start = cursor
    const end = start + READ
    bands.push({ start, end, mid: (start + end) / 2 })
    cursor = end + DISSOLVE
  }
  return bands
})()

// smoothstep — gives the crossfade a soft ease in/out instead of a linear ramp.
export const ease = (x) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}
