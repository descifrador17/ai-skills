#!/bin/bash
# Checks everything the pipeline needs BEFORE any work starts. Prints one line per check: OK / FIX (with the fix).
# Run:  source "<skill>/scripts/env.sh" && bash "$SKILL_DIR/scripts/preflight.sh"      (exit code = number of FIX lines)
set -u; fails=0
ok(){ printf '  OK   %s\n' "$1"; }
fix(){ printf '  FIX  %s\n       -> %s\n' "$1" "$2"; fails=$((fails+1)); }
have(){ command -v "$1" >/dev/null 2>&1; }

echo "== Environment (scripts/env.sh)"
for v in SKILL_DIR CONTENT_DIR SERIES_DIR HF_WEB RUN_DIR EPS; do
  [ -n "${!v:-}" ] && ok "$v=${!v}" || fix "$v is empty" "copy scripts/env.example.sh to scripts/env.sh, fill it in, then: source \"<skill>/scripts/env.sh\""
done

echo "== Command-line tools"
[ "$(uname)" = Darwin ] && ok "macOS" || fix "not macOS" "hf_web drives Arc through AppleScript (osascript) and uses sips: macOS only"
for c in python3 node npx ffmpeg ffprobe curl osascript sips whisper-cli; do
  have $c && ok "$c" || case $c in
    whisper-cli) fix "whisper-cli missing" "brew install whisper-cpp (VO word check)";;
    node|npx)    fix "$c missing" "install Node 18+ (brew install node)";;
    ffmpeg|ffprobe) fix "$c missing" "brew install ffmpeg";;
    *)           fix "$c missing" "install $c";;
  esac
done
have node && { v=$(node -p 'process.versions.node.split(".")[0]'); [ "$v" -ge 18 ] && ok "node $v >= 18" || fix "node $v" "Node 18 or newer"; }

echo "== Project files"
CONTENT_DIR=${CONTENT_DIR:-/missing}; SERIES_DIR=${SERIES_DIR:-/missing}; HF_WEB=${HF_WEB:-/missing}
for f in "$HF_WEB" "$SERIES_DIR/PROJECT_PROFILE.md" "$SERIES_DIR/CLAUDE.md" "$SERIES_DIR/EDIT_PLAN.md" \
         "$SERIES_DIR/tools/prepare_media.sh" "$SERIES_DIR/tools/render.sh" "$SERIES_DIR/tools/split_vo.sh" "$SERIES_DIR/tools/process_vo.sh" \
         "$SERIES_DIR/tools/music_preview.py" "$SERIES_DIR/tools/check_overlays.py" "$SERIES_DIR/tools/chrome-headless-wrapper.sh"; do
  case $f in
    */PROJECT_PROFILE.md)     how="run the project intake first (reference/project-intake.md)";;
    */CLAUDE.md|*/EDIT_PLAN.md) how="write it from the confirmed profile (SKILL.md section 1, step 3)";;
    */tools/*)                how="cp -R "$SKILL_DIR/template/tools" "$SERIES_DIR/", then adapt it (reference/customizing-the-template.md)";;
    *)                        how="get it from the shared content folder";;
  esac
  [ -e "$f" ] && ok "${f#$CONTENT_DIR/}" || fix "missing ${f#$CONTENT_DIR/}" "$how"
done
for f in ${REQUIRED_FILES:-}; do
  case $f in /*) p=$f;; *) p="$SERIES_DIR/$f";; esac
  [ -e "$p" ] && ok "$f" || fix "missing $f" "a file the profile needs (REQUIRED_FILES in env.sh): get it from the project owner"
done
FONTS=$(grep -m1 '^FONTS=' "$SERIES_DIR/tools/prepare_media.sh" 2>/dev/null | sed -E 's/^FONTS=//; s/^"//; s/"$//')
ls "$FONTS"/*.ttf >/dev/null 2>&1 && ok "fonts in $FONTS" || fix "no .ttf fonts in '$FONTS'" "put the profile's fonts there, or edit FONTS= in tools/prepare_media.sh"

echo "== Remotion"
if [ -d "$SERIES_DIR/remotion/node_modules" ]; then ok "node_modules installed"; else fix "remotion/node_modules missing" "cd \"$SERIES_DIR/remotion\" && npm install (copy template/remotion first; Remotion pinned in package.json)"; fi
ls "$SERIES_DIR"/remotion/node_modules/.remotion/chrome-headless-shell/*/chrome-headless-shell-*/chrome-headless-shell >/dev/null 2>&1 \
  && ok "chrome-headless-shell present" || fix "chrome-headless-shell missing" "cd remotion && npx remotion browser ensure (render.sh runs it through tools/chrome-headless-wrapper.sh)"
