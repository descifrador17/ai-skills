# Creative Direction + Visual Philosophy

Condensed from rampstackco `creative-direction` + `art-direction`, and Anthropic's canvas-design "philosophy first" practice.

## The four axes (pick one position each, with a one-line why)

**1. Tone register** — Professional · Conversational · Playful · Provocative
Choose by contrast with the category: dry category → warmer; loud category → restraint.

**2. Aesthetic philosophy** — Editorial restrained · Polished standard · Controlled maximalist · Expressive maximalist
Restrained earns attention by deserving it; maximalist holds it by never letting go. "Polished standard" is where generic SaaS lives — choose it consciously or not at all.

**3. Audience relationship** — Authority · Peer · Companion · Coach
Lost audiences want authority/coach; patronized audiences want peer/companion.

**4. Sensory ambition** — Functional · Considered · Resonant
Functional respects time; resonant respects feeling. Store previews skew functional; launch films skew resonant.

### Hard combinations — flag and confirm
- Functional + Provocative: provocation needs emotional engagement functional resists.
- Authority + Functional: slides into preachy.
- Expressive maximalist + Calm tone cell: contradicts itself in motion.
- Resonant + ≤10s duration: rarely enough time to land feeling.

## Visual philosophy (the canvas step)

Before any frame: name a movement and write its manifesto. This is what turns a style into a point of view.

```
Movement: <2–4 word name, e.g. "Quiet Margin Cinema", "Brutal Index", "Paper Weather">
Manifesto (5–8 sentences): how this piece treats
  - space (what fills the frame, what is withheld)
  - form (geometry, edges, material)
  - color (count, logic, what color MEANS)
  - type (the role text plays — actor, caption, texture)
  - time (what motion is for in this world)
```

Test: two designers reading it independently would make frames that look like siblings. If not, it's too vague.

## Rejection list (often the most useful section)
Concrete, checkable "never" statements. Examples:
- No floating phone mockups on gradients.
- No more than two colors on screen at once.
- No text that moves while it is being read.
- No particles, lens flares, or bokeh.
- No stock "hand holding phone" footage.

## Art direction — five layers, motion edition

1. **Story** — premise, emotional through-line, brand's role, takeaway.
2. **Look** — pacing (cut density), camera language (locked / drifting / one continuous move), color treatment, type system, audio direction (music, VO, silence), 3–5 references with *borrow X, not Y*. Never reference direct competitors.
3. **Execution** — required frames, assets list (screens, fonts, SVGs, audio), constraints, licensing for fonts/music decided now.
4. **Variants** — plan per aspect up front:

| Variant | Size (verify current store specs) | Notes |
|---|---|---|
| Landscape film | 1920×1080 | master |
| Vertical social | 1080×1920 | hero in center 4:5 safe area; captions above bottom 20% |
| Square | 1080×1080 | text scale +10–15% |
| App Store preview | per-device portrait, 15–30s | Apple expects mostly captured in-app footage — check current App Store guidelines before concepting |
| Play Store promo | YouTube link, landscape | |

   For each: what recomposes, what crops, what's dropped. In Remotion this becomes one composition per variant sharing scene components with a `layout` prop.
5. **Standards** — what "approved" looks like (the storyboard Stills), what "not approved" looks like (the rejection list), revision rounds.

## Failure patterns
- "Modern, clean, minimal" — means nothing. Force references and mechanisms.
- Brief written then ignored — every implementing agent gets `CREATIVE.md`.
- Approving "fine" — fine is the enemy of distinctive.
