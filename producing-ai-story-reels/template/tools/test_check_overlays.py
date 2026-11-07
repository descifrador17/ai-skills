"""check_overlays.present(): an overlay must count as present over a pale sky too, where the plate is already
"ivory" (>= 200) and only the change the type and its halo make shows it. Run with the reel 05 venv:
../05_sacred_places_matter/tools/.venv/bin/python -I tools/test_check_overlays.py"""
import os, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_overlays import present

rng = np.random.default_rng(1)
noise = lambda a: (a + rng.integers(-3, 4, a.shape)).astype(np.int16)  # codec noise
cream = np.full((49, 280, 3), [212, 230, 235], np.int16)  # BGR, EP 06's pale sky under the wordmark
green = np.full((90, 900, 3), [60, 110, 70], np.int16)

wordmark = cream.copy(); wordmark[10:40, 20:260] = [255, 255, 255]  # white logo over the sky (+20 per channel)
assert present(wordmark, cream)[0], 'white wordmark over a pale sky'
halo = np.full((90, 900, 3), [212, 230, 235], np.int16); sky = halo.copy()
halo[20:70, 100:800] -= 40; halo[35:55, 150:750] = [246, 251, 255]  # dark halo around ivory words
assert present(halo, sky)[0], 'cue with its halo over a pale sky'
assert not present(noise(cream), cream)[0], 'pale sky with nothing drawn'
words = green.copy(); words[30:60, 100:400] = [246, 251, 255]
assert present(words, green)[0], 'ivory words over a dark plate'
assert not present(noise(green), green)[0], 'dark plate with nothing drawn'
card = np.full((49, 280, 3), [90, 100, 110], np.int16); card[10:40, 20:260] = [255, 255, 255]
assert present(card, None)[0] and not present(np.full((49, 280, 3), [90, 100, 110], np.int16), None)[0], 'under the card'
print('ok: overlays found over pale and dark plates, none where nothing is drawn')
