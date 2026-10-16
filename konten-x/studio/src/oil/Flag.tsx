/**
 * A holder's flag: every wallet at the table is a small nation. Four parts (ink, pattern, emblem,
 * field), generated from the address until the holder picks their own. The part counts are fixed
 * by the engine.
 */
import { FIELDS, INKS, flagOf, type Flag } from "./barrels";

const PATTERNS = [
  null,
  <rect key="p" x="0" y="8" width="36" height="8" />,
  <rect key="p" x="12" y="0" width="12" height="24" />,
  <g key="p">
    <rect x="10" y="0" width="6" height="24" />
    <rect x="0" y="9" width="36" height="6" />
  </g>,
  <path key="p" d="M0 24 0 18 28 0 36 0 36 6 8 24Z" />,
];

/** Emblems on a 24 by 24 grid, filled. */
const EMBLEMS = [
  // barrel
  <g key="e">
    <rect x="6.5" y="3" width="11" height="6" rx="2" />
    <rect x="6.5" y="10.2" width="11" height="3.6" />
    <rect x="6.5" y="15" width="11" height="6" rx="2" />
  </g>,
  // drop
  <path key="e" d="M12 3c3 4.2 6 7.4 6 10.9a6 6 0 0 1-12 0C6 10.4 9 7.2 12 3Z" />,
  // gavel
  <g key="e">
    <path d="m9.2 4.6 6.4 6.4-2.9 2.9-6.4-6.4Z" />
    <path d="m12.6 10.6 7.2 7.2-1.8 1.8-7.2-7.2Z" />
    <path d="M4 20.5h9v-2H4Z" />
  </g>,
  // star
  <path key="e" d="m12 3 2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.6 6.4 20l1.5-6.3L3 9.5l6.4-.5Z" />,
  // crown
  <path key="e" d="M4 18h16l1-11-5 4.5L12 5l-4 6.5L3 7Z" />,
  // derrick
  <path key="e" d="M12 2.5 18.5 21M12 2.5 5.5 21M7.6 15h8.8M9.2 10h5.6M4 21h16" fill="none" strokeWidth="2.4" strokeLinecap="round" />,
];

export function FlagMark({ flag, size = 36, className = "", title }: { flag: Flag; size?: number; className?: string; title?: string }) {
  const [ink, pattern, emblem, field] = flag;
  const bg = FIELDS[field];
  const fg = INKS[ink];
  // on a band, a column, a cross or a sash the emblem sits on ink, so it takes the field's colour
  const em = pattern === 0 ? fg : bg;
  return (
    <svg
      className={`flag ${className}`}
      viewBox="0 0 36 24"
      width={size}
      height={(size * 2) / 3}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="36" height="24" fill={bg} />
      <g fill={fg}>{PATTERNS[pattern]}</g>
      <g transform="translate(12.4 6.4) scale(0.47)" fill={em} stroke={em} strokeLinejoin="round">
        {EMBLEMS[emblem]}
      </g>
      <rect width="36" height="24" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
    </svg>
  );
}

/** One emblem on its own, in the current text colour: 0 barrel, 1 drop, 2 gavel, 3 star, 4 crown, 5 derrick. */
export function Emblem({ e, size = 28, className = "" }: { e: number; size?: number; className?: string }) {
  return (
    <svg className={`emblem ${className}`} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="currentColor" strokeLinejoin="round" aria-hidden="true">
      {EMBLEMS[e]}
    </svg>
  );
}

/** A wallet's flag: the one it picked, else the one its address gives. */
export function FlagOf({ addr, pp, size, className }: { addr: string; pp?: number[] | null; size?: number; className?: string }) {
  return <FlagMark flag={flagOf(addr, pp)} size={size} className={className} />;
}
