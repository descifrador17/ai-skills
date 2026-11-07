# Generation traps: Seedream 4.5, Kling 3.0, Higgsfield filters, Arc

Every item here was learned on the Ramayana series (EP 01–14, Seedream 4.5 + Kling 3.0 on Higgsfield, 2026). Episode numbers refer to that series; the traps apply to any project on the same models. Check each still and clip against this list before the user sees it. The full driver notes are in `tools/hf_web/README.md`; the project `CLAUDE.md` holds the standing rules.

## Checking a still (before `live.py set … --status review`)
- **Subject and story:** is this the beat in the script, with the right characters, in the right place?
- **Bible match:** skin colour, face, costume, ornaments and crown against the sheet. Watch for forehead marks the sheet doesn't have (Seedream and Kling both add tilaks and dots).
- **One image:** no split screen, panels, seam, oval or border, no metal bars or frames, no collage (a big head on a small body), and no character drawn twice (a giant face in the sky plus the figure).
- **Empty text area:** the planned area really is empty on the still and stays empty through the clip window.
- **Physics:** gazes, scale and screen direction agree with the neighbouring shots. A flyer heading toward the horizon must show his back (a face toward the camera means he flies backwards; the user caught this on EP 11 still 2). Anyone greeting, bowing to or speaking to another character faces them, not the camera (EP 12 still 10: he bowed with his back to Surasa). Keep the pair's screen sides fixed (e.g. Hanuman left, Surasa right). Mirror with `ffmpeg -vf hflip` (name it `_t1f.png`) to fix direction.
- **Depth order and geography:** read who is NEARER the camera, not just left and right, and ask whether the next shot can follow from this staging. ArcaneArt ep01: a stall "ahead on the left" sat in the left FOREGROUND, behind her. Its clip walked her away from the vendor, so the next shot (he takes her basket) couldn't chain, and the still and clip were redone.
- **Framing words are ignored** ("from the knees up", "chin down", "running left to right", "full-bleed"). Fix them in post on the RAW still, then paint-filter: mirror (`hflip`), crop to the box and lanczos back up, or crop off a painted border or black band. Don't re-roll for framing.
- **Filter risk:** large bare skin in the foreground (a big shoulder, a big torso) gets the still refused as a Kling start frame. So do body contact, carrying and swallowing-like staging.

## Seedream 4.5
- **The style frame leaks architecture.** Every outdoor prompt says "Nature only: … no palace, no pillars, no domes, no buildings or architecture anywhere" (decision 43).
- It paints borders, bands, metal bars and frames. Write "full-bleed, no border", and crop leftovers: `crop=w:h:x:y,scale=1440:2560:flags=lanczos`, saved as `_t1c.png`.
- It splits "huge face + tiny figure" into panels. After two such failures, change the shot (e.g. the face alone, eyes on him off-frame).
- It doubles a character when a sheet reference and "vast" meet. Write "each figure appears exactly once".
- **Edits barely change anything** ("Edit the reference … change only …" returned near-identical images). For small fixes use ffmpeg `delogo` (fill a region from its surroundings), crop or hflip. Regenerate for big changes.
- **Edits that do work (ArcaneArt, 2026-11):**
  - ONE named change, with the second reference supplying it: a garment swap; a wall replaced by the market of ref 2; a stall moved twenty paces down the aisle.
  - But the stall edit also dropped her basket. A second edit to put the basket back lost the whole scene.
  - **When edits keep breaking one element, composite that element from your own approved image:**
    1. GrabCut the element inside a measured box.
    2. Scale it by a body measure (shoulder width), not by hair or head size.
    3. Seat it, checking a 2× crop for a floating gap.
    4. Run the paint filter over the whole frame so the strokes match.
- **A named character's block + sheet clones him onto look-alike extras.** The porters came out with the old vendor's face, moustache and pouch, twice.
  - Describe every extra explicitly, with a different age, hair, build and clothes ("two young porters, one tall and thin with a short beard, one short, stocky and clean-shaven").
  - Drop the character's sheet from the refs when he is small in frame.
- **"Walks away" alone gives a front view.** Write what the camera sees: "her back to us: we see the back of her head, her braid hanging down the middle of her back".
- It draws a person when asked for a shadow, and gets literal with words ("a dome of water" became a glass dome with spikes; "flame-of-the-forest" became fire). Describe plainly: "a natural mountain of rock and forest, never a crown, never spikes".
- Small figures without sheet references get kimono and shoes. Pass the sheet, or keep them as silhouettes.
- For new character sheets, use a non-human style reference (`jatayu_sheet.png`) so it doesn't copy a face. The three small face studies often come out as someone else: fill them away with `delogo`.
- Prompts over about 3,000 characters are silently ignored. `hf_web` refuses them; shorten background characters to a line.

