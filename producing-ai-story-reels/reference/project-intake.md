# Project intake: ask before any setup or work

Run this at the start of every new project (and when an existing project has no `PROJECT_PROFILE.md`).

**How to ask:**
- Ask **one question per message**, in this order. Use AskUserQuestion with 2–4 options when sensible defaults exist, and leave "Other" open.
- Never answer a question for the user, never skip one, and never assume from an earlier project.
- If the user says "you decide", propose one concrete answer, mark it **my call** in the profile, and still show it to them.
- Write each answer into `<project>/PROJECT_PROFILE.md` (template below) as it arrives, with the date. Record later changes there too.

When every field is filled, read the profile back in one message and get a yes. Then go to setup (`SKILL.md` §2).

## The questions

### A. What is being made
1. **Format:** video reels with sound, silent video, still posts, a carousel, or a mix?
2. **Count and batches:** how many pieces in all, and how many per batch? A Ramayana "pair" is two episodes moving through the checkpoints together.
3. **Length** (video only): exact runtime per piece in seconds, and whether it may change later. Ask for a fixed frame count at the chosen fps (e.g. 30 s = 900 frames at 30 fps).
4. **Aspect ratio and resolution:** 9:16 1080×1920, 1:1 1080×1080, 4:5 1080×1350, 16:9 1920×1080, or several? If several, which one is the master?
5. **Platforms and safe zones:** Instagram, YouTube Shorts, Facebook, TikTok? Each one's UI covers part of the frame. Record the text-safe box, e.g. Instagram 9:16 keeps text out of the top 220 px, bottom 380 px and right 140 px.

### B. Look
6. **Art style:** for example 2D cel anime, painted watercolour, photoreal, 3D, flat vector or paper-cut. Ask for 1–3 references (files or links) and **what to borrow from each**. Also ask what to avoid.
7. **Character consistency:** are there recurring characters who must look identical in every shot? If yes, plan a style frame plus one character sheet each, approved before any still.
8. **Period, setting and content rules:** a historical or mythological period, costume rules, modesty, and anything that must never appear (gore, deity likeness, brand marks).

### C. Sound (skip for silent formats)
9. **Voiceover:** yes or no? Language(s), voice (provider, voice ID or preset, settings such as stability), and who pays. Paid VO counts against credits; record the per-take cost.
10. **Music:** the licensed source (a track file, a library, none), and whether Content ID matters.
11. **Sound effects:** yes or no, and the source (Mixkit, Pixabay, own library).
12. **Loudness target:** the default is −14 LUFS integrated ±1 and true peak ≤ −1 dBTP, with voice about 12 dB over the music.

### D. Words on screen
13. **On-screen text:** none, captions, or key phrases? The language and script (e.g. Hinglish in Roman letters), fonts (files on disk), colours, size, and animation style.
14. **Brand frame:** a wordmark file, fine print, an end card (CTA, URL), and how long the card holds. Spelling rules for the brand name.

### E. Truth and claims
15. **Source of truth:** a scripture, book, research brief or product facts? Name the sources to cite, and what to do with later or popular versions (cut them, or voice them as tradition).
16. **Claims policy:** no prices, promises or medical claims unless the user confirms them; how to treat real places and people.

### F. Generation setup
17. **Image model and route:** for example Higgsfield web Unlimited (free, through `tools/hf_web` in Arc), the Higgsfield connector (paid credits), or a local model (ComfyUI or other: name, checkpoint and where it runs). Record the default model and resolution, and which models count as free.
18. **Video model and route:** for example Kling 3.0 Unlimited on the web, a paid connector model, a local model, or none (stills only). Record the clip length, resolution and whether native audio stays off.
19. **Credit policy:** the budget, who approves paid redos, the balance floor that triggers a warning, and what to do when Unlimited is unavailable (default: pause and ask, never pay).
20. **Machine and tools:** macOS or other; Arc available (hf_web is macOS + Arc only)? Is the **Remotion plugin installed** in Claude Code (`/plugin install remotion@remotion`), with Node 18+, ffmpeg and whisper available? Check them yourself, report, and only ask about what's missing.

### G. Process
21. **Checkpoints:** which steps the user wants to approve. The default is five per batch: 1 script and sheets → 2 stills → 3 VO → 4 music → 5 final.
22. **Review surface:** the live review page (superpowers visual companion), files in a folder, or chat only.
23. **Agent policy:** may Claude use subagents or parallel agents? Some users forbid them; obey strictly.
24. **Deliverables:** file names, folders (e.g. `9x16/<name>_epNN_final_<lang>.mp4`), covers, post copy (caption, hashtags, titles) and languages.
25. **Schedule:** deadlines and posting dates, which decide the batch order.
26. **Anything else that would make you wince if I got it wrong?**

## PROJECT_PROFILE.md template

```markdown
# <Project name>: project profile

Filled at intake <date>. User answers are marked "user"; my proposals the user accepted are marked "my call".

| # | Field | Answer | Source and date |
|---|---|---|---|
| 1 | Format | | |
| 2 | Count and batches | | |
| 3 | Length (frames @ fps) | | |
| 4 | Aspect ratio / resolution (master) | | |
| 5 | Platforms and safe zones | | |
| 6 | Art style + references (what to borrow) + avoid | | |
| 7 | Recurring characters (sheets needed) | | |
| 8 | Period, setting, content rules | | |
| 9 | Voiceover (language, voice, settings, cost) | | |
| 10 | Music source (Content ID?) | | |
| 11 | Sound effects source | | |
| 12 | Loudness target | | |
| 13 | On-screen text (language, fonts, style) | | |
| 14 | Brand frame / end card / spelling | | |
| 15 | Source of truth and citation rule | | |
| 16 | Claims policy | | |
| 17 | Image model + route (free?) | | |
| 18 | Video model + route (free?) | | |
| 19 | Credit policy | | |
| 20 | Machine, Arc, Remotion plugin, tools (checked) | | |
| 21 | Checkpoints | | |
| 22 | Review surface | | |
| 23 | Agent policy | | |
| 24 | Deliverables and naming | | |
| 25 | Schedule | | |
| 26 | Other | | |

## Changes after intake
- <date>: <field> changed from … to … (user: "…")
```

A filled example is in `example-profile-ramayana.md`.
