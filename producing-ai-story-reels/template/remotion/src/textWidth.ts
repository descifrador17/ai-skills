// The real one-line width of a cue at 60 px, from the fonts' own advance widths (cmap format 4 + hmtx, no kerning).
// Test-only (node reads the TTFs): the old 0.5 em per character estimate passed m-heavy lines that wrapped on screen.
import { readFileSync } from "node:fs";
import { HOOK, type Cue } from "./timeline.ts";

const advances = (path: string) => {
  const d = readFileSync(path), u16 = (o: number) => d.readUInt16BE(o), at: Record<string, number> = {};
  for (let i = 0; i < u16(4); i++) at[d.toString("latin1", 12 + 16 * i, 16 + 16 * i)] = d.readUInt32BE(20 + 16 * i);
  const upem = u16(at.head + 18), nh = u16(at.hhea + 34), glyph = new Map<number, number>();
  for (let i = 0; i < u16(at.cmap + 2); i++) {
    const o = at.cmap + d.readUInt32BE(at.cmap + 8 + 8 * i);
    if (u16(o) !== 4) continue;
    const n = u16(o + 6) / 2, ends = o + 14, starts = ends + 2 * n + 2, deltas = starts + 2 * n, ranges = deltas + 2 * n;
    for (let k = 0; k < n; k++)
      for (let ch = u16(starts + 2 * k); ch <= u16(ends + 2 * k) && ch !== 0xffff; ch++) {
        const r = u16(ranges + 2 * k), g = r ? u16(ranges + 2 * k + r + 2 * (ch - u16(starts + 2 * k))) : ch;
        if ((r && !g) || glyph.has(ch)) continue;
        glyph.set(ch, (g + d.readInt16BE(deltas + 2 * k)) & 0xffff);
      }
    break;
  }
  return (s: string) => ([...s].reduce((w, ch) => w + u16(at.hmtx + 4 * Math.min(glyph.get(ch.codePointAt(0)!) ?? 0, nh - 1)), 0) * HOOK.size) / upem;
};

const roman = advances(new URL("../public/fonts/NotoSerif.ttf", import.meta.url).pathname);
const italic = advances(new URL("../public/fonts/NotoSerif-Italic.ttf", import.meta.url).pathname);

// Gold key words are set in the italic.
export const cueWidth = (c: Cue) =>
  c.words.reduce((w, word, i) => w + (c.gold.includes(i) ? italic : roman)(word), 0) + roman(" ") * (c.words.length - 1);
