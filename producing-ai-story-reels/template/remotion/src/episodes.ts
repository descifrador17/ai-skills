// Each episode's edit as data (EDIT_PLAN.md, BUILD_PLAN.md Global Constraints). Frames @ 30 fps, 1080×1920 px.
export type EpId = `ep${string}`;
export type Box = { x: number; y: number; w: number; h: number };
// clip: the prepared clip under public/ ("clips/ep01/01B.mp4", from ep01/clips/01B.mp4 by tools/prepare_media.sh);
// srcIn: frames into that 30 fps clip; empty: the area the still was composed to leave free for text.
export type Shot = { clip: string; frames: number; srcIn: number; empty: Box };
// slot: the frames the line may use; lead: frames after the slot opens; durationFrames = ceil(s × 30) of
// the processed wav (tools/process_vo.sh).
export type Take = { slot: [number, number]; lead: number; durationFrames: number };
// One Hinglish line, revealed word by word from `from`, gone by `to`; gold: indices of the key words.
export type Cue = { words: string[]; gold: number[]; from: number; to: number; box: Box; align: "center" | "left" | "right" };
export type Sfx = { file: string; at: number; gain: number }; // file: "sfx/ep01/<name>.wav" under public/
// The golden thread's graphic form: trace draws on, holds and fades; handoff draws on, then shrinks to its end.
export type Thread = { d: string; from: number; to: number; kind: "trace" | "handoff" }; // d: SVG path in 1080×1920 space
export type Episode = {
  seconds?: 15 | 30; // runtime; decision 35 (2026-10-30): 30 from EP 07, 15 before (the default)
  id: EpId; n: number; title: string; shots: Shot[]; takes: Take[]; cues: Cue[]; sfx: Sfx[]; thread: Thread[];
  music: { from: number; base: number; ducked: number }; // from: seconds into ramayana_bg_music.mp3
  trim?: number; // whole-mix gain (VO, music and SFX together, so the approved balance holds); default 1
};


