// Closing card, over the blurred, dimmed plate: the 450 px wordmark centred in the frame and `cosmolife.in` beneath
// (user 2026-10-30 removed mock B's `agla episode` tease). The rows stagger in from storyEnd (360 at 15 s)
// and are settled by cardStatic (timeline.ts cardSettled); the card is then static to the last frame.
import { Img, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "./fonts";
import { IVORY } from "./Cue";
import { wordState } from "./reveal";
import { CARD, CARD_IN, CARD_STAGGER, WIDTH, timing, wordmarkH, type Episode } from "./timeline";

const SMALL: React.CSSProperties = {
  fontFamily: FONTS.sans, fontWeight: 400, fontSize: CARD.url.size, lineHeight: 1.4, letterSpacing: "0.06em", color: IVORY,
  opacity: 0.9, textShadow: "0 0 24px rgba(0,0,0,.35)", fontSynthesis: "none",
};

const Row: React.FC<{ i: number; top: number; from: number; children: React.ReactNode }> = ({ i, top, from, children }) => {
  const s = wordState(useCurrentFrame(), from, Infinity, i, CARD_IN, CARD_STAGGER);
  return (
    <div style={{ position: "absolute", left: 0, width: WIDTH, top, display: "flex", justifyContent: "center", opacity: s.opacity, filter: `blur(${s.blur}px)`, translate: `0px ${s.rise}px` }}>
      {children}
    </div>
  );
};

export const ClosingCard: React.FC<{ e: Episode }> = ({ e }) => {
  const { storyEnd } = timing(e);
  if (useCurrentFrame() < storyEnd) return null;
  return (
    <>
      <Row i={0} top={CARD.wordmark.top} from={storyEnd}>
        <Img src={staticFile("brand/wordmark.png")} style={{ width: CARD.wordmark.w, height: wordmarkH(CARD.wordmark.w), display: "block" }} />
      </Row>
      <Row i={1} top={CARD.url.top} from={storyEnd}>
        <div style={{ ...SMALL, fontSize: CARD.url.size }}>cosmolife.in</div>
      </Row>
    </>
  );
};
