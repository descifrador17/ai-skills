import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { ClosingCard } from "./Card";
import { CueText } from "./Cue";
import { SeriesFrame } from "./Frame";
import { Plate } from "./Plate";
import { GoldenThread } from "./Thread";
import { EPISODES, FPS, VO_GAIN, musicLevel, voFile, voSegments, type EpId } from "./timeline";

// One episode from its data (episodes.ts): plate, golden thread, overlay text, the fixed frame, the closing card;
// the VO lines at their slots, the music section ducked under them, and the sound effects.
export const EpisodeComp: React.FC<{ id: EpId }> = ({ id }) => {
  const e = EPISODES[id];
  const trim = e.trim ?? 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Plate e={e} />
      {e.thread.map((t, i) => (
        <GoldenThread key={i} t={t} />
      ))}
      {e.cues.map((c, i) => (
        <CueText key={i} cue={c} />
      ))}
      <SeriesFrame e={e} />
      <ClosingCard e={e} />

      {voSegments(e).map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from} name={`vo line${i + 1}`} layout="none">
          <Audio src={staticFile(voFile(e, i + 1))} volume={VO_GAIN * trim} />
        </Sequence>
      ))}
      <Audio src={staticFile("music/bed.mp3")} trimBefore={Math.round(e.music.from * FPS)} volume={(f) => musicLevel(e, f) * trim} />
      {e.sfx.map((s, i) => (
        <Sequence key={i} from={s.at} name={`sfx ${s.file}`} layout="none">
          <Audio src={staticFile(s.file)} volume={s.gain * trim} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
