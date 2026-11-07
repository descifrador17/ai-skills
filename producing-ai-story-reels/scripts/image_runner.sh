#!/bin/bash
# Stills for the pair in $EPS: every epNN/stills/work/*.prompt.txt (with its .refs) that has no <base>_t1.png and no
# <base>.failed, oldest prompt file first (to run a prompt next: touch -t 200001010000 <prompt>). One job at a time on the image tab.
# Aspect and model: $RATIO and $MODEL from env.sh (unset = hf_web defaults 9:16, Seedream 4.5). Output <base>_t1.png; a failure writes <base>.failed with the error. Stops when $RUN_DIR/STOP_IMAGES exists.
# Run:  source "$SKILL_DIR/scripts/env.sh" && cd "$SERIES_DIR" && bash "$SKILL_DIR/scripts/image_runner.sh" >> "$RUN_DIR/images.log" 2>&1
set -u; cd "$SERIES_DIR"
while [ ! -f "$RUN_DIR/STOP_IMAGES" ]; do
  globs=""; for ep in $EPS; do globs="$globs $ep/stills/work/*.prompt.txt"; done
  next=$(ls -tr $globs 2>/dev/null | while read p; do b=${p%.prompt.txt}; [ -f "${b}_t1.png" ] || [ -f "$b.failed" ] || { echo "$p"; break; }; done)
  if [ -z "$next" ]; then sleep 20; continue; fi
  b=${next%.prompt.txt}; refs=()
  [ -s "$b.refs" ] || { echo "== $b"; echo "missing $b.refs (style frame + character sheets)"; echo "missing refs" > "$b.failed"; continue; }
  while read -r r; do [ -n "$r" ] && refs+=(--ref "$r"); done < "$b.refs"
  echo "== $b"
  out=$(python3 "$HF_WEB" image --prompt @"$next" ${MODEL:+--model "$MODEL"} ${RATIO:+--ratio "$RATIO"} ${refs[@]+"${refs[@]}"} --out "${b}_t1.png" 2>&1 | tail -1)
  echo "$out"
  [ -f "${b}_t1.png" ] || echo "$out" > "$b.failed"
done
