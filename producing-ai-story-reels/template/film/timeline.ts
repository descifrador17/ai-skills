// ep01 v2 film timeline (pure data + math, no React): which window of which clip plays when, and at what speed.
// Shots match STUDY.md §2 v2 (decision 17). Windows come from strips (ep01/script.md § Clip windows v2).
// CHAIN RULE: when clip B was generated from frame N of clip A, A's srcOut is exactly N (B's frame 0 IS frame N; srcOut N+1 repeats it).
// Runtime B (decision 27): travel shots at 1.25x (the user judged it natural on the 01–06 preview); gestures (09–11) at 1x. Never more.
export const FPS = 24;
export const TOTAL = 924; // 38.5 s: runtime B (decision 27) at real clip lengths (ruling 30)

export type Seg = { clip: string; srcIn: number; srcOut: number; rate: number; note: string };

// Windows are read off strips and join measurements (EDIT_PLAN 26–30).
export const SEGS: Seg[] = [
  { clip: "01B", srcIn: 12, srcOut: 120, rate: 1.25, note: "truck right + tilt up: hands, lamp, basket -> her 3/4 MCU, cloth whipped over" },
  { clip: "02B", srcIn: 0, srcOut: 120, rate: 1.25, note: "continuous exit: rise, basket to hip, out of the door, pan into the street (tail = 03A)" },
  { clip: "03B", srcIn: 0, srcOut: 120, rate: 1.25, note: "side-on track through the light wedges; ends on chain frame 120" },
  { clip: "04B", srcIn: 0, srcOut: 104, rate: 1.25, note: "arc to behind her shoulder, tea man points; tail settles onto 05A" },
  { clip: "05B", srcIn: 0, srcOut: 60, rate: 1.25, note: "basket onto her head, walks away; passer #1 crosses at the end" },
  { clip: "06B", srcIn: 0, srcOut: 42, rate: 1.25, note: "the market shed from behind her; passer #2 crosses at the end" },
  { clip: "07B", srcIn: 8, srcOut: 104, rate: 1.25, note: "low, wide aisle: porters both ways; she walks up to the vendor's stall; ends on chain frame 104 (head trimmed under passer #2)" },
  { clip: "08B", srcIn: 0, srcOut: 120, rate: 1.25, note: "he lifts the basket onto the pan; fast push-in + swing to the profile two-shot; tail settles on 09B frame 44" },
  { clip: "09B", srcIn: 44, srcOut: 120, rate: 1, note: "locked two-shot: turns the basket on the pan, sniffs a sprig, two fingers for the price; chain frame 120" },
  { clip: "10B", srcIn: 0, srcOut: 108, rate: 1, note: "locked: notes from the pouch, she takes them, he tips the jasmine into a sack (cut on the tip)" },
  { clip: "11B", srcIn: 60, srcOut: 120, rate: 1, note: "THE hard cut (head trimmed): the dawn lane, jasmine string into her braid; chain frame 120" },
  { clip: "12B", srcIn: 0, srcOut: 0, rate: 1.25, note: "locked: she walks away into the lamplight, small under the navy sky (fills to TOTAL)" },
];

/** Film frames a segment occupies (the last segment fills whatever is left of TOTAL). */
export const segFrames = (s: Seg) => Math.round((s.srcOut - s.srcIn) / s.rate);

export const layout = (segs: Seg[] = SEGS) => {
  let from = 0;
  return segs.map((s, i) => {
    const frames = i === segs.length - 1 ? TOTAL - from : segFrames(s);
    const r = { ...s, from, frames };
    from += frames;
    return r;
  });
};

/** Film frame where the first segment of `clip` starts (joins are placed on these boundaries). */
export const startOf = (clip: string, segs = layout()) => {
  const s = segs.find((x) => x.clip === clip);
  if (!s) throw new Error(`no segment for ${clip}`);
  return s.from;
};

// Passer-by (distraction) cut, the reference's way (shot-grammar §3): a real, in-focus market porter, cut out on transparent
// ground (tools/make_occluder.py --full), crosses right -> left at one speed. The image is drawn at SCALE x the frame,
// bottom-aligned, so his head and load leave the top edge (cropped at the neck). x0/x1 = the figure's visible box as a fraction
// of the image width (measured on the rows still on screen). The cut lands when he has come in by a third of the frame
// (or by his whole width if he is narrower): the eye is on him, not on the swap behind him. Never dark, never full cover.
export const PASSER = { scale: 1.3, crossFrames: 10 } as const;
export type Passer = { at: number; img: string; x0: number; x1: number };
export const PASSERS = (): Passer[] => [
  { at: startOf("06B"), img: "ep01/p1_passer.png", x0: 0.123, x1: 0.712 }, // grey vest, basket on his head
  { at: startOf("07B"), img: "ep01/p2_passer.png", x0: 0.259, x1: 0.491 }, // white vest, waist cloth
];

const figW = (p: Passer, W: number) => (p.x1 - p.x0) * W * PASSER.scale;
const speed = (p: Passer, W: number) => (W + figW(p, W)) / PASSER.crossFrames; // px per frame, from entering to gone

/** Screen x (px) of the passer image's left edge at film frame f. */
export const passerX = (p: Passer, f: number, W = 1920) => {
  const v = speed(p, W);
  const enter = p.at - Math.round(Math.min(W / 3, figW(p, W)) / v); // frame his leading edge crosses the right edge
  const lead = W - v * (f - enter); // his leading (left) edge on screen
  return lead - p.x0 * W * PASSER.scale;
};

/** Fraction of the frame width his visible box covers at film frame f. */
export const passerCover = (p: Passer, f: number, W = 1920) => {
  const left = passerX(p, f, W) + p.x0 * W * PASSER.scale;
  return Math.max(0, Math.min(W, left + figW(p, W)) - Math.max(0, left)) / W;
};
