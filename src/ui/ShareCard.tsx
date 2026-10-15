/**
 * The share card window and the toasts. Anything on the page that shows a pumped barrel can open the
 * card with `openShare`; when the connected wallet's own buy pumps a barrel, the toast offers the
 * card on its own. When an emergency meeting pays out, the siren banner says so.
 */
import { useEffect, useRef, useState } from "react";
import { DownloadSimple, Siren, ShareNetwork, X as Close, XLogo, Drop } from "@phosphor-icons/react";
import { DEMO, demoBarrel, type PondRow, type Well } from "../lib/api";
import { FlagOf } from "./Flag";
import { nameFor } from "../lib/alias";
import { drawCard, postText, type CardBarrel } from "../lib/sharecard";
import { gradeOf } from "../lib/barrels";
import { useAccount } from "../lib/wallet";
import type { MeetingDrop } from "../lib/feed";

export const openShare = (b: CardBarrel) => window.dispatchEvent(new CustomEvent<CardBarrel>("oil:share", { detail: b }));

export function ShareCard() {
  const [barrel, setBarrel] = useState<CardBarrel | null>(null);
  const [url, setUrl] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [note, setNote] = useState("");
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = (e: Event) => setBarrel((e as CustomEvent<CardBarrel>).detail);
    window.addEventListener("oil:share", on);
    return () => window.removeEventListener("oil:share", on);
  }, []);

  useEffect(() => {
    if (!barrel) return;
    let alive = true;
    let made = "";
    setUrl("");
    setBlob(null);
    setNote("");
    drawCard(barrel).then((c) =>
      c.toBlob((b) => {
        if (!alive || !b) return;
        made = URL.createObjectURL(b);
        setBlob(b);
        setUrl(made);
      }, "image/png"),
    );
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBarrel(null);
    window.addEventListener("keydown", esc);
    closeBtn.current?.focus();
    return () => {
      alive = false;
      window.removeEventListener("keydown", esc);
      if (made) URL.revokeObjectURL(made);
    };
  }, [barrel]);

  if (!barrel) return null;
  const file = `oilceo-barrel-${barrel.n}.png`;
  const text = postText(barrel);
  const canShareFile = !!blob && typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([blob], file, { type: "image/png" })] });

  const share = async () => {
    if (!blob) return;
    try {
      await navigator.share({ files: [new File([blob], file, { type: "image/png" })], text });
    } catch {
      /* closed the share sheet */
    }
  };
  const post = () => {
    // the barrel's own page carries the card as its preview, so the post shows the picture by itself
    const link = DEMO ? "" : ` ${window.location.origin}/barrel/${barrel.n}`;
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(text + link)}`, "_blank", "noopener");
    setNote(DEMO ? "This is the demo: save the card and add it to the post yourself." : "The link shows the card on X once the post is up. You can still add the saved picture if you like.");
  };

  return (
    <div className="share" role="dialog" aria-modal="true" aria-label={`Share card for barrel #${barrel.n}`}>
      <button type="button" className="share__scrim" onClick={() => setBarrel(null)} aria-label="Close" />
      <div className="share__panel">
        <div className="share__top">
          <p className="num">
            <Drop weight="fill" aria-hidden="true" /> Share card · barrel #{barrel.n.toLocaleString("en-US")} · {gradeOf(barrel.n)}
          </p>
          <button type="button" ref={closeBtn} className="drawer__x" onClick={() => setBarrel(null)} aria-label="Close">
            <Close weight="bold" />
          </button>
        </div>
        <div className="share__pic">{url ? <img src={url} width={1200} height={630} alt={text} /> : <span className="num">Drawing the card…</span>}</div>
        <div className="share__acts">
          <a className={`btn is-red ${url ? "" : "is-waiting"}`} href={url || undefined} download={file} aria-disabled={!url}>
            <DownloadSimple weight="bold" aria-hidden="true" /> Save the card
          </a>
          {canShareFile ? (
            <button type="button" className="btn is-ghost" onClick={share}>
              <ShareNetwork weight="bold" aria-hidden="true" /> Share
            </button>
          ) : null}
          <button type="button" className="btn is-ghost" onClick={post}>
            <XLogo weight="bold" aria-hidden="true" /> Post on X
          </button>
        </div>
        <p className="share__text">{text}</p>
        {note ? <p className="share__note num">{note}</p> : null}
      </div>
    </div>
  );
}

