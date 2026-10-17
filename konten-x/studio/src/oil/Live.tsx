/**
 * Posts made from the live numbers on oilceo.fun (read 17 Oct 2026). Portrait 1080 by 1350, the
 * size X shows uncropped in the feed. Update NOW and re-render for fresh numbers.
 */
import { AbsoluteFill } from "remotion";
import { BarrelCEO } from "./Barrel";
import { FlagMark } from "./Flag";
import { flagFor, gradeOf, gravityOf, headlineOf } from "./barrels";
import { C, MONO, SANS, display, turn } from "./theme";

export const NOW = {
  ca: "0x1f35102C0AC5123D6c0579bF8a5E0AC9FCC18693",
  barrels: 12,
  holders: 10,
  embargoed: 7,
  latest: { n: 12, buyer: "0x9ab1…1d76", amount: "1.24M" },
  board: [
    ["0x58b0c25351ebab7d851928e41a5b9d8e42bb0a01", "34.78M"],
    ["0x0ce258fa60b6e5470993df512eedc22e339c17f4", "30.22M"],
    ["0x0dcafbe0af7271c64c894baf96291cb43318a66a", "28.86M"],
    ["0xe1799031467aa3218e5b770d240c59d6614336e5", "4.99M"],
    ["0x4b556dfe01f67763f0f954f6677aa67080754831", "3.92M"],
    ["0x9ab180ac1691df5e2d21a5e369d4217bbd4f1d76", "2.44M"],
    ["0x872bb5243f913e3b68ad8f888278deece0074622", "1.63M"],
    ["0x511447997ed13b4f96488aa2535aae54a6d4b2c5", "1.52M"],
    ["0x65d20e63f8d4bc6c6a3a6c8ecfc61bf85b332c44", "418K"],
  ] as [string, string][],
};

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const BG = `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(224,176,74,.14), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 2px, transparent 2px 54px), linear-gradient(180deg, ${C.night}, #0e1729)`;
const kick: React.CSSProperties = { fontFamily: MONO, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, margin: 0 };
const Foot: React.FC = () => (
  <div style={{ position: "absolute", left: 80, right: 80, bottom: 60, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, color: "rgba(242,234,216,.6)" }}>
    <span>$OILCEO</span>
    <span style={{ color: C.gold }}>oilceo.fun</span>
  </div>
);

