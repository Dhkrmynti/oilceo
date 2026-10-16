/**
 * The demo video for X, 1920 by 1080. Seven scenes, each in the place it lives on the site:
 * breaking news, the office, the Oil Reserve, the emergency meeting, the barrels, the embargo, the end.
 * Every number is the engine's real setting (0.02 ETH meetings, 70/30 split, 5,000 barrels).
 */
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BarrelCEO, isBlink } from "./Barrel";
import { FlagMark } from "./Flag";
import { BOARD_FLAGS, Office } from "./Office";
import { gradeOf, gravityOf, headlineOf } from "./barrels";
import { C, MONO, SANS, display, turn } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 from `start` over `dur` frames, eased out. */
const inn = (frame: number, start: number, dur = 18) => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: ease });
/** Fade and rise in, as one style object. */
const rise = (frame: number, start: number, dist = 40): React.CSSProperties => ({ opacity: inn(frame, start), translate: `0 ${(1 - inn(frame, start)) * dist}px` });

const kicker: React.CSSProperties = { fontFamily: MONO, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, margin: 0 };
const NIGHT_BG = `radial-gradient(ellipse 55% 60% at 70% 40%, rgba(224,176,74,.15), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 2px, transparent 2px 60px), linear-gradient(180deg, ${C.night}, #0e1729)`;

/* ───────── 1. breaking news ───────── */

export const SceneBreaking: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = Array.from({ length: 24 }, (_, i) => `${i * 52},${120 - Math.sin(i * 1.3) * 40 - Math.cos(i * 0.7) * 30 - i * 2.4}`).join(" ");
  const news = Array.from({ length: 6 }, (_, k) => headlineOf(1200 + k * 37)).join("   ·   ");
  return (
    <AbsoluteFill style={{ background: NIGHT_BG, color: C.ivory, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 120, top: 110, display: "flex", gap: 20, alignItems: "center", ...rise(frame, 0, 20) }}>
        <span style={{ background: C.red, color: "#fff", padding: "10px 22px", ...display(40), fontStretch: "70%", letterSpacing: "0.1em", textTransform: "uppercase", opacity: Math.floor(frame / 8) % 2 ? 1 : 0.75 }}>Breaking</span>
        <span style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "0.12em", color: "rgba(242,234,216,.7)" }}>LIVE · EVERYWHERE · TODAY</span>
      </div>
      <h1 style={{ position: "absolute", left: 120, top: 250, margin: 0, ...display(168) }}>
        <span style={{ display: "block", ...rise(frame, 8) }}>World leaders argue.</span>
        <span style={{ display: "block", color: C.gold, ...rise(frame, 40) }}>
          Oil prices <span style={{ ...turn, fontSize: "1.08em" }}>move.</span>
        </span>
      </h1>
      <svg viewBox="0 0 1200 220" style={{ position: "absolute", left: 120, top: 640, width: 1200, height: 220, overflow: "visible" }}>
        <polyline points={pts} fill="none" stroke={C.red} strokeWidth="8" strokeLinejoin="round" strokeDasharray="2600" strokeDashoffset={2600 * (1 - inn(frame, 44, 50))} />
      </svg>
      <p style={{ position: "absolute", right: 120, top: 700, margin: 0, fontFamily: MONO, fontSize: 44, color: C.red, opacity: inn(frame, 80) }}>OIL ▲ 2.1%</p>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: C.ivory, borderTop: `6px solid ${C.red}`, display: "flex", alignItems: "center", overflow: "hidden", color: C.ink }}>
        <span style={{ position: "relative", zIndex: 1, height: "100%", display: "grid", placeItems: "center", padding: "0 34px", background: C.red, color: "#fff", ...display(34), fontStretch: "70%", letterSpacing: "0.08em" }}>WIRE</span>
        <span style={{ whiteSpace: "nowrap", fontFamily: MONO, fontSize: 30, paddingLeft: 40, translate: `${-frame * 6}px 0` }}>{news}</span>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 2. the barrel gets promoted ───────── */

