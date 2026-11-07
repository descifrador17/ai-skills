# Occluder cutout (decision 13b): a painted torso generated on flat dark navy -> RGBA PNG whose alpha is 0 only in FRONT of
# the leading silhouette (per row, left of the first non-background pixel), feathered; everything behind stays opaque (the navy
# reads as the body's shadowed far side), so the occluder covers the whole frame at the cut.
# Usage: $OVERLAY_PY tools/make_occluder.py <in.png> <out.png> [--flip] [--full] [--fill x0,y0,x1,y1 ...]   (fill boxes in source pixels)
# --full: alpha = the whole figure (an in-focus passer-by crossing the scene; the background shows on both sides of him)
import sys, cv2, numpy as np
a = sys.argv[1:]; src, out = a[0], a[1]
img = cv2.imread(src)
for i, v in enumerate(a):
    if v == '--fill':
        x0, y0, x1, y1 = map(int, a[i + 1].split(','))
        m = np.zeros(img.shape[:2], np.uint8); m[y0:y1, x0:x1] = 255
        img = cv2.inpaint(img, m, 15, cv2.INPAINT_TELEA)   # small stray object (e.g. a painted bulb) filled from its surroundings
if '--flip' in a:
    img = cv2.flip(img, 1)
h, w = img.shape[:2]
bg = np.median(np.concatenate([img[80:, 40:80].reshape(-1, 3), img[80:120, 40:].reshape(-1, 3)]), 0)  # the flat ground, sampled inside the edges (Seedream sometimes adds a black band along the top, which inverted the matte)
d = np.linalg.norm(img.astype(np.float32) - bg, axis=2)
fg = cv2.morphologyEx((d > 38).astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))   # body pixels, specks removed
first = np.where(fg.any(1), fg.argmax(1), w)                                                    # leading edge per row
first = cv2.GaussianBlur(first.astype(np.float32).reshape(-1, 1), (1, 0), sigmaX=1, sigmaY=25).ravel()  # smooth the contour
xs = np.arange(w)[None, :].astype(np.float32)
if '--full' in a:   # whole-body matte: filled silhouette, small feather
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    m = np.zeros_like(m); cv2.drawContours(m, [c for c in cs if cv2.contourArea(c) > 0.01 * h * w], -1, 1, -1)
    alpha = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3)
else:
    alpha = np.clip((xs - first[:, None]) / 30 + 0.5, 0, 1)                                     # 30 px feather on the leading contour
rgba = np.dstack([img, (alpha * 255).astype(np.uint8)])
cv2.imwrite(out, rgba)
print('wrote', out, 'bg', bg.round(), 'leading edge x range', int(first.min()), int(first.max()))
