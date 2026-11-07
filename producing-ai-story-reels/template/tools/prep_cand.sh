#!/bin/bash
# Keyframe candidate prep (decisions 10, 12): <base>_t1.png -> paint filter r6 (2K) -> night grade 0.30 if "night" and mean luma > 35 -> <base>_t1p.png.
# Usage (after source env.sh, from SERIES_DIR): bash tools/prep_cand.sh ep01/stills/work/03A_street [night]
set -eu
b=$1; in=${b}_t1.png; out=${b}_t1p.png
"$OVERLAY_PY" tools/paint_filter.py "$in" "$out" 6 0.02 >/dev/null
if [ "${2:-}" = night ]; then
  l=$(ffmpeg -v error -i "$out" -vf "scale=320:180,format=gray" -f rawvideo - | python3 -c "import sys;d=sys.stdin.buffer.read();print(round(sum(d)/len(d)))")
  [ "$l" -gt 35 ] && "$OVERLAY_PY" tools/night_grade.py "$out" "$out" 0.30 8 >/dev/null
fi
echo "$out"