export const ScenePromoted: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NIGHT_BG, color: C.ivory, fontFamily: SANS }}>
      <div style={{ position: "absolute", right: 70, top: 120, width: 1060, height: 742, scale: String(interpolate(frame, [0, 150], [1, 1.07])), opacity: inn(frame, 0, 14) }}>
        <Office frame={frame} ring={frame - 48} flagsUp={inn(frame, 4, 40) * 10} look={frame > 90 ? 1 : 0} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 220, width: 760 }}>
        <p style={{ ...kicker, ...rise(frame, 4, 20) }}>Meanwhile, in the Barrel House</p>
        <h1 style={{ margin: "26px 0 0", ...display(118) }}>
          <span style={{ display: "block", ...rise(frame, 10) }}>The barrel</span>
          <span style={{ display: "block", ...turn, color: C.gold, fontSize: "1.1em", ...rise(frame, 26) }}>gets promoted</span>
          <span style={{ display: "block", ...turn, color: C.gold, fontSize: "1.1em", ...rise(frame, 34) }}>again.</span>
        </h1>
        <p style={{ marginTop: 44, fontSize: 46, lineHeight: 1.25, color: "rgba(242,234,216,.85)", ...rise(frame, 80) }}>
          $OILCEO. CEO of the world,
          <br />
          by popular demand.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 3. every trade fills the Oil Reserve ───────── */

const TRADES = ["0xb6e3…b2e9", "0xfee7…e1f2", "0x78fb…e1f2", "0xa3f9…9e2f", "0xc0ff…e6f3", "0x76b2…c0b5", "0x4be1…e4f6"];
const BOUGHT = ["1.38M", "640K", "2.10M", "910K", "1.72M", "380K", "1.05M"];

export const SceneReserve: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [16, 150], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const level = 90 + 520 * (1 - fill);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 50% at 25% 60%, rgba(232,162,74,.16), transparent 70%), linear-gradient(180deg, ${C.oil}, #141210)`, color: C.ivory, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 120, top: 96 }}>
        <p style={{ ...kicker, ...rise(frame, 0, 20) }}>The Oil Reserve</p>
        <h1 style={{ margin: "20px 0 0", ...display(110), ...rise(frame, 6) }}>
          Every trade <span style={{ ...turn, color: C.red, fontSize: "1.08em" }}>fills it.</span>
        </h1>
      </div>
      {/* the tank */}
      <svg viewBox="0 0 440 700" style={{ position: "absolute", left: 160, top: 330, width: 400, height: 636, overflow: "visible" }}>
        <defs>
          <clipPath id="demo-tank">
            <path d="M40 90 V610 A180 34 0 0 0 400 610 V90 Z" />
          </clipPath>
        </defs>
        <path d="M40 90 V610 A180 34 0 0 0 400 610 V90 Z" fill="#26231f" />
        <g clipPath="url(#demo-tank)">
          <rect x="30" y={level} width="380" height={660 - level} fill="#0d0b09" />
          <ellipse cx="220" cy={level} rx="180" ry="22" fill={C.crude} />
        </g>
        <path d="M40 90 V610 A180 34 0 0 0 400 610 V90" fill="none" stroke="#d9a93f" strokeWidth="5" />
        <ellipse cx="220" cy="90" rx="180" ry="34" fill="#34302b" stroke="#d9a93f" strokeWidth="5" />
        {Array.from({ length: 7 }, (_, k) => {
          const t = (frame - 16 - k * 19) / 22;
          if (t < 0 || t > 1) return null;
          return <path key={k} d={`M220 ${-80 + t * 200} c10 14 18 24 18 35 a18 18 0 0 1 -36 0 c0 -11 8 -21 18 -35Z`} fill={C.crude} opacity={1 - t * 0.3} />;
        })}
        <text x="220" y="380" textAnchor="middle" style={{ font: `700 64px ${MONO}` }} fill={C.ivory}>
          {Math.round(fill * 100)}%
        </text>
      </svg>
      <div style={{ position: "absolute", left: 640, top: 360, fontFamily: MONO }}>
        <p style={{ margin: 0, fontSize: 84, fontWeight: 700 }}>
          {(fill * 0.02).toFixed(4)} <span style={{ fontSize: 40, color: "rgba(242,234,216,.6)" }}>/ 0.02 ETH</span>
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 28, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold }}>{fill >= 1 ? "● Full. Delegates called in." : "Filling: emergency meeting"}</p>
      </div>
      <div style={{ position: "absolute", left: 640, top: 560, width: 1160, display: "grid", gap: 14 }}>
        {TRADES.map((t, k) => (
          <div key={t} style={{ display: "flex", gap: 26, alignItems: "baseline", fontFamily: MONO, fontSize: 32, ...rise(frame, 16 + k * 19, 24) }}>
            <b style={{ color: C.ivory }}>{t}</b>
            <span style={{ color: "rgba(242,234,216,.7)" }}>bought {BOUGHT[k]} $OILCEO</span>
            <span style={{ color: C.crude }}>+ fee → reserve</span>
          </div>
        ))}
      </div>
      <p style={{ position: "absolute", right: 120, bottom: 46, margin: 0, fontFamily: MONO, fontSize: 22, color: "rgba(242,234,216,.4)" }}>illustration · wallets are examples</p>
    </AbsoluteFill>
  );
};

