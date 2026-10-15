/** The top bar, the agenda rail and the closing screen. */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Drop, XLogo } from "@phosphor-icons/react";
import { prefersReducedMotion } from "../lib/motion";
import { openShare } from "../ui/ShareCard";
import { nameFor } from "../lib/alias";
import { FieldEdge } from "../world/Edges";
import { BarrelCEO, Mark } from "../world/Barrel";
import { DEMO, X_URL, dexUrl, type Well, type Status } from "../lib/api";
import { CHAIN, NAME, TICKER } from "../lib/brand";
import { BuyButton, CaCopy, ConnectButton, openBadge, useMedia } from "../ui/Bits";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The day's agenda, one item per place. The drop marks where you are. */
const STOPS: [id: string, label: string][] = [
  ["top", "Office"],
  ["rules", "Briefing"],
  ["board", "Summit"],
  ["reserve", "Reserve"],
  ["minutes", "Minutes"],
  ["embargo", "Embargo"],
  ["credentials", "Credentials"],
  ["end", "After hours"],
];

export function Agenda() {
  const [on, setOn] = useState("top");
  useEffect(() => {
    const st = STOPS.map(([id]) => ScrollTrigger.create({ trigger: `#${id}`, start: "top 55%", end: "bottom 55%", onToggle: (x) => x.isActive && setOn(id) }));
    return () => st.forEach((x) => x.kill());
  }, []);
  const at = STOPS.findIndex(([id]) => id === on);
  return (
    <nav className={`agenda ${on === "top" ? "is-away" : ""}`} aria-label="Today's agenda">
      <span className="agenda__line" aria-hidden="true">
        <i style={{ height: `${(at / (STOPS.length - 1)) * 100}%` }} />
      </span>
      <ol>
        {STOPS.map(([id, label], i) => (
          <li key={id} className={i === at ? "is-on" : i < at ? "is-past" : ""}>
            <a href={`#${id}`} aria-current={i === at ? "location" : undefined}>
              <span className="agenda__dot" aria-hidden="true">
                {i === at ? <Drop weight="fill" /> : null}
              </span>
              <span className="agenda__label num">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const LINKS: [string, string][] = [
  ["#rules", "Briefing"],
  ["#board", "The Board"],
  ["#reserve", "Reserve"],
  ["#minutes", "Minutes"],
  ["#embargo", "Embargo"],
  ["#credentials", "My pass"],
];

export function TopBar({ status }: { status: Status | null }) {
  return (
    <header className="bar">
      <a className="bar__brand" href="#top" aria-label={`${NAME}, back to the top`}>
        <Mark />
        <span className="bar__word">{NAME}</span>
      </a>
      <nav className="bar__nav" aria-label="Sections">
        {LINKS.map(([h, l]) => (
          <a key={h} href={h}>
            {l}
          </a>
        ))}
      </nav>
      <div className="bar__acts">
        {X_URL ? (
          <a className="bar__x" href={X_URL} target="_blank" rel="noreferrer noopener" aria-label={`${NAME} on X`}>
            <XLogo weight="bold" aria-hidden="true" />
          </a>
        ) : null}
        <ConnectButton />
        <BuyButton status={status} className="is-small" />
      </div>
    </header>
  );
}

export function Closing({ status, well, ceoAddr }: { status: Status | null; well: Well | null; ceoAddr?: string }) {
  const dry = !!well && well.burned >= well.total;
  const last = well?.last ?? null;
  const root = useRef<HTMLElement>(null);
  const narrow = useMedia("(max-width: 760px)");
  const ca = DEMO ? "" : status?.tokenAddress;
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".night__moon", { y: 120, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: 0.6 } });
      gsap.from(".night__ceo", { x: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".night__window", start: "top 75%" } });
      gsap.from(".end__h", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".end__h", start: "top 88%" } });
    },
    { scope: root },
  );
  return (
    <footer className="place end" id="end" ref={root} aria-label="After hours">
      <FieldEdge />
      <div className="night" aria-hidden="true">
        <span className="night__moon" />
      </div>
      <div className="wrap end__wrap">
        <div className="end__copy">
          <p className="head__k num">08 · after hours</p>
          <p className="end__h">
            Everyone argues.
            <br />
            <em>Everyone needs oil.</em>
          </p>
          <p className="end__sub">
            {dry
              ? `The well is dry${last ? `. The last barrel came up in ${nameFor(last.buyer, last.nickname, last.x).name}'s buy, #${last.n.toLocaleString("en-US")}` : ""}. The Board still sits, and every trade still fills the reserve. The barrel kept the job.`
              : "The office lights stay on. The barrel is the dev wallet: it chairs every meeting, and it is never seated, never ranked, never paid. Buy and a barrel comes up. Hold and a seat is yours. Sell and you are under embargo."}
          </p>
          {dry && last ? (
            <button type="button" className="btn is-red" onClick={() => openShare({ n: last.n, amount: last.amount, t: last.t, total: well!.total, who: nameFor(last.buyer, last.nickname, last.x).name })}>
              The last barrel's card
            </button>
          ) : null}
          <div className="end__acts">
            <BuyButton status={status} />
            <CaCopy status={status} compact={narrow} />
          </div>
          {ceoAddr ? (
            <button type="button" className="end__ceo num" onClick={() => openBadge(ceoAddr)}>
              The barrel · dev wallet · open its credentials
            </button>
          ) : null}
        </div>
        <div className="night__window">
          <svg viewBox="0 0 300 340" aria-hidden="true">
            <rect x="10" y="10" width="280" height="320" fill="#0a1426" stroke="#d9a93f" strokeWidth="6" />
            <path d="M150 10 V330 M10 170 H290" stroke="#d9a93f" strokeWidth="3" />
            <path d="M10 286 Q90 270 150 280 T290 274 V330 H10Z" fill="#05090f" />
            <path d="M206 276 L216 226 L226 276 M210 256 H222" stroke="#05090f" strokeWidth="3" fill="none" />
            <g className="night__ceo" transform="translate(48 100) scale(0.96)">
              <BarrelCEO hands={false} look={1} />
            </g>
          </svg>
        </div>
      </div>
      <div className="wrap">
        <nav className="end__links num" aria-label="Elsewhere">
          {X_URL ? (
            <a href={X_URL} target="_blank" rel="noreferrer">
              <XLogo weight="bold" aria-hidden="true" /> {NAME} on X
            </a>
          ) : null}
          {ca ? (
            <a href={dexUrl(ca)} target="_blank" rel="noreferrer">
              Chart <ArrowUpRight weight="bold" aria-hidden="true" />
            </a>
          ) : null}
          <a href="/terms.html">Terms</a>
          <a href="/privacy.html">Privacy</a>
        </nav>
        <p className="end__fine">
          {NAME} · {TICKER} · {CHAIN}. This is satire about oil and the people who argue over it. No real person, country or company is part of it, and the headlines are made up. A memecoin with
          no promise of value; meeting payouts depend on trading fees and can stop.
        </p>
      </div>
    </footer>
  );
}
