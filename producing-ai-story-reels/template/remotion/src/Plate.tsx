// The story shots back to back, each a 30 fps clip (tools/prepare_media.sh) entered at its srcIn. Over the card
// transition the plate blurs, dims and grows to the card values; under the static card it holds the last shot's
// last frame (374 at 15 s), frozen, so no clip ever has to cover the card.
import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, Freeze, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CARD, HEIGHT, WIDTH, shotStarts, timing, type Episode } from "./timeline";

export const Plate: React.FC<{ e: Episode }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { storyEnd, cardStatic } = timing(e);
  const t = interpolate(frame, [storyEnd, cardStatic - 1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.37, 0, 0.63, 1),
  });
  const starts = shotStarts(e);
  const mix = (to: number) => 1 + (to - 1) * t;
  return (
    <AbsoluteFill
      style={{
        filter: t ? `blur(${CARD.blur * t}px) brightness(${mix(CARD.brightness)}) saturate(${mix(CARD.saturate)})` : undefined,
        scale: String(mix(CARD.scale)),
      }}
    >
      <Freeze frame={cardStatic - 1} active={frame >= cardStatic}>
        {e.shots.map((s, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={s.frames} name={`shot ${i + 1}`}>
            <Video src={staticFile(s.clip)} muted trimBefore={s.srcIn} style={{ width: WIDTH, height: HEIGHT }} />
          </Sequence>
        ))}
      </Freeze>
    </AbsoluteFill>
  );
};
