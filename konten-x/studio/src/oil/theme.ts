/** The site's palette and fonts, so every piece of content looks like oilceo.fun. */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  night: "#0b1220",
  night2: "#111a2e",
  navy: "#16294a",
  chamber: "#102342",
  walnut: "#24160d",
  oil: "#0e0d0c",
  paper: "#f1ead9",
  ivory: "#f2ead8",
  ink: "#17140f",
  red: "#ff4a2e",
  redD: "#c8261a",
  gold: "#e0b04a",
  teal: "#7fd0c4",
  crude: "#e8a24a",
  oxblood: "#4a1b1d",
};

export const SANS = '"Archivo", system-ui, sans-serif';
export const SERIF = '"Instrument Serif", Georgia, serif';
export const MONO = '"JetBrains Mono", ui-monospace, monospace';

// The same woff2 files the site ships (copied from its node_modules into public/fonts).
loadFont({ family: "Archivo", url: staticFile("fonts/archivo-latin-wdth-normal.woff2"), weight: "100 900", stretch: "62% 125%" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), style: "italic" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/instrument-serif-latin-400-normal.woff2") });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/jetbrains-mono-latin-wght-normal.woff2"), weight: "100 800" });

/** Headline style: heavy, condensed grotesque, like the site's display type. */
export const display = (size: number): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontStretch: "74%",
  fontSize: size,
  lineHeight: 0.92,
  letterSpacing: "-0.005em",
  wordSpacing: "0.12em",
});

/** The serif italic turn in every headline. */
export const turn: React.CSSProperties = { fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontStretch: "100%", letterSpacing: 0 };
