/**
 * Behind the office, the Oil Reserve: trading fees pour into the tank; when it reaches the next
 * step, the valve opens and the engine runs it: the emergency meeting pays the Board, or the strategic
 * reserve goes to the treasury. Then the minutes, one resolution per round with its transaction, and
 * the embargo list: every wallet that sold.
 */
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { DEFAULT_STEPS, DEMO, PONS_FEE_ESCROW, REPO_URL, STEP, addrUrl, amount, dateWib, demoGraveyard, eth, short, stepShare, txUrl, usePoll, type Graveyard, type HouseRow, type RoundRow, type Status } from "../lib/api";
import { CHAIN, TICKER } from "../lib/brand";
import { nameFor } from "../lib/alias";
import { span } from "../lib/clock";
import { prefersReducedMotion } from "../lib/motion";
import { Face, Head, openBadge } from "../ui/Bits";
import { RefineryEdge, TapeEdge } from "../world/Edges";

function Tank({ fill, alarm }: { fill: number; alarm: boolean }) {
  const h = 250;
  const level = 70 + h * (1 - fill);
  return (
    <svg className="tank" viewBox="0 0 320 380" aria-hidden="true">
      <defs>
        <clipPath id="tank-body">
          <path d="M50 70 V320 A110 22 0 0 0 270 320 V70 Z" />
        </clipPath>
      </defs>
      {/* ladder */}
      <g stroke="#5b5650" strokeWidth="3">
        <path d="M282 80 V340 M300 80 V340" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M282 ${96 + i * 21} H300`} />
        ))}
      </g>
      <path d="M50 70 V320 A110 22 0 0 0 270 320 V70 Z" fill="#26231f" />
      <g clipPath="url(#tank-body)">
        <g className="tank__oil">
          <rect x="40" y={level} width="240" height={340 - level} fill="#0d0b09" />
          <ellipse cx="160" cy={level} rx="110" ry="14" fill="#e8a24a" opacity="0.9" />
          <ellipse cx="140" cy={level - 2} rx="50" ry="4" fill="#ffd27a" opacity="0.5" />
        </g>
      </g>
      <g stroke="#3b3631" strokeWidth="2" fill="none">
        {[130, 190, 250].map((y) => (
          <path key={y} d={`M50 ${y} A110 22 0 0 0 270 ${y}`} />
        ))}
      </g>
      <path d="M50 70 V320 A110 22 0 0 0 270 320 V70" fill="none" stroke="#d9a93f" strokeWidth="3" />
      <ellipse cx="160" cy="70" rx="110" ry="22" fill="#34302b" stroke="#d9a93f" strokeWidth="3" />
      {/* the gauge */}
      <g className="num tank__marks">
        {[1, 0.75, 0.5, 0.25].map((p) => (
          <g key={p}>
            <path d={`M50 ${70 + h * (1 - p)} h-14`} stroke="#d9a93f" strokeWidth="2" />
            <text x="30" y={74 + h * (1 - p)} textAnchor="end">
              {p * 100}
            </text>
          </g>
        ))}
      </g>
      {/* the beacon */}
      <g className={`beacon ${alarm ? "is-on" : ""}`}>
        <rect x="150" y="36" width="20" height="12" fill="#2b2621" />
        <path d="M152 36 V26 a8 8 0 0 1 16 0 V36Z" className="beacon__dome" />
        <circle cx="160" cy="28" r="34" className="beacon__glow" />
      </g>
      <text x="160" y="204" textAnchor="middle" className="tank__pct num">
        {Math.round(fill * 100)}%
      </text>
    </svg>
  );
}

export function Reserve({ status }: { status: Status | null }) {
  const root = useRef<HTMLElement>(null);
  const live = !!status?.tokenAddress;
  const steps = status?.cycle.steps ?? DEFAULT_STEPS;
  const idx = live ? (status?.cycle.index ?? 0) : 0;
  const step = steps[idx] ?? steps[0];
  const escrow = live ? parseFloat(status?.escrowETH ?? "0") : 0;
  const target = parseFloat(step.thresholdETH);
  const fill = target > 0 ? Math.max(0, Math.min(1, escrow / target)) : 0;
  const toBoard = stepShare(steps, "feeding");
  const t = status?.totals;
  const meeting = steps.find((s) => s.kind === "feeding");
  const treasury = steps.find((s) => s.kind === "keeper");
  const alarm = live && step.kind === "feeding" && fill >= 0.8;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".tank__oil", { yPercent: 70 }, { yPercent: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".tank", start: "top 80%", once: true } });
      gsap.from(".valve", { x: 50, opacity: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.15, scrollTrigger: { trigger: ".works", start: "top 70%" } });
      gsap.from(".plate", { y: 30, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.08, scrollTrigger: { trigger: ".plates", start: "top 88%" } });
    },
    { scope: root },
  );

  return (
    <section className="place reserve" id="reserve" ref={root} aria-labelledby="reserve-h">
      <RefineryEdge />
      <div className="wrap">
        <div className="reserve__top">
          <Head
            kicker="04 · the oil reserve"
            id="reserve-h"
            title={
              <>
                Every trade fills it. <em>Full means a meeting.</em>
              </>
            }
            lead="Every trade pays a fee into the Oil Reserve. When it reaches the size of the next step, the valve opens and the engine runs that step, in this order, for as long as people trade."
          />
          <div className="plates">
            <div className="plate is-split">
              <p className="num">Over one full loop</p>
              <span className="split__bar" aria-hidden="true">
                <i className="is-board" style={{ width: `${toBoard}%` }} />
                <i className="is-tr" style={{ width: `${100 - toBoard}%` }} />
              </span>
              <p className="split__legend num">
                <span>{toBoard}% to the Board</span>
                <span>{100 - toBoard}% to the treasury</span>
              </p>
            </div>
            <div className="plate">
              <p className="num">Fees claimed</p>
              <b className="num">{eth(live ? (t?.feesClaimedETH ?? "0") : "0")}</b>
            </div>
            <div className="plate">
              <p className="num">Paid to the Board</p>
              <b className="num">{eth(live ? (t?.fedETH ?? "0") : "0")}</b>
            </div>
            <div className="plate">
              <p className="num">To treasury</p>
              <b className="num">{eth(live ? (t?.keeperETH ?? "0") : "0")}</b>
            </div>
            <div className="plate">
              <p className="num">Sessions held</p>
              <b className="num">{live ? (status?.rounds ?? 0) : 0}</b>
            </div>
          </div>
        </div>
        <div className="works">
          <div
            className="works__tank"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={escrow}
            aria-label={`${STEP[step.kind].name}: ${escrow.toFixed(4)} of ${step.thresholdETH} ETH`}
          >
            <Tank fill={fill} alarm={alarm} />
            <p className="works__v num">
              {escrow.toFixed(4)} <small>/ {step.thresholdETH} ETH</small>
            </p>
            <p className="works__k num">{alarm ? "● Delegates are being called in" : `Now filling: ${STEP[step.kind].name}`}</p>
          </div>
          <svg className="pipes" viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
            <path className="pipes__pipe" d="M0 230 H90 V70 H200" />
            <path className="pipes__pipe" d="M0 230 H200" />
            <path className={`pipes__oil ${step.kind === "feeding" && live ? "is-flow" : ""}`} d="M0 230 H90 V70 H200" />
            <path className={`pipes__oil ${step.kind === "keeper" && live ? "is-flow" : ""}`} d="M0 230 H200" />
            <g className="pipes__flange">
              {[
                [40, 230, 0],
                [140, 230, 0],
                [90, 150, 1],
                [150, 70, 0],
              ].map(([x, y, v]) => (
                <rect key={`${x}-${y}`} x={v ? x - 13 : x - 3} y={v ? y - 3 : y - 13} width={v ? 26 : 6} height={v ? 6 : 26} rx="1" />
              ))}
              <circle cx="90" cy="230" r="13" />
              <circle cx="90" cy="70" r="13" />
            </g>
          </svg>
          <ol className="valves">
            <li className={`valve is-meeting ${live && step.kind === "feeding" ? "is-now" : ""}`}>
              <span className="valve__wheel" aria-hidden="true" />
              <span className="valve__n num">01</span>
              <b>Emergency meeting</b>
              <span className="num">{meeting?.thresholdETH ?? "0.02"} ETH</span>
              <span>{STEP.feeding.does}, split by bench and by balance.</span>
            </li>
            <li className={`valve is-treasury ${live && step.kind === "keeper" ? "is-now" : ""}`}>
              <span className="valve__wheel" aria-hidden="true" />
              <span className="valve__n num">02</span>
              <b>Strategic reserve</b>
              <span className="num">{treasury?.thresholdETH ?? "0.025"} ETH</span>
              <span>{STEP.keeper.does}. Then back to 01.</span>
            </li>
          </ol>
        </div>
        <p className="reserve__fine">The rules of this engine: no buyback, no token burn. Every ETH claimed goes to the Board or to the treasury, and every transfer is in the minutes.</p>
      </div>
    </section>
  );
}

/**
 * Don't trust the barrel: every address that touches the money, one click from the explorer, plus
 * the engine's source. The demo edition prints no links (a made-up address is a trap).
 */
function Receipts({ status, house }: { status: Status | null; house?: HouseRow | null }) {
  const live = !DEMO && !!status?.tokenAddress;
  const rows: [string, string, string][] = [
    ["The Oil Reserve", "Pons fee escrow. Every trade's fee lands here first.", PONS_FEE_ESCROW],
    ["The engine wallet", "Claims the reserve and pays the Board. Also the dev wallet: never seated, never paid.", status?.walletAddress ?? ""],
    ["The treasury", "Where the strategic-reserve step goes.", status?.treasuryAddress ?? ""],
    ["The token", `${TICKER} on ${CHAIN}.`, status?.tokenAddress ?? ""],
  ];
  return (
    <div className="receipts">
      <p className="receipts__k num">Don't trust the barrel. Check it.</p>
      <ul>
        {rows.map(([name, what, addr]) => (
          <li key={name}>
            <b>{name}</b>
            <span>{what}</span>
            {live && addr ? (
              <a className="num" href={addrUrl(addr)} target="_blank" rel="noreferrer">
                {short(addr)} <ArrowUpRight weight="bold" aria-hidden="true" />
              </a>
            ) : (
              <span className="num receipts__wait">at launch</span>
            )}
          </li>
        ))}
        <li>
          <b>The engine's code</b>
          <span>Every rule on this page, in plain TypeScript. Public, read it.</span>
          <a className="num" href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight weight="bold" aria-hidden="true" />
          </a>
        </li>
        {live && house ? (
          <li>
            <b>What the dev holds</b>
            <span>The engine wallet's own {TICKER}, live.</span>
            <span className="num">{amount(house.balance)}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export function Minutes({ rounds, live, status, house }: { rounds: RoundRow[] | null; live: boolean; status: Status | null; house?: HouseRow | null }) {
  const root = useRef<HTMLElement>(null);
  const rows = live ? (rounds ?? []).filter((r) => r.stage === "done").slice(0, 14) : [];
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".minutes__doc",
        { clipPath: "inset(0 0 100% 0)", y: -30 },
        { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.4, ease: "power2.inOut", scrollTrigger: { trigger: ".minutes__desk", start: "top 75%", once: true } },
      );
      gsap.from(".receipts li", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: ".receipts", start: "top 88%", once: true } });
      gsap.fromTo(
        ".minutes__stamp",
        { scale: 3, opacity: 0, rotate: 30 },
        { scale: 1, opacity: 1, rotate: -12, duration: 0.35, ease: "power4.in", scrollTrigger: { trigger: ".minutes__doc", start: "bottom 85%", toggleActions: "play none none reverse" } },
      );
    },
    { scope: root, dependencies: [rows.length > 0] },
  );
  return (
    <section className="place minutes" id="minutes" ref={root} aria-labelledby="minutes-h">
      <div className="wrap">
        <Head
          kicker="05 · the minutes"
          id="minutes-h"
          title={
            <>
              Every session, <em>on the record.</em>
            </>
          }
          lead="The secretary types one resolution per round, and each one links to its transaction. Nobody has to take the barrel's word for it."
        />
        <div className="minutes__desk">
          {rows.length ? (
            <div className="minutes__doc" role="table" aria-label="Resolutions">
              <div className="minutes__head num" aria-hidden="true">
                <b>MINUTES OF THE BOARD</b>
                <span>The Barrel House · all times UTC+7</span>
              </div>
              <div className="minutes__row is-head num" role="row">
                <span role="columnheader">Res.</span>
                <span role="columnheader">Session</span>
                <span role="columnheader">When</span>
                <span role="columnheader">ETH</span>
                <span role="columnheader">To</span>
                <span role="columnheader">Tx</span>
              </div>
              {rows.map((r) => (
                <div key={r.n} className={`minutes__row num is-${r.kind}`} role="row">
                  <span role="cell">#{r.n}</span>
                  <span role="cell">
                    <b>{STEP[r.kind].name}</b>
                  </span>
                  <span role="cell">{dateWib(r.doneAt || r.at)}</span>
                  <span role="cell">{parseFloat(r.kind === "feeding" ? r.fedETH : r.spentETH).toFixed(4)}</span>
                  <span role="cell">{r.kind === "feeding" ? `${r.recipients} seats` : "treasury"}</span>
                  <span role="cell">
                    {r.tx ? (
                      <a href={txUrl(r.tx)} target="_blank" rel="noreferrer">
                        {r.tx.slice(0, 8)}… <ArrowUpRight weight="bold" aria-hidden="true" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
              ))}
              <p className="minutes__foot num" aria-hidden="true">
                — motion carried. meeting adjourned. —
              </p>
              <span className="minutes__stamp num" aria-hidden="true">
                Adopted
                <br />
                on chain
              </span>
            </div>
          ) : (
            <p className="empty">{live ? "No session yet. The first convenes when the reserve reaches its first step." : "The secretary starts typing at launch."}</p>
          )}
        </div>
        <Receipts status={status} house={house} />
      </div>
    </section>
  );
}

export function Embargo({ status }: { status: Status | null }) {
  const root = useRef<HTMLElement>(null);
  const live = !!status?.tokenAddress;
  const { data } = usePoll<Graveyard>(live ? "/api/graveyard?limit=24" : null, 30000, demoGraveyard);
  const rows = live ? (data?.rows ?? []) : [];
  const shortest = rows.length ? rows.reduce((a, b) => (b.hoppedAt - b.firstIn < a.hoppedAt - a.firstIn ? b : a)) : null;
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".sanction", { y: 50, opacity: 0, rotate: (i) => (i % 2 ? 3 : -3), duration: 0.6, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: ".sanctions", start: "top 85%" } });
      gsap.fromTo(
        ".sanction__stamp",
        { scale: 2.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power4.in", stagger: 0.06, delay: 0.4, scrollTrigger: { trigger: ".sanctions", start: "top 80%" } },
      );
    },
    { scope: root, dependencies: [rows.length > 0] },
  );
  return (
    <section className="place embargo" id="embargo" ref={root} aria-labelledby="embargo-h">
      <TapeEdge />
      <div className="wrap">
        <Head
          kicker="06 · the embargo list"
          id="embargo-h"
          title={
            <>
              They sold. <em>Now they're sanctioned.</em>
            </>
          }
          lead={`${live ? (data?.total ?? 0) : 0} wallets are under embargo. Out for good: no seat, no meeting money.${shortest ? ` Shortest stay at the table: ${span(shortest.hoppedAt - shortest.firstIn)}.` : ""}`}
        />
        {rows.length ? (
          <ul className="sanctions">
            {rows.map((g) => {
              const n = nameFor(g.addr, g.nickname, g.x);
              return (
                <li key={g.addr} className="sanction">
                  <button type="button" onClick={() => openBadge(g.addr)}>
                    <span className="sanction__photo" aria-hidden="true">
                      <Face addr={g.addr} pp={g.pp} x={g.x} size={72} className="sanction__face" />
                    </span>
                    <b className={n.claimed ? "" : "num"}>{n.name}</b>
                    <span className="num">held {span(g.hoppedAt - g.firstIn)}</span>
                    <span className="num">{parseFloat(g.received) > 0 ? `paid ${parseFloat(g.received).toFixed(4)} ETH before` : "never paid"}</span>
                  </button>
                  <span className="sanction__stamp num" aria-hidden="true">
                    Embargoed
                  </span>
                  {g.hoppedTx ? (
                    <a className="sanction__tx num" href={txUrl(g.hoppedTx)} target="_blank" rel="noreferrer" aria-label="The sale's transaction">
                      sale tx <ArrowUpRight weight="bold" aria-hidden="true" />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="empty">{live ? "No sanctions yet. Nobody has sold." : "The list opens at launch."}</p>
        )}
      </div>
    </section>
  );
}
