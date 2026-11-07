"""Music bed under the VO with SMOOTH ducking (learned on ArcaneArt bali, 2026-11: a fast compressor pumped, and the user heard "abrupt breaks"). Any length, any fps.
Usage: $OVERLAY_PY tools/mix_bed.py <music> <in_s> <vo> <total_s> <out.wav> [--sfx file@sec:gain_db ...]
Speech spans come from the VO's 20 ms RMS (> -35 dBFS). Gaps shorter than MERGE are bridged, so the music never swells inside a line.
The envelope is the span mask convolved with a raised-cosine RAMP, so every dip and rise is eased, never stepped.
Fades: FADE_IN at the start, FADE_OUT ending at total. The master pass (ffmpeg loudnorm -14 LUFS, TP -1.5) is run by the caller."""
import subprocess, sys
import numpy as np

SR, MUSIC_DB, DUCK_DB, MERGE, RAMP, PAD = 48000, -6.0, -9.0, 1.4, 0.6, 0.15
FADE_IN, FADE_OUT = 0.6, 2.0

def load(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start)] + (['-t', str(dur)] if dur else []) + ['-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()

def speech_mask(vo, n):
    hop = SR // 50                                                    # 20 ms
    m = vo[: len(vo) // hop * hop, 0].reshape(-1, hop)
    on = 20 * np.log10(np.sqrt((m ** 2).mean(1)) + 1e-9) > -35
    idx = np.flatnonzero(on)
    spans = []
    for i in idx:                                                     # merge short gaps
        t = i * hop / SR
        if spans and t - spans[-1][1] < MERGE: spans[-1][1] = t + hop / SR
        else: spans.append([t, t + hop / SR])
    mask = np.zeros(n, np.float32)
    for a, b in spans: mask[int(max(0, a - PAD) * SR): int(min(n / SR, b + PAD) * SR)] = 1
    return mask, spans

def ease(mask):
    k = int(RAMP * SR); win = np.hanning(2 * k + 1).astype(np.float32); win /= win.sum()
    return np.clip(np.convolve(mask, win, 'same'), 0, 1)

def main():
    a = sys.argv[1:]
    music, at, vo_p, total, out = a[0], float(a[1]), a[2], float(a[3]), a[4]
    n = int(total * SR)
    mus = load(music, at, total); mus = np.pad(mus, ((0, max(0, n - len(mus))), (0, 0)))[:n]
    vo = load(vo_p); vo = np.pad(vo, ((0, max(0, n - len(vo))), (0, 0)))[:n]
    mask, spans = speech_mask(vo, n)
    duck = ease(mask)
    env = 10 ** ((MUSIC_DB + DUCK_DB * duck) / 20)
    t = np.arange(n) / SR
    env *= np.clip(t / FADE_IN, 0, 1) * np.clip((total - t) / FADE_OUT, 0, 1)
    mix = vo + mus * env[:, None]
    for s in [x for x in a[5:] if '@' in x]:                          # --sfx file@sec:gain_db
        f, rest = s.split('@'); sec, g = rest.split(':')
        fx = load(f) * 10 ** (float(g) / 20); i = int(float(sec) * SR); fx = fx[: max(0, n - i)]
        fade = np.clip((total - t[i: i + len(fx)]) / FADE_OUT, 0, 1)   # the end fade covers the SFX too (nothing cut off at the last frame)
        mix[i: i + len(fx)] += fx * fade[:, None]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', out], input=mix.astype(np.float32).tobytes(), check=True)
    print(f'{len(spans)} speech spans (gaps < {MERGE}s bridged); music {MUSIC_DB} dB, ducked {DUCK_DB} dB with {RAMP}s eased ramps -> {out}')

if __name__ == '__main__':
    main()
