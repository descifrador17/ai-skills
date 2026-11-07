# Spec → Remotion Contract

How an approved `CREATIVE.md` becomes code that cannot drift from it. If a Remotion best-practices skill is installed (e.g. `remotion-dev/skills`), load it for API details; this file only governs **direction fidelity**.

## Project layout

```
src/
  motion-tokens.ts        # from templates/ — the ONLY place Easing.* and spring configs live
  brand.ts                # colors, type scale, spacing — values from CREATIVE.md § Look
  storyboard/
    Frames.tsx            # <Still> per storyboard frame (Phase 3), kept as regression references
  scenes/
    S01Hook.tsx ...       # one file per SHOT in CREATIVE.md; header comment = that shot's notes
  compositions/
    Film16x9.tsx          # one composition per variant, sharing scenes via a `layout` prop
    Vertical9x16.tsx
  Root.tsx
```

## Rules the lint enforces (`node scripts/check-direction.mjs --code src`)

| Rule | Why |
|---|---|
| `Easing.` only in `motion-tokens.ts` | One easing vocabulary |
| `spring(...)` must not contain a `config: {` literal outside tokens | One named spring |
| `interpolate(` must clamp (or use a token helper) | Unclamped extrapolation = overshoot you didn't direct |
| No `ease-in-out`/`ease` CSS strings or CSS `transition:` | Remotion is frame-driven; CSS timing ignores the spec |
| Scene files carry a `SHOT <n>` header | Traceability to direction notes |
| Warn: `Math.random()` | Non-deterministic renders; use `random(seed)` from remotion |

Run it in CI and as a pre-render npm script:
```json
"scripts": {
  "direction": "node .claude/skills/creative-director/scripts/check-direction.mjs --brief CREATIVE.md --code src",
  "prerender": "npm run direction"
}
```

## Scene pattern

```tsx
/**
 * SHOT 3 [t = 6.0–9.5s]
 * PURPOSE: Show the place you left off survives airplane mode.
 * HERO: Bookmark ribbon. SUPPORT: page lines. TEXTURE: paper grain.
 */
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEnter, enterAt, enterStyle, useTextureDrift} from '../motion-tokens';
import {brand} from '../brand';

export const S03Bookmark: React.FC<{layout: 'wide' | 'tall'; lines: string[]}> = ({layout, lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = useEnter({multiple: 2});   // hero: slowest, most eased move
  const grain = useTextureDrift(8, 2);    // texture: subliminal

  return (
    <AbsoluteFill style={{background: brand.paper}}>
      {lines.map((text, i) => (
        // support: pure helper, so dynamic lists don't call hooks in a loop
        <p key={i} style={enterStyle(enterAt(frame, fps, {index: i, delay: 1}))}>{text}</p>
      ))}
      <div style={enterStyle(hero)}>{/* bookmark ribbon */}</div>
    </AbsoluteFill>
  );
};
```

## Sequencing
- Use `<Series>` or `@remotion/transitions` `<TransitionSeries>` with ONLY the transition family named in the spec (e.g. `fade()` and no `wipe()`).
- Overlap shots with negative `offset` equal to a base-unit multiple.
- Beat-synced landings: store beat times in `brand.ts`/`beats.ts` and derive frames, never eyeball.

## Verification (Phase 4 exit)
1. `npm run direction` passes.
2. Render each storyboard timestamp from the real composition: `npx remotion still <CompId> out/check-<n>.png --frame=<f>`.
3. Place each next to its approved `storyboard/` Still; differences must be explained by a NOTE in `CREATIVE.md` or fixed.
4. Watch the full render once at 1× with sound before claiming done.
