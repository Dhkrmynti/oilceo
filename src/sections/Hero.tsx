/**
 * The first screen: the office. The barrel sits in the president's chair behind the desk, the Board's
 * ten flags stand behind it, and the readouts sit beside it like a newsroom monitor: the Oil Reserve
 * filling toward the next meeting, the barrels pumped, what is left in the well, and the wire.
 */
import { useMemo } from "react";
import type React from "react";
import { ArrowDown } from "@phosphor-icons/react";
import { DEMO, STEP, type Well, type Pond, type Status, type PondRow } from "../lib/api";
import { nameFor } from "../lib/alias";
import { TICKER } from "../lib/brand";
import { useNow } from "../lib/clock";
import type { Line } from "../lib/feed";
import { stageOf } from "../lib/marks";
import { flagOf } from "../lib/barrels";
import { BuyButton, openBadge } from "../ui/Bits";
import { FlagMark } from "../ui/Flag";
import { openShare } from "../ui/ShareCard";
import { BarrelCEO } from "../world/Barrel";

const ago = (sec: number) => (sec < 60 ? `${Math.max(1, Math.floor(sec))}s` : sec < 3600 ? `${Math.floor(sec / 60)}m` : `${Math.floor(sec / 3600)}h`);

/** Ten poles: No. 1-5 to the barrel's right hand (the viewer's left), No. 6-10 to its left. */
const POLES = [60, 100, 140, 180, 220, 580, 620, 660, 700, 740];

