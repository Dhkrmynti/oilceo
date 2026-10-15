/**
 * Under the office: the chyron (every recent barrel, with the news that came with it), then the
 * briefing on the CEO's desk: one memo to the world and four folders with the rules.
 */
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { amount, short, type Well, type Status } from "../lib/api";
import { nameFor } from "../lib/alias";
import { TICKER } from "../lib/brand";
import { gradeOf, headlineOf } from "../lib/barrels";
import { prefersReducedMotion } from "../lib/motion";
import { Head } from "../ui/Bits";
import { Emblem } from "../ui/Flag";
import { openShare } from "../ui/ShareCard";

gsap.registerPlugin(useGSAP);

export function Chyron({ well, live }: { well: Well | null; live: boolean }) {
  const rows = live ? (well?.recent ?? []).slice(0, 12) : [];
  if (!rows.length)
    return (
      <div className="chyron is-empty num" aria-label="Recent barrels">
        <span className="chyron__tag">Breaking</span>
        <span className="chyron__still">No barrel yet. The first buy pumps the first one.</span>
      </div>
    );
  const strip = (hidden: boolean) => (
    <ul className="chyron__run" aria-hidden={hidden || undefined}>
      {rows.map((b) => {
        const who = nameFor(b.buyer, b.nickname, b.x).name || short(b.buyer);
        return (
          <li key={`${hidden}-${b.n}`}>
            <button
              type="button"
              tabIndex={hidden ? -1 : undefined}
              onClick={() => openShare({ n: b.n, amount: b.amount, t: b.t, total: well?.total ?? 5000, who })}
              aria-label={hidden ? undefined : `Barrel #${b.n}, ${gradeOf(b.n)}, pumped by ${who}. Open its share card`}
            >
              <b>
                #{b.n.toLocaleString("en-US")} · {gradeOf(b.n)}
              </b>
              <span>{headlineOf(b.n)}</span>
              <span>
                {who} · {amount(b.amount)} {TICKER}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
  return (
    <div className="chyron num" aria-label="Recent barrels">
      <span className="chyron__tag">Breaking</span>
      <div className="chyron__track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}

export function Briefing({ status, well }: { status: Status | null; well: Well | null }) {
  const root = useRef<HTMLElement>(null);
  const min = amount(status?.rules.minBalance ?? "100000");
  const barrelMin = amount(well?.minTokens ?? "10000");
  const total = (well?.total ?? 5000).toLocaleString("en-US");
  const meet = status?.cycle.steps.find((s) => s.kind === "feeding")?.thresholdETH ?? "0.02";
  const out = status?.tokenAddress ? status.counts.hopped : 0;
  const folders = [
    { n: "01", e: 1, t: "Buy, and a barrel comes up.", b: `Every buy of ${barrelMin}+ ${TICKER} pumps one numbered barrel, with its own headline. ${total} in the well. No refills.` },
    { n: "02", e: 2, t: "Hold, and take a seat.", b: `The ten biggest wallets that never sold sit on the Board. Minimum ${min} ${TICKER}.` },
    { n: "03", e: 0, t: "Full reserve, emergency meeting.", b: `Trading fees fill the Oil Reserve. At ${meet} ETH the Board meets on-chain and the ETH goes to the ten.` },
    { n: "04", e: 3, t: "Sell once, embargoed for good.", b: `No seat, no meeting money, ever.${out ? ` ${out} wallets so far.` : ""} Moving between your own wallets is fine.` },
  ];


  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".memo", { rotate: -8, x: -80, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".memo", start: "top 85%" } });
      gsap.fromTo(".memo__stamp", { scale: 2.6, opacity: 0, rotate: 24 }, { scale: 1, opacity: 1, rotate: -11, duration: 0.35, ease: "power4.in", delay: 0.8, scrollTrigger: { trigger: ".memo", start: "top 80%" } });
      gsap.fromTo(".memo__motto span", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "steps(28)", stagger: 0.8, delay: 0.3, scrollTrigger: { trigger: ".memo", start: "top 75%" } });
      gsap.from(".folder", { y: 70, rotate: (i) => (i % 2 ? 4 : -4), opacity: 0, duration: 0.7, ease: "back.out(1.4)", stagger: 0.12, scrollTrigger: { trigger: ".folders", start: "top 85%" } });
    },
    { scope: root },
  );

  return (
    <section className="place brief" id="rules" ref={root} aria-labelledby="rules-h">
      <div className="wrap">
        <Head kicker="02 · the briefing" id="rules-h" title={<>Four rules. <em>No exceptions.</em></>} lead="On the CEO's desk this morning: one memo to the world and four folders. That is the whole policy." />
        <div className="brief__grid">
          <figure className="memo" aria-label="A memo from the barrel to the world">
            <p className="memo__head num">The Barrel House · Office of the CEO</p>
            <p className="memo__title">Memo</p>
            <dl className="memo__to num">
              <div>
                <dt>To</dt>
                <dd>The world</dd>
              </div>
              <div>
                <dt>From</dt>
                <dd>The Barrel</dd>
              </div>
              <div>
                <dt>Re</dt>
                <dd>You still need oil</dd>
              </div>
            </dl>
            <p className="memo__motto num">
              <span>world leaders argue.</span>
              <span>oil prices move.</span>
              <span>the barrel gets promoted again.</span>
            </p>
            <p className="memo__sig">The Barrel</p>
            <p className="memo__role num">CEO of the world, by popular demand</p>
            <span className="memo__stamp num" aria-hidden="true">
              Declassified
            </span>
          </figure>
          <ol className="folders">
            {folders.map((f) => (
              <li key={f.n} className="folder">
                <span className="folder__tab num">File {f.n}</span>
                <span className="folder__top">
                  <Emblem e={f.e} size={26} />
                  <span className="num">Top secret</span>
                </span>
                <h3>{f.t}</h3>
                <p>{f.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
