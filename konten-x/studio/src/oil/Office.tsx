/**
 * The office from the site's first screen: the barrel in the president's chair, ten flags behind it,
 * the desk with the red phone, the name plate and the siren lamp. 800 by 560, driven by the frame.
 */
import { BarrelCEO, isBlink } from "./Barrel";
import { FlagMark } from "./Flag";
import { flagFor, type Flag } from "./barrels";

/** Ten made-up delegates' flags, the same every render. */
export const BOARD_FLAGS: Flag[] = Array.from({ length: 10 }, (_, i) => flagFor(`0xboard${i * 7919}`));

const POLES = [60, 100, 140, 180, 220, 580, 620, 660, 700, 740];

export const Office: React.FC<{
  frame: number;
  /** 0..1: how red the desk siren glows */
  alarm?: number;
  /** how many of the ten flags are up (0..10) */
  flagsUp?: number;
  /** frames since the phone started ringing, or -1 */
  ring?: number;
  look?: number;
}> = ({ frame, alarm = 0, flagsUp = 10, ring = -1, look = 0 }) => {
  const shake = ring >= 0 && ring < 18 ? Math.sin(ring * 2.2) * 5 : 0;
  return (
    <svg viewBox="0 0 800 560" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {/* window */}
      <rect x="250" y="34" width="300" height="236" fill="#0a1426" />
      <circle cx="488" cy="78" r="16" fill="#efe1c4" opacity="0.85" />
      <path d="M250 270 V222 Q320 210 400 220 T550 214 V270Z" fill="#05090f" />
      <path d="M292 222 L304 160 L316 222 M297 196 H311 M300 178 H308 M430 222 L440 172 L450 222 M434 200 H446" stroke="#05090f" strokeWidth="3" fill="none" />
      <rect x="500" y="176" width="6" height="46" fill="#05090f" />
      <path d={`M503 176 q-7 ${-12 - Math.sin(frame / 3) * 3} 0 ${-24 - Math.sin(frame / 3) * 5} q7 12 0 ${24 + Math.sin(frame / 3) * 5}Z`} fill="#ffad3b" />
      <g stroke="#d9a93f" strokeWidth="6" fill="none">
        <rect x="250" y="34" width="300" height="236" />
        <path d="M400 34 V270 M250 152 H550" strokeWidth="3" />
      </g>
      {/* curtains */}
      <path d="M220 20 H262 Q252 150 268 290 H220Z" fill="#5a1d20" />
      <path d="M580 20 H538 Q548 150 532 290 H580Z" fill="#5a1d20" />
      <path d="M214 14 H586 V30 Q560 42 534 30 Q508 42 482 30 Q456 42 430 30 Q404 42 378 30 Q352 42 326 30 Q300 42 274 30 Q248 42 214 30Z" fill="#6e2427" />
      {/* the Board's flags */}
      {POLES.map((x, i) => {
        const up = Math.max(0, Math.min(1, flagsUp - i));
        const wave = Math.sin(frame / 9 + i) * 4;
        return (
          <g key={i} opacity={0.35 + up * 0.65}>
            <path d={`M${x} 96 V420`} stroke="#b8893a" strokeWidth="3" />
            <circle cx={x} cy="92" r="5" fill="#d9a93f" />
            <g transform={`translate(${x + 1.5} ${100 + (1 - up) * 240}) skewY(${wave})`}>
              <FlagMark flag={BOARD_FLAGS[i]} size={34} />
            </g>
          </g>
        );
      })}
      {/* chair */}
      <rect x="292" y="166" width="216" height="262" rx="54" fill="#4a1b1d" />
      <rect x="306" y="180" width="188" height="234" rx="44" fill="#5a2124" />
      <g fill="rgba(0,0,0,.22)">
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => <circle key={`${r}${k}`} cx={334 + k * 44} cy={206 + r * 42} r="3.5" />))}
      </g>
      <g transform="translate(300 182)">
        <BarrelCEO hands look={look} closed={isBlink(frame)} />
      </g>
      {/* desk */}
      <path d="M40 404 H760 L748 428 H52Z" fill="#6a4429" />
      <rect x="52" y="428" width="696" height="132" fill="#3a2416" />
      <g stroke="rgba(0,0,0,.28)" strokeWidth="2" fill="none">
        <rect x="80" y="446" width="200" height="96" rx="4" />
        <rect x="520" y="446" width="200" height="96" rx="4" />
      </g>
      <g transform="translate(400 502) scale(0.86)">
        <circle r="44" fill="none" stroke="#d9a93f" strokeWidth="3" />
        <path d="M0 -22 c9 12 16 20 16 29 a16 16 0 0 1 -32 0 c0 -9 7 -17 16 -29Z" fill="#d9a93f" />
      </g>
      <g transform={`translate(130 372) rotate(${shake} 32 32)`}>
        <path d="M0 32 H64 L56 10 H8Z" fill="#b8231a" />
        <path d="M-4 8 Q32 -10 68 8 L62 16 Q32 4 2 16Z" fill="#d42a1f" />
        <circle cx="32" cy="22" r="6" fill="#7d150f" />
      </g>
      <g transform="translate(330 434)">
        <rect width="140" height="20" rx="2" fill="#d9a93f" />
        <text x="70" y="14.5" textAnchor="middle" style={{ font: "800 9.5px Archivo", letterSpacing: "0.14em" }} fill="#1b1815">
          THE BARREL · CEO
        </text>
      </g>
      <g transform="translate(540 380)">
        <rect x="6" y="-6" width="78" height="22" fill="#d8ceb6" transform="rotate(-4)" />
        <rect width="80" height="24" fill="#f2ead8" />
        <text x="40" y="16" textAnchor="middle" style={{ font: "600 10px 'JetBrains Mono'", letterSpacing: "0.12em" }} fill="#3b352b">
          MINUTES
        </text>
      </g>
      <g transform="translate(668 364)">
        <circle cx="0" cy="18" r={30 + alarm * 30} fill="rgba(255,74,46,.4)" opacity={alarm} />
        <rect x="-16" y="28" width="32" height="12" rx="2" fill="#2b2621" />
        <path d="M-12 28 V14 a12 12 0 0 1 24 0 V28Z" fill={alarm > 0.3 ? "#ff4a2e" : "#5a1d16"} />
      </g>
    </svg>
  );
};
