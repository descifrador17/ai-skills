#!/bin/zsh
# Normalise each episode's sources into remotion/public/ so composition frame N == media frame N: every Kling
# clip epNN/clips/NNB.mp4 (24 fps) -> clips/epNN/NNB.mp4 at 1080x1920, 30 fps CFR (frame-rate conversion, never a
# speed change), exactly srcIn + frames frames via -frames:v, silent. A clip too short for its shot fails here by
# name (exit 1, its output removed) instead of freezing or padding. Sound effects epNN/sfx/* -> sfx/epNN/*.wav
# (48 kHz). Shared: the fonts, the wordmark and the music bed. Shots come straight from remotion/src/episodes.ts.
# Usage: prepare_media.sh 01 [02 ...]
set -euo pipefail
P="${0:A:h:h}"
O="$P/remotion/public"
# Absolute path, no $VARS and nothing after the closing quote: preflight.sh reads this line literally.
FONTS="/path/to/your/fonts"
(( $# )) || { echo "usage: prepare_media.sh NN [NN ...]"; exit 1; }
ff() { ffmpeg -nostdin -v error -y "$@"; }  # -nostdin: it runs inside a while-read loop
SHOTS_JS='import { EPISODES } from "./src/episodes.ts";
for (const s of EPISODES["ep" + process.argv[1]].shots) console.log(s.clip, s.srcIn + s.frames);'

for n in "$@"; do
  mkdir -p "$O/clips/ep$n" "$O/sfx/ep$n"
  (cd "$P/remotion" && node --no-warnings --input-type=module -e "$SHOTS_JS" "$n") | while read -r clip need; do
    ff -i "$P/ep$n/clips/${clip:t}" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1" \
      -frames:v "$need" -an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 "$O/$clip"
    got=$(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$O/$clip")
    if (( got < need )); then
      rm "$O/$clip"
      echo "prepare_media: ep$n/clips/${clip:t} is too short: $got frames at 30 fps, its shot needs $need (srcIn + frames)"
      exit 1
    fi
    echo "ep$n ${clip:t}: $got frames"
  done
  for f in "$P/ep$n/sfx/"*(N); do ff -i "$f" -ar 48000 -ac 2 "$O/sfx/ep$n/${f:t:r}.wav"; done
done

mkdir -p "$O/fonts" "$O/brand" "$O/music"
cp "$FONTS/NotoSerif-VariableFont.ttf" "$O/fonts/NotoSerif.ttf"
cp "$FONTS/NotoSerif-Italic-VariableFont.ttf" "$O/fonts/NotoSerif-Italic.ttf"
cp "$FONTS/Geist-VariableFont.ttf" "$O/fonts/Geist.ttf"
cp "$P/../cosmolife_typo.png" "$O/brand/wordmark.png"
cp "$P/ramayana_bg_music.mp3" "$O/music/bed.mp3"
echo "prepare_media: done"
