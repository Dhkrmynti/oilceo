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
import { Face, Head, XCheck, openBadge } from "../ui/Bits";
import { FlagMark } from "../ui/Flag";
import { BarrelCEO } from "../world/Barrel";

/** Where seat No. k sits, in degrees round the table from the head: permanent seats nearest the CEO. */
const SEAT_DEG = [40, 320, 70, 290, 100, 260, 130, 230, 160, 200];
const CX = 450;
const CY = 300;
const RX = 290;
const RY = 150;

function Table({ top, shares, nextMeeting, threshold }: { top: PondRow[]; shares: number[]; nextMeeting: number; threshold: string }) {
  return (
    <svg className="table" viewBox="0 0 900 560" role="group" aria-label="The Board at the round table">
      <ellipse cx={CX} cy={CY + 14} rx={RX + 6} ry={RY + 6} fill="rgba(0,0,0,.35)" />
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#4a2e1b" />
      <ellipse cx={CX} cy={CY} rx={RX - 18} ry={RY - 14} fill="#5a3a22" />
      <ellipse cx={CX} cy={CY} rx={RX - 70} ry={RY - 52} fill="none" stroke="#d9a93f" strokeWidth="1.5" opacity="0.6" />
      {/* the head of the table */}
      <g transform={`translate(${CX - 52} ${CY - RY - 112}) scale(0.52)`}>
        <BarrelCEO />
      </g>
      <text x={CX} y={CY - 18} textAnchor="middle" className="table__k">
        EMERGENCY MEETING #{nextMeeting}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" className="table__v">
        convenes at {threshold} ETH
      </text>
      <path d={`M${CX - 30} ${CY + 40} l22 -10 l6 12 l-22 10Z M${CX - 12} ${CY + 36} l40 18`} stroke="#d9a93f" strokeWidth="5" fill="#d9a93f" strokeLinecap="round" />
      {SEAT_DEG.map((deg, i) => {
        const r = top[i];
        const a = (deg * Math.PI) / 180;
        const sx = CX + (RX + 46) * Math.sin(a);
        const sy = CY - (RY + 44) * Math.cos(a);
        const fx = CX + (RX - 46) * Math.sin(a);
        const fy = CY - (RY - 34) * Math.cos(a);
        const below = Math.cos(a) < 0;
        const ly = below ? sy + 54 : sy - 60;
        const name = r ? nameFor(r.addr, r.nickname, r.x).name : "Empty seat";
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
            <circle cx={sx} cy={sy} r="30" className="seat__chair" />
            <text x={sx} y={sy + 7} textAnchor="middle" className="seat__n">
              {i + 1}
            </text>
            {r ? (
              <g transform={`translate(${fx - 18} ${fy - 12})`}>
                <FlagMark flag={flagOf(r.addr, r.pp)} size={36} />
              </g>
            ) : null}
            <text x={sx} y={ly} textAnchor="middle" className="seat__name">
              {name.length > 16 ? `${name.slice(0, 15)}…` : name}
            </text>
            {r ? (
              <text x={sx} y={ly + 20} textAnchor="middle" className="seat__eth">
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
        {top.length ? <Table top={top} shares={shares} nextMeeting={meetings + 1} threshold={meetStep?.thresholdETH ?? "0.02"} /> : null}
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
