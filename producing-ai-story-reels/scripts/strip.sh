#!/bin/bash
# strip.sh clip.mp4 out.jpg : frames at 0,1,2,3,4 s side by side (320 px wide each)
in=$1; out=$2; d=$(dirname "$out")/_strip; mkdir -p "$d"; rm -f "$d"/*.png
for t in 0 1 2 3 4; do ffmpeg -v error -y -ss $t -i "$in" -frames:v 1 -vf scale=320:-1 "$d/f$t.png"; done
ffmpeg -v error -y -i "$d/f0.png" -i "$d/f1.png" -i "$d/f2.png" -i "$d/f3.png" -i "$d/f4.png" -filter_complex hstack=inputs=5 "$out"
