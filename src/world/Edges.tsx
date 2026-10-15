/**
 * The edges between places. Each sits on top of a section, in that section's ground colour, and rises
 * into the place above it: the refinery over the reserve, embargo tape over the sanctions list,
 * the oil field over the night.
 */
import { fnv } from "../lib/barrels";

const r = (k: number) => (fnv(`edge:${k}`) % 1000) / 1000;
const W = 1440;

/** Tanks, a cracking tower, pipe racks and a flare stack: the reserve's skyline. */
export function RefineryEdge() {
  return (
    <svg className="edge edge--refinery" viewBox={`0 0 ${W} 140`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="128" width={W} height="12" />
        {[60, 250, 980, 1180].map((x, i) => (
          <g key={x}>
            <rect x={x} y={84 - i * 4} width={120 + (i % 2) * 30} height={60 + i * 4} />
            <ellipse cx={x + 60 + (i % 2) * 15} cy={84 - i * 4} rx={60 + (i % 2) * 15} ry="8" />
          </g>
        ))}
        <rect x="470" y="30" width="26" height="110" />
        <rect x="510" y="50" width="20" height="90" />
        <rect x="440" y="96" width="140" height="44" />
        <path d="M600 140 V70 h6 v70 M640 140 V60 h6 v80 M600 90 H700 M600 110 H700" stroke="currentColor" strokeWidth="5" />
        <rect x="760" y="20" width="10" height="120" />
        <rect x="1380" y="60" width="16" height="80" />
      </g>
      <path className="edge__flare" d="M765 20 q-9 -16 0 -32 q9 16 0 32Z" fill="#ffad3b" />
      <path className="edge__flare is-b" d="M1388 60 q-6 -11 0 -22 q6 11 0 22Z" fill="#ffad3b" />
    </svg>
  );
}

/** Two crossed runs of hazard tape. */
export function TapeEdge() {
  const words = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="edge edge--tape" aria-hidden="true">
      <div className="tape is-a">
        {words.map((i) => (
          <span key={i}>Embargo</span>
        ))}
      </div>
      <div className="tape is-b">
        {words.map((i) => (
          <span key={i}>Sanctioned · do not trade</span>
        ))}
      </div>
    </div>
  );
}

/** Pumpjacks and derricks along the horizon, for the night. */
export function FieldEdge() {
  const jacks = Array.from({ length: 9 }, (_, i) => ({ x: 60 + i * 160 + r(i) * 60, s: 0.7 + r(i + 20) * 0.5 }));
  return (
    <svg className="edge edge--field" viewBox={`0 0 ${W} 150`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor" stroke="currentColor">
        <path d={`M0 150 V128 Q360 116 720 126 T${W} 122 V150Z`} stroke="none" />
        {jacks.map((j, i) =>
          i % 3 === 1 ? (
            <path key={i} d={`M${j.x - 26 * j.s} 128 L${j.x} ${128 - 110 * j.s} L${j.x + 26 * j.s} 128 M${j.x - 17 * j.s} ${128 - 40 * j.s} H${j.x + 17 * j.s} M${j.x - 9 * j.s} ${128 - 76 * j.s} H${j.x + 9 * j.s}`} fill="none" strokeWidth="4" />
          ) : (
            <g key={i} transform={`translate(${j.x} 128) scale(${j.s})`}>
              <path d="M-20 0 L0 -44 L20 0" fill="none" strokeWidth="5" />
              <g className="edge__jack" style={{ animationDelay: `${-r(i) * 4}s` }}>
                <path d="M-46 -48 H40" strokeWidth="7" />
                <path d="M-52 -60 q-8 12 0 26 l8 -2 q-5 -11 0 -22Z" stroke="none" />
              </g>
              <rect x="-6" y="-50" width="12" height="10" stroke="none" />
            </g>
          ),
        )}
      </g>
    </svg>
  );
}