/** 1. In office: the token is live, with the counts. */
export const PostInOffice: React.FC = () => (
  <AbsoluteFill style={{ background: BG, color: C.ivory, fontFamily: SANS }}>
    <svg viewBox="0 0 200 250" style={{ position: "absolute", left: 340, top: 70, width: 400, height: 500 }}>
      <BarrelCEO hands look={0} />
    </svg>
    <div style={{ position: "absolute", left: 80, right: 80, top: 600 }}>
      <p style={kick}>
        <span style={{ color: C.red }}>● Live</span> · the Barrel House
      </p>
      <h1 style={{ margin: "18px 0 0", ...display(120) }}>
        The barrel is <span style={{ ...turn, color: C.gold, fontSize: "1.1em" }}>in office.</span>
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", marginTop: 50, border: `2px solid rgba(224,176,74,.35)`, borderRadius: 10 }}>
        {[
          ["Barrels pumped", String(NOW.barrels), C.gold],
          ["Holders", String(NOW.holders), C.ivory],
          ["Embargoed", String(NOW.embargoed), C.red],
        ].map(([k, v, col], i) => (
          <div key={k} style={{ padding: "24px 26px", borderLeft: i ? "2px solid rgba(224,176,74,.2)" : undefined }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 22, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(242,234,216,.6)" }}>{k}</p>
            <p style={{ margin: "8px 0 0", fontFamily: MONO, fontSize: 72, fontWeight: 700, color: col }}>{v}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: "30px 0 0", fontFamily: MONO, fontSize: 25, color: "rgba(242,234,216,.75)" }}>CA {NOW.ca}</p>
    </div>
    <Foot />
  </AbsoluteFill>
);

/** 2. The embargo list is already filling up. */
export const PostEmbargoed: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #2c2c2f, #232326)", color: C.ivory, fontFamily: SANS, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -60, right: -60, top: 70, rotate: "-3deg", padding: "12px 0", background: `repeating-linear-gradient(135deg, ${C.red} 0 30px, #1a0805 30px 60px)`, whiteSpace: "nowrap" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ display: "inline-block", margin: "0 22px", padding: "4px 12px", background: C.red, color: "#fff", ...display(30), fontStretch: "70%", letterSpacing: "0.16em" }}>
          EMBARGO
        </span>
      ))}
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 230 }}>
      <p style={kick}>The embargo list</p>
      <h1 style={{ margin: "18px 0 0", ...display(150) }}>
        {NOW.embargoed} sold.
        <br />
        <span style={{ ...turn, color: C.red, fontSize: "1.05em" }}>{NOW.embargoed} sanctioned.</span>
      </h1>
      <p style={{ margin: "30px 0 0", fontSize: 44, lineHeight: 1.3, color: "rgba(242,234,216,.85)" }}>Sell once and you lose your seat for good. No exceptions, not even for paper hands.</p>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 880, display: "flex", flexWrap: "wrap", gap: 14 }}>
      {Array.from({ length: NOW.embargoed }, (_, i) => (
        <div key={i} style={{ position: "relative", padding: 6, background: "#e9e3d4", rotate: `${(i % 3) - 1}deg` }}>
          <div style={{ filter: "grayscale(1)" }}>
            <FlagMark flag={flagFor(`0xsold${i * 31}`)} size={96} />
          </div>
          <svg viewBox="0 0 96 64" style={{ position: "absolute", inset: 6, width: 96, height: 64 }}>
            <path d="M4 4 L92 60 M92 4 L4 60" stroke={C.red} strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
    <Foot />
  </AbsoluteFill>
);

/** 3. The latest barrel, as a share card. */
export const PostLatestBarrel: React.FC = () => {
  const n = NOW.latest.n;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 40% 30%, rgba(224,176,74,.1), transparent 70%), ${C.walnut}`, color: C.ivory, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 100 }}>
        <p style={kick}>Breaking · the well</p>
        <h1 style={{ margin: "18px 0 0", ...display(130) }}>
          Barrel #{n} <span style={{ ...turn, color: C.red, fontSize: "1.08em" }}>just came up.</span>
        </h1>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 520, padding: "50px 54px", background: "#fbf6ea", color: C.ink, rotate: "-1.5deg", boxShadow: "0 40px 70px -30px rgba(0,0,0,.7)" }}>
        <p style={{ margin: 0, fontFamily: MONO, fontSize: 28, letterSpacing: "0.08em", color: "#9c7424" }}>
          BARREL #{n} · {gradeOf(n).toUpperCase()} · API {gravityOf(n)}°
        </p>
        <p style={{ margin: "26px 0 0", fontSize: 54, lineHeight: 1.18, fontWeight: 600 }}>{headlineOf(n)}</p>
        <p style={{ margin: "34px 0 0", fontFamily: MONO, fontSize: 28, color: "#6b6457" }}>
          bought by {NOW.latest.buyer} · {NOW.latest.amount} $OILCEO
        </p>
      </div>
      <p style={{ position: "absolute", left: 80, right: 80, top: 1080, margin: 0, fontFamily: MONO, fontSize: 30, color: C.gold }}>
        {(5000 - NOW.barrels).toLocaleString("en-US")} barrels left in the well. No refills.
      </p>
      <Foot />
    </AbsoluteFill>
  );
};

/** 4. The Board as it sits right now. */
export const PostBoardNow: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.chamber}, #0d1c36)`, color: C.ivory, fontFamily: SANS }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "radial-gradient(circle at 50% 0, #6e2427 0 26px, transparent 27px) 0 0 / 56px 40px repeat-x, linear-gradient(#5a1d20,#5a1d20) 0 0 / 100% 12px no-repeat" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 110 }}>
      <p style={kick}>The Board · right now</p>
      <h1 style={{ margin: "18px 0 0", ...display(96) }}>
        {NOW.board.length} seats taken. <span style={{ ...turn, color: C.red, fontSize: "1.08em" }}>{10 - NOW.board.length} open.</span>
      </h1>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 330, display: "grid", gap: 9 }}>
      {NOW.board.map(([a, bal], i) => (
        <div key={a} style={{ display: "grid", gridTemplateColumns: "56px 72px 1fr auto", alignItems: "center", gap: 22, padding: "9px 20px", borderRadius: 10, background: i < 5 ? "rgba(110,36,39,.35)" : "rgba(255,255,255,.05)", border: i === 0 ? `2px solid ${C.gold}` : "2px solid transparent" }}>
          <span style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: i === 0 ? C.gold : C.ivory }}>{i + 1}</span>
          <FlagMark flag={flagFor(a)} size={66} />
          <span style={{ fontFamily: MONO, fontSize: 32 }}>{short(a)}</span>
          <span style={{ fontFamily: MONO, fontSize: 32, color: C.gold }}>{bal}</span>
        </div>
      ))}
      <div style={{ padding: "12px 20px", borderRadius: 10, border: "2px dashed rgba(242,234,216,.3)", fontFamily: MONO, fontSize: 30, color: "rgba(242,234,216,.6)" }}>10 · this seat is open</div>
    </div>
    <Foot />
  </AbsoluteFill>
);
