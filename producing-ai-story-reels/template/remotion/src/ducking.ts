export type Segment = { from: number; to: number };

// Music bed level per frame: ducked under voice segments (linear ramps either side),
// base elsewhere, faded to silence over the last frames.
export const musicVolume = (
  frame: number,
  segs: Segment[],
  o = { base: 0.65, ducked: 0.41, ramp: 6, fadeFrom: 429, end: 450 },
): number => {
  let duck = 0;
  for (const s of segs) {
    const gap = frame < s.from ? s.from - frame : frame > s.to ? frame - s.to : 0;
    duck = Math.max(duck, 1 - gap / o.ramp);
  }
  const level = o.base * (1 - duck) + o.ducked * duck;
  const fade = frame <= o.fadeFrom ? 1 : Math.max(0, (o.end - frame) / (o.end - o.fadeFrom));
  return level * fade;
};

// Join voice segments separated by less than `minGap` frames, so the bed stays down through quick
// breaths instead of bobbing up between lines (pumping); it lifts only in real pauses.
export const mergeGaps = (segs: Segment[], minGap: number): Segment[] =>
  segs.reduce<Segment[]>((out, s) => {
    const last = out.at(-1);
    if (last && s.from - last.to < minGap) last.to = Math.max(last.to, s.to);
    else out.push({ ...s });
    return out;
  }, []);
