import { test } from "node:test";
import assert from "node:assert/strict";
import { cueWidth } from "./textWidth.ts";
import { CARD, HEIGHT, wordmarkH, EPISODES, TRACK_SECONDS, cardSettled, musicLevel, shotStarts, timing, voSegments } from "./timeline.ts";

for (const e of Object.values(EPISODES)) {
  const { total: TOTAL, storyEnd: STORY_END, cardStatic: CARD_STATIC, shots: [minShots, maxShots] } = timing(e);
  test(`${e.id}: ${minShots}-${maxShots} shots of 60-120 story frames, summing to ${CARD_STATIC} (the last runs through the card transition)`, () => {
    assert.equal(e.shots.reduce((n, s) => n + s.frames, 0), CARD_STATIC);
    assert.ok(e.shots.length >= minShots && e.shots.length <= maxShots, `${e.shots.length} shots`);
    const starts = shotStarts(e);
    e.shots.forEach((s, i) => {
      const story = Math.min(starts[i] + s.frames, STORY_END) - starts[i];
      assert.ok(story >= 60 && story <= 120, `shot ${i + 1} has ${story} story frames`);
    });
  });

  test(`${e.id}: every VO line plays inside its slot, within 15-${STORY_END}, >= 6 frames apart`, () => {
    const segs = voSegments(e);
    e.takes.forEach((t, i) => {
      assert.ok(segs[i].from >= t.slot[0] && segs[i].to <= t.slot[1], `line ${i + 1} ${segs[i].from}-${segs[i].to} outside ${t.slot}`);
      if (i) assert.ok(segs[i].from - segs[i - 1].to >= 6, `line ${i + 1} follows line ${i} by ${segs[i].from - segs[i - 1].to} frames`);
    });
    assert.ok(segs[0].from >= 15, `first line starts at ${segs[0].from}`);
    assert.ok(segs.at(-1)!.to <= STORY_END, `last line ends at ${segs.at(-1)!.to}`);
  });

  test(`${e.id}: cues end by ${STORY_END}, sit in x 40-1040 / y 240-1600 and fit their box on one line at 60 px`, () => {
    for (const c of e.cues) {
      const id = `cue "${c.words.join(" ")}"`;
      assert.ok(c.from < c.to && c.to <= STORY_END, `${id} runs ${c.from}-${c.to}`);
      const { x, y, w, h } = c.box;
      assert.ok(x >= 40 && x + w <= 1040 && y >= 240 && y + h <= 1600, `${id} box ${JSON.stringify(c.box)}`);
      assert.ok(c.gold.every((g) => g >= 0 && g < c.words.length), `${id} gold ${c.gold}`);
      assert.ok(cueWidth(c) <= w, `${id} needs ${Math.round(cueWidth(c))} px, box is ${w}`);
      // and only over the planned empty area of every shot it is on screen in
      shotStarts(e).forEach((start, i) => {
        const s = e.shots[i];
        if (c.from >= start + s.frames || c.to <= start) return;
        const inside = x >= s.empty.x && x + w <= s.empty.x + s.empty.w && y >= s.empty.y && y + h <= s.empty.y + s.empty.h;
        assert.ok(inside, `${id} box ${JSON.stringify(c.box)} outside shot ${i + 1}'s empty area ${JSON.stringify(s.empty)}`);
      });
    }
  });

  test(`${e.id}: threads end by ${STORY_END}, sound effects fall in 0-${TOTAL - 1}`, () => {
    for (const t of e.thread) assert.ok(t.to <= STORY_END, `thread ends at ${t.to}`);
    for (const s of e.sfx) assert.ok(s.at >= 0 && s.at < TOTAL, `${s.file} at ${s.at}`);
  });

  test(`${e.id}: the music section (from ${e.music.from} s) runs the full ${TOTAL / 30} s inside the track`, () => {
    assert.ok(e.music.from >= 0 && e.music.from + TOTAL / 30 <= TRACK_SECONDS, `music.from ${e.music.from}`);
  });


  test(`${e.id}: the closing card's last row settles by ${CARD_STATIC}, then holds still for >= 2.5 s`, () => {
    assert.ok(cardSettled(e) <= CARD_STATIC, `settles at ${cardSettled(e)}`);
    assert.ok(TOTAL - CARD_STATIC >= 75, `static for ${TOTAL - CARD_STATIC} frames`);
  });
}

// Closing card (user, 2026-10-30): no "agla episode" tease; the wordmark sits at the centre of the frame, URL beneath.
test("closing card: wordmark centred vertically, only the wordmark and the URL", () => {
  assert.equal(Math.round(CARD.wordmark.top + wordmarkH(CARD.wordmark.w) / 2), HEIGHT / 2);
  assert.ok(CARD.url.top > CARD.wordmark.top + wordmarkH(CARD.wordmark.w));
  assert.deepEqual(Object.keys(CARD).filter((k) => typeof (CARD as Record<string, unknown>)[k] === "object").sort(), ["url", "wordmark"]);
});

// Decision 35 (user, 2026-10-30): reels from EP 07 run 30 s; EP 01-06 keep 15 s. The closing card stays 3 s.
test("timing: 15 s episodes unchanged, 30 s episodes get 900 frames with the same 3 s closing card", () => {
  const ep = (seconds?: 15 | 30) => ({ ...EPISODES.ep01, seconds });
  assert.deepEqual(timing(ep()), { total: 450, storyEnd: 360, cardStatic: 375, shots: [4, 6] });
  assert.deepEqual(timing(ep(30)), { total: 900, storyEnd: 810, cardStatic: 825, shots: [8, 13] });
  assert.ok(cardSettled(ep(30)) <= 825, `card settles at ${cardSettled(ep(30))}`);
  assert.ok(musicLevel(ep(30), 899) < 0.03 && musicLevel(ep(30), 900) === 0, "faded out over the last 0.7 s");
  assert.ok(musicLevel(ep(30), 700) > 0, "the bed plays through a 30 s story");
});
