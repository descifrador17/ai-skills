// The CosmoLife app's own type: Noto Serif for the overlay text, with its real italic face for the gold key words
// (fontSynthesis is off everywhere, so a missing italic shows upright, never slanted), and Geist for the small lines.
// No Devanagari: all on-screen text is Hinglish.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONTS = { serif: "Noto Serif", sans: "Geist" };

loadFont({ family: FONTS.serif, url: staticFile("fonts/NotoSerif.ttf"), weight: "100 900", style: "normal" });
loadFont({ family: FONTS.serif, url: staticFile("fonts/NotoSerif-Italic.ttf"), weight: "100 900", style: "italic" });
loadFont({ family: FONTS.sans, url: staticFile("fonts/Geist.ttf"), weight: "100 900" });
