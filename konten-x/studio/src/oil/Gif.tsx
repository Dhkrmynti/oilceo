/**
 * The GIF: one emergency meeting in four seconds, looping clean. The reserve fills to 0.02 ETH, the
 * siren goes, the stamp comes down, the ten seats are paid, and the reserve is empty again.
 * Frame 0 and the last frame match, so the loop has no seam.
 */
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BarrelCEO, isBlink } from "./Barrel";
import { FlagMark } from "./Flag";
import { BOARD_FLAGS } from "./Office";
import { C, MONO, SANS, display } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MeetingLoop: React.FC = () => {
  const frame = useCurrentFrame();
  // 0-56 the reserve fills, 56-100 the meeting, 100-120 it drains and the stamp lifts
  const fill = frame < 100 ? interpolate(frame, [0, 56], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) }) : interpolate(frame, [100, 118], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const eth = (fill * 0.02).toFixed(4);
  const siren = frame >= 56 && frame < 100 ? (Math.floor((frame - 56) / 4) % 2 === 0 ? 1 : 0.35) : 0;
  const stamp = interpolate(frame, [60, 68, 100, 110], [0, 1, 1, 0], clamp);
  const stampScale = interpolate(frame, [60, 68], [2.4, 1], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) });
  const paid = interpolate(frame, [72, 100, 110], [0, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, #1a2742, ${C.night} 70%)`, color: C.ivory, fontFamily: SANS }}>
      {/* the siren wash */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,74,46,.55), rgba(120,10,4,.35) 70%)", opacity: siren * 0.9 }} />

      {/* the barrel watches its reserve */}
      <svg viewBox="0 0 200 250" style={{ position: "absolute", left: 220, top: 38, width: 160, height: 200 }}>
        <BarrelCEO hands look={fill < 1 ? -1 + fill * 2 : 0} closed={isBlink(frame, 60, 20)} />
      </svg>

      {/* the reserve: a horizontal tank */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 268 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(242,234,216,.75)" }}>
          <span>Oil Reserve</span>
          <span style={{ color: fill >= 1 ? C.red : C.gold }}>{eth} / 0.02 ETH</span>
        </div>
        <div style={{ position: "relative", height: 86, marginTop: 10, borderRadius: 43, border: `4px solid ${C.gold}`, background: "#26231f", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: `linear-gradient(180deg, ${C.crude}, #b8741f 55%, #0d0b09)` }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, textShadow: "0 2px 6px rgba(0,0,0,.7)" }}>{Math.round(fill * 100)}%</div>
        </div>
        <p style={{ margin: "12px 0 0", textAlign: "center", fontFamily: MONO, fontSize: 16, color: "rgba(242,234,216,.6)" }}>every trade fills it</p>
      </div>

      {/* the ten seats get paid */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 452, display: "flex", justifyContent: "center", gap: 9, flexWrap: "wrap" }}>
        {BOARD_FLAGS.map((f, i) => {
          const on = interpolate(paid, [i / 12, i / 12 + 0.12], [0, 1], clamp);
          return (
            <div key={i} style={{ opacity: 0.25 + on * 0.75, translate: `0 ${(1 - on) * 8}px`, display: "grid", justifyItems: "center", gap: 2 }}>
              <FlagMark flag={f} size={42} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: on > 0.5 ? C.gold : "rgba(242,234,216,.4)" }}>{i + 1}</span>
            </div>
          );
        })}
      </div>
      <p style={{ position: "absolute", left: 0, right: 0, bottom: 34, margin: 0, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gold, opacity: paid }}>+0.02 ETH to the Board</p>

      {/* the stamp */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 170,
          padding: "14px 10px",
          border: `6px solid ${C.ivory}`,
          background: "rgba(200,38,26,.92)",
          textAlign: "center",
          textTransform: "uppercase",
          ...display(62),
          fontStretch: "70%",
          opacity: stamp,
          scale: String(stampScale),
          rotate: "-5deg",
        }}
      >
        Emergency
        <br />
        meeting
      </div>
      <p style={{ position: "absolute", top: 14, left: 0, right: 0, margin: 0, textAlign: "center", fontFamily: MONO, fontSize: 15, letterSpacing: "0.14em", color: "rgba(242,234,216,.6)" }}>$OILCEO · oilceo.fun</p>
    </AbsoluteFill>
  );
};