## Kling 3.0
- **Bent legs mean running.** A flying figure with bent legs gets animated running or kicking in the air ("air walking"), even when the prompt says otherwise. Every flying still needs the **straight flying pose**: body stretched out flat, legs straight and pressed together, toes pointed. Never write "like an arrow": Seedream then paints an arrow or spear into his hand. A crowd frozen mid-leap also air-walks: start crowds grounded.
- **Late morphs.** After about 3 s Kling smears flying trees, merges figures and dissolves characters away. Choose `srcIn` + `frames` so the shot ends first (decision 43). Check the frames at 0/1/2/3/4 s with `strip.sh`, then the exact last frame you use.
- It adds a red tilak to older or elder faces when it redraws them. Ask for head-and-face-still, hands-only motion.
- It invents expressions (scowls, winks). Write the expression you want and "no wink".
- "Lift away" floats the feet off the ground. A foot already in the air gets a hop in the first second.
- A start/end morph works when both frames share one composition. When the end frame drifts, use a single start frame and describe the change.
- A zoom-out prompt can end with the characters dissolving. Cut before it.

## Higgsfield filters
- **IP filter (`ip_detected`):** never name studios, films or artists, or deity-named objects. Avoid famous calendar frames: Hanuman frontal with fist forward or lifting a mountain, Ram raising the bow, the abhaya palm. After two blocks, change the composition or the beat.
- **Output filter (`ended nsfw`):** carrying, body contact, a giant woman with a small figure, open mouths. Also a **"tiny" or cat-sized Hanuman**: Seedream draws a childlike bare-chested figure and the output filter flags it (EP 13 moon, EP 14 tree). Keep him a grown, muscular, bearded adult who is small only by distance or big leaves; never write "tiny" or "cat" (one prompt drew a real cat beside him), and never "conch" near him (his mace became a shell). With a small bare-chested Hanuman, also avoid "eyes half closed" and "lips parted": two takes in a row ended nsfw (EP 14 shot 8); an open-eyed, kind or watchful face passed. Never write swallow, devour, mouth, inside or enter; show light, silhouettes or scale cues instead.
- **Upload filter (`422 Restricted content detected`):** a still can pass generation and still be refused as a Kling start frame. Refused so far: a big bare-backed figure beside Sita, Hanuman's big bare shoulder up front, and every version of Hanuman striking a rock (even small in the frame). A close-up bare chest passed. The surer trigger is bursts and explosions: rock impacts and a column of water under a storm were all refused. Prefer calm staging (a slow storm, a tilting rock) to bursts and sprays. Reframe smaller or from behind, and ask the user to approve again. The tab reloads itself after a refusal.
- **Human check (`403 turnstile_required`):** stop the stills runner and ask the user to tick it in Arc, then delete the `.failed` file and restart.

## Arc and the runners
- `option not found: Seedream 4.5` or other form errors while someone else (the user, or another session) uses the same tab: transient. Check with `hf_web.py shot image`, delete the `.failed` file, and the runner retries.
- `Can't get tab id … (-1728)` or `Invalid index (-1719)`: tabs moved, usually while the user worked in Arc. It's transient: delete the `.failed` file and the runner retries.
- One Unlimited job runs at a time per tab. `hf_web` holds a file lock, so a manual `hf_web` call simply waits its turn.
- A running bash runner keeps the script and environment it started with. To change the morph list on the fly, write it to `$RUN_DIR/TRANSFORM` (the clip runner and `live.py` re-read that file); for anything else, stop the runner with its STOP file and restart it.
- The companion events file is never cleared. `live.py` applies each click once (it tracks the timestamp). Older copies re-applied clicks every loop.

## Words get painted (all models; learned on ArcaneArt ep01, 2026-11)
Any noun in a prompt can turn up in the picture, even inside a style rule or a negative clause:
- "jasmine is the only pure white" put flowers into an empty street;
- "paint dragged over rough paper" put a torn-paper border round a frame;
- "warm bulb light rakes across …" put a glowing bulb on a man's chest;
- "characters have angular faces" (in a STYLE block) put a giant floating face into an empty street;
- "no flowers in her hair", "no forehead mark" drew both;
- "warm oil lamps and bare bulbs" (a STYLE light clause) put lanterns on every character sheet;
- "hair is a few big dark masses" (a STYLE clause) gave two bald old men black afro hair. Swap the clause in shots with bald or white-haired people: "her dark hair is a few big masses …; white hair is a few small rough brush tufts";
- "her bare shoulder blades" (meant as a back view) cut her blouse down to a band. Name the garment that covers instead.
- "where light is golden it blooms softly" painted golden lotus flowers; write "glows softly into the haze";
- "a stern warning" (a face study) painted a ⚠ sign into the sheet; write "a stern look with one hand raised";
- a character sentence in STYLE ("characters have angular faces …") painted faces into a sheet of a giant cosmic foot: frames and sheets with no people use STYLE_ENV;
- "heavy round earrings" on a face-on silhouette read as two eyes: on a silhouette, paint head ornaments dark (or leave them out of the block).