// EP 01, Shiv Dhanush (ep01/script.md). Cuts 2.3, 4.8, 7.6, 9.8 s: the haul, the chest, he strings it, the crack
// (its clip ends on the golden burst), the four who stood. Line 3 ends on the burst so the thunder follows "टूट गया".
const ep01: Episode = {
  id: "ep01", n: 1, title: "Shiv Dhanush",
  shots: [
    { clip: "clips/ep01/01B.mp4", frames: 69, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep01/02B.mp4", frames: 75, srcIn: 20, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep01/03B.mp4", frames: 84, srcIn: 20, empty: { x: 380, y: 300, w: 660, h: 300 } }, // the bow fills the top left; the sky at top right is open
    { clip: "clips/ep01/04B.mp4", frames: 66, srcIn: 85, empty: { x: 90, y: 300, w: 900, h: 200 } },
    { clip: "clips/ep01/05B.mp4", frames: 81, srcIn: 20, empty: { x: 90, y: 300, w: 900, h: 240 } }, // runs through the card transition
  ],
  takes: [
    { slot: [15, 140], lead: 0, durationFrames: 122 }, // 4.05 s: पाँच हज़ार लोग जिसे खींचकर लाए, वह था शिव का धनुष।
    { slot: [140, 240], lead: 10, durationFrames: 72 }, // 2.38 s: श्रीराम ने सहज ही प्रत्यंचा चढ़ाई…
    { slot: [240, 360], lead: 9, durationFrames: 41 }, // 1.34 s: और धनुष टूट गया। (ends at 290, on the burst)
  ],
  cues: [
    { words: ["5000", "log.", "Ek", "dhanush."], gold: [3], from: 6, to: 64, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Shiv", "ka", "dhanush."], gold: [2], from: 76, to: 140, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    // shot 3: the bow's upper limb fills the top left, so the line sits in the sky to the right
    { words: ["Pratyancha", "chadhi…"], gold: [0], from: 152, to: 222, box: { x: 380, y: 330, w: 660, h: 90 }, align: "center" },
    { words: ["Janak", "ka", "pran", "poora", "hua."], gold: [3], from: 302, to: 356, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep01/wind_amb.wav", at: 0, gain: 0.22 },
    { file: "sfx/ep01/haul_rumble.wav", at: 0, gain: 0.28 },
    { file: "sfx/ep01/cart_creak.wav", at: 12, gain: 0.45 },
    { file: "sfx/ep01/cart_creak.wav", at: 42, gain: 0.4 },
    { file: "sfx/ep01/bow_creak.wav", at: 168, gain: 0.55 },
    { file: "sfx/ep01/crack_sparkle.wav", at: 232, gain: 0.45 },
    { file: "sfx/ep01/snap_thunder.wav", at: 292, gain: 0.38 },
    { file: "sfx/ep01/after_rumble.wav", at: 300, gain: 0.25 },
    { file: "sfx/ep01/bell.wav", at: 336, gain: 1 },
  ],
  // the thread lifts from the broken bow (right half, at their feet) and curves up and out past the kneeling court
  thread: [{ d: "M 720 1450 C 900 1250, 980 800, 1110 260", from: 300, to: 355, kind: "handoff" }],
  music: { from: 13.5, base: 0.39, ducked: 0.22 },
};

// EP 02, Do Vardaan (ep02/script.md). Cuts 2.2, 4.6, 7.0, 9.6 s: the waiting throne, the chamber of wrath, the old war
// (sepia), crown and forest (its clip ends on the crown's glow), unchanged. Silence over Kaikeyi's chamber; line 4 lands on Ram.
const ep02: Episode = {
  id: "ep02", n: 2, title: "Do Vardaan",
  shots: [
    { clip: "clips/ep02/01B.mp4", frames: 66, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep02/02B.mp4", frames: 72, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep02/03B.mp4", frames: 72, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep02/04B.mp4", frames: 78, srcIn: 73, empty: { x: 90, y: 300, w: 900, h: 240 } },
    { clip: "clips/ep02/05B.mp4", frames: 87, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } }, // runs through the card transition
  ],
  takes: [
    { slot: [15, 100], lead: 0, durationFrames: 64 }, // 2.10 s: राम के राजतिलक की तैयारी थी।
    { slot: [100, 205], lead: 20, durationFrames: 59 }, // 1.95 s: तभी कैकेयी ने दो वरदान माँगे— (over the old war)
    { slot: [205, 270], lead: 7, durationFrames: 38 }, // 1.25 s: भरत को राजगद्दी…
    { slot: [270, 360], lead: 5, durationFrames: 72 }, // 2.38 s: और राम को चौदह वर्ष का वनवास। (over Ram's calm face)
  ],
  cues: [
    { words: ["Kal", "Ram", "raja", "banenge."], gold: [2], from: 6, to: 62, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Usi", "raat…", "Kaikeyi."], gold: [2], from: 72, to: 134, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Purane", "yuddh", "ke", "do", "vardaan."], gold: [3, 4], from: 142, to: 204, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Bharat", "ko", "rajgaddi."], gold: [2], from: 214, to: 284, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Ram", "shaant", "rahe."], gold: [1], from: 300, to: 356, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep02/wind_amb.wav", at: 0, gain: 0.3 },
    { file: "sfx/ep02/bell.wav", at: 4, gain: 0.3 },
    { file: "sfx/ep02/bell.wav", at: 36, gain: 0.22 },
    { file: "sfx/ep02/lamp_crackle.wav", at: 66, gain: 0.3 },
    { file: "sfx/ep02/battle_thunder.wav", at: 138, gain: 0.25 },
    { file: "sfx/ep02/chariot_gallop.wav", at: 138, gain: 0.55 },
    { file: "sfx/ep02/lights_sparkle.wav", at: 172, gain: 0.5 },
    { file: "sfx/ep02/drone_wind.wav", at: 210, gain: 0.25 },
    { file: "sfx/ep02/forest_breeze.wav", at: 222, gain: 0.8 },
    { file: "sfx/ep02/lights_sparkle.wav", at: 250, gain: 0.6 },
    { file: "sfx/ep02/dawn_birds.wav", at: 288, gain: 0.8 },
  ],
  thread: [
    // arrives from EP 01 and comes to rest on the crown on the throne
    { d: "M 40 260 C 260 520, 380 900, 540 1130", from: 8, to: 62, kind: "trace" },
    // the path-light drifts out through the open courtyard right of Ram, above Dasharatha, clear of both figures
    { d: "M 760 1250 C 880 1150, 980 1080, 1110 980", from: 300, to: 355, kind: "handoff" },
  ],
  music: { from: 157.8, base: 0.39, ducked: 0.22 },
};

// EP 03, Sita ka Faisla (ep03/script.md). Cuts 2.3, 4.6, 7.2, 9.6 s: the hands, her decision, the bark, the knot (the
// wow, wordless: music and the knot only), the chariot leaving with the city behind. Line 3 lands on Lakshman in the chariot.
const ep03: Episode = {
  id: "ep03", n: 3, title: "Sita ka Faisla",
  shots: [
    { clip: "clips/ep03/01B.mp4", frames: 69, srcIn: 30, empty: { x: 40, y: 240, w: 840, h: 200 } }, // Ram's arm cuts down the right side
    { clip: "clips/ep03/02B.mp4", frames: 69, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 240 } }, // the dark wall above her
    { clip: "clips/ep03/03B.mp4", frames: 78, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 160 } },
    { clip: "clips/ep03/04B.mp4", frames: 72, srcIn: 30, empty: { x: 90, y: 300, w: 900, h: 120 } },
    { clip: "clips/ep03/05B.mp4", frames: 87, srcIn: 30, empty: { x: 300, y: 300, w: 700, h: 240 } }, // sky right of the gate; runs through the card transition
  ],
  takes: [
    { slot: [15, 105], lead: 0, durationFrames: 82 }, // 2.73 s: वनवास राम को मिला था, सीता को नहीं।
    { slot: [105, 216], lead: 5, durationFrames: 99 }, // 3.27 s: फिर भी सीता ने स्वयं साथ चलने का निर्णय किया—
    { slot: [288, 360], lead: 12, durationFrames: 39 }, // 1.29 s: और लक्ष्मण भी चल पड़े। (on the chariot)
  ],
  cues: [
    // the approved "…mila tha." is ~900 px; left of Ram's arm there is room for ~840
    { words: ["Sita", "ko", "vanvas", "nahin", "mila."], gold: [3], from: 6, to: 64, box: { x: 40, y: 240, w: 840, h: 90 }, align: "center" },
    { words: ["Apna", "faisla."], gold: [0], from: 75, to: 133, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Resham", "par", "valkal."], gold: [2], from: 144, to: 211, box: { x: 90, y: 330, w: 900, h: 90 }, align: "center" },
    { words: ["Lakshman", "bhi", "saath."], gold: [2], from: 296, to: 356, box: { x: 300, y: 330, w: 700, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep03/wind_amb.wav", at: 0, gain: 0.25 },
    { file: "sfx/ep03/bell.wav", at: 8, gain: 0.22 }, // distant palace bells
    { file: "sfx/ep03/cloth_rustle.wav", at: 150, gain: 0.5 }, // the bark cloth in her hands
    { file: "sfx/ep03/knot_pull.wav", at: 230, gain: 0.4 },
    { file: "sfx/ep03/lights_sparkle.wav", at: 236, gain: 0.35 }, // the soft swell on the knot
    { file: "sfx/ep03/horse_walk.wav", at: 288, gain: 0.45 }, // "go slowly, charioteer" (2-40-22): a walk, not a gallop
    { file: "sfx/ep03/crowd_follow.wav", at: 294, gain: 0.18 }, // the city following on foot, no voices
    { file: "sfx/ep03/wind_amb.wav", at: 300, gain: 0.2 },
  ],
  // EP 02's path-light streaks ahead along the garlanded city wall, above the horses' heads and right of Lakshman, out of frame
  thread: [{ d: "M 760 1040 C 860 1015, 960 990, 1100 960", from: 300, to: 355, kind: "handoff" }],
  music: { from: 84, base: 0.39, ducked: 0.22 }, // 1:24 "breath and motif", option A (checkpoint 4)
};

// EP 04, Paduka Raj (ep04/script.md). Cuts 2.3, 4.8, 7.4, 9.8 s: the sandals enthroned at Nandigrama, the plea at
// Chitrakoot, Ram's feet on the padukas (the quiet wow, wordless; its clip is used from 1.5 s, past a hop Kling added),
// Bharat carrying them on his head, Bharat holding the parasol over them.
const ep04: Episode = {
  id: "ep04", n: 4, title: "Paduka Raj",
  shots: [
    { clip: "clips/ep04/01B.mp4", frames: 69, srcIn: 30, empty: { x: 520, y: 240, w: 520, h: 300 } }, // right of the parasol dome
    { clip: "clips/ep04/02B.mp4", frames: 75, srcIn: 30, empty: { x: 90, y: 240, w: 900, h: 140 } }, // sky above the peak
    { clip: "clips/ep04/03B.mp4", frames: 78, srcIn: 45, empty: { x: 90, y: 240, w: 900, h: 100 } },
    { clip: "clips/ep04/04B.mp4", frames: 72, srcIn: 30, empty: { x: 750, y: 240, w: 290, h: 400 } }, // right of his raised arms
    { clip: "clips/ep04/05B.mp4", frames: 81, srcIn: 30, empty: { x: 90, y: 240, w: 900, h: 130 } }, // carved wall above the parasol; runs through the card transition
  ],
  takes: [
    { slot: [15, 144], lead: 5, durationFrames: 78 }, // 2.58 s: चित्रकूट में भी राम लौटने को नहीं माने।
    { slot: [144, 270], lead: 6, durationFrames: 111 }, // 3.69 s: तब भरत उनकी स्वर्ण-जड़ित पादुकाएँ सिर पर रखकर लौटे— ("सिर पर" near the cut to shot 4)
    { slot: [270, 360], lead: 18, durationFrames: 69 }, // 2.28 s: और नंदीग्राम में उन्हें ही राजा माना। (pre-laps shot 5)
  ],
  cues: [
    // the approved "Ayodhya ka raja: paduka." (~720 px) doesn't fit beside the parasol (520)
    { words: ["Raja:", "paduka."], gold: [1], from: 6, to: 64, box: { x: 520, y: 300, w: 520, h: 90 }, align: "center" },
    { words: ["Chitrakoot", "mein", "vinti."], gold: [2], from: 75, to: 139, box: { x: 90, y: 250, w: 900, h: 90 }, align: "center" },
    // "Sir par paduka." (~450 px) doesn't fit beside his arms (290); the VO says the rest
    { words: ["Sir", "par."], gold: [0, 1], from: 228, to: 289, box: { x: 750, y: 300, w: 290, h: 90 }, align: "center" },
    { words: ["Chaudah", "saal,", "paduka", "raj."], gold: [2], from: 300, to: 356, box: { x: 90, y: 250, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep04/lamp_crackle.wav", at: 0, gain: 0.3 },
    { file: "sfx/ep04/bell.wav", at: 10, gain: 0.22 },
    { file: "sfx/ep04/river_birds.wav", at: 66, gain: 0.5 }, // the Mandakini and its birds
    { file: "sfx/ep04/far_waterfall.wav", at: 69, gain: 0.15 },
    { file: "sfx/ep04/drone_wind.wav", at: 150, gain: 0.2 }, // the hum under the feet shot
    { file: "sfx/ep04/footfall.wav", at: 189, gain: 0.4 }, // the foot lands on the paduka (clip 3.0 s)
    { file: "sfx/ep04/walk_steps.wav", at: 222, gain: 0.4 },
    { file: "sfx/ep04/forest_breeze.wav", at: 222, gain: 0.5 },
    { file: "sfx/ep04/drone_wind.wav", at: 296, gain: 0.25 },
    { file: "sfx/ep04/bell.wav", at: 300, gain: 0.2 }, // a single bell for the crowned sandals (0.3 peaked at -0.8 dBTP over line 3)
  ],
  // a gold light leaves the sandals and drifts out to the left toward the forest, under the parasol, clear of Bharat
  thread: [{ d: "M 360 1450 C 270 1420, 160 1370, -20 1290", from: 300, to: 355, kind: "handoff" }],
  music: { from: 3, base: 0.39, ducked: 0.22 }, // 0:03 soft intro motif, option A (checkpoint 4)
};

// EP 05, Maya Mrig (ep05/script.md). Cuts 2.2, 4.7, 7.3, 9.7 s: the golden deer at the hermitage's edge, the forest's
// animals fleeing it, Sita delighted and Lakshman wary, the wow (struck, the deer dissolves into gold and Maricha falls;
// wordless), Ram turning back toward the hut at the false cry.
const ep05: Episode = {
  id: "ep05", n: 5, title: "Maya Mrig",
  shots: [
    { clip: "clips/ep05/01B.mp4", frames: 65, srcIn: 0, empty: { x: 90, y: 240, w: 900, h: 80 } }, // the glow above the antler tips (the deer fills the frame)
    { clip: "clips/ep05/02B.mp4", frames: 75, srcIn: 6, empty: { x: 90, y: 250, w: 900, h: 200 } }, // misty trees above the meadow
    { clip: "clips/ep05/03B.mp4", frames: 80, srcIn: 10, empty: { x: 90, y: 250, w: 900, h: 200 } }, // the leaf wall above their heads
    { clip: "clips/ep05/04B.mp4", frames: 70, srcIn: 50, empty: { x: 90, y: 240, w: 900, h: 100 } }, // dissolve 55-85, the giant lands ~112
    { clip: "clips/ep05/05B.mp4", frames: 85, srcIn: 45, empty: { x: 90, y: 240, w: 480, h: 140 } }, // sky left of Ram's head; he turns toward the hut at ~320; runs through the card transition
  ],
  takes: [
    { slot: [15, 140], lead: 15, durationFrames: 78 }, // 2.58 s: वन के पशु उस सोने के मृग से भागे— ("भागे" on the fleeing)
    { slot: [140, 220], lead: 8, durationFrames: 59 }, // 1.95 s: वह मृग नहीं, मारीच था।
    { slot: [220, 360], lead: 12, durationFrames: 117 }, // 3.88 s: राम के स्वर में पुकार उठी— "हा सीते! हा लक्ष्मण!" (the cry lands on Ram turning)
  ],
  cues: [
    { words: ["Woh", "hiran", "asli", "nahin", "tha."], gold: [2], from: 6, to: 64, box: { x: 90, y: 240, w: 900, h: 80 }, align: "center" },
    { words: ["Pashu", "pehchaan", "gaye."], gold: [1], from: 75, to: 139, box: { x: 90, y: 280, w: 900, h: 90 }, align: "center" },
    { words: ["Lakshman:", "\"Yeh", "Maricha", "hai.\""], gold: [2], from: 150, to: 219, box: { x: 90, y: 350, w: 900, h: 90 }, align: "center" },
    { words: ["Nakli", "pukaar."], gold: [0], from: 300, to: 356, box: { x: 90, y: 255, w: 480, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep05/forest_birds.wav", at: 0, gain: 0.4 },
    { file: "sfx/ep05/deer_glow.wav", at: 8, gain: 0.2 },
    { file: "sfx/ep05/alarm_calls.wav", at: 66, gain: 0.2 },
    { file: "sfx/ep05/wings_flap.wav", at: 68, gain: 0.4 },
    { file: "sfx/ep05/peacock.wav", at: 74, gain: 0.3 },
    { file: "sfx/ep05/forest_breeze.wav", at: 140, gain: 0.45 },
    { file: "sfx/ep05/bow_creak.wav", at: 175, gain: 0.3 }, // Lakshman's hand on the bow
    { file: "sfx/ep05/arrow_shot.wav", at: 216, gain: 0.45 }, // the unseen arrow, across the cut
    { file: "sfx/ep05/gold_peel.wav", at: 226, gain: 0.35 }, // the deer dissolving into gold
    { file: "sfx/ep05/heavy_fall.wav", at: 282, gain: 0.6 }, // Maricha hits the grass (clip frame ~112)
    { file: "sfx/ep05/drone_wind.wav", at: 290, gain: 0.25 },
  ],
  // the cry travels home: a gold line leaves Ram's side and runs left through the trees toward the hut, below the cue
  thread: [{ d: "M 400 1400 C 300 1340, 180 1250, -20 1180", from: 300, to: 355, kind: "handoff" }],
  music: { from: 160, base: 0.39, ducked: 0.22 }, // 2:40 muffled and dark, option A (checkpoint 4)
};

// EP 06, Sadhu ka Vesh (ep06/script.md). Cuts 2.0, 4.0, 6.0, 8.0, 10.0 s (six even shots: the last needs 60 story frames): the ascetic walking to the hut, the Godavari
// going glass-still, Sita offering water (the guest's point of view), the wow (his shadow lowers the umbrella, raises its
// arms for the clap and bursts into the crowned, many-headed king; wordless), the golden chariot flying off, Jatayu waking.
const ep06: Episode = {
  id: "ep06", n: 6, title: "Sadhu ka Vesh",
  shots: [
    { clip: "clips/ep06/01B.mp4", frames: 60, srcIn: 0, empty: { x: 90, y: 240, w: 900, h: 200 } }, // the bright sky between the canopies
    { clip: "clips/ep06/02B.mp4", frames: 60, srcIn: 20, empty: { x: 90, y: 240, w: 900, h: 300 } }, // clouds; the reeds dissolve from clip frame 97
    { clip: "clips/ep06/03B.mp4", frames: 60, srcIn: 6, empty: { x: 90, y: 260, w: 640, h: 200 } }, // thatch and sky, left of the umbrella
    { clip: "clips/ep06/04B.mp4", frames: 60, srcIn: 40, empty: { x: 90, y: 240, w: 900, h: 100 } }, // umbrella lowering → arms up (clip 70) → crowned shadow (~100)
    { clip: "clips/ep06/05B.mp4", frames: 60, srcIn: 10, empty: { x: 90, y: 240, w: 900, h: 300 } }, // the pale sky above the chariot
    { clip: "clips/ep06/06B.mp4", frames: 75, srcIn: 10, empty: { x: 90, y: 240, w: 900, h: 300 } }, // sky above Jatayu; eyes open ~clip 48; his head drifts white after clip ~90, so the shot ends at 85 (in the card transition)
  ],
  takes: [
    { slot: [15, 120], lead: 5, durationFrames: 82 }, // 2.72 s: एक साधु आया— और हवा तक थम गई।
    { slot: [120, 176], lead: 6, durationFrames: 43 }, // 1.42 s: सीता जी ने आसन दिया।
    { slot: [176, 246], lead: 0, durationFrames: 65 }, // 2.15 s: पर वह साधु नहीं, रावण था— (pre-laps the cut by 4; "रावण" as the shadow bursts)
    { slot: [246, 360], lead: 24, durationFrames: 64 }, // 2.12 s: पुकार सुनकर जटायु जाग उठे। ("जटायु" on the cut to him at 300)
  ],
  cues: [
    { words: ["Sadhu", "ke", "vesh", "mein", "kaun", "tha?"], gold: [2], from: 6, to: 59, box: { x: 90, y: 340, w: 900, h: 90 }, align: "center" }, // below the sun disc
    { words: ["Godavari", "bhi", "sahmi."], gold: [2], from: 66, to: 119, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Atithi", "samajh", "kar."], gold: [0], from: 128, to: 179, box: { x: 90, y: 300, w: 640, h: 90 }, align: "center" },
    { words: ["Sita", "ka", "haran."], gold: [2], from: 246, to: 299, box: { x: 90, y: 320, w: 900, h: 90 }, align: "center" },
    { words: ["Jatayu", "jaag", "gaye."], gold: [0], from: 308, to: 356, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep06/forest_fade.wav", at: 0, gain: 0.25 }, // the forest falls silent (3-46-6)
    { file: "sfx/ep06/walk_steps.wav", at: 4, gain: 0.35 },
    { file: "sfx/ep06/river_fade.wav", at: 60, gain: 0.35 }, // the Godavari's flow fading out (3-46-7)
    { file: "sfx/ep06/bangle.wav", at: 126, gain: 0.2 },
    { file: "sfx/ep06/water_pour.wav", at: 132, gain: 0.2 },
    { file: "sfx/ep06/rumble_rise.wav", at: 202, gain: 0.2 },
    { file: "sfx/ep06/clap.wav", at: 210, gain: 0.3 }, // the shadow's raised hands (3-49-1); 0.5 peaked at -0.4 dBFS over line 3
    { file: "sfx/ep06/wind_gust.wav", at: 240, gain: 0.15 },
    { file: "sfx/ep06/far_bray.wav", at: 252, gain: 0.15 }, // the asses (3-49-19)
    { file: "sfx/ep06/feathers.wav", at: 305, gain: 0.35 },
    { file: "sfx/ep06/eagle_call.wav", at: 346, gain: 0.35 }, // after "जाग उठे"
  ],
  // the chariot's path: a gold streak crosses the sky above Jatayu, under the cue, and leaves to the right (into EP 07's fight)
  thread: [{ d: "M -20 560 C 300 470, 700 450, 1100 520", from: 308, to: 355, kind: "handoff" }],
  music: { from: 145, base: 0.32, ducked: 0.17 }, // 2:25 end of the second build, option A (checkpoint 4); the build's peak under lines 3-4 hit -0.5 dBFS at 0.39/0.22
};

// EP 07, Gidhraj Jatayu (ep07/script.md). The first 30 s reel (decision 35): 11 shots, story 0-809. The hook (Jatayu and
// the flying chariot), his eye, the wow (the collision of silhouettes; Ravana's ten heads, decision 36; wordless), the
// arrows, the bow, the chariot, Ravana's sword (in colour; his extra heads dissolve after clip 75, so the shot ends at 70),
// the fall with Sita, Ram finding him, Ram kindling the fire, the pyre.
const ep07: Episode = {
  seconds: 30,
  id: "ep07", n: 7, title: "Gidhraj Jatayu",
  shots: [
    { clip: "clips/ep07/01B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 260, w: 900, h: 120 } }, // open sky above the chariot (its parasol tops out near y 420)
    { clip: "clips/ep07/02B.mp4", frames: 75, srcIn: 0, empty: { x: 40, y: 880, w: 400, h: 120 } }, // dark sky left of his ruff
    { clip: "clips/ep07/03B.mp4", frames: 70, srcIn: 20, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow: eagle dives in at ~clip 30-90
    { clip: "clips/ep07/04B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 250, w: 900, h: 110 } }, // his head stays dark to ~70
    { clip: "clips/ep07/05B.mp4", frames: 70, srcIn: 30, empty: { x: 90, y: 250, w: 900, h: 110 } }, // the snap at ~clip 90
    { clip: "clips/ep07/06B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 410, w: 900, h: 110 } }, // under the parasol, over the chariot
    { clip: "clips/ep07/07B.mp4", frames: 70, srcIn: 0, empty: { x: 40, y: 240, w: 600, h: 110 } }, // sky left of the sword, above his crown
    { clip: "clips/ep07/08B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // the canopy
    { clip: "clips/ep07/09B.mp4", frames: 80, srcIn: 0, empty: { x: 300, y: 260, w: 600, h: 120 } }, // sky right of Ram's bow
    { clip: "clips/ep07/10B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // dusk sky
    { clip: "clips/ep07/11B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // dusk sky; runs through the card transition
  ],
  takes: [
    { slot: [15, 140], lead: 0, durationFrames: 109 }, // 3.61 s: सीता की पुकार पर बूढ़े जटायु ने रावण को ललकारा—
    { slot: [140, 300], lead: 0, durationFrames: 94 }, // 3.11 s: "मेरे जीते जी, तू सीता को नहीं ले जा सकता!" (over the wow)
    { slot: [300, 440], lead: 0, durationFrames: 94 }, // 3.13 s: उन्होंने रावण का धनुष तोड़ा, रथ चूर कर दिया।
    { slot: [440, 590], lead: 0, durationFrames: 84 }, // 2.79 s: पर रावण की तलवार ने उनके पंख काट दिए।
    { slot: [590, 700], lead: 0, durationFrames: 93 }, // 3.07 s: रावण की दिशा बताकर जटायु ने प्राण त्यागे।
    { slot: [700, 810], lead: 0, durationFrames: 89 }, // 2.95 s: राम ने पिता समान उनका अंतिम संस्कार किया।
  ],
  cues: [
    { words: ["Ek", "pakshi", "ne", "Ravana", "ko", "roka."], gold: [1], from: 6, to: 70, box: { x: 90, y: 280, w: 900, h: 90 }, align: "center" },
    { words: ["60,000", "saal."], gold: [0], from: 81, to: 145, box: { x: 40, y: 900, w: 400, h: 90 }, align: "center" },
    { words: ["Pankhon", "ki", "dhaal."], gold: [0], from: 226, to: 285, box: { x: 90, y: 260, w: 900, h: 90 }, align: "center" },
    { words: ["Ratnon", "ka", "dhanush", "toota."], gold: [0], from: 296, to: 355, box: { x: 90, y: 260, w: 900, h: 90 }, align: "center" },
    { words: ["Rath", "choor-choor."], gold: [1], from: 366, to: 430, box: { x: 90, y: 420, w: 900, h: 90 }, align: "center" },
    { words: ["Phir", "uthi", "talwaar."], gold: [2], from: 441, to: 500, box: { x: 40, y: 250, w: 600, h: 90 }, align: "center" },
    { words: ["Saahas", "ki", "umr", "nahin", "hoti."], gold: [2], from: 511, to: 580, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["\"Dakshin", "ki", "or…\""], gold: [0], from: 591, to: 660, box: { x: 300, y: 280, w: 600, h: 90 }, align: "center" },
    { words: ["Pita", "samaan."], gold: [0], from: 671, to: 740, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Uttam", "lok", "ko", "gaye."], gold: [0, 1], from: 751, to: 805, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep07/wind_amb.wav", at: 0, gain: 0.25 },
    { file: "sfx/ep07/eagle_call.wav", at: 18, gain: 0.3 }, // "Stop, stop, Dashagriva!" (3-50-28)
    { file: "sfx/ep07/drone_wind.wav", at: 75, gain: 0.2 },
    { file: "sfx/ep07/feathers.wav", at: 80, gain: 0.3 },
    { file: "sfx/ep07/thunder_clash.wav", at: 150, gain: 0.4 }, // "like two winged mountains" (3-51-3)
    { file: "sfx/ep07/wings_flap.wav", at: 152, gain: 0.35 },
    { file: "sfx/ep07/arrow_shot.wav", at: 222, gain: 0.3 },
    { file: "sfx/ep07/arrow_shot.wav", at: 231, gain: 0.25 },
    { file: "sfx/ep07/wings_flap.wav", at: 245, gain: 0.3 },
    { file: "sfx/ep07/bow_snap.wav", at: 350, gain: 0.45 }, // the bow snaps at clip ~90 (3-51-13)
    { file: "sfx/ep07/pearls_scatter.wav", at: 353, gain: 0.3 },
    { file: "sfx/ep07/chariot_splinter.wav", at: 362, gain: 0.35 }, // 3-51-16
    { file: "sfx/ep07/far_bray.wav", at: 372, gain: 0.12 },
    { file: "sfx/ep07/sword_draw.wav", at: 437, gain: 0.3 },
    { file: "sfx/ep07/sword_swing.wav", at: 492, gain: 0.3 }, // cut before it lands (3-51-42)
    { file: "sfx/ep07/forest_breeze.wav", at: 505, gain: 0.3 },
    { file: "sfx/ep07/feathers.wav", at: 508, gain: 0.25 },
    { file: "sfx/ep07/forest_birds.wav", at: 585, gain: 0.18 },
    { file: "sfx/ep07/fire_drill.wav", at: 668, gain: 0.3 }, // 3-68-27
    { file: "sfx/ep07/flame_catch.wav", at: 700, gain: 0.25 },
    { file: "sfx/ep07/pyre_crackle.wav", at: 745, gain: 0.4 },
    { file: "sfx/ep07/river_dusk.wav", at: 745, gain: 0.2 }, // the Godavari (3-68-35)
  ],
  // one gold spark leaves the pyre and drifts west over the dark forest (toward Kabandha and Shabari, EP 08)
  thread: [{ d: "M 330 1300 C 250 1100, 120 900, -20 760", from: 755, to: 805, kind: "handoff" }],
  music: { from: 145, base: 0.39, ducked: 0.22 }, // 2:25 the build peaks, then falls dark, option A (checkpoint 4)
};

// EP 08, Shabari ki Raah (ep08/script.md). 30 s (decision 35), 11 shots: Shabari waiting by Pampa, Kabandha's arms,
// Kabandha freed, the shore, she rises to greet them, water for his feet, "my birth has borne fruit", the fruits, the
// unwithered wood, the wow (she rises as light; wordless; the light turns wing-shaped after clip ~110, so the shot ends
// at 80), the brothers setting out toward Rishyamuka.
const ep08: Episode = {
  seconds: 30,
  id: "ep08", n: 8, title: "Shabari ki Raah",
  shots: [
    { clip: "clips/ep08/01B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // sky and canopy above her
    { clip: "clips/ep08/02B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 500, w: 900, h: 120 } }, // the gloom under the amber glow
    { clip: "clips/ep08/03B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // the dusk sky
    { clip: "clips/ep08/04B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // sky above the trees
    { clip: "clips/ep08/05B.mp4", frames: 70, srcIn: 40, empty: { x: 60, y: 280, w: 420, h: 120 } }, // sky left of her (she rises to the top)
    { clip: "clips/ep08/06B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 860, w: 900, h: 130 } }, // the meadow between the leaf cup and the toes (the sky beside her hands is too narrow for one line)
    { clip: "clips/ep08/07B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // leaves above her face
    { clip: "clips/ep08/08B.mp4", frames: 80, srcIn: 0, empty: { x: 300, y: 280, w: 700, h: 120 } }, // sky above the lake, right of Ram's hair
    { clip: "clips/ep08/09B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // the canopy
    { clip: "clips/ep08/10B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow
    { clip: "clips/ep08/11B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 120 } }, // sky above the mountain; runs through the card transition
  ],
  takes: [
    { slot: [15, 140], lead: 0, durationFrames: 116 }, // 3.84 s: बरसों से एक वृद्ध तपस्विनी राम की राह देख रही थीं।
    { slot: [140, 280], lead: 0, durationFrames: 91 }, // 3.01 s: राह में मिले कबंध ने बताया— "शबरी से मिलो।"
    { slot: [280, 440], lead: 0, durationFrames: 98 }, // 3.25 s: पम्पा किनारे शबरी ने उन्हें देखा, और चरण छू लिए। ("चरण छू" on the feet shot)
    { slot: [440, 525], lead: 0, durationFrames: 71 }, // 2.35 s: बोलीं, "आज मेरा जन्म सफल हुआ।
    { slot: [525, 610], lead: 0, durationFrames: 58 }, // 1.91 s: आपके लिए वन के फल जुटाए हैं।"
    { slot: [610, 810], lead: 0, durationFrames: 131 }, // 4.35 s: राम से विदा लेकर, बिजली-सी चमकती वे गुरुओं के लोक चली गईं।
  ],
  cues: [
    { words: ["Barson", "ki", "pratiksha."], gold: [0], from: 6, to: 70, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Raah", "mein", "Kabandh."], gold: [2], from: 81, to: 140, box: { x: 90, y: 510, w: 900, h: 90 }, align: "center" },
    { words: ["\"Shabari", "se", "milo.\""], gold: [0], from: 151, to: 215, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Pampa", "ke", "kinaare."], gold: [0], from: 226, to: 290, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Ram", "aa", "gaye."], gold: [0], from: 301, to: 360, box: { x: 60, y: 300, w: 420, h: 90 }, align: "center" },
    { words: ["Charan", "pakhaare."], gold: [1], from: 371, to: 430, box: { x: 90, y: 880, w: 900, h: 90 }, align: "center" },
    { words: ["\"Janm", "saphal", "hua.\""], gold: [1], from: 441, to: 510, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Aapke", "liye", "van", "ke", "phal."], gold: [2, 3, 4], from: 521, to: 590, box: { x: 300, y: 300, w: 700, h: 90 }, align: "center" },
    { words: ["Vedi", "aaj", "bhi", "roshan."], gold: [3], from: 601, to: 660, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Ab", "Sugreev", "ki", "or."], gold: [1], from: 751, to: 805, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep08/forest_birds.wav", at: 0, gain: 0.3 },
    { file: "sfx/ep08/forest_breeze.wav", at: 0, gain: 0.2 },
    { file: "sfx/ep08/growl.wav", at: 80, gain: 0.3 }, // Kabandha (3-69-28: "his sounding is like thunder")
    { file: "sfx/ep08/twig_break.wav", at: 88, gain: 0.25 },
    { file: "sfx/ep08/lights_sparkle.wav", at: 150, gain: 0.22 },
    { file: "sfx/ep08/wings_flap.wav", at: 155, gain: 0.22 }, // the swans (3-72-6)
    { file: "sfx/ep08/lake_lap.wav", at: 220, gain: 0.3 },
    { file: "sfx/ep08/forest_breeze.wav", at: 295, gain: 0.22 },
    { file: "sfx/ep08/water_pour.wav", at: 368, gain: 0.22 }, // water for his feet (3-74-7)
    { file: "sfx/ep08/forest_birds.wav", at: 440, gain: 0.14 },
    { file: "sfx/ep08/cloth_rustle.wav", at: 520, gain: 0.14 },
    { file: "sfx/ep08/lamp_crackle.wav", at: 598, gain: 0.22 }, // the altar still burning (3-74-24)
    { file: "sfx/ep08/drip.wav", at: 602, gain: 0.28 }, // the bark cloths still wet (3-74-26)
    { file: "sfx/ep08/gold_peel.wav", at: 668, gain: 0.3 },
    { file: "sfx/ep08/bell.wav", at: 690, gain: 0.16 },
    { file: "sfx/ep08/walk_steps.wav", at: 750, gain: 0.28 },
  ],
  // a thin gold path runs from the brothers' feet along the shore toward Rishyamuka (EP 09: Hanuman)
  thread: [{ d: "M 560 1500 C 620 1320, 690 1160, 760 1010", from: 751, to: 805, kind: "handoff" }],
  music: { from: 84, base: 0.39, ducked: 0.22 }, // 1:24 breath and motif, option A (checkpoint 4)
};

// EP 09, Pehli Bhent (ep09/script.md). 30 s, 11 shots: Sugriva's point of view from the ridge, the vanaras' flight, Hanuman
// sent in disguise, the monk at Pampa, folded hands, Ram's smile, Lakshman's tears, the monk's joy, the wow (the monk rises
// into Hanuman, start/end morph, srcIn 30), the leap with the brothers on his back, the hands clasped over the fire.
const ep09: Episode = {
  seconds: 30,
  id: "ep09", n: 9, title: "Pehli Bhent",
  shots: [
    { clip: "clips/ep09/01B.mp4", frames: 75, srcIn: 45, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky above the ridge; the hand reaches in from clip ~2.5 s
    { clip: "clips/ep09/02B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 530, w: 900, h: 110 } }, // take 2 (user: "vaanar is air walking"): sky between the blossom branch and the ridge
    { clip: "clips/ep09/03B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky and blossom above Hanuman
    { clip: "clips/ep09/04B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // canopy and sky above the monk
    { clip: "clips/ep09/05B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky above the brothers
    { clip: "clips/ep09/06B.mp4", frames: 90, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky above Ram; the take holds a still smile to clip 3.0 s
    { clip: "clips/ep09/07B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 110 } }, // sky above Lakshman
    { clip: "clips/ep09/08B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky between the blossom and his head
    { clip: "clips/ep09/09B.mp4", frames: 80, srcIn: 30, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow: the monk glows ~clip 30, Hanuman stands by ~110
    { clip: "clips/ep09/10B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 1230, w: 900, h: 110 } }, // mist and rock between the cliffs, under the leap (the sun fills the top)
    { clip: "clips/ep09/11B.mp4", frames: 80, srcIn: 0, empty: { x: 90, y: 250, w: 900, h: 100 } }, // dark hillside above the clasped hands; runs through the card transition
  ],
  takes: [
    { slot: [15, 155], lead: 0, durationFrames: 123 }, // 4.08 s: दो धनुर्धारी देखकर सुग्रीव डर गए— "वाली के भेजे होंगे!"
    { slot: [160, 295], lead: 0, durationFrames: 103 }, // 3.41 s: तब हनुमान भिक्षु का वेश धरकर पंपा किनारे पहुँचे।
    { slot: [300, 455], lead: 0, durationFrames: 116 }, // 3.85 s: उनकी वाणी सुन राम खिल उठे— "एक भी शब्द ग़लत नहीं!"
    { slot: [460, 595], lead: 0, durationFrames: 98 }, // 3.24 s: लक्ष्मण ने नम आँखों से सीता-हरण की बात बताई।
    { slot: [600, 700], lead: 0, durationFrames: 91 }, // 3.02 s: असली रूप में हनुमान दोनों को पीठ पर ले चले।
    { slot: [704, 810], lead: 0, durationFrames: 103 }, // 3.41 s: और अग्नि को साक्षी मान, राम-सुग्रीव मित्र बने। (pre-laps from shot 10)
  ],
  cues: [
    { words: ["Ye", "Vali", "ke", "jasoos?"], gold: [1], from: 6, to: 70, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Darr", "se", "bhaage", "vanar."], gold: [0], from: 81, to: 145, box: { x: 90, y: 540, w: 900, h: 90 }, align: "center" },
    { words: ["\"Bhes", "badal", "kar", "jao.\""], gold: [0], from: 156, to: 215, box: { x: 90, y: 290, w: 900, h: 90 }, align: "center" },
    { words: ["Ek", "bhikshu,", "Pampa", "kinare."], gold: [1], from: 226, to: 285, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["\"Aap", "kaun", "hain?\""], gold: [1], from: 296, to: 355, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Teeno", "Ved", "jaanta", "hai."], gold: [1], from: 366, to: 445, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Sita", "ka", "haran."], gold: [0], from: 456, to: 515, box: { x: 90, y: 280, w: 900, h: 90 }, align: "center" },
    { words: ["\"Aapka", "aana", "saubhagya.\""], gold: [2], from: 526, to: 590, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Peeth", "par", "bitha", "kar."], gold: [0], from: 681, to: 740, box: { x: 90, y: 1230, w: 900, h: 90 }, align: "center" },
    { words: ["Agni", "saakshi."], gold: [1], from: 751, to: 805, box: { x: 90, y: 255, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep09/mountain_wind.wav", at: 0, gain: 0.2 },
    { file: "sfx/ep09/forest_birds.wav", at: 0, gain: 0.22 },
    { file: "sfx/ep09/twig_break.wav", at: 30, gain: 0.2 }, // the branch in his grip
    { file: "sfx/ep09/leap_swoosh.wav", at: 80, gain: 0.25 },
    { file: "sfx/ep09/branch_break.wav", at: 92, gain: 0.25 }, // 4-2-10
    { file: "sfx/ep09/leap_swoosh.wav", at: 118, gain: 0.22 },
    { file: "sfx/ep09/wind_hum.wav", at: 150, gain: 0.2 },
    { file: "sfx/ep09/walk_steps.wav", at: 222, gain: 0.25 },
    { file: "sfx/ep09/lake_lap.wav", at: 225, gain: 0.22 },
    { file: "sfx/ep09/forest_breeze.wav", at: 290, gain: 0.2 },
    { file: "sfx/ep09/forest_birds.wav", at: 360, gain: 0.18 },
    { file: "sfx/ep09/cloth_rustle.wav", at: 455, gain: 0.14 },
    { file: "sfx/ep09/forest_birds.wav", at: 520, gain: 0.14 },
    { file: "sfx/ep09/rumble_rise.wav", at: 600, gain: 0.3 },
    { file: "sfx/ep09/lights_sparkle.wav", at: 610, gain: 0.25 }, // the reveal
    { file: "sfx/ep09/leap_swoosh.wav", at: 680, gain: 0.28 },
    { file: "sfx/ep09/rocks_slide.wav", at: 690, gain: 0.15 },
    { file: "sfx/ep09/lamp_crackle.wav", at: 745, gain: 0.35 }, // the fire (4-5-15)
    { file: "sfx/ep09/forest_breeze.wav", at: 745, gain: 0.15 },
  ],
  // one gold spark leaves the fire and drifts away under the hands, out at the left (toward the sea, EP 10)
  thread: [{ d: "M 380 1350 C 280 1300, 140 1220, -20 1150", from: 755, to: 805, kind: "handoff" }],
  music: { from: 0, base: 0.39, ducked: 0.22 }, // 0:00 soft intro, then the build at 0:22, option A (checkpoint 4)
};

// EP 10, Jambavan ki Pukaar (ep10/script.md). 30 s, 11 shots: the sea at dusk, the roll call, Jambavan, Hanuman alone (the
// ring glows in the clip itself, so no Remotion glint), Jambavan's paw on his shoulder, the memory of the sun, the turn
// (srcIn 45 so the cue sits in the sky left of his crown), the growth (start/end morph, srcIn 45), Mahendra pressed (srcIn 50),
// the wow (the spring, srcIn 40), the flight over the sea (0-3.2 s; a splash appears at clip ~4 s).
const ep10: Episode = {
  seconds: 30,
  id: "ep10", n: 10, title: "Jambavan ki Pukaar",
  shots: [
    { clip: "clips/ep10/01B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 280, w: 900, h: 110 } }, // dusk sky above the wave; the wave curls by clip 2.5 s
    { clip: "clips/ep10/02B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky above the shore
    { clip: "clips/ep10/03B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // clouds above his ears
    { clip: "clips/ep10/04B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // sky above him
    { clip: "clips/ep10/05B.mp4", frames: 70, srcIn: 45, empty: { x: 90, y: 255, w: 900, h: 100 } }, // sky above the crown and the ears; Jambavan smiles from clip ~3 s
    { clip: "clips/ep10/06B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 300, w: 900, h: 110 } }, // the dawn sky above the sun
    { clip: "clips/ep10/07B.mp4", frames: 70, srcIn: 45, empty: { x: 40, y: 250, w: 340, h: 100 } }, // the sky corner left of the crown spire (the head fills the rest from clip 1.6 s)
    { clip: "clips/ep10/08B.mp4", frames: 75, srcIn: 45, empty: { x: 90, y: 1440, w: 900, h: 110 } }, // the crowd silhouettes below his feet (the mace and crown sweep through the sky as he grows)
    { clip: "clips/ep10/09B.mp4", frames: 70, srcIn: 50, empty: { x: 90, y: 290, w: 900, h: 110 } }, // clouds above the summit; the burst at clip ~3 s
    { clip: "clips/ep10/10B.mp4", frames: 80, srcIn: 10, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow: crouch, the spring at clip ~2 s, the rise; ends at clip 3.0 s, before the trees smear into a morph (~3.2 s; user: "this animation looks off")
    { clip: "clips/ep10/11B.mp4", frames: 95, srcIn: 0, empty: { x: 90, y: 1150, w: 900, h: 110 } }, // open sea beside the blossom wake, below him; runs through the card transition
  ],
  takes: [
    { slot: [15, 140], lead: 0, durationFrames: 113 }, // 3.75 s: सौ योजन का सागर देखकर वानर सेना निराश हो गई।
    { slot: [140, 255], lead: 0, durationFrames: 103 }, // 3.43 s: सबसे वृद्ध जाम्बवान बोले, "अब मैं बूढ़ा हो गया।"
    { slot: [255, 362], lead: 0, durationFrames: 91 }, // 3.01 s: फिर वे एकांत में चुप बैठे हनुमान के पास गए।
    { slot: [362, 475], lead: 0, durationFrames: 99 }, // 3.27 s: "तुम पवनपुत्र हो! बचपन में सूरज की ओर उड़े थे।"
    { slot: [475, 595], lead: 0, durationFrames: 78 }, // 2.59 s: "उठो, और इस महासागर को लाँघ जाओ!"
    { slot: [595, 810], lead: 0, durationFrames: 92 }, // 3.05 s: महेन्द्र पर्वत से हनुमान लंका की ओर उड़ चले।
  ],
  cues: [
    { words: ["100", "yojan", "ka", "saagar."], gold: [0, 1], from: 6, to: 70, box: { x: 90, y: 280, w: 900, h: 90 }, align: "center" },
    { words: ["10…", "50…", "80", "yojan."], gold: [2, 3], from: 81, to: 145, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["90", "yojan", "tak", "bas."], gold: [0, 1], from: 156, to: 215, box: { x: 90, y: 290, w: 900, h: 90 }, align: "center" },
    { words: ["Hanuman", "chup", "the."], gold: [1], from: 226, to: 285, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["\"Chup", "kyon", "ho,", "vats?\""], gold: [3], from: 296, to: 355, box: { x: 90, y: 255, w: 900, h: 90 }, align: "center" },
    { words: ["Suraj", "ko", "phal", "samjha."], gold: [2], from: 366, to: 430, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Garud-bal."], gold: [0], from: 441, to: 490, box: { x: 40, y: 250, w: 340, h: 90 }, align: "left" }, // shortened from "Garud jaisi bhujaayein." (4-66-6): only a sky corner is free
    { words: ["Mukh", "agni", "sa", "damka."], gold: [1], from: 511, to: 575, box: { x: 90, y: 1450, w: 900, h: 90 }, align: "center" },
    { words: ["Parvat", "ke", "phool", "jhade."], gold: [2], from: 586, to: 645, box: { x: 90, y: 290, w: 900, h: 90 }, align: "center" },
    { words: ["\"Ram", "ke", "baan", "ki", "tarah.\""], gold: [2], from: 736, to: 805, box: { x: 90, y: 1150, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep10/sea_waves.wav", at: 0, gain: 0.3 }, // the southern ocean (4-64-4/7)
    { file: "sfx/ep10/windy_sea.wav", at: 0, gain: 0.18 },
    { file: "sfx/ep10/wave_boom.wav", at: 30, gain: 0.3 }, // a wave "as high as mountains"
    { file: "sfx/ep10/lights_sparkle.wav", at: 225, gain: 0.22 }, // the ring glows
    { file: "sfx/ep10/wind_hum.wav", at: 290, gain: 0.18 },
    { file: "sfx/ep10/memory_whoosh.wav", at: 362, gain: 0.25 },
    { file: "sfx/ep10/wind_gust.wav", at: 438, gain: 0.25 },
    { file: "sfx/ep10/rumble_rise.wav", at: 505, gain: 0.18 }, // he grows (4-67-1); 0.3 peaked at -0.8 dBFS under line 5
    { file: "sfx/ep10/rocks_groan.wav", at: 582, gain: 0.3 }, // Mahendra pressed (5-1-11)
    { file: "sfx/ep10/forest_birds.wav", at: 590, gain: 0.15 },
    { file: "sfx/ep10/far_waterfall.wav", at: 585, gain: 0.25 },
    { file: "sfx/ep10/sea_waves.wav", at: 600, gain: 0.22 },
    { file: "sfx/ep10/wings_flap.wav", at: 600, gain: 0.22 },
    { file: "sfx/ep10/launch_swoosh.wav", at: 700, gain: 0.35 }, // the spring (5-1-43)
    { file: "sfx/ep10/windy_sea.wav", at: 730, gain: 0.25 },
  ],
  // the gold line runs up beside the blossom wake and out at the left, toward the sea's mountain (EP 11)
  thread: [{ d: "M 560 1920 C 540 1500, 380 1100, -20 900", from: 740, to: 805, kind: "handoff" }],
  music: { from: 60, base: 0.39, ducked: 0.22 }, // 1:00 the build peaks on the leap, option A (checkpoint 4)
};

// EP 11, Mainak ka Nyota (ep11/script.md). 30 s, 11 shots: the gold heart under the sea, the glide (from behind, legs
// straight), the wow (the rise, srcIn 40), the glide toward the mountain, the gold tip toppling (no figure: every version
// with Hanuman at the impact was refused as a Kling start frame), Mainaka on his peak, the offering, his gratitude,
// Hanuman's reply, the touch (ends before the rock warps), the flight on.
const ep11: Episode = {
  seconds: 30,
  id: "ep11", n: 11, title: "Mainak ka Nyota",
  shots: [
    { clip: "clips/ep11/01B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 640, w: 900, h: 130 } }, // clear water between the surface and the mountain
    { clip: "clips/ep11/02B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sea below the horizon, above his crown
    { clip: "clips/ep11/03B.mp4", frames: 70, srcIn: 40, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow: the mountain lifts and its glow brightens
    { clip: "clips/ep11/04B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 250, w: 900, h: 110 } }, // clouds above him; a light beam brightens only after clip 2.5 s
    { clip: "clips/ep11/05B.mp4", frames: 70, srcIn: 0, empty: { x: 40, y: 290, w: 580, h: 110 } }, // clouds left of the toppling tip
    { clip: "clips/ep11/06B.mp4", frames: 75, srcIn: 0, empty: { x: 330, y: 470, w: 420, h: 240 } }, // open sky between the cliff and Hanuman, below the tree and above the cloud
    { clip: "clips/ep11/07B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 230, w: 900, h: 110 } }, // sky above the leaf of fruits
    { clip: "clips/ep11/08B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky above his head
    { clip: "clips/ep11/09B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky above his crown
    { clip: "clips/ep11/10B.mp4", frames: 80, srcIn: 0, empty: { x: 40, y: 690, w: 640, h: 110 } }, // the green slope left of the hand (the hand rises into the right side at the end)
    { clip: "clips/ep11/11B.mp4", frames: 95, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky above him as he flies off; runs through the card transition
  ],
  takes: [
    { slot: [30, 155], lead: 0, durationFrames: 122 }, // 4.06 s: राम के वंश का ऋण चुकाने, सागर ने मैनाक पर्वत उठाया। ("उठाया" lands on the rise)
    { slot: [225, 360], lead: 0, durationFrames: 108 }, // 3.58 s: हनुमान ने उसे रुकावट समझा, और छाती से टक्कर मारी।
    { slot: [365, 505], lead: 0, durationFrames: 112 }, // 3.71 s: मैनाक ने मनुष्य रूप धरकर कहा, "उतरो, विश्राम करो!"
    { slot: [510, 580], lead: 0, durationFrames: 66 }, // 2.17 s: "तुम्हारे पिता पवन ने मुझे बचाया था।"
    { slot: [585, 705], lead: 0, durationFrames: 114 }, // 3.79 s: हनुमान बोले, "मैंने वचन दिया है, बीच में रुक नहीं सकता।"
    { slot: [710, 810], lead: 0, durationFrames: 88 }, // 2.91 s: पर्वत को छूकर, वे मुस्कुराते हुए उड़ चले।
  ],
  cues: [
    { words: ["Samudra", "se", "parvat", "kyon", "utha?"], gold: [2], from: 6, to: 70, box: { x: 90, y: 660, w: 900, h: 90 }, align: "center" },
    { words: ["Ram", "ke", "kul", "ka", "rin."], gold: [4], from: 81, to: 145, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Raaste", "mein", "rukaavat?"], gold: [2], from: 226, to: 285, box: { x: 90, y: 260, w: 900, h: 90 }, align: "center" },
    { words: ["Chhaati", "se", "takkar."], gold: [2], from: 296, to: 355, box: { x: 40, y: 300, w: 580, h: 90 }, align: "center" },
    // One cue set as three stacked lines (no one-line spot clears Hanuman); each line's `from` continues the word stagger.
    { words: ["Parvat", "ne", "liya"], gold: [], from: 366, to: 430, box: { x: 330, y: 470, w: 420, h: 80 }, align: "center" },
    { words: ["manushya"], gold: [0], from: 378, to: 430, box: { x: 330, y: 550, w: 420, h: 80 }, align: "center" },
    { words: ["roop."], gold: [], from: 382, to: 430, box: { x: 330, y: 630, w: 420, h: 80 }, align: "center" },
    { words: ["Meethe", "kand-mool-phal."], gold: [1], from: 441, to: 500, box: { x: 90, y: 240, w: 900, h: 90 }, align: "center" },
    { words: ["Atithi", "poojniya", "hai."], gold: [0], from: 511, to: 575, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["\"Din", "dhal", "raha", "hai.\""], gold: [1], from: 586, to: 645, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["Chhookar", "vidaa."], gold: [0], from: 656, to: 725, box: { x: 40, y: 700, w: 640, h: 90 }, align: "center" },
    { words: ["Pavan", "ki", "raah", "par."], gold: [0], from: 736, to: 805, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep11/wind_hum.wav", at: 0, gain: 0.25 }, // the deep sea
    { file: "sfx/ep11/leap_swoosh.wav", at: 30, gain: 0.2 }, // the shape passing overhead
    { file: "sfx/ep11/sea_waves.wav", at: 75, gain: 0.25 },
    { file: "sfx/ep11/windy_sea.wav", at: 75, gain: 0.15 },
    { file: "sfx/ep11/rumble_rise.wav", at: 150, gain: 0.3 }, // the rise (5-1-101)
    { file: "sfx/ep11/far_waterfall.wav", at: 160, gain: 0.3 }, // sea water pouring off
    { file: "sfx/ep11/lights_sparkle.wav", at: 170, gain: 0.2 }, // the gold glow
    { file: "sfx/ep11/wind_gust.wav", at: 222, gain: 0.22 },
    { file: "sfx/ep11/rocks_groan.wav", at: 292, gain: 0.35 }, // the tip breaks (5-1-108)
    { file: "sfx/ep11/wave_boom.wav", at: 296, gain: 0.2 },
    { file: "sfx/ep11/bell.wav", at: 365, gain: 0.15 }, // the human form
    { file: "sfx/ep11/forest_breeze.wav", at: 360, gain: 0.18 },
    { file: "sfx/ep11/forest_breeze.wav", at: 435, gain: 0.15 },
    { file: "sfx/ep11/wind_hum.wav", at: 505, gain: 0.15 },
    { file: "sfx/ep11/windy_sea.wav", at: 580, gain: 0.12 },
    { file: "sfx/ep11/lights_sparkle.wav", at: 660, gain: 0.2 }, // the touch (5-1-133)
    { file: "sfx/ep11/windy_sea.wav", at: 730, gain: 0.25 },
    { file: "sfx/ep11/sea_waves.wav", at: 730, gain: 0.18 },
  ],
  // the gold line rises along his climb, left of him, and leaves at the top (toward Surasa's sea, EP 12)
  thread: [{ d: "M 200 1550 C 250 1100, 290 700, 330 -20", from: 740, to: 805, kind: "handoff" }],
  music: { from: 79, base: 0.39, ducked: 0.22 }, // 1:19 the build peaks on the rise, option A (checkpoint 4)
};

// EP 12, Surasa ki Pariksha (ep12/script.md). 30 s, 11 shots: the storm with eyes (from behind), the lights, Surasa
// rises, her face (Kling adds a small Hanuman she glares at), folded palms, the contest (start/end morph, srcIn 50; a gold
// height ruler between them), the zoom out (ends before they dissolve), the wow (the shrink morph, srcIn 45), the point of
// light (srcIn 50), the true form (morph, srcIn 40), the flight on over a rising wave.
const ep12: Episode = {
  seconds: 30,
  id: "ep12", n: 12, title: "Surasa ki Pariksha",
  shots: [
    { clip: "clips/ep12/01B.mp4", frames: 75, srcIn: 0, empty: { x: 60, y: 240, w: 960, h: 110 } }, // sky above the storm bank
    { clip: "clips/ep12/02B.mp4", frames: 75, srcIn: 0, empty: { x: 90, y: 1040, w: 900, h: 110 } }, // shadowed cloud above the tiny flier
    { clip: "clips/ep12/03B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 1440, w: 900, h: 110 } }, // her robe hem and the sea (her figure fills the rest)
    { clip: "clips/ep12/04B.mp4", frames: 70, srcIn: 0, empty: { x: 40, y: 1440, w: 640, h: 110 } }, // the sea left of her robe
    { clip: "clips/ep12/05B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky above him
    { clip: "clips/ep12/06B.mp4", frames: 75, srcIn: 50, empty: { x: 90, y: 230, w: 900, h: 110 } }, // sky above their heads as they grow
    { clip: "clips/ep12/07B.mp4", frames: 70, srcIn: 0, empty: { x: 90, y: 240, w: 900, h: 110 } }, // sky above them
    { clip: "clips/ep12/08B.mp4", frames: 75, srcIn: 45, empty: { x: 90, y: 240, w: 900, h: 100 } }, // the wow: giant, then glow, then a point of light
    { clip: "clips/ep12/09B.mp4", frames: 70, srcIn: 50, empty: { x: 40, y: 290, w: 600, h: 160 } }, // sky left of the light streak
    { clip: "clips/ep12/10B.mp4", frames: 80, srcIn: 40, empty: { x: 90, y: 240, w: 900, h: 110 } }, // sky above them
    { clip: "clips/ep12/11B.mp4", frames: 95, srcIn: 0, empty: { x: 90, y: 290, w: 900, h: 110 } }, // sky above him; runs through the card transition
  ],
  takes: [
    { slot: [15, 155], lead: 0, durationFrames: 100 }, // 3.31 s: देवता हनुमान का बल और बुद्धि परखना चाहते थे।
    { slot: [160, 285], lead: 0, durationFrames: 101 }, // 3.36 s: नागमाता सुरसा ने रास्ता रोका— "मेरे मुख में आओ!"
    { slot: [290, 405], lead: 0, durationFrames: 114 }, // 3.79 s: हनुमान ने हाथ जोड़कर कहा, "सीता को खोजकर लौटूँगा।"
    { slot: [410, 548], lead: 0, durationFrames: 135 }, // 4.48 s: दोनों बढ़ते गए— हनुमान नब्बे योजन, सुरसा का मुख सौ!
    { slot: [552, 662], lead: 0, durationFrames: 108 }, // 3.60 s: तभी वे अंगूठे जितने बने, मुख में गए, निकल आए।
    { slot: [667, 810], lead: 0, durationFrames: 112 }, // 3.72 s: प्रसन्न सुरसा बोलीं, "जाओ, सीता को राम से मिलाओ!"
  ],
  cues: [
    { words: ["Devtaon", "ne", "hi", "raasta", "rukwaaya!"], gold: [3], from: 6, to: 70, box: { x: 60, y: 250, w: 960, h: 90 }, align: "center" },
    { words: ["Bal", "aur", "upaay", "ki", "pariksha."], gold: [2], from: 81, to: 145, box: { x: 90, y: 1050, w: 900, h: 90 }, align: "center" },
    { words: ["Surasa,", "nagon", "ki", "mata."], gold: [0], from: 156, to: 215, box: { x: 90, y: 1450, w: 900, h: 90 }, align: "center" },
    { words: ["\"Koi", "laangh", "na", "sake.\""], gold: [1], from: 226, to: 285, box: { x: 40, y: 1450, w: 640, h: 90 }, align: "center" },
    { words: ["Ram", "ka", "doot", "hoon."], gold: [0], from: 296, to: 355, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
    { words: ["10…", "30…", "50", "yojan."], gold: [2, 3], from: 366, to: 430, box: { x: 90, y: 240, w: 900, h: 90 }, align: "center" },
    { words: ["Parvat", "jaise", "Hanuman."], gold: [0], from: 441, to: 500, box: { x: 90, y: 250, w: 900, h: 90 }, align: "center" },
    { words: ["Buddhimaan"], gold: [0], from: 586, to: 645, box: { x: 40, y: 290, w: 600, h: 80 }, align: "center" }, // two lines: one would cross the light streak
    { words: ["Hanuman."], gold: [], from: 590, to: 645, box: { x: 40, y: 370, w: 600, h: 80 }, align: "center" },
    { words: ["\"Pranaam,", "Dakshayani.\""], gold: [1], from: 656, to: 725, box: { x: 90, y: 250, w: 900, h: 90 }, align: "center" },
    { words: ["Sabne", "kaha,", "\"Saadhu!", "Saadhu!\""], gold: [2, 3], from: 736, to: 805, box: { x: 90, y: 300, w: 900, h: 90 }, align: "center" },
  ],
  sfx: [
    { file: "sfx/ep12/windy_sea.wav", at: 0, gain: 0.2 },
    { file: "sfx/ep12/sea_waves.wav", at: 0, gain: 0.2 },
    { file: "sfx/ep12/wave_boom.wav", at: 40, gain: 0.25 }, // the storm heaves
    { file: "sfx/ep12/lights_sparkle.wav", at: 80, gain: 0.2 }, // the lights (5-1-145)
    { file: "sfx/ep12/wind_hum.wav", at: 75, gain: 0.12 },
    { file: "sfx/ep12/rumble_rise.wav", at: 150, gain: 0.3 }, // she rises (5-1-149)
    { file: "sfx/ep12/thunder_clash.wav", at: 180, gain: 0.18 },
    { file: "sfx/ep12/wind_hum.wav", at: 222, gain: 0.18 },
    { file: "sfx/ep12/windy_sea.wav", at: 290, gain: 0.12 },
    { file: "sfx/ep12/rumble_rise.wav", at: 360, gain: 0.25 }, // the contest (5-1-160)
    { file: "sfx/ep12/thunder_clash.wav", at: 440, gain: 0.15 },
    { file: "sfx/ep12/rumble_rise.wav", at: 440, gain: 0.2 },
    { file: "sfx/ep12/bell.wav", at: 540, gain: 0.18 }, // the shrink (5-1-167)
    { file: "sfx/ep12/lights_sparkle.wav", at: 545, gain: 0.2 },
    { file: "sfx/ep12/leap_swoosh.wav", at: 600, gain: 0.2 }, // in
    { file: "sfx/ep12/leap_swoosh.wav", at: 625, gain: 0.2 }, // and out (5-1-168)
    { file: "sfx/ep12/lights_sparkle.wav", at: 660, gain: 0.2 }, // her true form (5-1-170)
    { file: "sfx/ep12/wind_hum.wav", at: 650, gain: 0.12 },
    { file: "sfx/ep12/windy_sea.wav", at: 730, gain: 0.25 },
    { file: "sfx/ep12/sea_waves.wav", at: 730, gain: 0.2 },
    { file: "sfx/ep12/wind_hum.wav", at: 780, gain: 0.15 }, // the water stirs (toward Simhika)
  ],
  thread: [
    { d: "M 545 1480 L 545 300", from: 366, to: 500, kind: "trace" }, // the height ruler in the gap between them (never on a body)
    { d: "M 80 1600 C 90 1100, 100 600, 120 -20", from: 755, to: 805, kind: "handoff" }, // up the far left edge, clear of him and his shadow (toward EP 13)
  ],
  music: { from: 105, base: 0.39, ducked: 0.22 }, // 1:45 the second build under the duel, option A (checkpoint 4)
  trim: 0.85, // the VO runs almost unbroken: at 1 the render measured -12.4 LUFS
};

export const EPISODES: Record<EpId, Episode> = { ep01, ep02, ep03, ep04, ep05, ep06, ep07, ep08, ep09, ep10, ep11, ep12 };
