#!/bin/zsh
# Cut each episode's continuous Maya take (ElevenLabs v4, read as one passage so the lines flow) into its
# lines, at the middle of the pause between lines (pauses found with silencedetect).
# Writes tools/vo_raw/<ep>/line1..N.wav for tools/process_vo.sh.
set -euo pipefail
V="${0:A:h}/vo_raw"
split() { # episode, take, cut times between lines
  local ep=$1 take=$2; shift 2
  local cuts=(0 "$@" 99)
  for i in {1..$(( $# + 1 ))}; do
    ffmpeg -v error -y -i "$V/$ep/$take" -af "atrim=${cuts[$i]}:${cuts[$((i + 1))]}" -ac 1 -ar 48000 "$V/$ep/line$i.wav"
  done
}
# split ep00 take1.aiff 3.21 7.51   # placeholder (say -v Lekha); pauses 3.09-3.33, 7.39-7.62 s
split ep01 takeA.mp3 4.43 7.33        # Maya take A (stability 0.35, user pick 2026-10-30); pauses 4.16-4.71, 7.09-7.58 s
split ep02 takeA.mp3 2.46 4.97 6.74   # take A; pauses 2.17-2.75, 4.71-5.24, 6.49-6.98 s (ellipsis after राजगद्दी kept as a slot gap)
split ep03 takeA.mp3 3.09 6.89        # Maya take A (stability 0.35); pauses 2.80-3.38, 6.65-7.13 s
split ep04 takeA.mp3 2.93 7.12        # take A; pauses 2.65-3.20, 6.90-7.34 s
split ep05 takeA.mp3 2.92 5.47        # Maya take A (job f4f6405a); pauses 2.64-3.20, 5.16-5.78 s
split ep06 takeA.mp3 3.25 5.25 7.95   # take A (job 5f543b3e); pauses 2.95-3.54, 4.97-5.52, 7.68-8.21 s
split ep07 takeA.mp3 3.85 7.46 11.07 14.35 17.97   # Maya take A (job f4f2430b, 30 s format); pauses 3.69-4.01, 7.17-7.75, 10.90-11.23, 14.06-14.63, 17.71-18.23 s
split ep08 takeA.mp3 4.23 8.04 11.91 15.01 17.56   # take A (job 48f5d4c4); pauses 3.90-4.57, 7.69-8.39, 11.67-12.15, 14.76-15.26, 17.20-17.92 s
split ep09 takeA.mp3 4.59 8.54 13.09 16.90 20.47   # Maya take A (job 2cee6b13, 30 s format); pauses 4.33-4.85, 8.26-8.81, 12.81-13.37, 16.62-17.18, 20.21-20.72 s
split ep10 takeA.mp3 4.13 8.31 11.97 15.97 19.12   # take A (job e55cf1c0); pauses 3.84-4.43, 8.03-8.60, 11.64-12.29, 15.66-16.27, 18.87-19.37 s
split ep11 takeA.mp3 4.51 8.74 13.14 15.90 20.53   # Maya take A (job 7b0aecb5, 30 s); pauses 4.20-4.83, 8.43-9.04, 12.87-13.41, 15.60-16.21, 20.22-20.84 s
split ep12 takeA.mp3 3.65 7.74 12.20 17.43 21.60   # take A (job caad4014); pauses 3.37-3.93, 7.46-8.02, 11.92-12.48, 17.14-17.73, 21.33-21.87 s
