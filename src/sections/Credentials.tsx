/**
 * Credentials: look up any wallet and see where it stands. The holder can set a name and a flag, or
 * link X, by signing one plain message. No transaction is ever asked for. Opens as a drawer from
 * anywhere (a flag, a seat, the Connect button) and lives as a section too: the accreditation desk.
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, CaretLeft, CaretRight, MagnifyingGlass, X as Close, XLogo } from "@phosphor-icons/react";
import { DEMO, addrUrl, amount, bylineNonce, claimByline, demoSaveByline, eth, fetchWallet, short, startXLink, txUrl, unlinkX, type WalletInfo } from "../lib/api";
import { nameFor } from "../lib/alias";
import { Countdown, Held } from "../lib/clock";
import { TICKER } from "../lib/brand";
import { PARTS, PART_NAMES, flagOf, gradeOf, type Flag } from "../lib/barrels";
import { connectWallet, hasWallet, signText, useAccount } from "../lib/wallet";
import { Head, XCheck, openBadge } from "../ui/Bits";
import { prefersReducedMotion } from "../lib/motion";
import { FlagMark } from "../ui/Flag";
import { openShare } from "../ui/ShareCard";
import { BarrelCEO } from "../world/Barrel";

const VALID = /^0x[0-9a-fA-F]{40}$/;

const STAMP: Record<WalletInfo["status"], { word: string; tone: string; line: string }> = {
  sitting: { word: "Accredited", tone: "gold", line: "You are an accredited delegate. Hold more to reach a seat at the table." },
  waiting: { word: "In the lobby", tone: "red", line: "Over the minimum. Your first buy is still too fresh; your credentials clear soon." },
  "too-small": { word: "Too small", tone: "red", line: `Under the minimum. Hold more ${TICKER} to be accredited.` },
  hopped: { word: "Embargoed", tone: "ash", line: "This wallet sold. It is under embargo for good." },
  excluded: { word: "Staff", tone: "ash", line: "Engine, curve, treasury or dead address. Never seated, never paid." },
  "not-holding": { word: "No pass", tone: "ash", line: `This wallet holds no ${TICKER}.` },
};

const NO_WALLET = "No wallet in this browser. Open this site inside your wallet app (MetaMask, Rabby, OKX) to connect.";

const SLOTS: [keyof typeof PART_NAMES, string][] = [
  ["ink", "Ink"],
  ["pattern", "Pattern"],
  ["emblem", "Emblem"],
  ["field", "Field"],
];

function Dress({ info, onSaved }: { info: WalletInfo; onSaved: (p: Partial<WalletInfo>) => void }) {
  const account = useAccount();
  const mine = DEMO || (!!account && account.toLowerCase() === info.addr.toLowerCase());
  const [name, setName] = useState(info.nickname || "");
  const [flag, setFlag] = useState<Flag>(flagOf(info.addr, info.pp));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const turn = (i: number, by: number) => {
    const next = [...flag] as Flag;
    next[i] = (next[i] + by + PARTS[i]) % PARTS[i];
    setFlag(next);
  };
  const fail = (e: any, what: string) => setNote({ ok: false, text: e?.code === 4001 ? "You cancelled the signature. Nothing changed." : e?.message || what });

  const connect = async () => {
    setNote(null);
    if (!hasWallet()) return setNote({ ok: false, text: NO_WALLET });
    try {
      const a = await connectWallet();
      if (a.toLowerCase() !== info.addr.toLowerCase()) setNote({ ok: false, text: `These credentials belong to ${short(info.addr)}; your wallet is ${short(a)}.` });
    } catch (e) {
      fail(e, "The wallet didn't connect.");
    }
  };

  const save = async () => {
    setNote(null);
    const clean = name.replace(/\s+/g, " ").trim();
    if (DEMO) {
      if (clean.length < 3 || clean.length > 18 || !/^[A-Za-z0-9 _'-]+$/.test(clean)) return setNote({ ok: false, text: "Names are 3 to 18 letters, numbers, spaces, - ' or _." });
      demoSaveByline(info.addr, { nickname: clean, pp: flag });
      onSaved({ nickname: clean, pp: flag });
      return setNote({ ok: true, text: `Saved as "${clean}". (Demo page: kept on this page only.)` });
    }
    try {
      setBusy(true);
      const { nonce, template } = await bylineNonce(info.addr);
      const signature = await signText(account, template.replace("{nickname}", clean).replace("{mugshot}", flag.join("-")));
      const saved = await claimByline(info.addr, clean, flag, nonce, signature);
      onSaved({ nickname: saved.nickname, pp: saved.pp });
      setNote({ ok: true, text: `Saved. The Board lists you as "${saved.nickname}" now.` });
      window.dispatchEvent(new Event("rbank:refresh"));
    } catch (e) {
      fail(e, "Couldn't save the name.");
    } finally {
      setBusy(false);
    }
  };

  const linkX = async () => {
    setNote(null);
    if (DEMO) return setNote({ ok: false, text: "X sign-in works on the live site only." });
    try {
      setBusy(true);
      const { nonce, linkX: text } = await bylineNonce(info.addr);
      const { url } = await startXLink(info.addr, nonce, await signText(account, text));
      window.location.assign(url);
    } catch (e) {
      fail(e, "Couldn't start X sign-in.");
      setBusy(false);
    }
  };

  const dropX = async () => {
    setNote(null);
    try {
      setBusy(true);
      const { nonce, unlinkX: text } = await bylineNonce(info.addr);
      await unlinkX(info.addr, nonce, await signText(account, text));
      onSaved({ x: null });
      setNote({ ok: true, text: "X unlinked. The Board shows your name and flag again." });
      window.dispatchEvent(new Event("rbank:refresh"));
    } catch (e) {
      fail(e, "Couldn't unlink X.");
    } finally {
      setBusy(false);
    }
  };

  if (info.status === "not-holding" || info.status === "excluded") return null;
  return (
    <div className="dress">
      <p className="dress__k num">Your name and flag at the table · one free signature, no transaction</p>
      {!mine ? (
        <button type="button" className="btn is-ghost-dark" onClick={connect}>
          Connect this wallet to edit
        </button>
      ) : info.x ? (
        <div className="dress__x">
          <p>
            Showing your X account <b>@{info.x.username}</b> <XCheck x={info.x} />.
          </p>
          <button type="button" className="btn is-ghost-dark" onClick={dropX} disabled={busy}>
            Unlink X
          </button>
        </div>
      ) : (
        <>
          <div className="dress__flag">
            <FlagMark flag={flag} size={108} />
            <ul>
              {SLOTS.map(([k, label], i) => (
                <li key={k}>
                  <span className="num">{label}</span>
                  <button type="button" onClick={() => turn(i, -1)} aria-label={`Previous ${label}`}>
                    <CaretLeft weight="bold" />
                  </button>
                  <b>{PART_NAMES[k][flag[i]]}</b>
                  <button type="button" onClick={() => turn(i, 1)} aria-label={`Next ${label}`}>
                    <CaretRight weight="bold" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <label className="field">
            <span className="num">Name, 3 to 18 characters</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={18} placeholder="crudeking" autoComplete="off" />
          </label>
          <div className="dress__acts">
            <button type="button" className="btn is-red" onClick={save} disabled={busy}>
              {busy ? "Waiting for the wallet" : "Sign & save"}
            </button>
            {info.xLogin ? (
              <button type="button" className="btn is-ghost-dark" onClick={linkX} disabled={busy}>
                <XLogo weight="bold" aria-hidden="true" /> Link X instead
              </button>
            ) : null}
          </div>
        </>
      )}
      {note ? <p className={`note ${note.ok ? "is-ok" : "is-bad"}`}>{note.text}</p> : null}
    </div>
  );
}

function Card({ addr }: { addr: string }) {
  const [info, setInfo] = useState<WalletInfo | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    setInfo(null);
    setErr("");
    fetchWallet(addr)
      .then(setInfo)
      .catch((e) => setErr(e.message || "The engine didn't answer."));
  }, [addr]);
  if (err) return <p className="note is-bad">{err}</p>;
  if (!info) return <p className="badge__loading num">Checking the credentials…</p>;
  const n = nameFor(info.addr, info.nickname, info.x);
  const st = STAMP[info.status];
  const seat = info.rank && info.inTop ? (info.rank <= 5 ? "permanent" : "rotating") : "";
  return (
    <div className="badge__card">
      <div className="badge__id">
        {info.x?.avatar ? <img className="xface" src={info.x.avatar} width={64} height={64} alt="" referrerPolicy="no-referrer" /> : <FlagMark flag={flagOf(info.addr, info.pp)} size={72} />}
        <div>
          <p className="badge__name">{n.name}</p>
          <a className="badge__addr num" href={addrUrl(info.addr)} target="_blank" rel="noreferrer">
            {short(info.addr)} <ArrowUpRight weight="bold" aria-hidden="true" />
          </a>
        </div>
        <span className={`stamp is-${st.tone}`}>{info.house ? "The CEO" : seat ? "Board" : st.word}</span>
      </div>
      <p className="badge__line">
        {info.house
          ? "The dev wallet: the barrel itself. It chairs every meeting and is never seated, never paid."
          : seat && info.status === "sitting"
            ? `You hold a ${seat} seat on the Board. Every emergency meeting pays you in ETH.`
            : st.line}
      </p>
      <dl className="badge__facts">
        <div>
          <dt>Holds</dt>
          <dd className="num">
            {amount(info.balance)} {TICKER}
          </dd>
        </div>
        <div>
          <dt>Rank</dt>
          <dd className="num">{info.rank ? `No. ${info.rank}${seat ? ` · ${seat}` : ""}` : "-"}</dd>
        </div>
        <div>
          <dt>Tenure</dt>
          <dd>{info.firstIn && info.status !== "hopped" ? <Held since={info.firstIn} /> : <span className="num">-</span>}</dd>
        </div>
        <div>
          <dt>Next meeting</dt>
          <dd className="num">{info.inTop ? eth(info.estNext) : "-"}</dd>
        </div>
        <div>
          <dt>Paid so far</dt>
          <dd className="num">{eth(info.received)}</dd>
        </div>
        <div>
          <dt>{info.status === "waiting" ? "Cleared in" : info.status === "hopped" ? "Sold" : "Status"}</dt>
          <dd className="num">
            {info.status === "waiting" ? (
              <Countdown to={info.eligibleAt} />
            ) : info.status === "hopped" && info.hoppedTx ? (
              <a href={txUrl(info.hoppedTx)} target="_blank" rel="noreferrer">
                sale tx
              </a>
            ) : (
              st.word
            )}
          </dd>
        </div>
      </dl>
      {info.trees?.length ? (
        <div className="pumps">
          <p className="pumps__k num">
            {(info.treeCount ?? info.trees.length).toLocaleString("en-US")} {(info.treeCount ?? info.trees.length) === 1 ? "barrel" : "barrels"} pumped by this wallet · the latest
          </p>
          <ul>
            {info.trees.slice(0, 4).map((t) => (
              <li key={t.n}>
                <span className="pumps__name">
                  <b>
                    Barrel #{t.n.toLocaleString("en-US")} · {gradeOf(t.n)}
                  </b>
                  <span className="num">
                    {amount(t.amount)} {TICKER}
                  </span>
                </span>
                <button type="button" className="btn is-red is-small" onClick={() => openShare({ n: t.n, amount: t.amount, t: t.t, total: info.forestTotal ?? 5000, who: n.name })}>
                  Share card
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Dress key={info.addr} info={info} onSaved={(p) => setInfo({ ...info, ...p })} />
    </div>
  );
}

function Lookup({ onFind }: { onFind: (a: string) => void }) {
  const [q, setQ] = useState("");
  const [bad, setBad] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const a = q.trim();
    if (!VALID.test(a)) return setBad(true);
    setBad(false);
    onFind(a);
  };
  return (
    <form className="lookup" onSubmit={submit}>
      <label className="sr-only" htmlFor="lookup">
        Wallet address
      </label>
      <input id="lookup" value={q} onChange={(e) => setQ(e.target.value)} placeholder="0x… any wallet" autoComplete="off" spellCheck={false} className="num" aria-invalid={bad} />
      <button type="submit" className="btn is-red" aria-label="Look up">
        <MagnifyingGlass weight="bold" aria-hidden="true" /> Check
      </button>
      {bad ? <p className="note is-bad">That isn't a wallet address.</p> : null}
    </form>
  );
}

/** The drawer, opened from anywhere on the page. */
export function BadgeDrawer() {
  const [addr, setAddr] = useState<string | null>(() => {
    const w = new URLSearchParams(window.location.search).get("w") || "";
    return VALID.test(w) ? w : null;
  });
  useEffect(() => {
    const on = (e: Event) => setAddr((e as CustomEvent<string>).detail ?? "");
    window.addEventListener("oil:badge", on);
    return () => window.removeEventListener("oil:badge", on);
  }, []);
  useEffect(() => {
    if (addr === null) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });
  const close = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("w");
    window.history.replaceState(null, "", url);
    setAddr(null);
  };
  if (addr === null) return null;
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Credentials">
      <button type="button" className="drawer__scrim" onClick={close} aria-label="Close" />
      <div className="drawer__panel">
        <div className="drawer__top">
          <p className="num">Delegate credentials</p>
          <button type="button" className="drawer__x" onClick={close} aria-label="Close">
            <Close weight="bold" />
          </button>
        </div>
        {addr ? <Card addr={addr} /> : <p className="note is-bad">{NO_WALLET}</p>}
        <Lookup onFind={(a) => openBadge(a)} />
      </div>
    </div>
  );
}

