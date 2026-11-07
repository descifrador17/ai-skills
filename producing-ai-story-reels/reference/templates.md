# Templates and glossary

The bundled scripts parse these formats, so keep them exact. The worked examples come from the Ramayana series (`09_ramayana_the_road_to_diwali/`): `ep10/research.md`, `ep11/script.md`, `characters/BIBLE.md`, `ep11/clips/*.prompt.txt`. Replace the Valmiki citations with your project's source of truth (profile field 15), Hinglish with your on-screen language (field 13), and the 30 s frame split with your length (field 3).

## Glossary
- **Batch** ("pair" in the Ramayana series): the episodes made together through the checkpoints; one `BUILD_PLAN.md` task per batch.
- **Ideation:** the project's original outline, if any. It's a draft: the plan and the source of truth override it.
- **Checkpoint 1–5:** the five user approvals per batch (the default; profile field 21) (scripts and sheets, stills, VO, music, final).
- **Wow:** the single most spectacular shot of an episode. It carries no on-screen text.
- **Golden thread:** a thin gold line drawn in Remotion that runs through the series: a hand-off in each episode's last shot, an occasional glow. It never crosses a face or a sacred figure.
- **Empty text area / box:** the part of a shot planned to stay clear for the Hinglish line (`empty` in `episodes.ts`).
- **Hinglish line:** one short on-screen line per shot, Hindi in Roman script, with one *gold italic* key word.
- **`_t1`:** the first output of a prompt. **`_v2`, `_v3`:** new prompts (redos). **`_e1`:** an edit prompt that passes the take as reference ("Edit the reference image …"). **`_end`:** the end frame of a morph shot. **`_t1c` / `_t1f`:** cropped / mirrored copies. **`_alt_NNB_vK.mp4`:** a rejected clip, kept.
- **Ruling:** a decision I make on the user's behalf. It goes in the ledger as `Ruling: <what> — <why> — <cost if wrong>` and is flagged at the next checkpoint.

## epNN/research.md (one per episode; written by you unless the agent policy allows helpers)
Header: date, sources with URL patterns (Rao/Kopalle on valmikiramayan.net, Shastri on wisdomlib, the GRETIL critical edition), and the verified verse range. Then numbered sections:
1. the beats in story order, each quoted verbatim with kanda-sarga-verse;
2. where the translations and the critical edition differ;
3. designs: places, palette, and character blocks for new cast;
4. shot ideas (11 shots, with filter-risk notes and swaps);
5. departures in the ideation;
6. later traditions not to present as Valmiki;
7. prompt and filter notes;
8. `## Script-safe facts`: short Hindi facts, each with its citation.

## epNN/script.md (what `live.py` and `kling_md.py` parse)
```markdown
# EP 13 / 20: <Hinglish title> (<English gloss>)          <- line 1: becomes the page and record title

**Status:** draft for checkpoint 1
**Format:** **30 s** (decision 35): story 0–809, card transition 810–824, card static 825–899
**Fine print:** `EP 13/20 | <Title> | Valmiki Ramayana`

## Valmiki anchors
(beats with citations; then "Where Valmiki differs from the doc and popular versions")

## Creative (express)
(Rejected (obvious): 3 ideas. A table of 3 concepts, each with premise, wow and score: Originality, Fit, Wow, Feasibility,
Variant survival, each scored 1–5. A premortem on the leader, then "Chosen: …")

## Shots (30 fps; story 0–809, card 810–899)
| # | Frames (s) | Picture | Named | Empty text area | Thread | SFX |
|---|---|---|---|---|---|---|
| 1 | 0–74 (0.0–2.5) | **Hook.** … | Hanuman | the sky above | — | wind |
(11 rows; frames like 75/75/70/70/70/75/70/75/70/80/95; mark the wow row **Wow.**)

## Voiceover (Maya, Hindi, NN words)
| Line | Text | Over |
|---|---|---|
| 1 | <Hindi sentence> | shots 1–2 |
(6 lines, ~55 words; then **Emotion:**, **Meaning:**, **Citations:**)

## On-screen text (Hinglish, one per shot except the wow)
| Shot | Line | Citation |
|---|---|---|
| 1 (hook) | `Ek *shabd* yahan.` | 5-1-101 |

## Music (proposal)
## Cast and sheets needed
## Approvals
| Step | Date | Note |
|---|---|---|
```

## A new character sheet (checkpoint 1)
- **Prompt** (`characters/work/<name>.prompt.txt`), in this order:
  1. the frozen STYLE block from `BIBLE.md`;
  2. "Character turnaround model sheet of ONE character, in the exact drawing and painting style of the reference character sheet … but a completely different, new character …";
  3. "Plain warm light-grey studio background … Full body front, three-quarter, side profile and back views in a row, plus a large face close-up and three small face studies showing <three expressions>";
  4. the character block, colours described in words (no hex codes, or Seedream paints them as text);
  5. "No text, no labels, no letters, no numbers, no logos, no watermark."
- **Run:** `python3 "$HF_WEB" image --prompt @characters/work/<name>.prompt.txt --ref characters/jatayu_sheet.png --ratio 16:9 --out characters/work/<name>_t1.png`. Use a non-human style reference only, not the style frame, so no face is copied.
- **Fixes:** `delogo` stray small studies or marks; regenerate for big changes (edits rarely take).
- **After approval:**
  - Copy it to `characters/<name>_sheet.png`.
  - Add a table row to `BIBLE.md`: `| Name (EP NN) | **approved <date>** (\`<name>_sheet.png\`, how it was made) | \`<job id>\` |`. The job id is the `"job"` in hf_web's output line.
  - Add a block before `## Costume variants`: a `### NAME (EP NN; citations)` heading, then **one** line starting `> NAME: …`. `make_prompts` reads it with `block('NAME')`.

## A still prompt (via a copy of `scripts/make_prompts_example.py`)
- **Prompt:** STYLE block + the full-bleed line + the shot + the safety lines (nature only, no buildings; open ocean; one continuous scene) + one composition line for the empty text area ("the top third is … with nothing in it") + the character blocks + `No text, no letters, no logos, no watermark.` Keep it under 3,000 characters.
- **`.refs`:** `characters/style_frame.png` plus the sheet of each named character who is visible. Leave sheets out for tiny figures and silhouettes. For hands-only shots, keep the sheet: it carries the cuffs, fur and skin colour.
- **Re-running the generator** rewrites every prompt and resets the queue order. For a redo, write a new `<base>_v2.prompt.txt` (and copy the `.refs`) instead.

## A clip prompt (`epNN/clips/NNB.prompt.txt`, write it before the still is approved)
`<the motion, in one or two sentences>. <camera move>. <guards: body stretched out flat and legs still and together for flying (in the still too; never "like an arrow"); head and face still for elders; no wink; her mouth stays closed>. Keep every character exactly as in the start frame: faces, hair, skin, costume and ornaments. Silent. No text, no letters, no logos.`

## Stopping a stuck job
STOP files act after the current job. To abort one now: `ps aux | grep hf_web.py`, then `kill <pid>`. The Higgsfield job itself still finishes server-side, which is free in Unlimited. Delete its half-written output and `.failed` before restarting.
