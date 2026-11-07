/**
 * ep01 v2 "The Jasmine Errand" [t = 0–30 s], shots matched 1:1 to the reference (STUDY.md §2 v2, decision 17).
 * The clips (paint-filtered by tools/paint_clip.py) play back to back from timeline.ts. Every join is a butt join between
 * clips generated to meet (chain frame, shared keyframe, end-frame reset) except:
 * - the two passer-by cuts: an in-focus porter crosses right -> left at one speed and the place changes behind him;
 * - the one hard cut (11B), at the story's resolution.
 */
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS, PASSER, PASSERS, TOTAL, layout, passerCover, passerX, type Passer as P } from "./timeline";

export const FILM = { fps: FPS, width: 1920, height: 1080, total: TOTAL } as const;

// Sharp, lit like the market, no shadow panel (the v1 dark occluder was rejected): the eye follows him, not a black wipe.
const Passer: React.FC<{ p: P }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (passerCover(p, frame, width) <= 0) return null;
  return (
    <Img src={staticFile(p.img)} style={{ position: "absolute", left: passerX(p, frame, width), top: height * (1 - PASSER.scale),
      width: width * PASSER.scale, height: height * PASSER.scale }} />
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: "#0E1630" }}>
    {layout().map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.frames} name={`${s.clip} ${s.srcIn}–${s.srcOut} @${s.rate}x`}>
        <Video src={staticFile(`ep01/${s.clip}.mp4`)} muted trimBefore={s.srcIn} playbackRate={s.rate}
          style={{ width: FILM.width, height: FILM.height }} />
      </Sequence>
    ))}
    {PASSERS().map((p, i) => <Passer key={i} p={p} />)}
    <Img src={staticFile("watermark.png")} style={{ position: "absolute", right: 96, bottom: 54, height: 44, opacity: 0.55 }} />
  </AbsoluteFill>
);
