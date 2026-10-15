/** The well's big moments, shared by the engine and the page. */
export const MARKS = ["10%", "25%", "50%", "75%", "90%", "last100", "gone"] as const;
export type Mark = (typeof MARKS)[number];

/** The marks reached once `burned` of `total` barrels are pumped. */
export function marksAt(burned: number, total: number): Mark[] {
  const out: Mark[] = [];
  for (const p of [10, 25, 50, 75, 90]) if (burned * 100 >= total * p) out.push(`${p}%` as Mark);
  if (total - burned <= 100) out.push("last100");
  if (burned >= total) out.push("gone");
  return out;
}

/** Where the well stands: still pumping, the last hundred, or dry ("gone"). */
export const stageOf = (burned: number, total: number) => (burned >= total ? "gone" : total - burned <= 100 ? "last100" : "burning");
