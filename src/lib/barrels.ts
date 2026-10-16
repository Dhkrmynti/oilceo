/**
 * The barrels and the holders' flags. Everything here is worked out from a number or an address
 * alone, so the same barrel always has the same grade and headline, and the same wallet the same flag.
 */

export function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Crude grades. Barrel n is always the same grade. */
export const GRADES = [
  "Brent", "WTI", "Dubai", "Murban", "Urals", "Bonny Light", "Arab Light", "Basrah",
  "Maya", "Tapis", "Minas", "Forties", "Oman", "Es Sider", "Saharan", "Duri",
];

export const gradeOf = (n: number) => GRADES[fnv(`grade:${n}`) % GRADES.length];

/** API gravity, the number oil people quote: 18° heavy to 45° light. */
export const gravityOf = (n: number) => 18 + (fnv(`api:${n}`) % 28);

const WHO = [
  "Two presidents", "A summit in a neutral country", "Seven ministers", "Both sides", "A regional bloc",
  "Three envoys", "The opposition", "A coalition", "Every spokesperson", "An emergency session",
  "Two prime ministers", "The council", "A press secretary", "Twelve delegations", "A former ally", "The G-something",
];
const DID = [
  "walked out", "agreed to disagree", "sent a strongly worded letter", "cancelled the photo op",
  "blamed each other", "talked past midnight", "announced new sanctions", "denied everything",
  "called for calm", "shook hands for 14 seconds", "posted on X at 3 in the morning", "recalled an ambassador",
  "demanded an apology", "left before lunch", "drafted a joint statement nobody signed", "threatened tariffs",
];
const THEN = [
  "Oil up {p}%.", "Oil down {p}%.", "Oil flat. The barrel is unbothered.", "The barrel got promoted again.",
  "Everyone still bought oil.", "Nobody asked the barrel.", "Oil up {p}%. The barrel took the call.", "Tankers kept moving.",
];

/** The world news that came with barrel n. Deadpan, generic, never a real name. */
export function headlineOf(n: number) {
  const h = fnv(`news:${n}`);
  const p = (0.3 + (fnv(`pct:${n}`) % 47) / 10).toFixed(1);
  return `${WHO[h % WHO.length]} ${DID[Math.floor(h / WHO.length) % DID.length]}. ${THEN[Math.floor(h / (WHO.length * DID.length)) % THEN.length].replace("{p}", p)}`;
}

/* ───────── flags: a holder's mark on the Board ───────── */

/** Part counts per slot. Must match MUGSHOT_PARTS in bot/byline.ts: [ink, pattern, emblem, field]. */
export const PARTS = [5, 5, 6, 6] as const;
export type Flag = [ink: number, pattern: number, emblem: number, field: number];

export const PART_NAMES = {
  ink: ["Gold", "Ivory", "Signal", "Teal", "Crude"],
  pattern: ["Plain", "Bands", "Columns", "Cross", "Diagonal"],
  emblem: ["Barrel", "Drop", "Gavel", "Star", "Crown", "Derrick"],
  field: ["Navy", "Crude", "Forest", "Maroon", "Slate", "Sand"],
};

export const INKS = ["#e0b04a", "#f2ead8", "#ff4a2e", "#4fb3a9", "#141210"];
export const FIELDS = ["#16294a", "#2a211a", "#1e4a33", "#5c1f24", "#3d4650", "#c7ad7c"];

export function flagFor(addr: string): Flag {
  const h = fnv(addr.toLowerCase() + ":flag");
  const f: Flag = [h % 5, Math.floor(h / 5) % 5, Math.floor(h / 25) % 6, Math.floor(h / 150) % 6];
  // crude ink on a crude field would vanish: lift the ink
  if (f[0] === 4 && (f[3] === 1 || f[3] === 0)) f[0] = 0;
  return f;
}

export function validFlag(t: unknown): t is Flag {
  return Array.isArray(t) && t.length === 4 && t.every((v, i) => Number.isInteger(v) && v >= 0 && v < PARTS[i]);
}

export const flagOf = (addr: string, pp?: number[] | null): Flag => (validFlag(pp) ? pp : flagFor(addr));
