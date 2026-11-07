import { test } from "node:test";
import assert from "node:assert/strict";
import { PASSER, PASSERS, SEGS, TOTAL, layout, passerCover, passerX, segFrames } from "./timeline.ts";

test("film is exactly TOTAL frames and the last segment gets a sane length", () => {
  const l = layout();
  const end = l[l.length - 1].from + l[l.length - 1].frames;
  assert.equal(end, TOTAL);
  assert.ok(l[l.length - 1].frames >= 48, `last shot only ${l[l.length - 1].frames} frames`);
  assert.ok(l.every((s) => s.frames > 0));
});

test("every segment reads inside its 5 s clip (121 frames)", () => {
  for (const s of SEGS.slice(0, -1)) assert.ok(s.srcOut <= 121 && s.srcIn < s.srcOut, `${s.clip} ${s.srcIn}-${s.srcOut}`);
  const last = layout().at(-1)!;
  assert.ok(last.srcIn + last.frames * last.rate <= 121, "last segment would run past its clip");
});

test("segFrames rounds ramps", () => assert.equal(segFrames({ clip: "x", srcIn: 0, srcOut: 36, rate: 3, note: "" }), 12));

// Passer-by cut (shot-grammar §3): he is seen entering in the old shot, the cut lands while he covers about a third of
// the frame (or all of himself if he is narrower), he crosses at one speed and leaves at the left.
test("passer enters before the cut, covers ~a third on the cut, and is gone within crossFrames", () => {
  for (const p of PASSERS()) {
    const covers = (f: number) => passerCover(p, f);
    assert.ok(covers(p.at - 1) > 0, `${p.img}: not visible the frame before the cut`);
    const width = (p.x1 - p.x0) * PASSER.scale;
    const want = Math.min(1 / 3, width);
    assert.ok(Math.abs(covers(p.at) - want) < 0.06, `${p.img}: covers ${covers(p.at).toFixed(2)} on the cut, want ~${want.toFixed(2)}`);
    const frames = Array.from({ length: 60 }, (_, i) => p.at - 20 + i).filter((f) => covers(f) > 0);
    assert.ok(frames.length <= PASSER.crossFrames + 1, `${p.img}: on screen ${frames.length} frames`);
    assert.equal(covers(frames[0] - 1), 0);
    assert.equal(covers(frames.at(-1)! + 1), 0);
  }
});

test("passer moves right to left at one speed", () => {
  for (const p of PASSERS()) {
    const d = [0, 1, 2, 3].map((i) => passerX(p, p.at + i + 1) - passerX(p, p.at + i));
    assert.ok(d.every((x) => x < 0 && Math.abs(x - d[0]) < 1e-6), `${p.img}: steps ${d.map((x) => x.toFixed(1))}`);
  }
});

test("passer cuts sit on segment boundaries and leave the shed visible between them", () => {
  const starts = new Set(layout().map((s) => s.from));
  const [a, b] = PASSERS();
  for (const p of [a, b]) assert.ok(starts.has(p.at), `${p.img} at ${p.at} is not a segment start`);
  assert.ok(b.at - a.at >= 24, `only ${b.at - a.at} frames of the shed between the two passers`);
});
