#!/bin/bash
# Safety net (decision 42): if hf_web reports that Unlimited is off (its guard already refuses any paid submit), or
# Higgsfield asks for its human check, stop both runners at once and say why. Reads only log lines written after it
# starts, so restarting after a pause doesn't re-trigger on old lines.
# Run:  source "$SKILL_DIR/scripts/env.sh" && bash "$SKILL_DIR/scripts/unlimited_guard.sh" >> "$RUN_DIR/guard.log" 2>&1 &
set -u
PAT='not UNLIMITED|Unlimited will not|is not Kling 3\.0 UNLIMITED|button says|turnstile_required'
touch "$RUN_DIR/images.log" "$RUN_DIR/clips.log"
a0=$(wc -l < "$RUN_DIR/images.log"); c0=$(wc -l < "$RUN_DIR/clips.log")
while :; do
  hit=$( { tail -n +$((a0 + 1)) "$RUN_DIR/images.log"; tail -n +$((c0 + 1)) "$RUN_DIR/clips.log"; } | grep -m1 -E "$PAT")
  [ -n "$hit" ] && break; sleep 15
done
touch "$RUN_DIR/STOP_IMAGES" "$RUN_DIR/STOP_CLIPS"
echo "PAUSED: $hit"
echo "Tell the user now. Unlimited off: never use credits; wait until they restore it. Human check: they tick it in the Arc tab."
echo "Then delete the STOP files and any .failed files from this error, and restart the runners and this guard."