Fixes:
- **Light words** name only direction and colour: "warm light from the left".
- **Style words** describe how the marks are made, never materials or objects: "edges dry-brushed", "hair painted as a few big dark masses whose edges break into rough brush marks".
- **Shape adjectives get drawn:** "spiky stroke-ends" gave spiky hair. Use them for the subject only.
- **A thing that must stay out:** delete the clause and keep the noun out of the prompt entirely. Use a positive phrase ("her forehead is bare"), and pick the clean take or fix it in post.
- **Environment-only frames** (no people) use a `STYLE_ENV` block without the character sentences.

## Matching a reference look (Seedream 4.5 / 5.0 lite, Kling O1, Nano Banana)
- **The words decide more than the model.** Seedream 4.5 lost the first bake-off and won the second with style words read off the reference (§1 of `shot-grammar.md`).
- **Bake-off verdicts on a painted-3D (Arcane-like) look:**
  - Seedream 4.5: closest. Angular faces, graphic light shapes.
  - Seedream 5.0 lite: painterly but soft, Pixar-like faces. Best for flat 2D painted planes.
  - Kling O1: cel anime with ink outlines, plus a text-like plaque.
  - Nano Banana: smooth 3D render.
- **Generators render clean digital edges and smooth gradients** whatever the words say. The reference's rough brush-stroke edges come from a deterministic post step:
  - `tools/paint_filter.py` (generalised Kuwahara, fixed-seed grain) at r6 on 2K keyframes **before** Kling;
  - `tools/paint_clip.py` at r4 on every clip frame in the edit.
  - Measured: no added shimmer (frame-to-frame change 8.5 → 7.8). At 2560 px, r10 smears eyes and grain 0.05 reads as noise.
- **Seedream 5.0 lite won't paint true night** (mean luma ~59 at any wording). Use `tools/night_grade.py`: Lab-lightness gamma, highlights protected. **Never per-channel RGB curves:** they turn orange red and cobalt violet. Grade before Kling, so the clip inherits the darkness.
- **Turnaround sheets come out as line art.** Write: "painted exactly like a frame of the film, NOT a line-art model sheet: no black outlines, edges only where two painted colours meet".
- **Sheets carry filter risks into every shot:** an open vest became a bare chest; a face study winked. Name the undershirt, and "both eyes open, never winking".
- **Sheet backgrounds leak into scenes.** With two sheets plus one place reference, a two-shot came out on the sheets' grey studio wall. Fix with a named-change edit, below.
- **Seedream 4.5 named-change edits DO work** for one named region or garment. Two clean fixes:
  - "Change only her lower garment: one long, full, ankle-length skirt shaped like a bell";
  - "Change only the plain grey wall behind them: it becomes the flower market of the second reference image".
  The old trap ("edits barely change") holds for subtle fixes only.
- **Seedream ignores framing words in side-on walking shots** and draws full-length figures. Crop the raw 2K frame to the box, lanczos back up, **then** run the paint filter. The filter repaints the upscale softness.
- **Generated "cutout on chroma green" fails:** you get a whole character with a face, props, and a half-green ground. Generate the figure on one flat, evenly lit LIGHT grey ground, and cut it out with `tools/make_occluder.py --full` (shot-grammar §3). On dark navy, his shadow side merges with the ground and the matte loses half his body.
- Seedream 4.5 painted stray digits on a sheet. Check every sheet corner for text.

## Kling 3.0 (added 2026-11)
- **Safest motion:** walking away from the camera, followed from behind. Identity held for all 5 s in every take.
- **Least safe:** a face toward the camera during action. It redraws the face and adds marks (a bindi at 2.25 s).
- **Idle head:** a clip that starts on a static chain frame barely moves for 1.25–1.5 s, even with "right away" (ArcaneArt 08B: about 1.3 s). Start→end clips with a big move between their frames began moving at once (02B: diff 13 by frame 4). Never ramp it away: a 3× ramp read as unnatural and was rejected (`shot-grammar.md` §4). Trim it where the head is free (after a passer-by or hard cut), or budget it.
- **End frames converge in the last ~0.8 s** (diff 7.0 at −0.5 s, 2.6 at the last frame). Join on the last frame, never before.
- **A locked profile two-shot with ordered, named gestures plays a whole silent negotiation** in 5 s. An expression change written as the last clause lands at the end of the clip.

## hf_web (added 2026-11)
- `-> 401` while polling: the session token expired mid-wait, but the job still ran. Run `hf_web.py wait <job-id> <out>`. Never resubmit, because that makes a second job.
- `references panel did not open` (first runs with refs after several without): transient. Close the assets picker (`button[aria-label="Close assets picker"]`) and rerun.
- zsh (Claude Code's macOS shell) aborts a whole command on an unmatched glob. `rm -f "$RUN_DIR"/STOP_*` with no STOP files kills the runner launch that follows it, so name the STOP files explicitly.
