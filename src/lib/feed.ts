/**
 * The wire: what just happened, one line each. Read off the changes between two boards (a new
 * Chairman, a new seat taken, a sale), the barrels that were pumped and the rounds the engine reports.
 * Nothing here is stored or sent.
 */
import { useEffect, useRef, useState } from "react";
import { nameFor } from "./alias";
import { amount, short, type Well, type Pond, type RoundRow } from "./api";
import { gradeOf } from "./barrels";
import { TICKER } from "./brand";

export type Tone = "oil" | "gold" | "red" | "ash";
export interface Line {
  id: number;
  at: number;
  tone: Tone;
  who?: string;
  text: string;
}

export interface MeetingDrop {
  eth: number;
  n: number;
}
export const dropMeeting = (d: MeetingDrop) => window.dispatchEvent(new CustomEvent<MeetingDrop>("oil:meeting", { detail: d }));

let next = 1;

export function useFeed(pond: Pond | null, rounds: RoundRow[] | null, well: Well | null, live: boolean) {
  const [lines, setLines] = useState<Line[]>([]);
  const push = (l: Omit<Line, "id" | "at">[]) => l.length && setLines((all) => [...l.map((x) => ({ ...x, id: next++, at: Date.now() })).reverse(), ...all].slice(0, 7));

  const lastPump = useRef<number | null>(null);
  useEffect(() => {
    if (!well) return;
    const fresh = lastPump.current === null ? well.recent.slice(0, 4) : well.recent.filter((b) => b.n > lastPump.current!);
    push(
      fresh
        .slice(0, 6)
        .reverse()
        .map((b) => ({ tone: "oil" as const, who: nameFor(b.buyer, b.nickname, b.x).name, text: `bought ${amount(b.amount)} ${TICKER}. Barrel #${b.n.toLocaleString("en-US")} (${gradeOf(b.n)}) into the reserve.` })),
    );
    lastPump.current = well.recent[0]?.n ?? lastPump.current ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [well]);

  const top = useRef<string[] | null>(null);
  const names = useRef(new Map<string, string>());
  const sold = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!live || !pond) return;
    const rows = pond.rows.slice(0, 10);
    rows.forEach((r) => names.current.set(r.addr.toLowerCase(), nameFor(r.addr, r.nickname, r.x).name));
    const ids = rows.map((r) => r.addr.toLowerCase());
    const out: Omit<Line, "id" | "at">[] = [];
    if (top.current) {
      if (ids[0] && ids[0] !== top.current[0]) out.push({ tone: "gold", who: names.current.get(ids[0]), text: "took the gavel. Chairman now." });
      ids.forEach((id, i) => {
        if (i === 0 || top.current!.includes(id)) return;
        out.push({ tone: "gold", who: names.current.get(id), text: `took a ${i < 5 ? "permanent" : "rotating"} seat on the Board` });
      });
    }
    top.current = ids;
    const gone = [...(pond.sold ?? []), ...(pond.out ?? []).map((o) => o.addr)].map((a) => a.toLowerCase());
    if (sold.current) {
      for (const a of gone)
        if (!sold.current.has(a)) {
          sold.current.add(a);
          out.push({ tone: "red", who: names.current.get(a) ?? short(a), text: "sold. Under embargo, for good." });
        }
    } else sold.current = new Set(gone);
    push(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pond, live]);

  const lastRound = useRef<number | null>(null);
  useEffect(() => {
    if (!rounds?.length) return;
    const done = rounds.filter((r) => r.stage === "done").sort((a, b) => a.n - b.n);
    const say = (r: RoundRow): Omit<Line, "id" | "at"> =>
      r.kind === "feeding"
        ? { tone: "red", text: `Emergency meeting #${r.n} adjourned: ${parseFloat(r.fedETH).toFixed(4)} ETH to ${r.recipients || 10} seats` }
        : { tone: "ash", text: `Session #${r.n}: ${parseFloat(r.spentETH).toFixed(4)} ETH to the strategic reserve` };
    if (lastRound.current !== null) {
      const fresh = done.filter((r) => r.n > lastRound.current!);
      push(fresh.map(say));
      fresh.filter((r) => r.kind === "feeding").forEach((r) => dropMeeting({ eth: parseFloat(r.fedETH), n: r.n }));
    }
    lastRound.current = done.at(-1)?.n ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]);

  return lines;
}
