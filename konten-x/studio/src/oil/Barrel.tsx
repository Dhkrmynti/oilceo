/** The CEO, drawn from the same shape list as the site and the share cards. */
import { C, ceoShapes } from "./ceo-shapes";

/** The barrel on its 200 by 250 grid. `closed` swaps the eyes for two flat lines (a blink). */
export const BarrelCEO: React.FC<{ hands?: boolean; look?: number; closed?: boolean }> = ({ hands = true, look = 0, closed = false }) => {
  return (
    <g>
      {ceoShapes(hands, look)
        .filter((s) => !(closed && s.cls === "ceo__eye"))
        .map((s, i) => (
          <path key={i} d={s.d} fill={s.fill ?? "none"} stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" />
        ))}
      {closed ? <path d="M72 87 H88 M112 87 H128" stroke={C.shirt} strokeWidth="3.5" strokeLinecap="round" /> : null}
    </g>
  );
};

/** Blinks for the last 3 frames of every `every` (never on frame 0, so stills keep their eyes open), offset so two barrels on screen don't blink together. */
export const isBlink = (frame: number, every = 75, offset = 0) => (frame + offset) % every >= every - 3;
