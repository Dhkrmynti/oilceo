/**
 * The CEO: a small oil barrel in a suit. The shapes live in ceo-shapes.ts so the cards draw the same
 * barrel; this is the page's SVG of it, plus the mark in the bar.
 */
import { C, ceoShapes } from "./ceo-shapes";

/** The barrel, 200 by 250. `hands` steeples the hands in front (sitting at a desk). */
export function BarrelCEO({ hands = true, look = 0, className = "" }: { hands?: boolean; look?: number; className?: string }) {
  return (
    <g className={`ceo ${className}`}>
      {ceoShapes(hands, look).map((s, i) => (
        <path key={i} d={s.d} className={s.cls} fill={s.fill ?? "none"} stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The mark: the barrel's lid and tie in a ring. */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={C.drum} stroke={C.brass} strokeWidth="2" />
      <path d="M9 9 Q8 16 9 24 Q16 26.5 23 24 Q24 16 23 9 Z" fill={C.suit} />
      <ellipse cx="16" cy="9" rx="7" ry="2.2" fill={C.lid} stroke={C.brass} strokeWidth="1" />
      <path d="M13.6 14 L16 15 L18.4 14 L16 22 Z" fill={C.shirt} />
      <path d="M15 15 H17 L17.8 20 L16 22 L14.2 20 Z" fill={C.tie} />
    </svg>
  );
}