/* ───────── 4. the emergency meeting ───────── */

const SEAT_DEG = [40, 320, 70, 290, 100, 260, 130, 230, 160, 200];

export const SceneMeeting: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = frame < 24 ? (Math.floor(frame / 4) % 2 ? 0.9 : 0.25) : 0;
  const stampScale = interpolate(frame, [4, 14], [2.6, 1], { ...clamp, easing: Easing.bezier(0.3, 1.6, 0.5, 1) });
  const cx = 960;
  const cy = 640;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 40% at 50% 60%, rgba(224,176,74,.14), transparent 70%), linear-gradient(180deg, ${C.chamber}, #0d1c36)`, color: C.ivory, fontFamily: SANS }}>
      <AbsoluteFill style={{ background: "rgba(255,74,46,.75)", opacity: flash }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "grid", justifyItems: "center" }}>
        <div style={{ padding: "16px 40px", border: `7px solid ${C.ivory}`, background: C.redD, textTransform: "uppercase", ...display(96), fontStretch: "70%", scale: String(stampScale), opacity: inn(frame, 4, 6), rotate: "-3deg" }}>
          Emergency meeting
        </div>
        <p style={{ margin: "26px 0 0", fontSize: 40, color: "rgba(242,234,216,.85)", ...rise(frame, 24, 20) }}>The reserve hit 0.02 ETH. The Board is paid, on-chain.</p>
      </div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={cx} cy={cy + 16} rx="420" ry="196" fill="rgba(0,0,0,.35)" />
        <ellipse cx={cx} cy={cy} rx="414" ry="190" fill="#4a2e1b" />
        <ellipse cx={cx} cy={cy} rx="390" ry="172" fill="#5a3a22" />
        <g transform={`translate(${cx - 60} ${cy - 330}) scale(0.6)`}>
          <BarrelCEO closed={isBlink(frame, 60)} />
        </g>
        {SEAT_DEG.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const sx = cx + 470 * Math.sin(a);
          const sy = cy - 240 * Math.cos(a);
          const fx = cx + 330 * Math.sin(a);
          const fy = cy - 120 * Math.cos(a);
          const paid = inn(frame, 50 + i * 8, 10);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={fx} y2={fy} stroke={C.gold} strokeWidth="4" strokeDasharray="10 10" opacity={paid * 0.8} />
              <circle cx={sx} cy={sy} r="44" fill={i < 5 ? "#5a2124" : "#1f2f4d"} stroke={paid > 0.5 ? C.gold : "rgba(242,234,216,.3)"} strokeWidth={paid > 0.5 ? 6 : 3} />
              <text x={sx} y={sy + 13} textAnchor="middle" style={{ font: `700 36px ${MONO}` }} fill={C.ivory}>
                {i + 1}
              </text>
              <g transform={`translate(${fx - 30} ${fy - 20})`}>
                <FlagMark flag={BOARD_FLAGS[i]} size={60} />
              </g>
            </g>
          );
        })}
        <g opacity={inn(frame, 40)}>
          <rect x={cx - 150} y={cy - 46} width="300" height="80" rx="12" fill="#3a2416" stroke={C.gold} strokeWidth="3" />
          <text x={cx} y={cy + 16} textAnchor="middle" style={{ font: `700 52px ${MONO}` }} fill={C.gold}>
            0.02 ETH
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, bottom: 70, ...rise(frame, 96, 30) }}>
        <p style={{ margin: 0, ...kicker, fontSize: 24 }}>Permanent seats · No. 1-5</p>
        <p style={{ margin: "8px 0 0", fontFamily: MONO, fontSize: 52, fontWeight: 700 }}>70% · 0.014 ETH</p>
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 70, textAlign: "right", ...rise(frame, 110, 30) }}>
        <p style={{ margin: 0, ...kicker, fontSize: 24 }}>Rotating seats · No. 6-10</p>
        <p style={{ margin: "8px 0 0", fontFamily: MONO, fontSize: 52, fontWeight: 700 }}>30% · 0.006 ETH</p>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 5. every buy pumps a barrel ───────── */

