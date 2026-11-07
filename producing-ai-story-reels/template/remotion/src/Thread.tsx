// The golden thread's graphic form: a glowing gold stroke with soft bloom (a drop-shadow plus a wider blurred copy
// underneath). pathLength=1 lets the dash pattern show any stretch [a, b] of the path. trace draws on, holds, and
// fades by `to`; handoff draws on, then shrinks into its end point and fades by `to`.
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { GOLD } from "./Cue";
import type { Thread } from "./episodes";

const EASE = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.37, 0, 0.63, 1) } as const;
const DRAW = 30; // frames to draw a trace on
const FADE = 12;

export const GoldenThread: React.FC<{ t: Thread }> = ({ t }) => {
  const frame = useCurrentFrame();
  if (frame < t.from || frame >= t.to) return null;
  const mid = t.kind === "handoff" ? (t.from + t.to) / 2 : Math.min(t.from + DRAW, t.to - FADE);
  const b = interpolate(frame, [t.from, mid], [0, 1], EASE);
  const a = t.kind === "handoff" ? interpolate(frame, [mid, t.to], [0, 1], EASE) : 0;
  const opacity = interpolate(frame, [t.to - FADE, t.to], [1, 0], EASE);
  if (b - a < 0.001) return null;
  const path = (width: number, style: React.CSSProperties) => (
    <path d={t.d} pathLength={1} fill="none" stroke={GOLD} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${b - a} 2`} strokeDashoffset={-a} style={style} />
  );
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity }}>
      {path(14, { filter: "blur(10px)", opacity: 0.35 })}
      {path(4, { filter: "drop-shadow(0 0 12px rgba(243,199,123,.8))" })}
    </svg>
  );
};
