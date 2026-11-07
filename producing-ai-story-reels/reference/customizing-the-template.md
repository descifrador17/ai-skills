# Starting a project from template/

`template/` is the working edit pipeline from the Ramayana series: the Remotion project (code only) and the shell/Python tools around it. Copy it into the new project, then change the spots below to match `PROJECT_PROFILE.md`. Everything else (the timing model, ducking, word reveal, real-width caption test, overlay check, VO splitting) is generic.

```bash
cp -R "$SKILL_DIR/template/tools" "$SKILL_DIR/template/remotion" "<project>/"
mkdir -p "<project>/remotion/public/fonts" && cp <your fonts> "<project>/remotion/public/fonts/"   # names as in src/fonts.ts (NotoSerif.ttf, NotoSerif-Italic.ttf, Geist.ttf), or edit fonts.ts and textWidth.ts
cd "<project>/remotion" && npm install && npx remotion browser ensure && npm test
```

- **Fonts first:** the caption width test reads the font files from `public/fonts/`. Without them, the whole timeline test file fails to load with `ENOENT … NotoSerif.ttf`. Later, `tools/prepare_media.sh` keeps `public/` filled.
- **Test before you change anything:** `npm test` must pass on the example data (115 tests, checked 2026-11-01). Then replace the example episodes and run it again.

| File | What to change | Profile field |
|---|---|---|
| `remotion/src/timeline.ts` | `FPS`, `WIDTH`, `HEIGHT`; `TRACK_SECONDS` (your music file's length); `WORDMARK`, `FINE`, `HOOK` sizes; `CARD`; `wordmarkH` (your wordmark's pixel ratio); `timing()` (story / card frame split, runtime per episode) | 3, 4, 13, 14 |
| `remotion/src/episodes.ts` | Replace the example episodes with yours (keep one as a reference until your first episode passes the tests) | per batch |
| `remotion/src/Root.tsx` | The composition id pattern (`RamayanaEp…`) | 24 |
| `remotion/src/Frame.tsx` | The fine-print text (`EP NN/20 \| title \| Valmiki Ramayana`), wordmark position | 14 |
| `remotion/src/Card.tsx` | The end card's URL line (`cosmolife.in`) and layout | 14 |
| `remotion/src/fonts.ts`, `Cue.tsx` | Font families, weights, colours (ivory `#FFFBF6`, gold `#F3C77B`), text shadow | 13 |
| `remotion/src/textWidth.ts` | The font files measured for the caption width test (regular + italic) | 13 |
| `remotion/src/Thread.tsx` | The series' "golden thread" motif: keep, restyle or delete (and drop `thread` from the episode data) | 6 |
| `tools/prepare_media.sh` | `FONTS=` (your font folder), the wordmark and music copy lines, output size | 4, 13, 14 |
| `tools/render.sh` | The output name (`9x16/ramayana_epNN_final_hindi.mp4`), composition id, `OVERLAY_PY` default | 24 |
| `tools/check_overlays.py` | The card text it looks for (`cosmolife.in`) and the file-name pattern (`ramayana_ep(\d+)`) | 14, 24 |
| `tools/split_vo.sh`, `process_vo.sh` | One `split` line per episode (pause times); loudness targets | 9, 12 |
| `tools/music_preview.py` | The music file path (`public/music/bed.mp3`) | 10 |
| `remotion/remotion.config.ts` | Keep `setBrowserExecutable` → `tools/chrome-headless-wrapper.sh` on macOS (the default headless shell crashes on some Macs) | 20 |

Pin the Remotion version that `package.json` names (4.0.539). Upgrade only on purpose, and re-run the tests and a full render.
