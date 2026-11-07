"""WORKED EXAMPLE (EP 11-12): copy per pair, then edit the shots dict. Builds each still prompt (frozen STYLE block + character blocks from characters/BIBLE.md + the shot + composition and safety lines) and its .refs list into epNN/stills/work/. Run from the series folder; prompts must stay under 3,000 characters (hf_web refuses longer)."""
import re, os
B = open('characters/BIBLE.md').read()
def block(name):
    m = re.search(r'^### ' + re.escape(name) + r'\b.*?\n> (.+?)\n', B, re.M | re.S)
    return m.group(1).strip()
STYLE = block('STYLE block')
BLEED = ('Vertical 9:16 frame, full-bleed, with NO thin dark outline around the picture: the painting fills the image '
         'edge to edge, with no border, frame, margin or band.')
LAND = ('Rendering: soft muted natural colours like a hand-painted background, atmospheric haze, visible brush texture; '
        'no saturated, neon or flat digital colours.')
NOARCH = 'Nature only: no palace, no stone buildings, no temple, no architecture anywhere.'
SPRING = ('Spring: trees in full blossom, no monsoon, no bare autumn trees.')
END = 'No text, no letters, no logos, no watermark.'
# short forms for shots with several named characters (the sheets carry the detail; MAX_PROMPT 3000)
RAM_S = ('SHRI RAM in his forest look, exactly as on his reference sheet: young prince, tall and broad-shouldered, skin pale '
         'sky blue #A9C8E8 on face, hands and body, calm lotus-petal eyes, clean-shaven, red vertical tilak; long black matted '
         'locks piled high and tied with a cord; rough brown bark-cloth robe and dhoti, black-and-tan antelope skin over the '
         'left shoulder, rudraksha mala, no gold; a tall dark-wood bow and a quiver on his back.')
LAK_S = ('LAKSHMAN in his forest look, exactly as on his reference sheet: slightly shorter and leaner than Ram, natural warm '
         'light-brown skin #E2B48A (never yellow), sharp alert eyes, clean-shaven, red-and-white tilak; thick matted locks in a '
         'tall bun tied with a cord; sleeveless brown bark-cloth robe and bark dhoti, rudraksha mala, no gold; a bow and a full quiver.')
HAN_S = ('HANUMAN exactly as on his reference sheet: mighty vanara, very muscular, taller than Ram, warm honey skin #D9A877 with '
         'cel shadow #B6845A, heavy vanara face with a full short beard and kind amber eyes, white U-shaped forehead mark, a long '
         'tail with a tufted tip, gold crown, gold armbands, wrist cuffs and necklace, deep red dhoti with a gold border.')
BHIK_S = ('HANUMAN IN DISGUISE exactly as on his reference sheet: a young human-looking mendicant, no tail, warm honey skin '
          '#D9A877, amber eyes, short brown beard, white U-shaped forehead mark, dark-brown hair in a low knot, a plain grey-brown '
          'robe over the left shoulder with the right shoulder bare, a rope cord, barefoot.')
SUG_S = ('SUGRIVA exactly as on his reference sheet: tawny ochre vanara skin #E2A468, thick tawny fur on the forearms above wide '
         'gold wrist cuffs, plain gold armbands, a heavy gold chain necklace, tawny hair falling past the shoulders, a deep '
         'forest-green dhoti with a thin gold border.')

MAIN_S = ('MAINAKA exactly as on his reference sheet: a tall, broad, handsome man of about fifty, warm stone-brown skin, kind dark '
          'eyes, a short dark beard and dark hair with silver streaks in a low knot, an ankle-length moss-green dhoti with a gold '
          'border, a stone-grey shawl over the left shoulder, a broad gold sash with a round gold clasp at the navel, gold wrist cuffs, barefoot.')
SUR_S = ('SURASA in her fearsome form exactly as on her reference sheet: colossal, mask-like and stern, cool sea-storm teal-grey skin, '
         'two short ivory tusks at the corners of a closed mouth, tawny copper-amber eyes, white shell ear discs, a vast storm-grey mane '
         'streaming into spray, a high-necked long-sleeved dark sea-green robe with silver wave borders and a dark green hooded cape, '
         'a white shell and red coral collar; fully covered, never sensual.')
