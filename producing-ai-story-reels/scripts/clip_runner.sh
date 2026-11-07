#!/bin/bash
# Kling clips for every approved still of the pair ($EPS): epNN/stills/NNA_<name>.png with no clips/NNB.mp4 and no
# clips/NNB.failed. Shots listed in $TRANSFORM also need their approved NNA_<name>_end.png (start->end morph).
# Prompt: epNN/clips/NNB.prompt.txt (a shot without one waits). One clip at a time on the video tab. To redo a clip: rename clips/NNB.mp4 to
# _alt_NNB_vK.mp4 (and delete NNB.failed); the runner then makes NNB.mp4 again. Stops when $RUN_DIR/STOP_CLIPS exists. The morph list is re-read every loop
# from the file $RUN_DIR/TRANSFORM (one line, e.g. "ep13/08 ep14/06"); without the file, $TRANSFORM from env.sh is used.
# Run:  source "$SKILL_DIR/scripts/env.sh" && cd "$SERIES_DIR" && bash "$SKILL_DIR/scripts/clip_runner.sh" >> "$RUN_DIR/clips.log" 2>&1
set -u; cd "$SERIES_DIR"
while [ ! -f "$RUN_DIR/STOP_CLIPS" ]; do
  did=0; MORPH=$( [ -f "$RUN_DIR/TRANSFORM" ] && cat "$RUN_DIR/TRANSFORM" || echo "${TRANSFORM:-}")
  for ep in $EPS; do
    for s in $(ls $ep/stills/[0-9][0-9]A_*.png 2>/dev/null | grep -v '_end\.png$'); do
      n=$(basename "$s" | cut -c1-2); out=$ep/clips/${n}B.mp4
      [ -f "$out" ] && continue; [ -f "$ep/clips/${n}B.failed" ] && continue
      [ -f "$ep/clips/${n}B.prompt.txt" ] || continue   # write the clip prompt before (or right after) the still is approved
      args=()
      if [[ " $MORPH " == *" $ep/$n "* ]]; then e=${s%.png}_end.png; [ -f "$e" ] || continue; args=(--end "$e"); fi
      echo "== $out"
      r=$(python3 "$HF_WEB" video --start "$s" ${args[@]+"${args[@]}"} --prompt @"$ep/clips/${n}B.prompt.txt" --out "$out" 2>&1 | tail -1)
      echo "$r"; [ -f "$out" ] || echo "$r" > "$ep/clips/${n}B.failed"
      did=1; break 2
    done
  done
  [ $did = 0 ] && sleep 30
done
