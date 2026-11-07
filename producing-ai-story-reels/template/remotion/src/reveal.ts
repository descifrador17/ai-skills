// Word-by-word reveal for the overlay text (frames). Word i starts STAGGER frames after word i-1 and goes from
// blurred, low and clear to sharp over IN frames; all words leave together over the last OUT frames before `to`
// (blur to 4 px, lift 12 px, fade). Ease-in-out only. The closing card passes its own shorter IN/STAGGER.
import { Easing } from "remotion";

export const STAGGER = 4;
export const IN = 21;
export const OUT = 12;

const ease = Easing.bezier(0.37, 0, 0.63, 1);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const wordState = (frame: number, cueFrom: number, cueTo: number, i: number, inFrames = IN, stagger = STAGGER) => {
  const t = ease(clamp01((frame - cueFrom - i * stagger) / inFrames));
  const out = ease(clamp01((frame - cueTo + OUT) / OUT));
  return { opacity: t * (1 - out), blur: 6 * (1 - t) + 4 * out, rise: 24 * (1 - t) - 12 * out };
};

// Frame by which every word of an n-word cue is fully in.
export const settledAt = (cueFrom: number, nWords: number, inFrames = IN, stagger = STAGGER) => cueFrom + (nWords - 1) * stagger + inFrames;