SURT_S = ('SURASA in her true form exactly as on her reference sheet: a serene, motherly goddess radiant like the sun, warm golden-fair '
          'skin, calm brown eyes, a gentle smile, a small gold bindi, black hair in a low bun, a navy-blue silk saree with a broad gold '
          'border and a matching choli with elbow-length sleeves, fine gold ornaments, a soft halo of warm sunlight.')
GOLD = ('The mountain\'s upper crags are burnished old gold rock with a soft inner glow, not shiny metal, not blinding; its lower '
        'slopes are dense green forest with great trees and trailing creepers.')
NOBUILD = 'No buildings, no temple, no shrine, no steps, no ruins, no statues anywhere.'
SEA = 'Open ocean: no land, no islands, no ships. Nature only: sky, clouds and sea; no palace, no pavilion, no pillars, no arches, no domes, no buildings or architecture anywhere.'
AFT11 = 'Afternoon light under a steel-blue sky.'
AFT12 = 'Warm, low mid-afternoon sunlight from the right.'
FLY = 'his golden mace strapped on his back, his long tail streaming behind him'
S = 'characters/style_frame.png'
SH = lambda n: 'characters/%s_sheet.png' % n
def top(what): return 'Composition: the top third of the frame is %s with nothing in it.' % what
def side(where, what): return 'Composition: the subject is in the lower two thirds, to the %s; the top third and the other side are %s with nothing in it.' % (where, what)

