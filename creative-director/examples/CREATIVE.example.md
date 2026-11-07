# CREATIVE — Shelf launch film

> Worked example. Same brief that produced a generic baseline (fade → rising book covers → feature chips → logo) without this skill.

## Brief
- **Audience:** Commuters and frequent flyers who read on their phones and already use Kindle or Play Books.
- **One message:** Shelf never makes you wait for a connection.
- **Platform / aspect:** 1920×1080 master; 1080×1920 vertical; App Store preview cut later from in-app captures.
- **Duration:** 20 s @ 30 fps
- **Mood (exactly 3):** unhurried, exact, warm
- **Brand cues:** Paper #F4ECDD, ink #1E1A16, single amber accent #E8A33D; Literata for reading text, Inter for UI.
- **Must include / avoid:** Must show a real reading screen and the store badges on the end card. Avoid airplane and cloud icons.
- **References:** https://www.apple.com/airpods-pro/ (borrow the long held silences, not the product spin); iA Writer's site (borrow the typographic calm, not its blue).

## 1. Ideation
**Method:** Story skeletons — Inversion and Reveal by subtraction, pressure-tested with de Bono PO (Escape).

### Rejected (obvious)
1. Book covers rise in a row, "Works offline" chips pop in, logo, CTA — this is the category average and survives a noun-swap to any reader app.
2. A phone mockup flies through clouds while an airplane-mode toggle flips — it uses the literal travel metaphor every offline app uses.
3. A crossed-out Wi-Fi icon with "No signal? No problem." — it is a slogan with motion attached, not an idea.

### C1: Tunnel Page — method: Single-object journey
Premise: One reading screen rides a metro carriage into a tunnel, and the frame goes dark except the page.
Skeleton: Single-object journey
Wow moment: At 11 s the status bar reads "No service" and the page turns anyway.
Visual system: Abstract light bands sweep across black and the page is the only lit plane.
Mechanism: SVG status bar, gradient bands as texture tier, CSS 3D page turn inside one Sequence.
Failure mode: Tunnels read as a horror cliché if the bands are too fast, and it needs a careful dark grade.
Grounded?: no

### C2: Margin Notes — method: Typographic score
Premise: The whole film is one book page, and the features arrive as handwritten marginalia timed like notation.
Skeleton: Typographic score
Wow moment: At 13 s a note reads "finished on AI-302, row 31".
Visual system: A single cream page, ink strokes, one amber underline.
Mechanism: @remotion/paths evolvePath stroke-draw, with text measured via @remotion/layout-utils.
Failure mode: It is text-heavy, the vertical 9:16 cut squeezes the margin, and nobody reads cursive at speed.
Grounded?: no

### C3: The Noise Leaves — method: Inversion + Reveal by subtraction
Premise: The connected world is shown as the strange one — a reading screen is buried under 12 stacking "Reconnecting…" toasts and spinners, and then Shelf opens and all of it falls away into silence.
Skeleton: Reveal by subtraction
Wow moment: At 12 s every toast drops out of frame on one beat, the audio cuts to silence, and only the paragraph remains.
Visual system: The connected half uses grey system UI; the Shelf half is warm paper with one amber bookmark.
Mechanism: Toasts are a data array mapped with enterAt() stagger, one shared exit on beat frame 360, and a TransitionSeries fade into the page.
Failure mode: The first 10 seconds depict the problem, so people may remember the spinners instead of Shelf.
Grounded?: yes

### Scores
| Concept | Originality | Brief fit | One-wow | Feasibility | Variants | Total |
|---|---|---|---|---|---|---|
| C1 | 4 | 4 | 4 | 3 | 3 | 18 |
| C2 | 5 | 3 | 3 | 4 | 2 | 17 |
| C3 | 4 | 5 | 5 | 5 | 4 | 23 |

### Premortem (leader)
- Flopped because the spinners dominated memory → cap the noise at 9 s and give the silence 8 s.
- Misread as a battery or notification app → open on the reading screen first, not on toasts.
- Indistinguishable from a focus-mode ad → the end card names the mechanism: "Every book, on your phone, before you need it."

**Chosen:** C3 — it carries the one message without a single offline icon.

## 2. Direction
| Axis | Position | Why |
|---|---|---|
| Tone register | Conversational | The category is dry and feature-listy. |
| Aesthetic philosophy | Editorial restrained | The payoff is emptiness, so the frame must earn it. |
| Audience relationship | Companion | Readers are the protagonist, not students. |
| Sensory ambition | Considered | Craft should be felt, but the film is 20 s, not a short film. |

