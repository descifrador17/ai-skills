# Motion Art Direction

Condensed from iart-ai `motion-art-direction` + its direction playbook. **The one rule: define the motion language first, then animate to it.** Consistency reads as confidence; variety reads as noise.

## 1. Tone & energy matrix — pick ONE cell

|  | Soft (organic) | Sharp (precise) |
|---|---|---|
| **Calm** | Luxury, wellness, editorial — long eases, generous holds | Premium tech, fintech, productivity — clean decel, tight but unhurried |
| **Kinetic** | Playful, lifestyle, kids — springy overshoot, loose | Sports, hype, gaming — hard snaps, cuts on beats |

Straddling cells is the #1 cause of "inconsistent". (Baseline failure: bouncy overshoot chips inside a calm decel piece.)

## 2. Personality preset — pick ONE

| Personality | Cell | Base unit | Signature curve | Overshoot |
|---|---|---|---|---|
| Premium | calm-soft | 0.6s | `0.4, 0, 0.2, 1` | 0% |
| Corporate/precise | calm-sharp | 0.4s | `0.22, 1, 0.36, 1` | ≤2% |
| Playful | kinetic-soft | 0.4s | `0.34, 1.56, 0.64, 1` / spring | 10–20% |
| Energetic | kinetic-sharp | 0.25s | `0.16, 1, 0.3, 1` | 15–30% on beats |
| Data-story | neutral | 0.5s | `0.25, 0.1, 0.25, 1` | 0% on quantities |

## 3. The motion-language spec — one value per row

| Property | Rule |
|---|---|
| Entrance curve | ONE bezier (ease-out family) |
| Exit curve | ONE bezier (ease-in family) |
| Spring (optional) | ONE named config, only if the cell is kinetic-soft or the philosophy demands physics |
| Base unit | seconds; every duration is ×0.5, ×1, ×2, ×3 of it |
| Transition family | e.g. "match-cut + crossfade only" — no wipes/spins unless chosen |
| Stagger | ONE value in ms, ONE direction |
| Intensity | max travel px, scale range, overshoot % |
| Hold | min stillness after each beat |

Max **two** primary curves. A third must be logged as a NOTE with a reason.

## 4. Hierarchy — per shot

| Tier | Role | Moves |
|---|---|---|
| Hero | what the shot is about | boldest, slowest, lands on the beat |
| Support | helps hero land | smaller, faster, yields |
| Texture | ambient | subliminal: slow loops, low contrast, `linear` allowed only here |

Two elements competing for the eye = direction failed. Demote one.

## 5. Restraint — write down what stays still
- Never animate the whole frame at once; keep an anchor.
- Never transition the transition (wipe + spin + fade).
- Never move text while it is being read.
- No overshoot on serious or numeric content.
- One wow per piece.

## 6. Pacing map
Draw energy over time before timing anything: low open → build → ONE peak → settle → end-card hold. A hold after a fast run makes the next hit land. Key landings sit on audio beats when scored.

## 7. Shot direction notes (intent, not keyframes)
```
SHOT <n>  [t = a–b s]
PURPOSE:  why this shot exists
HERO:     the one element; how it enters and lands
SUPPORT:  how secondary elements yield
TEXTURE:  ambient behaviour, if any
TRANSITION IN/OUT: from the locked family only
BEAT:     audio mark the key move lands on
NOTE:     any deliberate spec break + reason
```

## 8. Brand → motion translation (map only the 2–3 strongest words)

| Word | Easing | Timing | Avoid |
|---|---|---|---|
| Premium | long soft decel | slow, generous holds | bounce, fast cuts |
| Precise/trustworthy | clean decel | on-grid multiples | wobble, irregular stagger |
| Energetic | hard-out | fast, syncopated | slow fades, dead air |
| Friendly | slight spring | loose | robotic linear |
| Calm/focused | long decel, low intensity | slow, long holds | anything that demands attention |

## Consistency check (pre-render)
- One easing family on comparable moves; no stray `linear`/default `ease`.
- Every duration is a multiple of the base unit.
- Only the chosen transition family.
- Identical stagger across grouped reveals.
- Hold discipline respected.
- Exactly one hero per frame, exactly one wow per piece.