/** The accreditation desk: a delegate pass on a lanyard, with a blank to fill. Looking a wallet up opens its record. */
export function CredentialsSection() {
  const root = useRef<HTMLElement>(null);
  const account = useAccount();
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".pass", { y: -160, rotate: -6, opacity: 0, duration: 1.1, ease: "elastic.out(1, 0.6)", scrollTrigger: { trigger: ".pass", start: "top 85%" } });
      gsap.from(".lanyard", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: ".pass", start: "top 85%" } });
    },
    { scope: root },
  );
  return (
    <section className="place creds" id="credentials" ref={root} aria-labelledby="creds-h">
      <div className="wrap creds__wrap">
        <div>
          <Head
            kicker="07 · accreditation"
            id="creds-h"
            title={
              <>
                Are you on <em>the list?</em>
              </>
            }
            lead="Every wallet has credentials. Paste one to see its rank, how long it has held, what it has been paid and what the next emergency meeting would bring it."
          />
          {account ? (
            <button type="button" className="btn is-ghost" onClick={() => openBadge(account)}>
              Open my credentials · {short(account)}
            </button>
          ) : null}
        </div>
        <div className="pass__hang">
          <span className="lanyard" aria-hidden="true" />
          <div className="pass">
            <span className="pass__clip" aria-hidden="true" />
            <p className="pass__k num">Delegate · all access</p>
            <svg className="pass__ceo" viewBox="0 0 200 250" aria-hidden="true">
              <BarrelCEO hands={false} />
            </svg>
            <p className="pass__h">Emergency Session</p>
            <p className="pass__sub num">Valid until your first sale</p>
            <div className="pass__field">
              <span className="num">Wallet</span>
              <Lookup onFind={(a) => openBadge(a)} />
            </div>
            <p className="pass__sig num">Free signature to edit. No transaction, ever.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
