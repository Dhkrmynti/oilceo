/**
 * The CEO as a list of flat shapes on a 200 by 250 grid, so the page (SVG) and the cards (canvas,
 * in the browser and on the server) draw the very same barrel. No DOM here.
 */

export const C = {
  drum: "#1b1815",
  lid: "#2b2621",
  brass: "#d9a93f",
  suit: "#16294a",
  suitD: "#0e1c35",
  shirt: "#f2ead8",
  tie: "#e0301e",
  skin: "#efe1c4",
};

export interface Shape {
  d: string;
  fill?: string;
  stroke?: string;
  w?: number;
  /** A class for the page to animate (eyes blink, for one). */
  cls?: string;
}

/** An ellipse as a path, so everything is one kind of thing. */
export const ell = (cx: number, cy: number, rx: number, ry = rx) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;

export function ceoShapes(hands = true, look = 0): Shape[] {
  const s: Shape[] = [
    // drum
    { d: "M44 44 Q37 132 44 220 Q100 238 156 220 Q163 132 156 44 Z", fill: C.drum },
    { d: "M54 50 Q48 132 54 214", stroke: "rgba(255,255,255,.09)", w: 9 },
    { d: "M41 60 Q100 74 159 60", stroke: C.brass, w: 5 },
    { d: ell(100, 44, 56, 13), fill: C.lid },
    { d: ell(100, 44, 48, 9), stroke: "rgba(255,255,255,.12)", w: 2 },
    { d: ell(124, 42, 7, 2.6), fill: C.brass },
    // face, deadpan
    { d: ell(80, 86, 8, 6.5), fill: C.shirt, cls: "ceo__eye" },
    { d: ell(120, 86, 8, 6.5), fill: C.shirt, cls: "ceo__eye" },
    { d: ell(82 + look * 3, 87, 3.4), fill: C.drum, cls: "ceo__eye" },
    { d: ell(122 + look * 3, 87, 3.4), fill: C.drum, cls: "ceo__eye" },
    { d: "M71 82 Q80 78 89 82 L89 79 L71 79Z M111 82 Q120 78 129 82 L129 79 L111 79Z", fill: C.drum, cls: "ceo__eye" },
    { d: "M70 75 L90 78 M130 75 L110 78", stroke: C.shirt, w: 3 },
    { d: "M92 104 H108", stroke: C.shirt, w: 3 },
    // suit
    { d: "M42 120 Q38 172 44 220 Q100 238 156 220 Q162 172 158 120 Q128 112 100 128 Q72 112 42 120 Z", fill: C.suit },
    { d: "M86 124 L100 129 L114 124 L100 180 Z", fill: C.shirt },
    { d: "M96 129 H104 L102.5 137 H97.5 Z", fill: C.tie },
    { d: "M97.5 137 H102.5 L107 168 L100 177 L93 168 Z", fill: C.tie },
    { d: "M80 121 L93 160 L84 150 L86 136 Z M120 121 L107 160 L116 150 L114 136 Z", fill: C.suitD },
    { d: "M128 140 l10 -3 l-2 8 Z", fill: C.shirt },
    { d: ell(74, 142, 3), fill: C.brass },
    { d: ell(100, 194, 2.6), fill: C.brass },
    { d: ell(100, 207, 2.6), fill: C.brass },
  ];
  if (hands)
    s.push(
      { d: "M48 132 Q58 176 88 196", stroke: C.suit, w: 17 },
      { d: "M152 132 Q142 176 112 196", stroke: C.suit, w: 17 },
      { d: "M83 191 l6 9 M117 191 l-6 9", stroke: C.shirt, w: 5 },
      { d: "M90 200 Q100 176 110 200 Q100 208 90 200 Z", fill: C.skin },
      { d: "M100 186 V203", stroke: "rgba(0,0,0,.25)", w: 1.4 },
    );
  else
    s.push(
      { d: "M44 132 Q34 168 40 198", stroke: C.suit, w: 16 },
      { d: "M156 132 Q166 168 160 198", stroke: C.suit, w: 16 },
      { d: ell(40, 204, 7), fill: C.skin },
      { d: ell(160, 204, 7), fill: C.skin },
    );
  return s;
}