const CARDS = [1204, 1205, 1206];

export const SceneBarrels: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 60% at 30% 30%, rgba(224,176,74,.1), transparent 70%), ${C.walnut}`, color: C.ivory, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 120, top: 110 }}>
        <p style={{ ...kicker, ...rise(frame, 0, 20) }}>The well</p>
        <h1 style={{ margin: "20px 0 0", ...display(110), ...rise(frame, 6) }}>
          Every buy <span style={{ ...turn, color: C.red, fontSize: "1.08em" }}>pumps a barrel.</span>
        </h1>
        <p style={{ margin: "24px 0 0", fontSize: 44, color: "rgba(242,234,216,.8)", ...rise(frame, 20) }}>5,000 in the well. Each one gets a number, a grade and the day's news. No refills.</p>
      </div>
      {CARDS.map((n, k) => {
        const t = inn(frame, 34 + k * 18, 26);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 120 + k * 590,
              top: 520,
              width: 540,
              padding: "34px 36px",
              background: "#fbf6ea",
              color: C.ink,
              boxShadow: "0 30px 60px -24px rgba(0,0,0,.7)",
              rotate: `${(k - 1) * 1.6}deg`,
              opacity: t,
              translate: `${(1 - t) * 160}px 0`,
            }}
          >
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 21, letterSpacing: "0.06em", color: "#9c7424", whiteSpace: "nowrap" }}>
              #{n.toLocaleString("en-US")} · {gradeOf(n).toUpperCase()} · API {gravityOf(n)}°
            </p>
            <p style={{ margin: "18px 0 0", ...display(64) }}>
              I pumped <span style={{ ...turn, color: C.redD }}>#{n.toLocaleString("en-US")}.</span>
            </p>
            <p style={{ margin: "18px 0 0", fontSize: 30, lineHeight: 1.3, color: "#4a3b26" }}>{headlineOf(n)}</p>
          </div>
        );
      })}
      <p style={{ position: "absolute", left: 120, bottom: 70, margin: 0, fontFamily: MONO, fontSize: 30, color: C.gold, opacity: inn(frame, 100) }}>
        Every barrel has a share card. Post it.
      </p>
    </AbsoluteFill>
  );
};

/* ───────── 6. sell once, embargoed ───────── */

export const SceneEmbargo: React.FC = () => {
  const frame = useCurrentFrame();
  const tape = (label: string, top: number, rot: number, color: string, dir: number) => (
    <div
      style={{
        position: "absolute",
        left: -200,
        width: 2400,
        top,
        rotate: `${rot}deg`,
        padding: "12px 0",
        background: `repeating-linear-gradient(135deg, ${color} 0 34px, #1a0805 34px 68px)`,
        whiteSpace: "nowrap",
        translate: `${dir * (interpolate(frame, [0, 16], [2400, 0], { ...clamp, easing: ease }) + frame * 3)}px 0`,
        boxShadow: "0 10px 24px rgba(0,0,0,.45)",
      }}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ display: "inline-block", margin: "0 26px", padding: "6px 14px", background: color, color: color === C.red ? "#fff" : C.ink, ...display(30), fontStretch: "70%", letterSpacing: "0.16em" }}>
          {label}
        </span>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2c2c2f, #232326)", color: C.ivory, fontFamily: SANS, overflow: "hidden" }}>
      {tape("EMBARGO", 70, -2.5, C.red, 1)}
      {tape("SANCTIONED · DO NOT TRADE", 150, 2, C.gold, -1)}
      <div style={{ position: "absolute", left: 120, top: 380 }}>
        <h1 style={{ margin: 0, ...display(150), ...rise(frame, 10) }}>Sell once?</h1>
        <h1 style={{ margin: "10px 0 0", ...display(150), ...turn, color: C.red, ...rise(frame, 24) }}>Embargoed. For good.</h1>
        <p style={{ margin: "30px 0 0", fontSize: 42, color: "rgba(242,234,216,.8)", ...rise(frame, 40) }}>No seat. No meeting money. Ever.</p>
      </div>
      <div style={{ position: "absolute", right: 200, top: 420, padding: 10, background: "#e9e3d4", rotate: "-4deg", opacity: inn(frame, 30) }}>
        <div style={{ filter: "grayscale(1)" }}>
          <FlagMark flag={BOARD_FLAGS[3]} size={300} />
        </div>
        <svg viewBox="0 0 300 200" style={{ position: "absolute", inset: 10, width: 300, height: 200 }}>
          <path d="M10 10 L290 190 M290 10 L10 190" stroke={C.red} strokeWidth="12" strokeLinecap="round" strokeDasharray="340" strokeDashoffset={340 * (1 - inn(frame, 44, 14))} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── 7. the end card ───────── */

