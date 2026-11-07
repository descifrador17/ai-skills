// Overlay text (type-style-v3 at 3×): Noto Serif 400, 60 px, ivory, key words in the real gold italic. No glow and
// no scrim: legibility comes from the soft diffuse shadow and a calm empty area of the shot.
import { Fragment } from "react";
import { useCurrentFrame } from "remotion";
import { FONTS } from "./fonts";
import { wordState } from "./reveal";
import { HOOK, type Cue } from "./timeline";

export const IVORY = "#FFFBF6";
export const GOLD = "#F3C77B";
export const SERIF_TEXT: React.CSSProperties = {
  fontFamily: FONTS.serif, fontWeight: 400, fontSize: HOOK.size, lineHeight: HOOK.lineHeight, color: IVORY, fontSynthesis: "none",
  // soft dark halo, no box (user rejected scrims): tuned on EP 01, where the mockup's faint shadow lost gold words on sunlit skies
  textShadow: "0 0 28px rgba(24,14,4,.62), 0 0 10px rgba(24,14,4,.5), 0 2px 4px rgba(24,14,4,.45)",
};
export const goldWord = (gold: number[], i: number): React.CSSProperties => (gold.includes(i) ? { color: GOLD, fontStyle: "italic" } : {});

const JUSTIFY = { center: "center", left: "flex-start", right: "flex-end" } as const;

// Each word is its own inline-block so the blur and rise apply per word.
export const CueText: React.FC<{ cue: Cue }> = ({ cue }) => {
  const frame = useCurrentFrame();
  if (frame < cue.from || frame >= cue.to) return null;
  const { x, y, w, h } = cue.box;
  return (
    <div style={{ ...SERIF_TEXT, position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: JUSTIFY[cue.align] }}>
      <div style={{ textAlign: cue.align, textWrap: "balance" }}>
        {cue.words.map((word, i) => {
          const s = wordState(frame, cue.from, cue.to, i);
          return (
            <Fragment key={i}>
              {i ? " " : null}
              <span style={{ display: "inline-block", ...goldWord(cue.gold, i), opacity: s.opacity, filter: `blur(${s.blur}px)`, translate: `0px ${s.rise}px` }}>{word}</span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
