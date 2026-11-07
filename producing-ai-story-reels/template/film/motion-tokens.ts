/**
 * motion-tokens.ts — ep01/CREATIVE.md § Motion-language spec as code (calm-soft, premium, base unit 0.5 s).
 * The ONLY file allowed to call Easing.*. No spring (spec: none). The film's motion lives in the clips;
 * Remotion only drives the joins (occluder travel, anchor-object swing blur), so the tokens are few.
 */
import { Easing, interpolate } from "remotion";

export const SPEC = {
  personality: "premium",
  baseUnitSec: 0.5,
  staggerMs: 0,
  holdSec: 1.0,
  maxBlurPx: 64, // anchor-object swing blur ceiling
  minCover: 0.95, // occluder must cover this fraction of the frame at the cut
  scaleFrom: 1, // 0% Remotion scale on clips
} as const;

export const ease = {
  enter: Easing.bezier(0.4, 0, 0.2, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
} as const;

export type Beat = 0.5 | 1 | 2 | 3;
export const sec = (m: Beat): number => SPEC.baseUnitSec * m;
export const frames = (m: Beat, fps: number): number => Math.round(sec(m) * fps);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 eased progress of a move that starts at `start` and lasts `m` base units (occluder travel, swing). */
export const move = (frame: number, start: number, m: Beat, fps: number): number =>
  interpolate(frame, [start, start + frames(m, fps)], [0, 1], { ...CLAMP, easing: ease.enter });
