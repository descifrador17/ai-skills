// The fixed series frame: the wordmark top centre (it fades out over the card transition; the card has its own,
// larger one) and the fine print `EP NN/20 | Title | Valmiki Ramayana` bottom centre on every frame, card included.
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IVORY } from "./Cue";
import { FONTS } from "./fonts";
import { FINE, WIDTH, WORDMARK, timing, wordmarkH, type Episode } from "./timeline";

export const SeriesFrame: React.FC<{ e: Episode }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { storyEnd, cardStatic } = timing(e);
  const opacity = interpolate(frame, [storyEnd, cardStatic - 1], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.37, 0, 0.63, 1),
  });
  return (
    <>
      {opacity > 0 ? (
        <Img
          src={staticFile("brand/wordmark.png")}
          style={{ position: "absolute", left: (WIDTH - WORDMARK.w) / 2, top: WORDMARK.top, width: WORDMARK.w, height: wordmarkH(WORDMARK.w), opacity }}
        />
      ) : null}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: FINE.bottom, textAlign: "center", whiteSpace: "pre", fontFamily: FONTS.sans,
          fontWeight: 400, fontSize: FINE.size, lineHeight: 1, letterSpacing: "0.06em", color: IVORY, opacity: FINE.opacity,
          textShadow: "0 0 24px rgba(0,0,0,.35)", fontSynthesis: "none",
        }}
      >
        {`EP ${String(e.n).padStart(2, "0")}/20  |  ${e.title}  |  Valmiki Ramayana`}
      </div>
    </>
  );
};
