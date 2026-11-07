# Shot grammar: joins, camera moves and story transitions

Read this before planning keyframes for any film that should feel continuous ("one take", hidden cuts), and whenever a project studies or recreates a reference video. Every number here was measured on ArcaneArt ep01 (2026-11), a 30 s recreation of a one-take reference, using Seedream 4.5 and Kling 3.0 (5 s clips, 24 fps) with a Remotion edit. The tools named here live in `template/tools/` and `template/film/`.

## 1. Studying a reference (never its pixels)
- **No reference pixels anywhere.** No frame, crop or still goes to a generator, into the edit or into the project folder. Contact sheets live in the session scratchpad. The look travels in words, then through our own approved style frame.
- **Look at every second before writing anything.**
  - Make 8 fps sheets per 3 s (6×4 tiles at 240 px) and view each one.
  - **If an image comes back "media removed" or doesn't load, you have NOT seen it.** Remake it smaller and view it again.
  - Never fill a gap from motion or brightness numbers. On ArcaneArt the v1 breakdown was inferred that way and was wrong at seven beats; the user rejected the finished film ("the movements and cuts are nowhere near the original").
- **Then check the finished cut beat by beat.** Pair frames of the reference and ours at the same story beats (in scratch) before showing the user.
- **Measure, too:**
  - Cuts: `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.12)',metadata=print" -f null -`. A one-take reference shows a single score ≥ 0.3.
  - Camera motion, per frame: OpenCV `phaseCorrelate` on 320×180 grey frames (dx, dy in px, scaled to 1080p). 0 means locked; a ramp means an eased move.
  - Light clock: mean luma and red−blue per frame.
  - Sheets: 4 fps sheets per 6 s, and 12 fps strips around every join.
- **Write two things:**
  1. A timeline table: shot, time, picture, camera, join, luma and warmth.
  2. A **style checklist read off 3–4 full-size reference frames, plus 2× crops of a face and an edge.** It covers faces, skin rendering, how edges are made, light shapes, shadows, grade and depth of field.
- **The checklist is the look's spec:**
  - Judge every candidate side by side with a reference frame at the same size, in scratch, before the user sees it. A candidate that loses on any line doesn't go up.
  - Naming a style from memory ("flat planes, two-tone shadows") cost two rejected checkpoints on ep01.

## 2. Grammar rules (from the reference; all were confirmed in our cut)
1. **Detail before face.** Open on hands and an object, then reveal the person with one eased move.
2. **The camera moves only while the subject moves.** Lock it while she works, bargains or pauses; track, arc or follow only while she travels.
3. **Hide every change of place; cut visibly once, at the story's resolution.** The film may change state when the story does. If the user asks for no cuts at all, the resolution transforms too (the keyframe chain, §3), and "one hard cut" is dropped.
4. **Each hidden join changes one more thing.** Place, then shot size, then angle. Never all at once.
5. **Keep the hero's screen box and pose across a hidden join.** The eye follows her; the world swaps behind her. Plan the box ("about two thirds of the frame height, left of centre") in the prompts on **both** sides, and pick the out-point where her size matches.
6. **Light is the clock.** Warm interior → cold street with warm pools every ~3 s → warm market → cool first light.
7. **Introduce a character by depth staging.** Put him in a lit doorway in the background while she crosses the dark foreground.
8. **Frame-in-frame for the still scene.** Use symmetry and a light at each edge.
9. **End on the subject leaving a locked frame**, not on a camera move.

## 3. The join catalogue
Plan one row per join in `script.md` (type, frames, how it is built) before any keyframe.