( cd "$SERIES_DIR/remotion" 2>/dev/null && node --test >/dev/null 2>&1 ) && ok "remotion tests pass (node --test)" || fix "remotion tests fail" "cd remotion && npm test   (ENOENT on a .ttf = fonts missing from remotion/public/fonts; otherwise read the failing test)"

echo "== Audio checks"
[ -f "${WHISPER_MODEL:-/nonexistent}" ] && ok "whisper model" || fix "WHISPER_MODEL not found" "download ggml-large-v3-turbo.bin (whisper.cpp models) and set WHISPER_MODEL"
"${OVERLAY_PY:-/missing}" -c 'import numpy, cv2' 2>/dev/null && ok "overlay-check Python has numpy + OpenCV" \
  || fix "OVERLAY_PY lacks numpy/cv2" "python3 -m venv \"$CONTENT_DIR/.venv-overlay\" && \"$CONTENT_DIR/.venv-overlay/bin/pip\" install numpy opencv-python, then set OVERLAY_PY in env.sh (tools/render.sh reads it)"

echo "== Higgsfield in Arc (free Unlimited generation)"
if pgrep -xq Arc; then ok "Arc is running"; else fix "Arc is not running" "open Arc"; fi
chk=$(python3 "$HF_WEB" check 2>&1)
echo "$chk" | grep -q '^image .*"logged_in": true' && ok "image tab open and logged in" || fix "image tab" "open https://higgsfield.ai/ai/image in Arc and log in; on the very first run macOS asks to let your terminal/Claude control Arc: click Allow  ($(echo "$chk" | head -1 | cut -c1-100))"
echo "$chk" | grep -q '^video .*"logged_in": true' && ok "video tab open and logged in" || fix "video tab" "open https://higgsfield.ai/ai/video in Arc and log in"
echo "$chk" | grep -q 'UNLIMITED\|Generate Unlimited' && ok "Unlimited mode available" || fix "Unlimited not shown" "the account needs an active Unlimited plan for the free web route; never fall back to credits without the user"
echo "$chk" | grep -qi 'turned off\|not allowed\|-1743' && fix "Arc refuses AppleScript JavaScript" "Arc: View > Developer > Allow JavaScript from Apple Events; System Settings > Privacy & Security > Automation: allow your terminal / Claude to control Arc" || true

echo "== Review page (companion server)"
if [ -n "${COMPANION_DIR:-}" ] && [ -f "$COMPANION_DIR/state/server-info" ] && [ ! -f "$COMPANION_DIR/state/server-stopped" ]; then
  ok "server alive: $(python3 -c "import json;print(json.load(open('$COMPANION_DIR/state/server-info')).get('url','?'))" 2>/dev/null)"
else fix "companion server not running" "start it (superpowers brainstorming visual companion): bash <superpowers>/skills/brainstorming/scripts/start-server.sh --project-dir \"$SERIES_DIR\" --open, then set COMPANION_DIR"; fi

echo "== Not checkable from the shell (confirm by hand)"
echo "  -    the Remotion plugin is installed in Claude Code (/plugin lists remotion@remotion)"
echo "  -    if any step is paid (PROJECT_PROFILE field 19): the claude.ai Higgsfield connector is connected and its balance tool works"
echo "  -    the credit policy in PROJECT_PROFILE.md is understood: what is paid, the budget, the balance floor"
echo; [ $fails = 0 ] && echo "PREFLIGHT PASSED" || echo "PREFLIGHT: $fails thing(s) to fix before starting"
exit $fails
