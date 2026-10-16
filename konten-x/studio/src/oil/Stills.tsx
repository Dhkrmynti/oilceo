/** Profile pieces for X: the avatar and the header. */
import { AbsoluteFill } from "remotion";
import { BarrelCEO } from "./Barrel";
import { Office } from "./Office";
import { C, MONO, display, turn } from "./theme";

/** The avatar: the barrel's bust, centred so X's round crop keeps the lid, the eyes and the tie. */
export const Logo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, #1c2b4a 0%, ${C.night} 62%)` }}>
      <svg viewBox="0 0 1000 1000" style={{ width: "100%", height: "100%" }}>
        <circle cx="500" cy="500" r="470" fill="none" stroke={C.gold} strokeWidth="14" opacity="0.9" />
        <circle cx="500" cy="500" r="446" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="4 14" opacity="0.6" />
        <g transform="translate(160 118) scale(3.4)">
          <BarrelCEO hands={false} look={0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/**
 * The header, 1500 by 500. The office stands on the right; the words sit top left, clear of the
 * bottom-left corner where X lays the avatar over the header.
 */
export const Banner: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 45% 70% at 76% 45%, rgba(224,176,74,.2), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 2px, transparent 2px 46px), linear-gradient(180deg, ${C.night}, #0e1729)`,
        color: C.ivory,
      }}
    >
      <div style={{ position: "absolute", right: 30, top: 6, width: 700, height: 490 }}>
        <Office frame={0} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 56, width: 760 }}>
        <p style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(242,234,216,.75)", margin: 0 }}>
          <span style={{ color: C.red }}>● Live</span> from the Barrel House · $OILCEO
        </p>
        <h1 style={{ ...display(84), margin: "18px 0 0" }}>
          The world's most
          <br />
          important <span style={{ ...turn, color: C.gold, fontSize: "1.12em" }}>barrel.</span>
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 20, lineHeight: 1.5, color: "rgba(242,234,216,.8)", margin: "22px 0 0" }}>
          world leaders argue. oil prices move.
          <br />
          the barrel gets promoted again.
        </p>
      </div>
      <p style={{ position: "absolute", right: 46, bottom: 22, margin: 0, fontFamily: MONO, fontSize: 18, letterSpacing: "0.08em", color: C.gold }}>oilceo.fun</p>
    </AbsoluteFill>
  );
};
