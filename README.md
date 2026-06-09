# La Villa — Pâtisserie Fine

A scroll-driven patisserie showcase for **La Villa**. The source reel had hard
slide-wipe cuts between pastries; those were dropped entirely. Instead, five
clean single-pastry rotations were sliced out and stitched back together with
**direct canvas crossfades** — each pastry gets its own readable "page" where it
turns gently while its copy holds steady, then dissolves smoothly into the next.

Built per the **Cinematic Landing SOP**: React 19 + Vite + Tailwind v4 + GSAP
ScrollTrigger + Lenis, with a canvas frame sequence for smooth scrub.

## Stack

| Package           | Role                              |
| ----------------- | --------------------------------- |
| react / react-dom | UI framework + DOM renderer       |
| tailwindcss v4    | Styling (`@tailwindcss/vite`)     |
| gsap              | ScrollTrigger pin + scrub         |
| lenis             | Smooth wheel scroll               |
| vite              | Dev server + bundler              |
| playwright (dev)  | Headless browser for verification |

## Run

```bash
npm install
npm run dev        # http://localhost:5180
```

No environment variables, no API keys, no external services required. La Villa
is pinned to port **5180** so it never collides with the Camera Deconstruction
(5173), Cave Exploration (5175), Seed of Life (5177), Ferrari (5178) or Aura
Ring (5179) sites.

## Asset pipeline (run once per source-video change)

The source `display.mp4` (1280×720 @ 24fps, 10s) is a turntable reel cycling
through five pastries with slide-wipe transitions between them. The wipes are
discarded; only the clean single-pastry rotations are kept. Extract every frame
once, then slice the clean ranges into one folder per pastry:

```bash
# all frames → temp
ffmpeg -y -i display.mp4 -vf "fps=24,scale=1280:720:flags=lanczos" -q:v 3 _allframes/a%03d.jpg
# then copy the clean ranges (no wipe frames) into public/frames/p1..p5:
#   p1 Paris-Brest      frames 8–37
#   p2 Berry tart       frames 63–92
#   p3 Chocolate        frames 111–140
#   p4 Pistachio tart   frames 158–185
#   p5 Lemon meringue   frames 194–221
```

Result: **146 JPEGs** across `public/frames/p1 … p5` (~7 MB at 1280×720).

### Timeline — `src/lib/timeline.js`

Single source of truth shared by the canvas and the copy. Each pastry owns a
`READ` band of scroll where it rotates and its chapter is fully readable; a short
`DISSOLVE` (0.045 of scroll) crossfades between bands. `SEGMENTS` lists the
per-pastry frame counts.

### Crossfade — `src/components/FrameSequence.jsx`

Inside a read band the canvas paints one rotating pastry. Inside a dissolve it
paints the outgoing pastry's last frame, then the incoming pastry's first frame
fading in over it (`globalAlpha` driven by a smoothstep ease) — a clean direct
crossfade with no background bleed.

### Pastry pages — `src/components/CinematicLanding.jsx`

| # | Pastry                    | Copy            |
| - | ------------------------- | --------------- |
| 1 | Paris-Brest               | 01 — Choux      |
| 2 | Tarte aux Fruits Rouges   | 02 — Tarte      |
| 3 | L'Entremet Chocolat       | 03 — Entremet   |
| 4 | Tarte Pistache-Framboise  | 04 — Pistache   |
| 5 | Tarte au Citron Meringuée | 05 — Citron     |

The pinned section runs `+=15000` of scroll so every pastry gets a generous,
readable dwell before it dissolves.

## Structure

```
public/
  videos/display.mp4          source reel (kept for re-slicing)
  frames/p1 … p5/f001.jpg …   clean per-pastry rotation frames
src/
  lib/smoothScroll.js         Lenis ↔ GSAP ticker wiring
  lib/timeline.js             read bands + dissolves (shared map)
  components/
    CinematicLanding.jsx      pinned section, pastry pages, intro/outro
    FrameSequence.jsx         canvas crossfade scrub
    Chapter.jsx               per-pastry copy overlay
    ChapterIndicator.jsx      right-side progress dots
```

## Premium touches over the base SOP

- Warm ivory/caramel theme tuned to the patisserie's soft daylight
- Direct pastry-to-pastry crossfades replacing the original slide-wipes
- Per-pastry readable "pages" — copy holds across the whole rotation band
- Soft warm vignette + fine film-grain overlay
- Scroll-progress bar, poster-backed intro hero, closing CTA outro

## Verify (optional)

With the dev server running:

```bash
node .tmp-verify.mjs   # screenshots every pastry page + dissolve → .tmp-shots/*.png
```

## Deploy

Vercel preset (`vercel.json`): framework `vite`, build `npm run build`,
output `dist`.
