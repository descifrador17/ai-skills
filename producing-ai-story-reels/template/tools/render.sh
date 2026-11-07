#!/bin/sh
# Render episodes with Remotion (headless shell via tools/chrome-headless-wrapper.sh, set in
# remotion/remotion.config.ts), mux each to the exact runtime and check every frame's overlays.
# Usage: render.sh 01 [02 ...] -> 9x16/ramayana_epNN_final_hindi.mp4. Also logged to tools/render.log.
P="$(cd "$(dirname "$0")/.." && pwd)"
[ $# -gt 0 ] || { echo "usage: render.sh NN [NN ...]"; exit 1; }
LOG="$P/tools/render.log"
PY="${OVERLAY_PY:-$P/../05_sacred_places_matter/tools/.venv/bin/python}"  # numpy + OpenCV (env OVERLAY_PY wins)
{
  echo "== $(date) | node $(node -v 2>&1) | episodes $*"
  status=0
  mkdir -p "$P/9x16"
  cd "$P/remotion" && for n in "$@"; do
    raw="$P/remotion/out/render_ep${n}.mp4"
    out="$P/9x16/ramayana_ep${n}_final_hindi.mp4"
    npx remotion render "RamayanaEp${n}" "$raw" --codec=h264 --crf=16 &&
    # AAC encoder padding adds ~19 ms; copy the video untouched and trim the audio to the video's exact runtime
    secs=$(ffprobe -v error -select_streams v -show_entries stream=duration -of csv=p=0 "$raw") &&
    ffmpeg -v error -y -i "$raw" -c:v copy -af "atrim=0:$secs" -c:a aac -b:a 320k -movflags +faststart "$out" &&
    "$PY" -I "$P/tools/check_overlays.py" "$out" && echo "Rendered: $out" || { status=1; break; }
  done
  echo "== exit $status"
} 2>&1 | tee "$LOG"
grep -q "^== exit 0$" "$LOG" && grep "^Rendered:" "$LOG" || { echo "Render failed - full log: $LOG"; exit 1; }
