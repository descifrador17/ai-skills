/**
 * motion-tokens.ts — the motion-language spec from CREATIVE.md, as code.
 *
 * This is the ONLY file allowed to call Easing.* or define spring configs.
 * Scene components import helpers from here; `check-direction.mjs --code`
 * fails the build if they hand-roll easing, spring configs, or durations.
 *
 * Fill every value from CREATIVE.md § Motion-language spec. Do not add a
 * third curve without a NOTE in CREATIVE.md explaining why.
 */
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from 'remotion';
import type {CSSProperties} from 'react';

// ── Spec (edit these, nothing else) ────────────────────────────────────────
export const SPEC = {
  personality: 'corporate', // premium | corporate | playful | energetic | data-story
  baseUnitSec: 0.4,
  staggerMs: 60,
  holdSec: 0.3,
  maxTravelPx: 24,
  scaleFrom: 0.96,
  overshootPct: 2,
} as const;

/** Two primary curves maximum. `texture` (linear) is for ambient loops only. */
export const ease = {
  enter: Easing.bezier(0.22, 1, 0.36, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
  texture: Easing.linear,
} as const;

/** Optional: exactly one named spring. Delete if the tone cell is not kinetic-soft. */
export const springs = {
  hero: {damping: 200, stiffness: 120, mass: 1, overshootClamping: true},
} as const satisfies Record<string, Partial<SpringConfig>>;

// ── Derived scale (never hand-write durations in scenes) ──────────────────
export type Beat = 0.5 | 1 | 2 | 3;

export const sec = (multiple: Beat): number => SPEC.baseUnitSec * multiple;

/** Frames for a multiple of the base unit at the composition's fps. */
export const useDur = () => {
  const {fps} = useVideoConfig();
  return (multiple: Beat): number => Math.round(sec(multiple) * fps);
};

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ── Primitives scenes use ────────────────────────────────────────────────
export type EnterOpts = {
  /** Position in a staggered group (0 for solo elements). */
  index?: number;
  /** Duration as a base-unit multiple. Hero = 2, support = 1, micro = 0.5. */
  multiple?: Beat;
  /** Extra delay as a base-unit multiple (e.g. support waits for the hero). */
  delay?: Beat;
};

/** Pure 0→1 entrance progress. Safe inside .map() over dynamic lists. */
export const enterAt = (
  frame: number,
  fps: number,
  {index = 0, multiple = 1, delay}: EnterOpts = {},
): number => {
  const f = (m: Beat) => Math.round(sec(m) * fps);
  const start = (delay ? f(delay) : 0) + Math.round((index * SPEC.staggerMs * fps) / 1000);
  return interpolate(frame, [start, start + f(multiple)], [0, 1], {
    ...CLAMP,
    easing: ease.enter,
  });
};

/** Hook form for single elements. */
export const useEnter = (opts: EnterOpts = {}): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return enterAt(frame, fps, opts);
};

/** 0→1 progress for an exit that ends exactly at `endFrame`. */
export const useExit = (endFrame: number, multiple: Beat = 1): number => {
  const frame = useCurrentFrame();
  const dur = useDur();
  return interpolate(frame, [endFrame - dur(multiple), endFrame], [0, 1], {
    ...CLAMP,
    easing: ease.exit,
  });
};

/** Spring progress using the single named config. */
export const useHeroSpring = (delayFrames = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delayFrames, fps, config: springs.hero});
};

/** Style for the standard entrance: travel + fade + scale within the intensity budget. */
export const enterStyle = (p: number): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * SPEC.maxTravelPx}px) scale(${
    SPEC.scaleFrom + (1 - SPEC.scaleFrom) * p
  })`,
});

/** Ambient drift for texture-tier elements only. */
export const useTextureDrift = (periodSec: number, amplitudePx: number): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const period = Math.max(1, Math.round(periodSec * fps));
  const t = interpolate(frame % period, [0, period], [0, 1], {...CLAMP, easing: ease.texture});
  return Math.sin(t * Math.PI * 2) * amplitudePx;
};