export const SceneEnd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #1c2b4a, ${C.night} 60%)`, color: C.ivory, fontFamily: SANS }}>
      <svg viewBox="0 0 200 250" style={{ position: "absolute", left: 810, top: 70, width: 300, height: 375, ...rise(frame, 0, 30) }}>
        <BarrelCEO hands look={0} closed={isBlink(frame, 70, 30)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "grid", justifyItems: "center", textAlign: "center" }}>
        <h1 style={{ margin: 0, ...display(190), ...rise(frame, 10) }}>$OILCEO</h1>
        <p style={{ margin: "6px 0 0", ...turn, fontSize: 84, color: C.gold, ...rise(frame, 22) }}>the world's most important barrel.</p>
        <p style={{ margin: "36px 0 0", fontFamily: MONO, fontSize: 52, color: C.ivory, ...rise(frame, 36) }}>oilceo.fun</p>
      </div>
      <p style={{ position: "absolute", left: 0, right: 0, bottom: 50, margin: 0, textAlign: "center", fontFamily: MONO, fontSize: 22, color: "rgba(242,234,216,.45)", opacity: inn(frame, 50) }}>
        Satire. No real leader, country or company. A memecoin with no promise of value; meeting payouts depend on trading fees.
      </p>
    </AbsoluteFill>
  );
};

/* ───────── the whole video ───────── */

export const Demo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: 12 });
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Breaking" durationInFrames={120} premountFor={fps}>
          <SceneBreaking />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Promoted" durationInFrames={150} premountFor={fps}>
          <ScenePromoted />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Reserve" durationInFrames={180} premountFor={fps}>
          <SceneReserve />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Meeting" durationInFrames={180} premountFor={fps}>
          <SceneMeeting />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Barrels" durationInFrames={150} premountFor={fps}>
          <SceneBarrels />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="Embargo" durationInFrames={90} premountFor={fps}>
          <SceneEmbargo />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence name="End" durationInFrames={120} premountFor={fps}>
          <SceneEnd />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
