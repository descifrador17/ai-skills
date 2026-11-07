# creative-director

A gated creative process that sits above Remotion and hands off to superpowers.

```
Ideate (6 → reject 3 → present 3) → score + premortem → human picks
  → Direct (4 axes + visual philosophy + rejection list)
  → Motion art direction (one tone cell, one spec, storyboard Stills)
  → check-direction --brief  → approval
  → superpowers:writing-plans → subagent-driven-development → verification
```

## Install

**Claude Code / Cowork:** copy this folder to `~/.claude/skills/creative-director/` (personal) or `.claude/skills/creative-director/` (per project).
**claude.ai:** Settings → Capabilities → Skills → upload the zip.

## Use in a Remotion project

```bash
cp ~/.claude/skills/creative-director/templates/CREATIVE.md ./CREATIVE.md
cp ~/.claude/skills/creative-director/templates/motion-tokens.ts ./src/motion-tokens.ts
```

`package.json`:
```json
"scripts": {
  "direction": "node ~/.claude/skills/creative-director/scripts/check-direction.mjs --brief CREATIVE.md --code src",
  "prerender": "npm run direction"
}
```

The lint fails the build when scene code hand-rolls `Easing.*`, inline spring configs, unclamped `interpolate`, CSS timing, or when `motion-tokens.ts` drifts from the curves/base unit/stagger in `CREATIVE.md`.

## Files

| Path | Purpose |
|---|---|
| `SKILL.md` | Iron Law, phases, rejection loop, red flags, Express Mode |
| `references/ideation.md` | Method routing, PO operators, anti-slop five-test, scoring rubric |
| `references/direction.md` | Four axes, visual philosophy, rejection list, art-direction layers, variants |
| `references/motion-language.md` | Tone matrix, personalities, spec, hierarchy, restraint, pacing |
| `references/remotion.md` | Spec → code contract, project layout, verification |
| `templates/CREATIVE.md` | The single artifact superpowers plans against |
| `templates/motion-tokens.ts` | Typed tokens + `useEnter` / `enterAt` / `useExit` / `useTextureDrift` |
| `scripts/check-direction.mjs` | Zero-dep gate (Node 18+) |
| `examples/CREATIVE.example.md` | Fully worked brief that passes the gate |

## Tested
- Baseline (no skill): 0 alternative concepts, no spec, 5 easing behaviours and 3 stagger values mixed across one 20s piece.
- With skill: 3 rejected + 3 presented concepts, scored, premortem, one 2-curve spec, no code before approval — including under "ship today".

Credits: Hermes creative-ideation (SHL0MS, MIT), rampstackco creative-direction + art-direction, iart-ai motion-art-direction, Anthropic canvas-design.
