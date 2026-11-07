import { test } from "node:test";
import assert from "node:assert/strict";
import { EPISODES, musicLevel, timing, voSegments } from "./timeline.ts";

for (const e of Object.values(EPISODES)) {
  const segs = voSegments(e);

  test(`${e.id}: the bed sits at ducked in the middle of every VO line`, () => {
    for (const s of segs) assert.equal(musicLevel(e, Math.floor((s.from + s.to) / 2)), e.music.ducked);
  });

  test(`${e.id}: the bed is back at base 20 frames after the voice`, () => {
    assert.equal(musicLevel(e, segs.at(-1)!.to + 20), e.music.base);
  });

  const last = timing(e).total - 1;
  test(`${e.id}: the bed has faded out by the last frame (${last})`, () => {
    assert.ok(musicLevel(e, last) < 0.05 * e.music.base, `${musicLevel(e, last)}`);
  });
}
