# Paint filter (no AI): a generalised Kuwahara filter that turns smooth rendered gradients into flat, stroke-like patches with
# hard, slightly ragged edges, plus a faint paper grain — the hand-painted "brush edge" feel of the reference. Deterministic,
# so the same settings can run on every keyframe and, frame by frame, on every clip.
# Usage: $OVERLAY_PY tools/paint_filter.py <in> <out> [radius=6] [grain=0.04] [passes=1]   (radius in px at 2K width; scale for 1080p)
import cv2, sys, numpy as np

def kuwahara(img, r):
    f = img.astype(np.float32) / 255
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    k = (r + 1, r + 1)
    best_mean, best_var = None, None
    for ax, ay in ((r, r), (0, r), (r, 0), (0, 0)):  # the four quadrant windows around each pixel
        m = cv2.boxFilter(f, -1, k, anchor=(ax, ay), borderType=cv2.BORDER_REFLECT)
        gm = cv2.boxFilter(g, -1, k, anchor=(ax, ay), borderType=cv2.BORDER_REFLECT)
        gv = cv2.boxFilter(g * g, -1, k, anchor=(ax, ay), borderType=cv2.BORDER_REFLECT) - gm * gm
        if best_var is None:
            best_mean, best_var = m, gv
        else:
            pick = gv < best_var
            best_mean = np.where(pick[..., None], m, best_mean); best_var = np.where(pick, gv, best_var)
    return best_mean

def grain(shape, seed=7):
    rng = np.random.default_rng(seed)  # fixed seed: the same paper under every frame (no boiling)
    n = rng.standard_normal(shape[:2]).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), 1.2) + 0.5 * cv2.GaussianBlur(rng.standard_normal(shape[:2]).astype(np.float32), (0, 0), 6)
    return (n / (n.std() + 1e-6))[..., None]

if __name__ == '__main__':
    src, out = sys.argv[1:3]
    r = int(sys.argv[3]) if len(sys.argv) > 3 else 6
    gs = float(sys.argv[4]) if len(sys.argv) > 4 else 0.04
    passes = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    img = cv2.imread(src)
    f = img
    for _ in range(passes):
        f = (kuwahara(f, r) * 255).astype(np.uint8)
    f = f.astype(np.float32) / 255 * (1 + gs * grain(f.shape))
    cv2.imwrite(out, np.clip(f * 255, 0, 255).astype(np.uint8))
    print('wrote', out)
