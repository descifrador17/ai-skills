# film/: continuous-film edit (hidden joins), from ArcaneArt ep01 v2

Copy into `<project>/remotion/src/film/`. Register it in `Root.tsx`:

```tsx
import { FILM, Film } from "./film/Film";
<Composition id="Film" component={Film} durationInFrames={FILM.total} fps={FILM.fps} width={FILM.width} height={FILM.height} />
```

| File | Does |
|---|---|
| `timeline.ts` | The edit as data: one row per clip window (`srcIn`, `srcOut`, `rate`; the last row fills to `TOTAL`), plus the passer-by cuts (`PASSERS`: image, x0/x1 of the figure's visible box, cut frame) and their crossing maths |
| `timeline.test.ts` | `node --test`. Checks:<br>• the total is exact and the last shot is at least 2 s;<br>• every window stays inside the 121-frame clip;<br>• each passer is visible the frame before the cut and covers about ⅓ (or his own width) on the cut;<br>• each passer crosses at one speed, right to left, and is gone within `crossFrames`;<br>• passer cuts sit on segment boundaries |
| `Film.tsx` | Plays the clips (already paint-filtered into `public/ep01/` by `tools/paint_clip.py`) and draws the sharp passer layers |
| `motion-tokens.ts` | creative-director tokens (base unit, curves). Replace them with the project's own spec |

To adapt it:
1. Replace `SEGS` with your windows, read off strips and join measurements.
2. Make each passer:
   - paint a figure on flat LIGHT grey, then run `tools/make_occluder.py <in> <out> --full`;
   - measure x0/x1 on the rows still on screen at `PASSER.scale`;
   - point `PASSERS` at the cut boundaries.
3. Change `TOTAL` and `FPS` to match the profile.
4. Run `node --test`.

Joins that need no edit code (chain, shared keyframe, an end frame taken from inside the next clip, the hard cut) are plain butt joins between segments.

The v1 anchor-swing blur, if a project needs it as a fallback, is one SVG filter: `feGaussianBlur stdDeviation="b 0"` with `b = sin(πp)·64`, peaking on the cut.

The rules behind every number are in `reference/shot-grammar.md`.
