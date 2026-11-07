---
name: producing-ai-story-reels
description: Use when starting, continuing or reviewing a series of AI-made story videos or posts (reels, shorts, carousels) built from generated stills and clips, a voiceover, music and a Remotion edit; when a new project needs its art style, format, length, aspect ratio or generation models decided; when setting up a new machine or person for this pipeline; when a film must feel like one continuous take with hidden cuts, or a reference video's look, camera moves and transitions are to be studied or recreated; or when continuing the "Ramayana: The Road to Diwali" series.
---
# Producing AI story reels

## Overview

A series of short pieces made in **batches**: script, then stills, then clips, then voiceover, then music, then a Remotion edit. The user approves each step through **checkpoints**. Stills and clips are generated free where the account allows it; Higgsfield Unlimited is driven through the user's Arc browser by `tools/hf_web`. Paid generation happens only where the project profile says so.

**Nothing starts without a project profile.** Every choice that differs between projects lives in `<project>/PROJECT_PROFILE.md`, filled at intake:
- art style, format and sound;
- length and aspect ratio;
- models and credit policy;
- checkpoints and agent policy.

The project's own `CLAUDE.md`, `EDIT_PLAN.md` (decision log) and ledger override this skill wherever they differ.

## 1. Project intake (first, every new project)

If `PROJECT_PROFILE.md` is missing or has blank fields:

1. Run `reference/project-intake.md`. It asks **one question per message**, never skips one, and never assumes. The questions cover:
   - format (video with sound, silent video, stills or a carousel);
   - count and batch size, and length in frames;
   - aspect ratio and resolution, and platform safe zones;
   - **art style** and references; recurring characters;
   - voiceover, music, SFX and loudness;
   - on-screen text and brand frame;
   - source of truth and claims;
   - **image and video model and route** (Higgsfield web Unlimited, a paid connector, or a local model), and the credit policy;
   - **machine and tools**, including whether the **Remotion plugin** is installed;
   - checkpoints, review surface and agent policy;
   - deliverables and schedule.
2. Write each answer into `PROJECT_PROFILE.md` as it comes. Read the whole profile back and get a yes.
3. Create the project docs from the profile:
   - `CLAUDE.md`: the standing rules;
   - `EDIT_PLAN.md`: the spec and a numbered, dated decision log;
   - `BUILD_PLAN.md`: one task per batch;
   - `characters/BIBLE.md`: if there are recurring characters;
   - the ledger: `.superpowers/sdd/BUILD_PLAN/progress.md`.

The worked example is `reference/example-profile-ramayana.md`.

**No setup, generation or scripting before the profile is confirmed.** If the user wants a creative concept first, run `creative-director` / `superpowers:brainstorming` inside the profile's limits.

## 2. Setup (once per machine or person)

Do every step that the profile's routes need, then run the preflight until it passes.

1. **Accounts and apps** (from the project owner):
   - the shared content folder;
   - a Higgsfield login with an active Unlimited plan, if the profile uses the web route;
   - the claude.ai Higgsfield connector, if any step is paid;
   - the `creative-director` skill;
   - Homebrew, Arc (arc.net) and Claude Code.
2. **Tools (macOS):**
   - `brew install ffmpeg node whisper-cpp python`
   - The whisper model: `ggml-large-v3-turbo.bin` from huggingface.co/ggerganov/whisper.cpp. Set `WHISPER_MODEL`.
   - An overlay-check venv with numpy + opencv-python. Set `OVERLAY_PY`.
