# Paint filter on every frame of a clip (decision 10): same Kuwahara as paint_filter.py, same fixed-seed grain (the paper never
# "boils"), re-encoded with ffmpeg at high quality. Usage: $OVERLAY_PY tools/paint_clip.py <in.mp4> <out.mp4> [radius=4] [grain=0.02]
import subprocess, sys, cv2, numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from paint_filter import kuwahara, grain

src, out = sys.argv[1:3]
r = int(sys.argv[3]) if len(sys.argv) > 3 else 4
gs = float(sys.argv[4]) if len(sys.argv) > 4 else 0.02
cap = cv2.VideoCapture(src)
w, h, fps = int(cap.get(3)), int(cap.get(4)), cap.get(5)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
g = 1 + gs * grain((h, w, 3))
n = 0
while True:
    ok, f = cap.read()
    if not ok: break
    enc.stdin.write(np.clip(kuwahara(f, r) * g * 255, 0, 255).astype(np.uint8).tobytes()); n += 1
enc.stdin.close(); enc.wait()
print('wrote', out, n, 'frames')