/** A link to /?barrel=<n> (where /barrel/<n> sends people) opens that barrel's card. */
export function useBarrelFromLink(live: boolean, total: number) {
  useEffect(() => {
    const n = parseInt(new URLSearchParams(window.location.search).get("barrel") || "", 10);
    if (!(n > 0)) return;
    const clean = () => {
      const u = new URL(window.location.href);
      u.searchParams.delete("barrel");
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    };
    if (DEMO) {
      const d = demoBarrel(n);
      openShare({ n, amount: d.amount, t: d.t, total, who: nameFor(d.buyer, d.nickname, d.x).name });
      return clean();
    }
    if (!live) return;
    fetch(`/api/barrel/${n}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.data) openShare({ n, amount: j.data.amount, t: j.data.t, total: j.data.total, who: j.data.who });
      })
      .catch(() => {})
      .finally(clean);
  }, [live, total]);
}

const MARK_LINE: Record<string, string> = {
  "10%": "A tenth of the well is pumped. Nobody slowed down.",
  "25%": "A quarter of the well is gone. Summits were held about it.",
  "50%": "Half the well is pumped. The barrel got promoted.",
  "75%": "Three quarters pumped. Leaders called for calm and kept buying.",
  "90%": "Nine in ten barrels are up. The barrel remains CEO.",
  last100: "A hundred barrels left in the well.",
  gone: "The well is dry. Everyone still needs oil.",
};

/** When the well passes a mark while someone is watching, the page says so. */
export function MarkBanner({ well }: { well: Well | null }) {
  const seen = useRef<Set<string> | null>(null);
  const [mark, setMark] = useState<{ m: string; n: number } | null>(null);
  useEffect(() => {
    if (!well?.marks) return;
    if (!seen.current) {
      seen.current = new Set(well.marks);
      return;
    }
    const fresh = well.marks.filter((m) => !seen.current!.has(m));
    fresh.forEach((m) => seen.current!.add(m));
    if (fresh.length) setMark({ m: fresh[fresh.length - 1], n: well.burned });
  }, [well]);
  useEffect(() => {
    if (!mark) return;
    const t = window.setTimeout(() => setMark(null), 20000);
    return () => clearTimeout(t);
  }, [mark]);
  if (!mark || !well) return null;
  const gone = mark.m === "gone";
  const r = well.recent.find((b) => b.n === mark.n) ?? well.recent[0];
  return (
    <div className={`markbar ${gone ? "is-gone" : ""}`} role="status">
      <span className="markbar__k num">{gone ? "Well dry" : mark.m === "last100" ? "Last 100" : `${mark.m} pumped`}</span>
      <p>{MARK_LINE[mark.m] ?? ""}</p>
      {r ? (
        <button type="button" className="btn is-red is-small" onClick={() => openShare({ n: r.n, amount: r.amount, t: r.t, total: well.total, who: nameFor(r.buyer, r.nickname, r.x).name })}>
          {gone ? "The last barrel's card" : `Barrel #${r.n.toLocaleString("en-US")}'s card`}
        </button>
      ) : null}
      <button type="button" className="toast__x" onClick={() => setMark(null)} aria-label="Dismiss">
        <Close weight="bold" />
      </button>
    </div>
  );
}

/** When the connected wallet's own buy pumps a barrel, say so and offer the card. */
export function PumpToast({ well }: { well: Well | null }) {
  const account = useAccount().toLowerCase();
  const [mine, setMine] = useState<CardBarrel | null>(null);
  const seen = useRef<number | null>(null);
  useEffect(() => {
    if (!well) return;
    const newest = well.recent[0]?.n ?? 0;
    // the first board only sets the mark: nothing pumped before this visit is announced
    if (seen.current === null) {
      seen.current = newest;
      return;
    }
    const fresh = well.recent.filter((b) => b.n > seen.current! && account && b.buyer.toLowerCase() === account);
    seen.current = Math.max(seen.current, newest);
    if (!fresh.length) return;
    const b = fresh[0];
    setMine({ n: b.n, amount: b.amount, t: b.t, total: well.total, who: nameFor(b.buyer, b.nickname, b.x).name });
  }, [well, account]);
  useEffect(() => {
    if (!mine) return;
    const t = window.setTimeout(() => setMine(null), 15000);
    return () => clearTimeout(t);
  }, [mine]);
  if (!mine) return null;
  return (
    <div className="toast" role="status">
      <span className="toast__icon" aria-hidden="true">
        <Drop weight="fill" />
      </span>
      <p>
        <b>Barrel #{mine.n.toLocaleString("en-US")} is up.</b> That was you.
      </p>
      <button
        type="button"
        className="btn is-red is-small"
        onClick={() => {
          openShare(mine);
          setMine(null);
        }}
      >
        Make the card
      </button>
      <button type="button" className="toast__x" onClick={() => setMine(null)} aria-label="Dismiss">
        <Close weight="bold" />
      </button>
    </div>
  );
}

/**
 * An emergency meeting just paid the Board: the whole screen goes to red for a few seconds, the
 * stamp comes down, and the ten flags that were paid line up under it. This is the moment people record.
 */
export function MeetingSiren({ board }: { board: PondRow[] }) {
  const [drop, setDrop] = useState<MeetingDrop | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const on = (e: Event) => setDrop((e as CustomEvent<MeetingDrop>).detail);
    window.addEventListener("oil:meeting", on);
    return () => window.removeEventListener("oil:meeting", on);
  }, []);
  useEffect(() => {
    if (!drop) return;
    closeBtn.current?.focus();
    const t = window.setTimeout(() => setDrop(null), 8000);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrop(null);
    window.addEventListener("keydown", esc);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", esc);
    };
  }, [drop]);
  if (!drop) return null;
  const seats = board.slice(0, 10);
  return (
    <div className="meeting" role="alertdialog" aria-label={`Emergency meeting ${drop.n} adjourned`}>
      <button type="button" className="meeting__scrim" onClick={() => setDrop(null)} aria-label="Close" />
      <div className="meeting__card">
        <p className="meeting__k num">
          <Siren weight="fill" aria-hidden="true" /> Breaking · the Barrel House
        </p>
        <p className="meeting__stamp">
          Emergency meeting <span className="num">#{drop.n}</span>
        </p>
        <p className="meeting__eth num">
          {drop.eth.toFixed(4)} <small>ETH</small>
        </p>
        <p className="meeting__line">paid on-chain to the Board. Meeting adjourned.</p>
        {seats.length ? (
          <ol className="meeting__flags" aria-label="Paid">
            {seats.map((r, i) => (
              <li key={r.addr} style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
                <FlagOf addr={r.addr} pp={r.pp} size={44} />
                <span className="num">{i + 1}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <button type="button" ref={closeBtn} className="btn is-ghost meeting__x" onClick={() => setDrop(null)}>
          Back to the office
        </button>
      </div>
    </div>
  );
}
