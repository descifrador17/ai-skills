#!/bin/sh
# Trim silence from each raw VO line, cap the comma pauses inside a line at ~0.18 s (Maya holds
# 0.3-0.45 s at every comma; CLAUDE.md allows tightening pauses, never time-stretching), gently compress,
# gain to -13 LUFS and peak-limit at -2 dBFS. Writes 48 kHz mono WAVs into remotion/public/vo/<ep>/ and
# prints each line's duration and loudness. Usage: process_vo.sh [ep00 ...]  (default: every tools/vo_raw/<ep>; after split_vo.sh)
set -e
P="$(cd "$(dirname "$0")/.." && pwd)"
TRIM="silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
PAUSE="silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-40dB:stop_silence=0.18"
loud() { ffmpeg -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | grep -A16 Summary | awk -v k="$2" '$1==k{print $2}'; }
for ep in ${*:-$(ls "$P/tools/vo_raw")}; do
IN="$P/tools/vo_raw/$ep"; OUT="$P/remotion/public/vo/$ep"; mkdir -p "$OUT"
for n in $(ls "$IN" | sed -n 's/^line\([0-9]*\)\.wav$/\1/p' | sort -n); do
  t="$OUT/.trim$n.wav"
  ffmpeg -v error -y -i "$IN/line$n.wav" -af "$TRIM,$PAUSE,acompressor=threshold=0.1:ratio=3:attack=5:release=80" -ac 1 -ar 48000 "$t"
  gain=$(echo "-13 - ($(loud "$t" I:))" | bc -l)
  ffmpeg -v error -y -i "$t" -af "volume=${gain}dB,alimiter=limit=0.79:attack=5:release=50:level=false" -ar 48000 -c:a pcm_s16le "$OUT/line$n.wav"
  rm "$t"
  echo "$ep line$n $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/line$n.wav") s, $(loud "$OUT/line$n.wav" I:) LUFS, peak $(loud "$OUT/line$n.wav" Peak:) dBTP"
done
done
