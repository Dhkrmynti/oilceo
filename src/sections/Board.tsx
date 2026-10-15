/**
 * The summit: the Board at the round table. The ten biggest holders who never sold sit with the CEO,
 * five permanent seats nearest the head and five rotating seats further down, each with its flag on
 * the table. Below: the seating list, the observers' gallery (No. 11-50), the lobby (wallets whose
 * first buy is still too fresh), and a tab for the longest tenure.
 */
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CaretDown, Gavel } from "@phosphor-icons/react";
import { DEFAULT_STEPS, DEFAULT_TIERS, amount, demoDiamond, splitInheritance, usePoll, type Diamond, type PondRow, type Pond, type Status } from "../lib/api";
import { nameFor } from "../lib/alias";
import { Countdown, Held } from "../lib/clock";
import { TICKER } from "../lib/brand";
import { flagOf } from "../lib/barrels";
import { prefersReducedMotion } from "../lib/motion";
import { Face, Head, XCheck, openBadge, useMedia } from "../ui/Bits";
import { FlagMark } from "../ui/Flag";
import { BarrelCEO } from "../world/Barrel";

/** Where seat No. k sits, in degrees round the table from the head: permanent seats nearest the CEO. */
const SEAT_DEG = [40, 320, 70, 290, 100, 260, 130, 230, 160, 200];

interface Seat {
  /** the chair */
  sx: number;
  sy: number;
  /** the flag on the table, top left corner */
  fx: number;
  fy: number;
  /** the name tag */
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
}

/** The wide table, seen from above: seats round an oval, names outside the chairs. */
const WIDE = { w: 900, h: 560, cx: 450, cy: 300, rx: 290, ry: 150, ceo: { x: 398, y: 38, s: 0.52 } };
const wideSeats: Seat[] = SEAT_DEG.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const { cx, cy, rx, ry } = WIDE;
  const sx = cx + (rx + 46) * Math.sin(a);
  const sy = cy - (ry + 44) * Math.cos(a);
  return { sx, sy, fx: cx + (rx - 46) * Math.sin(a) - 18, fy: cy - (ry - 34) * Math.cos(a) - 12, lx: sx, ly: Math.cos(a) < 0 ? sy + 54 : sy - 60, anchor: "middle" };
});

/** The tall table for a phone: five chairs down each side, names written on the table beside them. */
const TALL = { w: 400, h: 620, cx: 200, cy: 350, rx: 118, ry: 236, ceo: { x: 152, y: 0, s: 0.48 } };
const tallSeats: Seat[] = Array.from({ length: 10 }, (_, i) => {
  const right = i % 2 === 0;
  const row = Math.floor(i / 2);
  const sy = 196 + row * 86;
  const sx = right ? 362 : 38;
  return { sx, sy, fx: right ? 290 : 74, fy: sy - 26, lx: right ? 324 : 76, ly: sy + 22, anchor: right ? "end" : "start" };
});