function Office({ board, pumped, alarm, gone }: { board: PondRow[]; pumped: number; alarm: boolean; gone: boolean }) {
  return (
    <svg className="office" viewBox="0 0 800 560" role="img" aria-label="The barrel in a suit, sitting in the president's chair behind its desk, ten flags behind it">
      {/* window: the night, the fields, a flare */}
      <rect x="250" y="34" width="300" height="236" fill="#0a1426" />
      <circle cx="488" cy="78" r="16" fill="#efe1c4" opacity="0.85" />
      <g fill="#05090f">
        <path d="M250 270 V222 Q320 210 400 220 T550 214 V270Z" />
        <path d="M292 222 L304 160 L316 222 M297 196 H311 M300 178 H308" stroke="#05090f" strokeWidth="3" fill="none" />
        <path d="M430 222 L440 172 L450 222 M434 200 H446" stroke="#05090f" strokeWidth="3" fill="none" />
        <rect x="500" y="176" width="6" height="46" />
      </g>
      <path className="office__flare" d="M503 176 q-7 -12 0 -24 q7 12 0 24Z" fill="#ffad3b" />
      <g stroke="#d9a93f" strokeWidth="6" fill="none">
        <rect x="250" y="34" width="300" height="236" />
        <path d="M400 34 V270 M250 152 H550" strokeWidth="3" />
      </g>
      {/* curtains */}
      <path d="M220 20 H262 Q252 150 268 290 H220Z" fill="#5a1d20" />
      <path d="M580 20 H538 Q548 150 532 290 H580Z" fill="#5a1d20" />
      <path d="M214 14 H586 V30 Q560 42 534 30 Q508 42 482 30 Q456 42 430 30 Q404 42 378 30 Q352 42 326 30 Q300 42 274 30 Q248 42 214 30Z" fill="#6e2427" />
      {/* the Board's flags */}
      {POLES.map((x, i) => {
        const r = board[i];
        const flag = r ? flagOf(r.addr, r.pp) : null;
        const label = r ? `No. ${i + 1}, ${nameFor(r.addr, r.nickname, r.x).name}` : `Seat ${i + 1}, empty`;
        return (
          <g
            key={i}
            className={`pole ${r ? "is-taken" : "is-empty"} ${i === 0 ? "is-chair" : ""}`}
            role={r ? "button" : undefined}
            tabIndex={r ? 0 : undefined}
            aria-label={r ? `${label}. Open credentials` : label}
            onClick={r ? () => openBadge(r.addr) : undefined}
            onKeyDown={r ? (e) => (e.key === "Enter" || e.key === " ") && openBadge(r.addr) : undefined}
          >
            <title>{label}</title>
            <path d={`M${x} 96 V420`} stroke="#b8893a" strokeWidth="3" />
            <circle cx={x} cy="92" r="5" fill="#d9a93f" />
            <g transform={`translate(${x + 1.5} 100)`}>
              <g className="pole__flag">
                {flag ? <FlagMark flag={flag} size={34} /> : <rect width="34" height="23" fill="rgba(242,234,216,.08)" stroke="rgba(242,234,216,.25)" strokeDasharray="3 3" />}
              </g>
            </g>
            <text x={x} y="436" textAnchor="middle" className="pole__n">
              {i + 1}
            </text>
          </g>
        );
      })}
      {/* chair */}
      <rect x="292" y="166" width="216" height="262" rx="54" fill="#4a1b1d" />
      <rect x="306" y="180" width="188" height="234" rx="44" fill="#5a2124" />
      <g fill="rgba(0,0,0,.22)">{[0, 1, 2].map((rI) => [0, 1, 2, 3].map((k) => <circle key={`${rI}${k}`} cx={334 + k * 44} cy={206 + rI * 42} r="3.5" />))}</g>
      {/* the barrel */}
      <g transform="translate(300 182)">{gone ? <BarrelCEO hands look={0} className="is-dry" /> : <BarrelCEO hands look={pumped % 3 === 0 ? 1 : pumped % 3 === 1 ? -1 : 0} />}</g>
      {/* desk */}
      <path d="M40 404 H760 L748 428 H52Z" fill="#6a4429" />
      <rect x="52" y="428" width="696" height="132" fill="#3a2416" />
      <g stroke="rgba(0,0,0,.28)" strokeWidth="2" fill="none">
        <rect x="80" y="446" width="200" height="96" rx="4" />
        <rect x="520" y="446" width="200" height="96" rx="4" />
      </g>
      <g transform="translate(400 502) scale(0.86)">
        <circle r="44" fill="none" stroke="#d9a93f" strokeWidth="3" />
        <circle r="36" fill="none" stroke="#d9a93f" strokeWidth="1" strokeDasharray="2 4" />
        <path d="M0 -22 c9 12 16 20 16 29 a16 16 0 0 1 -32 0 c0 -9 7 -17 16 -29Z" fill="#d9a93f" />
      </g>
      {/* on the desk: the red phone, the plate, the minutes, the siren */}
      <g className="phone" key={`p${pumped}`} transform="translate(130 372)">
        <path d="M0 32 H64 L56 10 H8Z" fill="#b8231a" />
        <path d="M-4 8 Q32 -10 68 8 L62 16 Q32 4 2 16Z" fill="#d42a1f" />
        <circle cx="32" cy="22" r="6" fill="#7d150f" />
      </g>
      <g transform="translate(330 434)">
        <rect width="140" height="20" rx="2" fill="#d9a93f" />
        <text x="70" y="14.5" textAnchor="middle" className="office__plate">
          THE BARREL · CEO
        </text>
      </g>
      <g transform="translate(540 380)">
        <rect x="6" y="-6" width="78" height="22" fill="#d8ceb6" transform="rotate(-4)" />
        <rect width="80" height="24" fill="#f2ead8" />
        <text x="40" y="16" textAnchor="middle" className="office__paper">
          MINUTES
        </text>
      </g>
      <g className={`lamp ${alarm ? "is-on" : ""}`} transform="translate(668 364)">
        <rect x="-16" y="28" width="32" height="12" rx="2" fill="#2b2621" />
        <path d="M-12 28 V14 a12 12 0 0 1 24 0 V28Z" className="lamp__dome" />
        <circle cx="0" cy="18" r="30" className="lamp__glow" />
      </g>
    </svg>
  );
}