**Tensions flagged:** none

### Visual philosophy
**Movement:** Quiet After Noise
Space is withheld until it is deserved: the first half is crowded on purpose, and the second half is mostly margin. Form is flat and rectilinear, with no shadows, gradients, or device frames. Color carries meaning, with grey for the network world and paper for the reading world, and amber appears exactly once. Type is the actor, so the reading paragraph is the hero and every UI string is support. Time slows as the noise leaves, which means cuts get longer and holds get longer. Silence in the audio is treated as a visual element.

### Rejection list
- No airplane, cloud, or Wi-Fi icons.
- No device mockups or hands.
- No more than one amber element on screen.
- No text that moves while it is being read.

### Look
- **Palette:** #F4ECDD paper (ground), #1E1A16 ink (text), #E8A33D amber (bookmark only), #9A9A9A system grey (noise).
- **Type:** Literata 44/64 for the reading paragraph; Inter 28 for UI.
- **Camera language:** Locked off, with no moves; the frame only changes by subtraction.
- **Audio:** Soft room tone and notification ticks for 0–12 s, hard silence at 12 s, a single piano note at 17 s.

## 3. Motion
**Tone cell:** calm-sharp
**Personality:** corporate
**Mood → cell:** unhurried → calm; exact → sharp; warm → softens holds, not curves (no overshoot)

### Motion-language spec
| Property | Value |
|---|---|
| Entrance curve | cubic-bezier(0.22, 1, 0.36, 1) |
| Exit curve | cubic-bezier(0.4, 0, 1, 1) |
| Spring | none |
| Base unit | 0.4 |
| Transition family | Hard cut on the beat plus one crossfade into the end card |
| Stagger | 60 ms, top-to-bottom |
| Intensity | travel 24 px max, scale 0.96 to 1.0, 0% overshoot |
| Hold | 0.4 s minimum; 1.2 s after the wow |

### Restraint — stays still
- The reading paragraph never moves once it is visible, because it is being read.
- The status bar stays static apart from its text values, so it is an anchor.

### Pacing map
Open on the page (calm, 0–2 s) → toasts accumulate (build, 2–11 s) → WOW at 12 s: everything drops and silence lands → settle on the paragraph (12–17 s) → end card hold (17–20 s).

### Shots
```
SHOT 1  [t = 0–2s]
PURPOSE: Establish the reading screen so the noise has something to bury.
HERO: Reading paragraph, already present (no entrance).
SUPPORT: none
TEXTURE: Room tone only.
TRANSITION IN/OUT: Cold open / continuous into shot 2.
BEAT: none
NOTE: none

SHOT 2  [t = 2–12s]
PURPOSE: Make connectivity feel like noise.
HERO: Toast stack, which grows top-to-bottom at a 60 ms stagger in batches of three.
SUPPORT: Spinner glyphs in grey.
TEXTURE: Notification ticks.
TRANSITION IN/OUT: Continuous / hard cut on beat at 12 s.
BEAT: All toasts exit together at 12.0 s.
NOTE: Density is the energy and the curves stay calm-sharp. This is deliberate: noise is made by count, not by easing.

SHOT 3  [t = 12–17s]
PURPOSE: The payoff of silence.
HERO: The paragraph, untouched.
SUPPORT: Amber bookmark ribbon enters at 13 s at 2× base unit.
TEXTURE: none
TRANSITION IN/OUT: Hard cut / crossfade.
BEAT: Silence at 12 s.
NOTE: none

SHOT 4  [t = 17–20s]
PURPOSE: Name the product and the mechanism.
HERO: Wordmark "Shelf".
SUPPORT: Line "Every book, on your phone, before you need it." and store badges.
TEXTURE: none
TRANSITION IN/OUT: Crossfade / hold to end.
BEAT: Piano note at 17 s.
NOTE: none
```

### Variants
| Variant | Size | Recompose / crop / drop |
|---|---|---|
| Film | 1920×1080 | master, paragraph in centre 60% |
| Vertical | 1080×1920 | toasts stack full height; paragraph reflows to 5 lines |
| Store preview | per Apple spec | rebuilt from in-app captures, keeping the same beat |

### Storyboard
| Frame | t (s) | Still id | File |
|---|---|---|---|
| Hook | 1.0 | SbHook | out/sb-hook.png |
| Wow | 12.0 | SbWow | out/sb-wow.png |
| End card | 19.0 | SbEnd | out/sb-end.png |

## Approval
**Approved:** yes — UD, 2026-10-29 (example)
