"""Check every frame of a final render for missing overlays (headless-render paint race seen in reel 02).
Test: <reel 05 venv>/bin/python -I tools/test_check_overlays.py

Windows come straight from remotion/src via node: the top wordmark (frames 0-355), the fine print (every frame),
each cue from its last word's settle + 6 frames to the frame its 12-frame exit starts, and each closing-card row (the static card, 375-449 at 15 s).
Up to the card, a box must gain >= 250 ivory or gold pixels over the plate, rebuilt from the prepared shot clips
in order (each from its srcIn), so the plate's own highlights can't pass for type. Under the static card the plate
is a blurred copy dimmed to 0.62 (no channel above ~158), so there every ivory or gold pixel is type.
Ivory starts at 200, not 225: the fine print is ivory at 0.88 opacity, whose blue channel tops out near 217.

Usage: <reel 05 venv>/bin/python -I tools/check_overlays.py 9x16/ramayana_epNN_final_hindi.mp4
"""
import json
import os
import re
import subprocess
import sys

import cv2
import numpy as np

P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(P, "remotion")
TIMING_JS = """
import { CARD, EPISODES, FINE, HEIGHT, HOOK, WIDTH, WORDMARK, timing, wordmarkH } from "./src/timeline.ts";
import { OUT, settledAt } from "./src/reveal.ts";
const e = EPISODES[process.argv[1]];
const { total: TOTAL, storyEnd: STORY_END, cardStatic: CARD_STATIC } = timing(e);
const mid = (w, h, y) => ({ x: Math.round((WIDTH - w) / 2), y, w, h });
const card = (id, box) => ({ id, from: CARD_STATIC, to: TOTAL - 1, box });
const windows = [
  { id: "wordmark", from: 0, to: STORY_END - 5, box: mid(WORDMARK.w, wordmarkH(WORDMARK.w), WORDMARK.top) },
  { id: "fine print", from: 0, to: TOTAL - 1, box: mid(700, FINE.size + 8, HEIGHT - FINE.bottom - FINE.size - 4) },
  ...e.cues.map((c) => ({ id: `cue "${c.words.join(" ")}"`, from: settledAt(c.from, c.words.length) + 6, to: c.to - OUT, box: c.box })),
  card("card wordmark", mid(CARD.wordmark.w, wordmarkH(CARD.wordmark.w), CARD.wordmark.top)),
  card("cosmolife.in", mid(400, Math.round(CARD.url.size * 1.4), CARD.url.top)),
];
console.log(JSON.stringify({ shots: e.shots, cardStatic: CARD_STATIC, total: TOTAL, windows }));
"""
IVORY_MIN = np.array([200, 200, 200])
GOLD = np.array([123, 199, 243])  # #F3C77B in BGR


def frames(path):
    cap = cv2.VideoCapture(path)
    while True:
        ok, f = cap.read()
        if not ok:
            return
        yield f.astype(np.int16)


def plate(shots):
    for s in shots:
        for k, f in enumerate(frames(os.path.join(R, "public", s["clip"]))):
            if k >= s["srcIn"] + s["frames"]:
                break
            if k >= s["srcIn"]:
                yield f


def is_type(img):
    return (img >= IVORY_MIN).all(-1) | (np.abs(img - GOLD) <= [35, 35, 30]).all(-1)


def present(box, under):
    """Is an overlay drawn in this box of the final frame? under: the same box of the plate (None under the card)."""
    added = is_type(box)
    if under is not None:
        added &= ~is_type(under)
    n = int(added.sum())
    if n >= 250 or under is None:
        return n >= 250, n
    # Over a pale sky the plate is already "ivory", so count the change instead: the white wordmark lifts the sky by
    # ~20 and the cue's halo darkens it (EP 06: 5,600-25,000 changed pixels drawn, 0 when nothing is drawn).
    changed = int((np.abs(box - under).mean(-1) >= 12).sum())
    return changed >= 1000, n


def main():
    ep = "ep" + re.search(r"ramayana_ep(\d+)", os.path.basename(sys.argv[1])).group(1)
    t = json.loads(subprocess.run(["node", "--no-warnings", "--input-type=module", "-e", TIMING_JS, ep], cwd=R,
                                  capture_output=True, text=True, check=True).stdout)
    raw = plate(t["shots"])
    bad = []
    n = 0
    for f, final in enumerate(frames(sys.argv[1])):
        n += 1
        under = next(raw) if f < t["cardStatic"] else None
        for w in t["windows"]:
            if not w["from"] <= f <= w["to"]:
                continue
            x, y, bw, bh = (w["box"][k] for k in "xywh")
            ok, px = present(final[y:y + bh, x:x + bw], None if under is None else under[y:y + bh, x:x + bw])
            if not ok:
                bad.append(f"{f}: {w['id']} missing ({px} type pixels)")
    if n != t["total"]:
        bad.append(f"the render has {n} frames, not {t['total']}")
    if bad:
        print(f"{len(bad)} bad frames:\n" + "\n".join(bad))
        sys.exit(1)
    print(f"all overlays present on every frame ({ep}, {len(t['windows'])} windows)")


if __name__ == "__main__":
    main()