export function Hero({ status, pond, well, feed }: { status: Status | null; pond: Pond | null; well: Well | null; feed: Line[] }) {
  const live = !!status?.tokenAddress;
  const total = well?.total ?? status?.forest?.total ?? 5000;
  const pumped = live ? (well?.burned ?? status?.forest?.burned ?? 0) : 0;
  const left = Math.max(0, total - pumped);
  const pct = total > 0 ? (pumped / total) * 100 : 0;
  const stage = live ? stageOf(pumped, total) : "burning";
  const last = well?.last ?? null;

  const escrow = live ? parseFloat(status?.escrowETH ?? "0") : 0;
  const step = status?.cycle;
  const target = parseFloat(step?.thresholdETH ?? "0.02");
  const fill = target > 0 ? Math.max(0, Math.min(1, escrow / target)) : 0;
  const meeting = (step?.kind ?? "feeding") === "feeding";

  const board = useMemo(() => (live ? (pond?.rows ?? []).filter((r) => r.inTop).slice(0, 10) : []), [pond, live]);

  const now = useNow();
  const lastPump = well?.recent[0];

  return (
    <section className={`place hero is-${stage}`} id="top" aria-label="The office" style={{ "--fill": fill.toFixed(3) } as React.CSSProperties}>
      <div className="hero__copy">
        <p className="hero__k num">
          {live ? <span className="hero__live">● Live</span> : "Opening soon"} {live ? "from" : "at"} the Barrel House · {TICKER}
        </p>
        {stage === "gone" ? (
          <h1 className="hero__h">
            The well is dry.
            <br />
            <em>The barrel is still CEO.</em>
          </h1>
        ) : (
          <h1 className="hero__h">
            The world's most
            <br />
            important <em>barrel.</em>
          </h1>
        )}
        <p className="hero__sub">
          Every country argues. In the end, everybody needs oil, so one barrel of it got the job: CEO of the world. Every {TICKER} trade fills the Oil Reserve. When the reserve hits its target, the
          Board holds an emergency meeting on-chain and the ETH goes to the ten biggest holders. Sell once and you are under embargo.
          {DEMO ? <em className="demo"> Demo data.</em> : null}
        </p>
        <div className="hero__acts">
          <BuyButton status={status} />
          {stage === "gone" && last ? (
            <button type="button" className="btn is-ghost" onClick={() => openShare({ n: last.n, amount: last.amount, t: last.t, total, who: nameFor(last.buyer, last.nickname, last.x).name })}>
              The last barrel's card
            </button>
          ) : (
            <a className="btn is-ghost" href="#board">
              Meet the Board <ArrowDown weight="bold" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="hero__scene">
        <Office board={board} pumped={pumped} alarm={live && meeting && fill >= 0.8} gone={stage === "gone"} />
      </div>

      <div className="hero__strip">
        <dl className="meter" aria-label="The reserve and the well">
          <div className={`meter__cell is-wide is-reserve ${fill >= 0.8 && meeting ? "is-alarm" : ""}`}>
            <dt>Oil Reserve</dt>
            <dd className="num">
              {escrow.toFixed(4)} <small>/ {target} ETH</small>
            </dd>
            <span className="meter__bar" aria-hidden="true">
              <i style={{ width: `${Math.max(2, fill * 100)}%` }} />
            </span>
            <span className="meter__next num">
              {Math.round(fill * 100)}% · next: {STEP[step?.kind ?? "feeding"].name}
            </span>
          </div>
          <div className="meter__cell">
            <dt>Barrels pumped</dt>
            <dd className="num is-gold is-bump" key={`b${pumped}`}>
              {pumped.toLocaleString("en-US")}
            </dd>
          </div>
          <div className={`meter__cell ${stage === "last100" ? "is-alarm" : ""}`}>
            <dt>Left in the well</dt>
            <dd className="num">
              {left.toLocaleString("en-US")} <small className="is-under">{pct.toFixed(pct < 10 ? 1 : 0)}% pumped</small>
            </dd>
          </div>
          <div className="meter__cell">
            <dt>Last barrel</dt>
            <dd className="num">{lastPump && live ? `${ago(now - lastPump.t)} ago` : "not yet"}</dd>
          </div>
        </dl>

        <aside className="wire" aria-label="The wire">
          <p className="wire__k num">The wire · what just happened</p>
          <ol aria-live="polite">
            {feed.length ? (
              feed.map((l) => (
                <li key={l.id} className={`wire__line is-${l.tone}`}>
                  {l.who ? <b>{l.who}</b> : null} {l.text}
                </li>
              ))
            ) : (
              <li className="wire__line is-ash">{live ? "Quiet on the wire. Somebody is drafting a statement." : "The wire opens at launch."}</li>
            )}
          </ol>
        </aside>
      </div>
    </section>
  );
}