3. **Claude Code:**
   - `/plugin install superpowers@claude-plugins-official`;
   - `/plugin marketplace add remotion-dev/claude-code-plugin` then `/plugin install remotion@remotion` (check `/plugin` lists it);
   - copy `creative-director` to `~/.claude/skills/`;
   - **merge** (don't overwrite) the `permissions` block of `settings.example.json` into `<content>/.claude/settings.json`. It denies every paid Higgsfield generator, and asks before paid audio.
4. **Edit pipeline:** copy `template/` into the project and adapt it as `reference/customizing-the-template.md` says (fps, size, brand card, fonts, file names). `node --test` must pass.
5. **Generation route:**
   - **Higgsfield web (free Unlimited):**
     - open `higgsfield.ai/ai/image` and `/ai/video` in two Arc tabs and log in;
     - turn on Arc → View → Developer → *Allow JavaScript from Apple Events*;
     - run `python3 <content>/tools/hf_web/hf_web.py check` and click **Allow** when macOS asks.
   - **A local model:** keep the runners, but replace their `python3 "$HF_WEB" image|video …` line with your local command. It must write the same `<base>_t1.png` or `NNB.mp4`, and print one JSON line with `"out"` on success. Note it in the profile.
   - **A paid connector model:** generate only with explicit approval of each batch, and report the cost (profile field 19).
6. **Review page:**
   - Start the superpowers visual companion: `bash <superpowers>/skills/brainstorming/scripts/start-server.sh --project-dir <project> --open`.
   - Keep the URL with its `?key=`, and set `COMPANION_DIR` to `<project>/.superpowers/brainstorm/<id>`.
   - It stops after 4 h idle ("failed to load page"; `state/server-stopped` says `idle timeout`). Restart it with the same command: the URL and key stay the same, but the session folder changes. Update `COMPANION_DIR`, copy the old `content/` media across, run `live.py set` once to rebuild the page, and restart the sync loop (it keeps the old folder).
7. **Configure:**
   - `cp scripts/env.example.sh scripts/env.sh` and fill it in (`RATIO` and `MODEL` set the stills runner's aspect and model). Two projects on one machine: keep a project-local `env.sh` and source that instead.
   - Claude Code's Bash keeps no environment, so **every command starts with** `source "$SKILL_DIR/scripts/env.sh" && cd "$SERIES_DIR" && …`.
8. **Verify:** `bash "$SKILL_DIR/scripts/preflight.sh"`. Every line must read OK; each FIX line names its fix. Confirm the connector's `balance` by hand if anything is paid.

## 3. Rules that never bend

- **Checkpoints:** never start checkpoint N+1 before N is approved. Log each approval with its date and the user's words.
- **Money:**
  - Follow the profile's credit policy exactly.
  - On the free route, never pay to go faster: a 10–15 min queue is normal.
  - If Unlimited lapses, pause everything (`unlimited_guard.sh` does this) and tell the user.
  - A Higgsfield human check: the user ticks it. Never work around it.
- **Source of truth:** cite it for every story beat (profile field 15). Popular versions are cut, or voiced as such.
- **Consistency:** every still passes the style frame plus the sheet of each named, clearly visible character. Check each still against the bible before the user sees it.
- **No text, letters or logos in AI media.** All words are set in Remotion.
- **Reference videos are studied, never fed:** no frame, crop or still of a reference goes to a generator or into the edit. Its look is a checklist read off its frames, and every candidate is judged side by side with a reference frame before the user sees it (`reference/shot-grammar.md` §1).
- **Agent policy:** obey profile field 23. If it says one agent, never use the Agent tool, workflows or parallel agents.
- **Questions:** ask them one at a time, never skip them. Record user decisions in `EDIT_PLAN.md` and your own calls as rulings.

## 4. The pipeline, per batch

Skip any step the profile rules out (no VO, no music, stills only).

1. **Research** (yourself, unless the agent policy allows helpers): write `epNN/research.md` from the sources, in the format in `reference/templates.md`.
2. **Script and new sheets (checkpoint 1):**
   - Write `epNN/script.md` in the format in `reference/templates.md`; the tools parse its tables.
   - **Continuous film or reference recreation:** plan every join (chain, shared keyframe, end-frame reset, continuous start→end move, passer-by cut, the one hard cut) as a row with its frames and how it is built, using `reference/shot-grammar.md`, before any keyframe.
   - Make sheets for new characters.
   - Present the scripts and sheets together on one page.
3. **Stills and clips (checkpoint 2, live page):**
   - Copy `scripts/make_prompts_example.py` and fill in the shots. Write each `clips/NNB.prompt.txt` at the same time.
   - **Start all background jobs now (§5)**, the clip runner included.
   - Check each still (`reference/generation-traps.md`), then put it up: `live.py set epNN/MM --cand … --status review --note …`. If the look needs brush edges or night, run `tools/prep_cand.sh <base> [night]` first and put up the `_t1p.png`.
   - A chained shot's still is the raw frame N of the previous clip (`select='eq(n\,N)'`); its end frame, if any, is an approved fresh keyframe.
   - The user's Approve copies the still into `epNN/stills/`, and the clip starts automatically.
   - Check each clip with `strip.sh` and pick a window that ends before late morphs.
   - A still refused as a start frame (422): make a reframed `_v2`, move the approved still aside, delete `NNB.failed`, and ask the user to approve again.
4. **Voiceover (checkpoint 3):**
   - One take per episode, read as one passage.
   - **Voice:** reuse a voice the user already approved on an earlier series (Ramayana's "Maya", preset `b0f766b7-8703-4bd1-b973-f857c36837b6`). Otherwise, audition 2–3 voice ids on one short line (preflight each with `get_cost`; each is paid) and let the user pick by ear.
   - A TTS route with no style settings (the Higgsfield ElevenLabs route takes only a voice id and text) gets its energy from the text. Open on a hook question ("क्या आप जानते हैं? …"), use "!" instead of "…" pauses, and turn a flat question into a real one ("तीसरा पग कहाँ?"). Whisper spells ौ as ो, so have the user listen at those words.
   - Split at the pauses (`tools/split_vo.sh`) and process each line (`tools/process_vo.sh`).
   - Check every word with whisper. Never time-stretch.
5. **Music (checkpoint 4):** preview 2–3 sections under the VO. The user picks by ear.
   - **Choose sections by measuring for breaks.** Scan every window of the runtime for the largest 0.5 s level step, and keep windows with only small upward accents. Never pick by a loudness arc: a mid-window drop is the track's hard stop or silent gap, and the user heard "abrupt breaks".
   - Mix with `tools/mix_bed.py` (any length or fps): speech spans merged across gaps under 1.4 s, a −9 dB duck on 0.6 s eased ramps, the end fade covering the SFX, loudnorm −14 LUFS. Never use a fast sidechain compressor, which pumped ±10 dB between words.
   - Check the bed alone, without the VO, for steps. In the full mix, speech hides them.
   - `tools/music_preview.py` is Ramayana-specific (15/30 s at 30 fps).
6. **SFX:** cut licensed effects into `epNN/sfx/`, and log their sources.
7. **Edit and final (checkpoint 5):**
   - Add the episode to `remotion/src/episodes.ts`, with each caption's `empty` box checked on real frames. `node --test` must pass.
   - Continuous film: use `template/film/` (`timeline.ts` + its test). Paint-filter every clip into `public/` (`tools/paint_clip.py`), then tile frames N−2…N+2 at every join of a half-scale rough cut.
   - Run `tools/prepare_media.sh`, then `tools/render.sh`.
   - Check:
     - frames at every cue and cut, so no caption touches a figure;
     - loudness and peak against the profile;
     - the overlay check.
   - Render covers and write the post copy.
8. **Close:**
   - Tick the task, and log approvals and credits.
   - Ask (multi-select) which lessons should become standing rules, and write the chosen ones into the project `CLAUDE.md`.

## 5. Background jobs and the review page

Start all five at step 3, each as its own background command:

```bash
E='source "<skill>/scripts/env.sh" && cd "$SERIES_DIR"'
eval "$E" && bash "$SKILL_DIR/scripts/image_runner.sh"    >> "$RUN_DIR/images.log" 2>&1   # stills, oldest prompt first (touch -t 200001010000 <prompt> runs it next)
eval "$E" && bash "$SKILL_DIR/scripts/clip_runner.sh"     >> "$RUN_DIR/clips.log"  2>&1   # clips for approved stills
eval "$E" && bash "$SKILL_DIR/scripts/unlimited_guard.sh" >> "$RUN_DIR/guard.log"  2>&1   # auto-pause on Unlimited off / human check
eval "$E" && while [ ! -f "$RUN_DIR/STOP_SYNC" ]; do python3 "$SKILL_DIR/scripts/live.py" sync >> "$RUN_DIR/sync.log" 2>&1; sleep 10; done   # the user's clicks (log them: the watch reads sync.log)
eval "$E" && tail -n0 -f "$RUN_DIR/images.log" | grep -E --line-buffered '"out"|rror|failed|Restricted|turnstile'   # watch: ONE tail per log (a multi-file tail -F missed events on macOS); same for clips.log, and for sync.log with 'APPROVED|UNDONE|REFUSED|rror' (a REFUSED approval once sat unseen for 1.5 h)
eval "$E" && touch "$RUN_DIR/STOP_IMAGES" "$RUN_DIR/STOP_CLIPS" "$RUN_DIR/STOP_SYNC"   # stop each after its current job
```

- **One page at a time:** the server shows only the newest `.html`. Put other checkpoints (VO, music, finals) in `content/_extra.part`, and `live.py` shows them above the stills.
- **Media:** files served by `/files/` sit at the top of `content/`.
- **Don't edit a running runner script.** Stop it, edit, restart.
- **Track every job:**
  - Run one-off generations as tracked background commands. A job launched with `&` finished an hour before anyone noticed.
  - A Monitor expires after 30 min: re-arm it, then read the log tails for events missed in the gap.
- **Live-page names:** a candidate's file name must start with that shot's own number (`NNA_name…`), because the page copies it to `stills/NNA_name.png`.
  - A shared frame needs one copy per shot.
  - Never `set --status approved` by hand; use `approve`.
- **Replacing an approved still** (the page REFUSES while its clip exists):
  1. Move the old still out of `stills/`. Otherwise the clip runner animates the first `NNA_*.png` it finds, which may be the old one.
  2. Rename the old clip to `_alt_NNB_vK.mp4` and delete `NNB.failed`.
  3. Run `live.py approve`.
  4. If the still was a shared keyframe, also remake clip N−1, whose end frame it was. Replace its `stills/NN-1A_<name>_end.png` with the new still, rename clip N−1 to `_alt_`, and the runner remakes it.

## Quick reference

| Path | Does |
|---|---|
| `reference/project-intake.md` | The intake questions and the `PROJECT_PROFILE.md` template |
| `reference/customizing-the-template.md` | Which lines of `template/` to change for a new project |
| `reference/templates.md` | research.md, script.md, sheet, still- and clip-prompt formats; glossary |
| `reference/generation-traps.md` | Seedream, Kling, Higgsfield filter and Arc traps, with fixes; words that get painted; matching a reference look |
| `reference/shot-grammar.md` | Studying a reference; grammar rules; the join catalogue; Kling camera-move recipes; timing and join checks |
| `scripts/preflight.sh` | Checks tools, files, Remotion, whisper, Arc tabs, Unlimited, the server |
| `scripts/image_runner.sh`, `clip_runner.sh` | Free stills and clips, one at a time, with STOP files |
| `scripts/unlimited_guard.sh` | Stops the runners if Unlimited goes off or a human check appears |
| `scripts/live.py` | The live approval page (`set`, `sync`, `approve`) |
| `scripts/strip.sh`, `kling_md.py` | Clip frame strips; the clip record |
| `template/` | The Remotion project and edit tools to copy |
| `template/film/` | Continuous-film edit: `timeline.ts` (windows, rates, passer-by cuts) + test, `Film.tsx` (clips + sharp passer layers) |
| `template/tools/paint_filter.py`, `paint_clip.py`, `night_grade.py`, `make_occluder.py`, `prep_cand.sh`, `mix_bed.py` | Brush-edge filter on stills and clips; night grade; occluder cutout; candidate prep; VO, music bed and SFX mix with smooth ducking |

## Common mistakes

| Mistake | Fix |
|---|---|
| Starting work before the profile is confirmed | Run the intake; every later choice depends on it |
| Asking several intake questions at once, or assuming answers | One per message; the user's words go in the profile |
| Starting the stills runner without the clip runner | Start all five jobs at step 3 |
| A flying figure with bent legs | Kling animates running. Ask for a straight, flat body with legs together (never "like an arrow") |
| Outdoor prompts without "nature only, no buildings" | The style frame leaks palaces |
| "Tiny" / "cat-sized" characters | Childlike figures get filtered; keep them adult and small by scale |
| Trusting tests for caption placement | Check real frames at every cue |
| Turning down only the music when a render is too loud | Trim the whole mix (`trim` on the episode) |
| Commands without `source env.sh` | Each Bash call starts fresh |
| Naming the art style from memory | Read a checklist off reference frames; judge candidates side by side with them |
| A noun in style or light words ("rough paper", "bulb light", "no flowers") | It gets painted. Describe marks, direction and colour; leave unwanted things unnamed |
| Hiding a change of place with a dissolve or a dip to black | A continuous start→end move, a passer-by cut or an end-frame reset (`shot-grammar.md` §3) |
| Chaining clip after clip | One chained link, then an identity reset (an end frame made from the sheets) |
| Asking Kling or a green-screen still for the occluder, or using a dark blurred lens wipe | A sharp passer-by in the edit, painted on flat LIGHT grey and cut out with `make_occluder.py --full` (`template/film`, `shot-grammar.md` §3). The dark wipe was rejected |
| Quoting a runtime from one section, or planning reference beats shorter than 5 s as start→end clips | Sum every shot's pinned length first (`shot-grammar.md` §5). Show 1× / 1.25× / reference-speed previews of a real rough cut |
| Judging a join in a moving shot by its difference to the target frame | Compare the step across the join with the neighbouring frame steps (§6) |
| A keyframe that is right left-to-right but wrong in depth | Check who is nearer the camera, and whether the next shot can follow (`generation-traps.md`, "Checking a still") |
| Re-rolling Seedream for direction or framing, or stacking edits | Mirror or crop the raw still. When edits break one element, composite it from your own approved image |
| Extras who share a named character's face | Describe extras explicitly; drop his sheet when he is small |
| Hard cuts or match-cuts between independent clips when the user wants smooth transitions | A keyframe chain: each clip runs from one keyframe to the next and carries the transformation (`shot-grammar.md` §3) |
| A transition clip generated from a frame where the outgoing shot is still moving | Join only at rest frames; check global motion (phase correlation) as well as pixels (§6) |
| Picking a music section by its loudness arc, or ducking with a fast compressor | Measure windows for level breaks; duck with `mix_bed.py` eased automation; check the bed alone |
| A monitor that greps only APPROVED and errors | Include REFUSED; a refused approval stalls everything silently |
| Feet in a side-on walk | Crop the still to mid-thigh before Kling; prompt the background sliding past |
| A chained clip cut at `srcOut = N+1` | The next clip's frame 0 is frame N; end the window at N |
