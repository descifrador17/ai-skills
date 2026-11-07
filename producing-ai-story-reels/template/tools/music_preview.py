#!/usr/bin/env python3
"""Checkpoint 4 previews (BUILD_PLAN Task 8 Step 6): 15 s of the music bed from each candidate in-point, ducked
under the episode's processed VO lines exactly as Remotion will (remotion/src/ducking.ts), VO at VO_GAIN 0.8.

  tools/music_preview.py ep03 --vo 15:82,110:99,300:39 --at 84 --at 22 --at 175 --out /tmp/prev
  --vo  each line's start frame and length in frames (slot[0] + lead : durationFrames), in line order
  --at  candidate in-points in seconds into remotion/public/music/bed.mp3
  --seconds  the reel's runtime, 15 (default) or 30 (from EP 07)
Writes <out>/<ep>_<in-point>.mp3 and prints each preview's integrated loudness.
"""
import argparse, array, json, re, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'remotion' / 'public'
RATE, FPS, VO_GAIN = 48000, 30, 0.8
TOTAL = 450  # frames; main() sets it from --seconds (decision 35: 30 s reels from EP 07)


def envelope(segs, base, ducked):
    """Per-frame music level from the edit's own code, so the preview ducks exactly like the render."""
    js = ("import { musicVolume, mergeGaps } from %s;"
          "const segs = mergeGaps(%s, 12);"
          "console.log(JSON.stringify(Array.from({ length: %d }, (_, f) => musicVolume(f, segs, { base: %s, ducked: %s, ramp: 9, fadeFrom: %d, end: %d }))));"
          % (json.dumps(str(ROOT / 'remotion/src/ducking.ts')), json.dumps(segs), TOTAL, base, ducked, TOTAL - 21, TOTAL))
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, check=True).stdout)


def preview(ep, vo, at, env, out):
    tmp = Path(tempfile.mkdtemp())
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(at), '-t', str(TOTAL / FPS), '-i', str(PUB / 'music/bed.mp3'),
                          '-f', 'f32le', '-ac', '2', '-ar', str(RATE), '-'], capture_output=True, check=True).stdout
    a = array.array('f', raw)
    spf = RATE / FPS
    for i in range(0, len(a), 2):  # stereo frames; gain interpolated between video frames
        x = i / 2 / spf
        f = min(int(x), TOTAL - 1)
        g = env[f] + (env[min(f + 1, TOTAL - 1)] - env[f]) * (x - f)
        a[i] *= g; a[i + 1] *= g
    bed = tmp / 'bed.f32'
    bed.write_bytes(a.tobytes())
    args = ['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(RATE), '-i', str(bed)]
    chains, labels = [], ['[0]']
    for n, (start, _) in enumerate(vo, 1):
        args += ['-i', str(PUB / f'vo/{ep}/line{n}.wav')]
        ms = round(start / FPS * 1000)
        chains.append(f'[{n}]aresample={RATE},aformat=channel_layouts=stereo,volume={VO_GAIN},adelay={ms}|{ms}[v{n}]')
        labels.append(f'[v{n}]')
    fc = ';'.join(chains + [''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=first[m]'])
    dst = out / f'{ep}_{at:g}s.mp3'
    subprocess.run(args + ['-filter_complex', fc, '-map', '[m]', '-t', str(TOTAL / FPS), '-b:a', '160k', str(dst)], check=True)
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(dst), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    lufs = re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)
    print(dst, (lufs[-1] + ' LUFS') if lufs else '')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ep'); ap.add_argument('--vo', required=True); ap.add_argument('--at', type=float, action='append', required=True)
    ap.add_argument('--base', type=float, default=0.39); ap.add_argument('--ducked', type=float, default=0.22)
    ap.add_argument('--out', required=True); ap.add_argument('--seconds', type=int, choices=(15, 30), default=15)
    a = ap.parse_args()
    global TOTAL
    TOTAL = a.seconds * FPS
    vo = [tuple(int(v) for v in p.split(':')) for p in a.vo.split(',')]
    env = envelope([{'from': s, 'to': s + d} for s, d in vo], a.base, a.ducked)
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for at in a.at:
        preview(a.ep, vo, at, env, out)


if __name__ == '__main__':
    main()
