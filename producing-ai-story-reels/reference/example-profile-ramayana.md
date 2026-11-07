# Ramayana: The Road to Diwali: project profile (worked example)

The series this skill was built on. Its live copy is `09_ramayana_the_road_to_diwali/PROJECT_PROFILE.md`; the decision log is in its `EDIT_PLAN.md`.

| # | Field | Answer |
|---|---|---|
| 1 | Format | Video reels with VO, music and SFX |
| 2 | Count and batches | 20 episodes, made in pairs (two episodes through the checkpoints together) |
| 3 | Length | EP 01–06: 15 s (450 frames). EP 07 on: 30 s = 900 frames @ 30 fps: story 0–809, card transition 810–824, static card 825–899 |
| 4 | Aspect / resolution | 9:16, 1080×1920 (stills generated at 1440×2560 and scaled) |
| 5 | Platforms | Instagram Reels, YouTube Shorts, Facebook. Text boxes stay inside x 40–1040, y 240–1600 |
| 6 | Art style | 2D cel anime, soft cel shading, clean thin lines, hand-painted backgrounds; the look is carried by an approved style frame. Never name studios or films in prompts (IP filter) |
| 7 | Characters | Yes: style frame + one approved sheet per character, with frozen prompt blocks in `characters/BIBLE.md`; at most 3 named characters per shot |
| 8 | Content rules | Valmiki-true costumes (queens' cholis with elbow-length sleeves, Indian crowns); Ravana always ten-headed but framed sparingly; no gore; no deity-named objects in prompts |
| 9 | Voiceover | Hindi, ElevenLabs v4 "Maya" (preset `b0f766b7-…`, stability 0.35) through the Higgsfield connector; one take per episode, about 1.38 credits. The only paid step |
| 10 | Music | One licensed track (`ramayana_bg_music.mp3`); the section is chosen per episode by ear |
| 11 | SFX | Mixkit (direct downloads) |
| 12 | Loudness | −14 LUFS ±1, true peak ≤ −1 dBTP; a whole-mix `trim` when the VO runs almost unbroken |
| 13 | On-screen text | Hinglish (Roman letters), one short line per shot except the wow shot; Noto Serif 400, 60 px, ivory, one gold italic key word; word-by-word blur reveal; no scrim |
| 14 | Brand | Cosmolife wordmark top centre; fine print `EP NN/20 \| Title \| Valmiki Ramayana`; end card with the wordmark and cosmolife.in, static ≥ 2.5 s; always spelled "Cosmolife"; no cross-selling |
| 15 | Source of truth | Valmiki Ramayana (Kopalle / Rao on valmikiramayan.net, Shastri on wisdomlib, the GRETIL critical edition), cited kanda-sarga-verse; later traditions cut or voiced as tradition |
| 16 | Claims | No product claims in the reels |
| 17 | Image route | Higgsfield web, Seedream 4.5 Unlimited (free), 2K 9:16, through `tools/hf_web` in Arc |
| 18 | Video route | Kling 3.0 Unlimited on the web (free), 1080p 9:16, 5 s, sound off |
| 19 | Credit policy | Never credits for stills or clips; if Unlimited lapses, pause and tell the user; the first paid VO take is Claude's, any paid redo is the user's; warn before the balance falls below 100 |
| 20 | Machine | macOS, Arc, Claude Code with superpowers + remotion plugins, Remotion 4.0.539 (headless-shell wrapper), Node, ffmpeg, whisper-cpp |
| 21 | Checkpoints | Five per pair: script and sheets → stills (approved one by one on a live page) → VO → music → final |
| 22 | Review surface | The superpowers visual companion, with a live approval page |
| 23 | Agent policy | One agent only, no subagents or workflows (strict) |
| 24 | Deliverables | `9x16/ramayana_epNN_final_hindi.mp4`, a cover PNG per episode, and `post_copy.md` (Instagram + 5 hashtags, YouTube Shorts title and description, Facebook) |
| 25 | Schedule | Two episodes a day, 30 Oct to Diwali (8 Nov 2026) |
