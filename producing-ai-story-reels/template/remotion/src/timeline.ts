// Timing and geometry shared by every episode (frames @ 30 fps); each episode's own data is in episodes.ts.
// Geometry is the approved mockups (type-style-v3, end-card B) at 3×. See BUILD_PLAN.md Global Constraints.
import { EPISODES, type Cue, type Episode, type EpId } from "./episodes.ts";
import { mergeGaps, musicVolume } from "./ducking.ts";
import { settledAt } from "./reveal.ts";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const VO_GAIN = 0.8; // started at 0.7 (mono VO reads ~3 dB hotter on stereo); 0.8 brings the ep00 dry run to -14 LUFS
export const TRACK_SECONDS = 199.97; // ramayana_bg_music.mp3

export const WORDMARK = { w: 280, top: 150 }; // top centre, every frame up to the card
export const FINE = { size: 26, bottom: 250, opacity: 0.88 }; // fine print, every frame
export const HOOK = { size: 60, lineHeight: 1.3 }; // overlay text
export const CARD = {
  blur: 42, brightness: 0.62, saturate: 0.9, scale: 1.12, // the plate under the card (mock B also desaturates)
  // user 2026-10-30: no next-episode tease; the 450 px wordmark (79 px tall) centred on y 960, the URL beneath
  wordmark: { w: 450, top: 920 }, url: { size: 28, top: 1035 },
};
export const wordmarkH = (w: number) => Math.round((w * 328) / 1877); // cosmolife_typo.png is 1877×328

export { EPISODES };
export type { Cue, Episode, EpId };

// Per-episode timing (decision 35: 30 s reels from EP 07). Every reel ends on the same 3 s closing card. For 15 s:
// story 0-359 (VO, cues and threads are done by storyEnd), card transition 360-374, card static 375-449.
export const timing = (e: Episode) => {
  const total = (e.seconds ?? 15) * FPS, storyEnd = total - 90;
  return { total, storyEnd, cardStatic: storyEnd + 15, shots: e.seconds === 30 ? [8, 13] : [4, 6] };
};

export const shotStarts = (e: Episode) => e.shots.map((_, i) => e.shots.slice(0, i).reduce((n, s) => n + s.frames, 0));

export const voFile = (e: Episode, line: number) => `vo/${e.id}/line${line}.wav`;
export const voSegments = (e: Episode) =>
  e.takes.map((t) => ({ from: t.slot[0] + t.lead, to: t.slot[0] + t.lead + t.durationFrames }));

// The music bed's level at a frame: ducked under the voice (it stays down through breaths under 12 frames),
// faded out over the last 0.7 s.
export const musicLevel = (e: Episode, frame: number) =>
  musicVolume(frame, mergeGaps(voSegments(e), 12), { base: e.music.base, ducked: e.music.ducked, ramp: 9, fadeFrom: timing(e).total - 21, end: timing(e).total });


// Closing card: its rows (wordmark, cosmolife.in) stagger in from storyEnd with the overlay
// reveal's blur/rise/fade, shortened to fit the 15-frame transition: the overlay's 21 + 3×4 frames would settle
// at 393, well into the static card.
export const CARD_IN = 9;
export const CARD_STAGGER = 2;
export const CARD_ROWS = 2;
export const cardSettled = (e: Episode) => settledAt(timing(e).storyEnd, CARD_ROWS, CARD_IN, CARD_STAGGER); // storyEnd + 11, before cardStatic
