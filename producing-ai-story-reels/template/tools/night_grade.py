# Night grade (no AI): darken the midtones of a still on the Lab lightness channel only, so hues survive
# (per-channel curves turned lamp orange red and cobalt violet), keep lamp highlights, cool the shadows a touch.
# Seedream 5.0 lite won't paint true night; grade the keyframe BEFORE it becomes a Kling start frame so the clip is dark too.
# Usage: $OVERLAY_PY tools/night_grade.py <in> <out> [mid=0.42] [cool=6]   mid = output lightness at input 0.5 (lower = darker)
import cv2, sys, numpy as np
src, out = sys.argv[1:3]; mid = float(sys.argv[3]) if len(sys.argv) > 3 else 0.42; cool = float(sys.argv[4]) if len(sys.argv) > 4 else 6
lab = cv2.cvtColor(cv2.imread(src), cv2.COLOR_BGR2LAB).astype(np.float32)
L = lab[..., 0] / 255
g = np.log(mid) / np.log(0.5)                       # gamma that maps 0.5 -> mid
Ld = L ** g
hi = np.clip((L - 0.7) / 0.3, 0, 1)                 # protect highlights (lamps, wedges): blend back toward the original
Ln = Ld * (1 - hi) + L * hi
lab[..., 0] = Ln * 255
lab[..., 2] -= cool * (1 - Ln)                       # shadows a little bluer (b- axis), lights untouched
cv2.imwrite(out, cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR))
print('wrote', out)