function Table({ top, shares, nextMeeting, threshold, tall }: { top: PondRow[]; shares: number[]; nextMeeting: number; threshold: string; tall: boolean }) {
  const T = tall ? TALL : WIDE;
  const seats = tall ? tallSeats : wideSeats;
  const r0 = tall ? 24 : 30;
  return (
    <svg className={`table ${tall ? "is-tall" : ""}`} viewBox={`0 0 ${T.w} ${T.h}`} role="group" aria-label="The Board at the round table">
      <ellipse cx={T.cx} cy={T.cy + 14} rx={T.rx + 6} ry={T.ry + 6} fill="rgba(0,0,0,.35)" />
      <ellipse cx={T.cx} cy={T.cy} rx={T.rx} ry={T.ry} fill="#4a2e1b" />
      <ellipse cx={T.cx} cy={T.cy} rx={T.rx - 16} ry={T.ry - 14} fill="#5a3a22" />
      <ellipse cx={T.cx} cy={T.cy} rx={T.rx * 0.76} ry={T.ry * 0.65} fill="none" stroke="#d9a93f" strokeWidth="1.5" opacity="0.6" />
      {/* the head of the table */}
      <g transform={`translate(${T.ceo.x} ${T.ceo.y}) scale(${T.ceo.s})`}>
        <BarrelCEO />
      </g>
      <text x={T.cx} y={T.cy - 18} textAnchor="middle" className="table__k">
        {tall ? `MEETING #${nextMeeting}` : `EMERGENCY MEETING #${nextMeeting}`}
      </text>
      <text x={T.cx} y={T.cy + 8} textAnchor="middle" className="table__v">
        at {threshold} ETH
      </text>
      <path d={`M${T.cx - 30} ${T.cy + 40} l22 -10 l6 12 l-22 10Z M${T.cx - 12} ${T.cy + 36} l40 18`} stroke="#d9a93f" strokeWidth="5" fill="#d9a93f" strokeLinecap="round" />
      {seats.map((p, i) => {
        const r = top[i];
        const name = r ? nameFor(r.addr, r.nickname, r.x).name : "Empty seat";
        const max = tall ? 11 : 16;
        return (
          <g
            key={i}
            className={`seat ${i < 5 ? "is-perm" : "is-rot"} ${i === 0 ? "is-chair" : ""} ${r ? "" : "is-empty"}`}
            role={r ? "button" : undefined}
            tabIndex={r ? 0 : undefined}
            aria-label={r ? `Seat ${i + 1}, ${name}. Open credentials` : `Seat ${i + 1}, empty`}
            onClick={r ? () => openBadge(r.addr) : undefined}
            onKeyDown={r ? (e) => (e.key === "Enter" || e.key === " ") && openBadge(r.addr) : undefined}
          >
            <circle cx={p.sx} cy={p.sy} r={r0} className="seat__chair" />
            <text x={p.sx} y={p.sy + 7} textAnchor="middle" className="seat__n">
              {i + 1}
            </text>
            {r ? (
              <g transform={`translate(${p.fx} ${p.fy})`}>
                <FlagMark flag={flagOf(r.addr, r.pp)} size={36} />
              </g>
            ) : null}
            <text x={p.lx} y={p.ly} textAnchor={p.anchor} className="seat__name">
              {name.length > max ? `${name.slice(0, max - 1)}…` : name}
            </text>
            {r && !tall ? (
              <text x={p.lx} y={p.ly + 20} textAnchor="middle" className="seat__eth">
                +{(shares[i] ?? 0).toFixed(4)} ETH
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function Row({ r, share }: { r: PondRow; share: number }) {
  const n = nameFor(r.addr, r.nickname, r.x);
  const perm = r.rank <= 5;
  return (
    <li className={`seatrow ${r.rank === 1 ? "is-chair" : ""} ${perm ? "is-perm" : r.rank <= 10 ? "is-rot" : "is-obs"}`}>
      <button type="button" onClick={() => openBadge(r.addr)} aria-label={`No. ${r.rank}, ${n.name}. Open credentials`}>
        <span className="seatrow__n num" aria-hidden="true">
          {r.rank === 1 ? <Gavel weight="fill" /> : r.rank}
        </span>
        <Face addr={r.addr} pp={r.pp} x={r.x} size={36} className="seatrow__face" />
        <span className="seatrow__who">
          <b className={n.claimed ? "" : "num"}>
            {n.name} {r.x ? <XCheck x={r.x} /> : null}
          </b>
          <span className="num">
            tenure <Held since={r.firstIn} />
          </span>
        </span>
        <span className="seatrow__bal num">
          {amount(r.balance)} <small>{TICKER}</small>
        </span>
        <span className="seatrow__next num">{r.inTop ? `+${share.toFixed(4)}` : "-"}</span>
        <span className="seatrow__paid num">{parseFloat(r.received) > 0 ? parseFloat(r.received).toFixed(4) : "-"}</span>
      </button>
    </li>
  );
}

function Tenure() {
  const { data } = usePoll<Diamond>("/api/diamond?limit=20", 20000, demoDiamond);
  const rows = data?.rows ?? [];
  if (!rows.length) return <p className="empty">Nobody has tenure yet.</p>;
  return (
    <ol className="tenure">
      {rows.map((r) => {
        const n = nameFor(r.addr, r.nickname, r.x);
        return (
          <li key={r.addr}>
            <button type="button" onClick={() => openBadge(r.addr)}>
              <span className="num tenure__n">{r.rank}</span>
              <Face addr={r.addr} pp={r.pp} x={r.x} size={30} />
              <b className={n.claimed ? "" : "num"}>{n.name}</b>
              <Held since={r.firstIn} className="tenure__t" />
              <span className="num tenure__b">No. {r.balanceRank} by holdings</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Bench({ name, sub }: { name: string; sub: string }) {
  return (
    <p className="bench">
      <b>{name}</b>
      <span className="num">{sub}</span>
    </p>
  );
}

export function Board({ status, pond }: { status: Status | null; pond: Pond | null }) {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"seats" | "tenure">("seats");
  const [more, setMore] = useState(false);
  const live = !!status?.tokenAddress;
  const rows = live ? (pond?.rows ?? []) : [];
  const top = rows.filter((r) => r.inTop);
  const meetStep = (status?.cycle.steps ?? DEFAULT_STEPS).find((s) => s.kind === "feeding");
  const reward = parseFloat(meetStep?.thresholdETH ?? "0.02");
  const tiers = status?.rules.tiers ?? DEFAULT_TIERS;
  const shares = splitInheritance(reward, top.map((r) => parseFloat(r.balance)), tiers);
  const waiting = live ? (pond?.waiting ?? []) : [];
  const meetings = status ? Math.ceil(status.rounds / 2) : 0;
  const narrow = useMedia("(max-width: 700px)");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".table", { scale: 0.86, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".table", start: "top 85%" } });
      gsap.from(".table .seat", { scale: 0, transformOrigin: "50% 50%", opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.07, delay: 0.4, scrollTrigger: { trigger: ".table", start: "top 80%" } });
      gsap.from(".seats .seatrow", { x: -40, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05, scrollTrigger: { trigger: ".seats", start: "top 85%" } });
    },
    { scope: root, dependencies: [rows.length > 0] },
  );

  return (
    <section className="place summit" id="board" ref={root} aria-labelledby="board-h">
      <div className="summit__drape" aria-hidden="true" />
      <div className="wrap">
        <Head
          kicker="03 · the summit"
          id="board-h"
          title={
            <>
              Ten seats at the table. <em>The rest of the world watches.</em>
            </>
          }
          lead={`Ranked by ${TICKER} held, never sold. The next emergency meeting pays ${reward} ETH: ${tiers.map((t) => `${t.pct}% to No. ${t.from}-${t.to}`).join(" and ")}, split by balance inside each bench.`}
        />
        {top.length ? <Table top={top} shares={shares} nextMeeting={meetings + 1} threshold={meetStep?.thresholdETH ?? "0.02"} tall={narrow} /> : null}
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "seats"} className={tab === "seats" ? "is-on" : ""} onClick={() => setTab("seats")}>
            Seating by holdings
          </button>
          <button type="button" role="tab" aria-selected={tab === "tenure"} className={tab === "tenure" ? "is-on" : ""} onClick={() => setTab("tenure")}>
            Longest tenure
          </button>
        </div>
        {tab === "tenure" ? (
          <Tenure />
        ) : !rows.length ? (
          <p className="empty">{live ? "Every seat is empty. The first wallet over the minimum takes the gavel." : "The Board convenes at launch."}</p>
        ) : (
          <div className="seats">
            <div className="seats__cols num" aria-hidden="true">
              <span>Seat</span>
              <span />
              <span>Delegate</span>
              <span>Holds</span>
              <span>Next meeting</span>
              <span>Paid so far</span>
            </div>
            <Bench name="Permanent seats" sub={`No. 1-5 · ${tiers[0]?.eth ?? "0.014"} ETH per meeting`} />
            <ol>
              {top.slice(0, 5).map((r, i) => (
                <Row key={r.addr} r={r} share={shares[i] ?? 0} />
              ))}
            </ol>
            {top.length > 5 ? (
              <>
                <Bench name="Rotating seats" sub={`No. 6-10 · ${tiers[1]?.eth ?? "0.006"} ETH per meeting`} />
                <ol>
                  {top.slice(5, 10).map((r, i) => (
                    <Row key={r.addr} r={r} share={shares[i + 5] ?? 0} />
                  ))}
                </ol>
              </>
            ) : null}
            {rows.length > 10 ? (
              <>
                <button type="button" className="seats__more num" aria-expanded={more} onClick={() => setMore(!more)}>
                  {more ? "Hide" : "Show"} No. 11-{rows.length}, the observers' gallery <CaretDown weight="bold" aria-hidden="true" className={more ? "is-up" : ""} />
                </button>
                {more ? (
                  <ol className="seats__rest">
                    {rows.slice(10).map((r) => (
                      <Row key={r.addr} r={r} share={0} />
                    ))}
                  </ol>
                ) : null}
              </>
            ) : null}
            {waiting.length ? (
              <div className="seats__lobby">
                <p className="num">In the lobby: over the minimum, credentials still being checked</p>
                <ul>
                  {waiting.map((w) => (
                    <li key={w.addr}>
                      <button type="button" onClick={() => openBadge(w.addr)}>
                        <Face addr={w.addr} pp={w.pp} x={w.x} size={26} />
                        <span className="num">{nameFor(w.addr, w.nickname, w.x).name}</span>
                        <span className="num">{amount(w.balance)}</span>
                        <Countdown to={w.eligibleAt} done="in" className="seats__cd" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
        <p className="summit__foot num">
          {live && status ? `${status.counts.sitters} delegates accredited · ${status.counts.holders} holders · ${status.counts.hopped} under embargo` : ""}
        </p>
      </div>
    </section>
  );
}