| Join | Use when | Generate | Edit (Remotion) | Check |
|---|---|---|---|---|
| **Chain** | the move continues within one place | Clip B's start = clip A's frame N, extracted raw by index: `select='eq(n\,N)'`. Never by time seek. | A's window ends at `srcOut = N` exactly, and B plays from 0. (`srcOut = N+1` shows frame N twice.) | Frames either side of the join are identical. |
| **End-frame reset** | after one chained link; every new place; after any face drift | Clip B = start (a chain frame) + **end = a fresh keyframe made from the sheets**. | Play B to its **last** frame, then butt-join into the clip that starts on that keyframe. | Mean abs diff of B's tail to the keyframe: 27 → 10 → 2.6 over its last 1.5 s. Don't cut while it's above ~3, or it pops. |
| **Shared keyframe** | two clips meet on one approved still | B's end frame = C's start frame (the same file). | Butt join. | C's frame 0 vs the still: ≈ 2.4 (encode noise). |
| **Continuous exit (what the reference does)** | leaving a room | **No cut.** She rises with the object at camera height, turns, and the camera pans with her out of the door; the room slides out and the night wall slides in. Generate it as a Kling start → end pair: start = a chain frame inside; end = a fresh keyframe with the object on her hip and the night wall in the frame. | Butt joins only. | Her motion reads natural at 1×: **never ramp character action** (a 3× ramp over Kling's idle start was rejected as unnatural). |
| **Anchor-object swing** (fallback when the continuous exit fails) | leaving a room; a warm → cool world swap | The out-clip ends with the object held in the frame centre (her head out of frame). The in-clip starts with the object in a similar box. | Butt join under a horizontal-only blur that peaks on the cut: SVG `feGaussianBlur stdDeviation="b 0"` with `b = sin(πp)·64 px`, over 12 frames. | A 12 fps strip shows the object passing through the blur. |
| **Passer-by (distraction) cut** | a place change mid-walk; a reframe | What the reference does: a **real, in-focus** person of the scene walks across at mid-close distance, cropped at the neck and lit like the new place. The cut happens **as he enters**, so the eye follows him while the place swaps behind him. It is never dark and never fully covered. **Paint him on flat LIGHT grey** ("one flat, even, light warm-grey colour … evenly lit"). On navy, his shadow side merges with the ground and the matte loses half his body. Paint-filter the still (r6) first, then cut him out with `make_occluder.py --full`; leave him sharp. | `template/film/timeline.ts` `PASSERS` + `Film.tsx` `Passer`:<br>• image drawn at 1.3× the frame, bottom-aligned, so his head leaves the top;<br>• crosses right → left at one speed in 10 frames;<br>• the cut sits on the frame where he has come in by min(⅓ of the frame, his own width).<br>Measure x0/x1 on the rows still on screen. | `node --test` (covers about ⅓ on the cut; visible the frame before; gone within 10 frames).<br>Real frames: ep01 entered at 511, cut 512, gone 518. |
| **Keyframe chain (smooth transformations)** | the user wants NO cuts: "transitions smooth, things should morph" (King Bali, 2026-11) | Every shot is a still keyframe. Clip N is a Kling start→end clip from keyframe N to keyframe N+1, and it carries the action AND the transformation into the next scene ("the giving … then the light pours like molten gold, the scene melts into it, and Vamana forms"). Prompt: "Smoothly transforms from the start frame to the end frame … the [frame/doorway] stays in exactly the same place and composition, a stable background; the light and shadows stay consistent with the start frame; one smooth continuous take with no cuts". | Butt joins only. Every join falls on a REST frame (a settled end into an idle start). Each clip is pinned at 120 frames, so the runtime is about N × 5 s. | Pixel step across ≤ about 2 and phase-correlation global motion ≈ 0 on both sides (King Bali: 0.6–2.2 and 0.0 at all 7 joins). |
| ~~Transition clip appended between independent clips~~ (rejected) | — | Generated from the outgoing clip's frame N while it was still MOVING (doors opening, camera pushing). The transition starts as a still, so motion stops dead, then restarts. The pixels matched (step 2.8) but the user saw "a jank that clips are appended". Kling also invented shadows the outgoing clip never had. | — | Never generate a transition from a mid-motion frame. Use the keyframe chain. |
| **End frame taken from inside the next clip** | the next clip has a slow head (placing an object, settling) you want to skip | Make the next clip first. Then use **its frame K** (raw, `select='eq(n\,K)'`) as this clip's END frame. | This clip plays to its last frame; the next clip plays from `srcIn = K`. | Tail vs frame K ≈ encode noise (ep01: 08B tail → 09B frame 44, diff 2.3). It saved 1.8 s of 09 with no ramp. |
| ~~Occluder at the lens~~ (rejected) | — | ep01 v1 used a heavily blurred torso plus a dark shadow panel for full cover. It read as a black flash, not a person, and **the user rejected it**. | — | — |
| **Arc into the two-shot** (what the reference does) | the handover | No cut: a fast ~90° arc from behind her to the profile two-shot as the vendor lifts the basket. Kling start → end pair. The start is a chain frame of the approach; the end is the two-shot, or a frame from inside the two-shot clip (see the next rows). | Butt joins. Budget the full 5 s: the reference's 1 s arc cost 4 s at 1.25× on ep01 (wide aisle → close two-shot in one move, no morph worth cutting). | Step across each join within the neighbouring steps (§6). |
| **Cut on action** (fallback) | the handover, entering a two-shot | The action starts in A (the vendor's hands reach the basket) and continues in B (the basket already moving or landed). B is a new angle (+45°) and tighter. | Hard cut mid-action. | The action reads in one direction across the cut. |
| **The one hard cut** | the story's resolution | A fresh keyframe in new light. | Hard cut, no fade. | Exactly one, at the resolution. |
| **Kling's own occluder** | free bonus | Tracking past a corner or a passing porter makes Kling wipe the frame by itself (seen twice). | Cut under it, or keep it as texture. | Check the strips at 4–5 s. |

**Never** hide a change of place with a dissolve, a crossfade or a dip to black. They read as "time passed", the opposite of one take.

**Chain depth:** at most **one** chained link between identity resets. (The keyframe chain in §3 does not break this rule. Every one of its clips starts AND ends on a fresh keyframe made from the sheets, so every join is an identity reset. "Chained link" here means a clip started from another clip's raw frame.) Each link redraws the face a little, and the second link drifts visibly. Hidden joins (occluder, swing, end-frame reset) are the reset points.

## 4. Camera-move prompt recipes for Kling 3.0
One camera move per clip. Name the move, its direction and its speed **against the background**. Close every prompt with: "Keep every character exactly as in the start frame … keep the hand-painted brush-stroke look. Silent. No text, no letters, no logos."

| Move | What worked | Failure seen | Rule |
|---|---|---|---|
| Crane reveal (start → end) | "The camera cranes slowly up and to the right in one smooth eased move, from [detail] to her face, then holds." Start = insert, end = her MCU in the same room. | Her eyes drifted to the lens from 2 s ("never looking at the camera" was ignored). | A crane pinned by a shared end frame can't be cut early. Keep the end frame's gaze off-lens, so Kling's tail converges back to it; the mid-clip glance (ep01 v2: about 1–2.5 s) stays. Only a crane whose tail is free can be cut before the drift. |
| Side-on track | "The camera tracks sideways to the right **fast, at her walking speed**, so the house fronts, doorways and the wedge of lamplight slide past behind her from right to left; she stays in the centre." Start frame cropped to mid-thigh. | With a full-length figure and vague camera words she ran in place. Seedream ignores "framed from mid-thigh up". | **Crop the raw 2K still to the cowboy box (≈ 1.6×), lanczos back up, then paint-filter.** Light pools passed at the reference's ~3 s rhythm on their own. |
| Arc | Chained start (her profile) + end = a fresh 3/4-back keyframe of the next place. | none | The end-frame reset does double duty as the arc's target. |
| Follow / walk-away | "The camera follows behind her at walking pace … she walks steadily away from the camera." | none | **This is Kling's safest motion.** Identity held for all 5 s every time. |
| Rise / exit with an object | "Right away, in one quick smooth movement … her head leaves the top of the frame as she stands; we see her body from the chest down." | Face-toward-camera action drifted at 2.25 s and **painted a bindi in**. The basket deepened while lifted. | **Keep the face out of frame during action.** Hide object morphs under the swing blur. |
| Locked gesture sequence | "Locked-off camera on a tripod, no camera movement at all. He lowers the basket onto the scale, lifts one sprig and smells it, shrugs and holds out a few folded notes." | none. Five named gestures in order, faces stable for 5 s. | **A locked profile two-shot with named, ordered gestures is Kling's sweet spot.** It uses all 5 s: budget it. |
| Expression change | Put it as the **last** clause: "… then she lowers her hand, and her fierce look softens into a small private smile." | none. It lands at 4.5–5 s. | Chain the next shot from the last frame to keep the moment. |
| Any chained clip | none | **Idle head.** Kling barely moves for the first 1.25–1.5 s, even with "right away". | **Trim the idle head:** start the window after it, or make the move a start → end pair so the motion spans the clip. Never ramp a character's action; a 3× ramp read as unnatural and was rejected. Ramp only a shot where nothing living moves. A start→end clip with a big move did not idle (02B moved from frame 1); a static chain start did (08B, about 1.3 s). |

## 5. Timing
- **Plan runtime from PINNED lengths, before any keyframe.**
  - A Kling start→end clip spends its full 5 s between its two frames, however short the reference beat is (ep01: a 0.8 s exit took 5 s).
  - A shared-keyframe or chain join pins that end of the clip. Only a passer-by cut, a hard cut or an end frame taken from inside the next clip (§3) frees a head or tail for trimming.
  - So, per shot: a start→end clip pinned at both ends = 120 frames at 1×; a chain-in clip = from frame 0 to its chosen out-point.
  - Sum every shot. ep01 planned 30 s; 01–06 alone came to 22.7 s against the reference's 15 s, and the whole film came to 38.5 s even at 1.25× travel.
  - **Never quote a runtime from one section.** I told the user "~32–33 s" from 01–06, and the real figure was 38.5 s.
- **Let the user choose the speed on a real rough cut:**
  1. Render the first half at 1×.
  2. Make 1.25× and reference-speed copies (`setpts=PTS/r`).
  3. Put all three on the page with their resulting totals.
  - ep01 chose 1.25× for travel shots and 1× for gestures. At reference speed (1.58×) the movement reads sped-up.
- **Silent storytelling needs ~1.7× the screen time of the same beat told with dialogue.** The reference's 5.8 s spoken bargain took two full locked clips (10 s) as gesture. With a fixed runtime, show the user 1× / 1.25× / 1.7× of the gesture shot side by side and let them choose: 1.25× still reads as natural (the ep01 choice, 34.5 s instead of 30 s); 1.7× reads as fast-forward.
- **Chain from the last frame when the clip ends on the beat** (an offered note, a smile). Pick the chain frame where the next action can start, and end the outgoing window there.
- **Gesture shots resist compression.** A locked bargain or a private gesture needs its full clip at 1×. Decide early whether the runtime is fixed; if it is, take the time from travel shots, never from gestures.
- **Windows:** pick them from 0.5 s strips, plus 2-frame strips around each join. Record them in `script.md` → Clip windows.
- **`template/film/timeline.ts`** holds the edit as data: one row per clip window, with `srcIn`, `srcOut` and `rate`; a split row is a ramp. The last row fills to the total. Joins sit on segment boundaries.
- **`timeline.test.ts`** checks that the total is exact, that every window stays inside 121 frames, that the last shot is at least 2 s, and the passer-by crossing (visible before the cut, about ⅓ coverage on it, one speed, gone within 10 frames). Run `node --test` after every timing change; it caught a 1.2 s final shot on ep01.

## 6. Checking joins on real frames
Render a half-scale rough cut of what exists (`npx remotion render … --frames=0-N --scale=0.5`). Then tile the frames at each join (N−2…N+2) and look.
- **Static or slow shots:** the frames either side of the join differ by about encode noise (≤ 3 mean abs diff at 480×270).
- **Motion, at every join:** measure global motion either side with phase correlation (`cv2.phaseCorrelate` on 270×480 grey frames). Matching pixels with mismatched motion (one side moving, the other starting from rest) reads as a jank. That is what a transition generated from a mid-motion frame does.
- **Moving shots:** a running track changes 13–21 per frame on its own, so the difference to the target frame tells you nothing. Measure the **step across the join** (last out-frame → first in-frame) against the frame steps on either side.
  - ep01 02→03 stepped 20.8, against 6–14 before and 13–21 after: invisible, it reads as her speeding up.
  - A step well above both neighbours is a pop.
- **Passer-by cuts:** he is visible the frame before the cut, sharp, and there are no near-black frames.
- **Then compare beat by beat:** pair the reference's frame and ours at the middle of each beat (in scratch, never in the project). List every difference you see for the user (clock, light, framing, costume) before they review.