shots = {
 # ---------------- EP 11 ----------------
 'ep11/01A_depths': ([S], [
   'Underwater view looking up through deep clear blue ocean water: far above, the bright rippling surface of the sea lit by the '
   'afternoon sun, and crossing it the long dark shape of a flying figure seen from below through the water, small, arms spread, '
   'a long tail. Below, filling the lower half of the frame, the vast dim shape of a huge submerged mountain with forested slopes, '
   'great trees and creepers swaying in the water, and a warm soft golden glow coming from deep within its heart. Shafts of light '
   'slant down through the water.', 'No buildings, no ruins, no statues, no temple: only rock, water, trees and light.',
   'Composition: the middle of the frame, between the surface and the mountain, is clear open blue water with nothing in it.', LAND]),
 'ep11/02A_flight': ([S, SH('hanuman')], [
   'High above and behind: Hanuman flies over a vast open ocean, seen from behind and above, about one sixth of the frame height, '
   'body stretched forward, ' + FLY + ', a few pink blossoms still clinging to him and drifting off; below him a long trough opens '
   'in the water beneath his path and his shadow falls on the waves. Soft clouds.', SEA, AFT11, top('steel-blue sky above the horizon'), HAN_S, LAND]),
 'ep11/03A_rise': ([S], [
   'Side-on wide view of the open ocean: in the centre the sea surges and bulges upward as the jagged tips of a great mountain break '
   'through the surface, sea water pouring off them in white cascades and spray flying; only the peaks are out of the water so far, '
   'and the steel-blue sky around them is just beginning to warm to gold.', GOLD, 'No figures.', NOBUILD, SEA, AFT11,
   top('steel-blue sky'), LAND]),
 'ep11/04A_ahead': ([S, SH('hanuman')], [
   'Over Hanuman\'s shoulder in flight, three-quarter from behind, high above the ocean: his honey-skinned shoulder with a gold '
   'armband, the back of his crowned head and the edge of his face fill the lower left foreground; his eye narrows as he looks ahead. '
   'Dead ahead across his path a huge mountain has risen out of the sea, its forested lower slopes streaming with sea water, its gold '
   'crags reaching into the clouds; the steel-blue sky turns warm gold around the peaks.', GOLD, NOBUILD, top('sky above the peaks'), HAN_S, LAND]),
 'ep11/05A_strike': ([S, SH('hanuman')], [
   'Wide side-on view high above the ocean, all motion from left to right: Hanuman, seen in side view, flies shoulder-first through '
   'the very tip of a glowing summit of gold rock, like the prow of a ship cutting through a wave; the tip of the crag tilts away to '
   'the right and breaks into a spray of gold rock fragments and sea water. Hanuman about one third of the frame height, ' + FLY +
   ', his gold necklace on his chest. The forested lower slopes fall away below into the sea.', GOLD, NOBUILD, top('open sky'), HAN_S, LAND]),
 'ep11/06A_peak': ([S, SH('mainaka'), SH('hanuman')], [
   'Low side view of the summit of a mountain risen from the sea: on the left, on sunlit gold rock among green trees and hanging '
   'creepers, Mainaka stands in three-quarter view from behind, looking up and to the right, his arms opened wide in welcome; he is '
   'about one third of the frame height. High in the sky at the upper right, Hanuman hovers in the air, vast and further away, in '
   'side view facing left toward him, ' + FLY + '. Only these two.', GOLD, NOBUILD, AFT11,
   'Composition: a clear band of open sky between the man and Hanuman with nothing in it.', MAIN_S, HAN_S, LAND]),
 'ep11/07A_offer': ([S, SH('mainaka')], [
   'Medium shot: Mainaka stands on a sunlit summit of gold rock among green trees and creepers, in three-quarter view, with a gentle, '
   'warm elder\'s smile, holding up with both hands a broad green leaf heaped with forest fruits and roots, offering it toward the '
   'sky. The sea far below.', AFT11, side('left', 'open sky'), block('MAINAKA'), LAND]),
 'ep11/08A_heart': ([S, SH('mainaka')], [
   'Close-up of Mainaka\'s face and shoulders in three-quarter view: his kind dark eyes warm and slightly moist with gratitude, a soft '
   'smile, his right hand resting on his heart. Gold rock and green leaves softly blurred behind.', AFT11,
   side('right', 'soft blurred sky'), block('MAINAKA'), LAND]),
 'ep11/09A_reply': ([S, SH('hanuman')], [
   'Close-up of Hanuman\'s face and shoulders in three-quarter view, high in the sky: a warm, kind smile, his amber eyes looking far '
   'past the camera toward the horizon; clouds and steel-blue sky behind, a warm gold glow from below on one side of his face.',
   side('left', 'open sky'), block('HANUMAN'), LAND]),
 'ep11/10A_touch': ([S, SH('hanuman')], [
   'Close-up detail: a huge honey-coloured vanara hand with a gold wrist cuff and short honey-brown fur on the forearm comes in from '
   'the right and rests flat, palm down, gently on a sunlit face of gold rock among green hanging creepers and small leaves. Only '
   'the hand and forearm are visible: no face, no body, nothing held in the hand. Warm afternoon light.', GOLD,
   'Composition: the hand is in the lower half; the top third of the frame is plain sunlit gold rock and creepers with nothing else in it.', LAND]),
 'ep11/11A_away': ([S, SH('hanuman')], [
   'High view from behind and above: Hanuman flies away up into a clear blue afternoon sky, seen from behind, about one fifth of the '
   'frame height, ' + FLY + ', his head turned slightly to look back down; far below on the open sea stands a small mountain with '
   'gold-glowing crags and green slopes; far ahead on the horizon the open sea darkens under heavy cloud.', NOBUILD,
   top('clear blue sky'), HAN_S, LAND]),
 # ---------------- EP 12 ----------------
 'ep12/01A_storm': ([S, SH('hanuman')], [
   'From behind and above: Hanuman flies small over the open ocean, seen from behind, about one eighth of the frame height, ' + FLY +
   '; far ahead the sea heaves up into a towering dark mass of water and storm cloud as tall as a mountain, and inside it two vast '
   'round glowing tawny-amber eyes are opening. No other face or figure.', SEA, AFT12, top('pale afternoon sky above the storm'), HAN_S, LAND]),
 'ep12/02A_lights': ([S], [
   'High among towering cumulus clouds lit warm gold from the side: a few small soft points of white-gold light, like gentle floating '
   'lights with no faces or figures, hover together at the edge of a cloud as if looking down; far below, through a gap in the '
   'clouds, a tiny figure flies over the vast sea; one point of light drifts down toward the sea.',
   'No faces, no figures, no people, no deities among the clouds.', AFT12, top('soft cloud'), LAND]),
 'ep12/03A_rise': ([S, SH('surasa')], [
   'Low angle from among the waves of the open ocean: a colossal figure towers out of mid-sea, standing waist-deep, her head among '
   'dark storm clouds: Surasa in her fearsome form, her mouth closed, short tusks at its corners, her tawny eyes glaring, her robe '
   'and storm-grey hair streaming into spray and cloud.', SEA, AFT12,
   'Composition: she fills the right two thirds; the left third is open sky with nothing in it.', block('SURASA'), LAND]),
 'ep12/04A_face': ([S, SH('surasa'), SH('hanuman')], [
   'Side-on wide view high above the ocean: on the left, Hanuman, small, about one sixth of the frame height, hovers in mid-air in '
   'side view facing right, ' + FLY + '. On the right, a vast stern teal-grey face in three-quarter profile fills the right half of '
   'the frame, cropped by the bottom edge of the frame just below the cheekbones, so only the glaring tawny eyes, heavy brows, a white '
   'shell ear disc and the streaming storm-grey mane are visible; her eyes lock on him. Storm clouds around.', SEA, AFT12,
   'Composition: a clear band of open sky between Hanuman and the face with nothing in it.', SUR_S, HAN_S, LAND]),
 'ep12/05A_palms': ([S, SH('hanuman')], [
   'Medium shot of Hanuman in mid-air high above the sea, in three-quarter view, his palms joined together at his chest in a '
   'respectful greeting, his face calm, glad and sincere, his golden mace strapped on his back; the sea glitters far below; a dark '
   'storm presence at the right edge, out of focus.', AFT12, side('left', 'open sky'), HAN_S, LAND]),
 'ep12/06A_grow': ([S, SH('hanuman'), SH('surasa')], [
   'Side-on wide view of the open ocean with three clear layers of cloud: a low layer of small scattered clouds just above the water, '
   'a middle band of big cumulus, and high towering anvil clouds near the top. On the left, Hanuman hovers in mid-air in side view '
   'facing right, jaw set, eyes narrowed, about one fifth of the frame height, his head just below the low clouds. On the right, '
   'Surasa in her fearsome form stands waist-deep in the sea facing left, her head also just below the low clouds, her mouth closed. '
   'They face each other across open sky. Only these two.', SEA, AFT12, top('open high sky'), SUR_S, HAN_S, LAND]),
 'ep12/08A_shrink': ([S, SH('hanuman'), SH('surasa')], [
   'Wide view high above the ocean, the horizon gently curving far below: on the left, the mountain-sized Hanuman in three-quarter '
   'view from behind, ' + FLY + ', facing the even vaster storm-dark silhouette of Surasa on the right, backlit against the bright '
   'afternoon sky, her shape monumental and mask-like, only her glowing tawny eyes visible in the dark mass; towering clouds below them. '
   'Only these two.', AFT12, top('bright open sky'), HAN_S, LAND]),
 'ep12/09A_dart': ([S], [
   'Wide view: the vast storm-dark silhouette of a colossal mythic figure stands in the sea against a bright afternoon sky, two tawny '
   'eyes glowing high in the dark mass and a deep gulf of shadow in its middle like a cavern in a storm cloud; a single tiny point of '
   'warm golden light streaks out of that shadow and arcs up into the open bright sky, leaving a thin gold trail, like a bright point '
   'sliding free of a dark disc at the end of an eclipse.', SEA, AFT12, top('open bright sky'), LAND]),
 'ep12/10A_true': ([S, SH('hanuman'), SH('surasa')], [
   'Hanuman at his normal size hovers in mid-air in the lower foreground, in three-quarter view, his palms joined at his chest and his '
   'head bowed respectfully, his golden mace on his back. Behind him, vast and softly out of focus, Surasa in her fearsome form stands '
   'in the sea, her face calm now. Only these two.', SEA, AFT12, top('soft open sky above her'), HAN_S, SUR_S, LAND]),
 'ep12/11A_onward': ([S, SH('hanuman')], [
   'High view from behind and above: Hanuman flies away toward the far horizon over the open sea, seen from behind, about one eighth '
   'of the frame height, passing between towering clouds, ' + FLY + '; his shadow races over the waves below, and directly under the '
   'shadow the water is darker and stirring.', SEA, AFT12, top('open sky'), HAN_S, LAND]),
}
import time
base = time.time() - 1000
for i, (key, (refs, parts)) in enumerate(shots.items()):
    ep, name = key.split('/')
    d = f'{ep}/stills/work'; os.makedirs(d, exist_ok=True)
    text = ' '.join([STYLE, BLEED] + parts + [END])
    assert len(text) <= 3000, (key, len(text))
    p = f'{d}/{name}.prompt.txt'
    open(p, 'w').write(text)
    open(f'{d}/{name}.refs', 'w').write('\n'.join(refs) + '\n')
    os.utime(p, (base + i, base + i))
    print(f'{key:22} {len(text):5}  refs={len(refs)}')
