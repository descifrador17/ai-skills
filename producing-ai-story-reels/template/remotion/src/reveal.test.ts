import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { wordState } from "./reveal.ts";

const from = 100;
const to = 200;

test("a word is hidden before its cue starts", () => {
  assert.equal(wordState(from - 1, from, to, 0).opacity, 0);
});

test("word 2 is fully in after its 4-frame stagger plus the 21-frame reveal", () => {
  assert.deepEqual(wordState(from + 2 * 4 + 21, from, to, 2), { opacity: 1, blur: 0, rise: 0 });
});

test("mid-reveal, opacity, blur and rise are all part-way", () => {
  const s = wordState(from + 10, from, to, 0);
  for (const v of [s.opacity, s.blur / 6, s.rise / 24]) assert.ok(v > 0 && v < 1, JSON.stringify(s));
});

test("the exit blurs and lifts the words, and they are gone at `to`", () => {
  assert.equal(wordState(to, from, to, 0).opacity, 0);
  const s = wordState(to - 6, from, to, 0);
  assert.ok(s.blur > 0 && s.blur < 4 && s.rise < 0, JSON.stringify(s));
});

test("fonts.ts registers the real Noto Serif italic (never a synthesized slant)", () => {
  assert.match(readFileSync(new URL("./fonts.ts", import.meta.url), "utf8"), /NotoSerif-Italic\.ttf.*style: "italic"/);
});
