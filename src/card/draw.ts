/**
 * The cards, 1200 by 630: one barrel that was pumped, and the site as a whole (its link preview).
 * Drawn the same in the browser (Save the card) and in the engine (link previews on X and Telegram),
 * so nothing here touches the DOM: the caller hands in a way to make a canvas and a path.
 */
import { C, ceoShapes } from "../world/ceo-shapes";
import { TICKER } from "../lib/brand";
import { gradeOf, gravityOf, headlineOf } from "../lib/barrels";
import { amount } from "../lib/format";

export interface CardBarrel {
  /** The barrel's number: 1 is the first pumped. */
  n: number;
  /** Whole tokens bought, or "" when unknown. */
  amount: string;
  /** Unix seconds of the buy, or 0 when unknown. */
  t: number;
  /** Barrels in the well at launch. */
  total: number;
  /** How the buyer is shown: X handle, name, or short address. "" when unknown. */
  who: string;
}

/** Anything with a 2D context: a browser canvas or the server's. */
export interface Surface {
  width: number;
  height: number;
  getContext(kind: "2d"): unknown;
}
export type Make = (w: number, h: number) => Surface;
/** Turns SVG path data into whatever Path2D the canvas in use understands. */
export type ToPath = (d: string) => unknown;
// the browser's and the server's contexts differ in small ways; both draw what is used here
type Ctx = any;

export const W = 1200;
export const H = 630;
const SANS = '"Archivo Variable", "Archivo", system-ui, sans-serif';
const SERIF = '"Instrument Serif", Georgia, serif';
const MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

const NIGHT = "#0b1220";
const IVORY = "#f2ead8";
const RED = "#ff4a2e";
const GOLD = "#e0b04a";

const isLast = (b: CardBarrel) => b.total > 0 && b.n >= b.total;

function start(make: Make, scale: number) {
  const c = make(W * scale, H * scale);
  const g = c.getContext("2d") as Ctx;
  g.scale(scale, scale);
  g.fillStyle = NIGHT;
  g.fillRect(0, 0, W, H);
  return { c, g };
}

/** The office on the right: lamp glow, the oxblood chair, the barrel, the desk edge. */
function office(g: Ctx, path: ToPath, look = 0) {
  const lamp = g.createRadialGradient(900, 260, 20, 900, 260, 420);
  lamp.addColorStop(0, "rgba(224, 176, 74, 0.28)");
  lamp.addColorStop(1, "rgba(224, 176, 74, 0)");
  g.fillStyle = lamp;
  g.fillRect(480, 0, 720, H);
  // flags behind the chair
  const flags = ["#16294a", "#5c1f24", "#1e4a33", "#c7ad7c", "#3d4650", "#16294a"];
  flags.forEach((f, i) => {
    const x = i < 3 ? 600 + i * 46 : 1060 + (i - 3) * 46;
    g.strokeStyle = "rgba(224, 176, 74, 0.6)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x, 470);
    g.lineTo(x, 120);
    g.stroke();
    g.fillStyle = f;
    g.fillRect(x + 2, 126, 40, 27);
    g.fillStyle = "rgba(242, 234, 216, 0.25)";
    g.fillRect(x + 2, 136, 40, 7);
  });
  // chair
  g.fillStyle = "#4a1b1d";
  roundRect(g, 760, 92, 280, 420, 60);
  g.fill();
  g.fillStyle = "rgba(0, 0, 0, 0.18)";
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    g.beginPath();
    g.arc(810 + k * 60, 150 + r * 62, 4, 0, Math.PI * 2);
    g.fill();
  }
  // the barrel
  g.save();
  g.translate(705, 150);
  g.scale(1.95, 1.95);
  g.lineCap = "round";
  for (const s of ceoShapes(true, look)) {
    const p = path(s.d);
    if (s.fill) {
      g.fillStyle = s.fill;
      g.fill(p);
    }
    if (s.stroke) {
      g.strokeStyle = s.stroke;
      g.lineWidth = s.w ?? 1;
      g.stroke(p);
    }
  }
  g.restore();
  // desk
  g.fillStyle = "#3a2416";
  g.fillRect(560, 540, 640, 90);
  g.fillStyle = "#5a3a22";
  g.fillRect(560, 534, 640, 12);
  // name plate
  g.fillStyle = C.brass;
  roundRect(g, 840, 500, 160, 38, 4);
  g.fill();
  g.fillStyle = "#1b1815";
  g.font = `800 15px ${SANS}`;
  g.textAlign = "center";
  g.fillText("THE BARREL · CEO", 920, 524);
  g.textAlign = "left";
  // fade into the copy side
  const fade = g.createLinearGradient(480, 0, 700, 0);
  fade.addColorStop(0, NIGHT);
  fade.addColorStop(1, "rgba(11, 18, 32, 0)");
  g.fillStyle = fade;
  g.fillRect(480, 0, 220, H);
}

/** Three readings in a box. */
function readings(g: Ctx, x: number, y: number, cells: [string, string, string][]) {
  const bw = 150;
  g.strokeStyle = "rgba(224, 176, 74, 0.3)";
  g.lineWidth = 1;
  roundRect(g, x, y, bw * cells.length, 92, 6);
  g.stroke();
  cells.forEach(([k, v, col], i) => {
    const cx = x + i * bw + 18;
    if (i) {
      g.beginPath();
      g.moveTo(x + i * bw, y + 14);
      g.lineTo(x + i * bw, y + 78);
      g.stroke();
    }
    g.fillStyle = "rgba(242, 234, 216, 0.55)";
    g.font = `500 12px ${MONO}`;
    g.fillText(k, cx, y + 30);
    g.fillStyle = col;
    fitText(g, v, `600 VALUEpx ${MONO}`, 30, bw - 30, cx, y + 70);
  });
}

function footer(g: Ctx, x: number, host: string) {
  g.fillStyle = IVORY;
  g.font = `800 24px ${SANS}`;
  g.fillText(TICKER, x, 576);
  g.fillStyle = "rgba(242, 234, 216, 0.6)";
  g.font = `400 18px ${SANS}`;
  g.fillText("the world's most important barrel", x + g.measureText(TICKER).width + 64, 575);
  if (host) {
    g.fillStyle = "rgba(242, 234, 216, 0.45)";
    g.font = `500 14px ${MONO}`;
    g.fillText(host, x, 608);
  }
}

const pctText = (n: number, total: number) => {
  const p = total > 0 ? (n / total) * 100 : 0;
  return `${p.toFixed(p < 10 ? 2 : 1)}%`;
};

/** One barrel that was pumped. */
export function drawBarrelCard(make: Make, path: ToPath, b: CardBarrel, host: string, scale = 2) {
  const { c, g } = start(make, scale);
  const last = isLast(b);
  office(g, path, b.n % 3 === 0 ? 1 : b.n % 3 === 1 ? -1 : 0);

  const x = 56;
  g.fillStyle = GOLD;
  g.font = `500 15px ${MONO}`;
  const when = b.t ? " · " + new Date(b.t * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase() : "";
  g.fillText(`BARREL #${b.n.toLocaleString("en-US")} · ${gradeOf(b.n).toUpperCase()} · API ${gravityOf(b.n)}°${when}`, x, 78);

  g.fillStyle = IVORY;
  g.font = `800 74px ${SANS}`;
  g.fillText("I pumped", x, 164);
  g.fillStyle = RED;
  fitText(g, last ? "the last barrel." : `barrel #${b.n.toLocaleString("en-US")}.`, `italic 400 VALUEpx ${SERIF}`, 100, 600 - x, x, 252);

  g.fillStyle = "rgba(242, 234, 216, 0.82)";
  g.font = `400 23px ${SANS}`;
  wrap(g, last ? "The well is dry. Everyone still needs oil. The barrel got promoted one last time." : headlineOf(b.n), x, 300, 500, 30, 2);

  readings(g, x, 380, [
    ["IN THE WELL", Math.max(0, b.total - b.n).toLocaleString("en-US"), "#7fd0c4"],
    b.amount ? ["BOUGHT", amount(b.amount), GOLD] : ["BARREL", `#${b.n.toLocaleString("en-US")}`, GOLD],
    ["PUMPED", pctText(b.n, b.total), RED],
  ]);
  if (b.who) {
    g.fillStyle = "rgba(242, 234, 216, 0.55)";
    g.font = `500 13px ${MONO}`;
    g.fillText(`${TICKER} bought by ${b.who}`, x, 500);
  }
  footer(g, x, host);
  return c;
}

/** The site's own link preview. */
export function drawSiteCard(make: Make, path: ToPath, pumped: number, total: number, host: string, scale = 1) {
  const { c, g } = start(make, scale);
  office(g, path);
  const x = 56;
  g.fillStyle = GOLD;
  g.font = `500 15px ${MONO}`;
  g.fillText("LIVE FROM THE BARREL HOUSE", x, 78);
  g.fillStyle = IVORY;
  g.font = `800 64px ${SANS}`;
  if (pumped >= total) {
    g.fillText("The well", x, 164);
    g.fillStyle = RED;
    fitText(g, "is dry.", `italic 400 VALUEpx ${SERIF}`, 100, 420, x, 250);
  } else {
    g.fillText("Leaders argue.", x, 156);
    g.fillText("Oil moves.", x, 226);
    g.fillStyle = RED;
    fitText(g, "The barrel gets promoted.", `italic 400 VALUEpx ${SERIF}`, 64, 560, x, 296);
  }
  readings(g, x, 350, [
    ["PUMPED", pumped.toLocaleString("en-US"), GOLD],
    ["IN THE WELL", Math.max(0, total - pumped).toLocaleString("en-US"), "#7fd0c4"],
    ["BOARD SEATS", "10", RED],
  ]);
  g.fillStyle = "rgba(242, 234, 216, 0.72)";
  g.font = `400 19px ${SANS}`;
  g.fillText("Every trade fills the Oil Reserve. Full reserve: emergency meeting.", x, 488);
  footer(g, x, host);
  return c;
}

/** Shrinks a line until it fits `max` wide; `font` carries VALUE where the size goes. */
function fitText(g: Ctx, text: string, font: string, size: number, max: number, x: number, y: number) {
  let s = size;
  g.font = font.replace("VALUE", String(s));
  while (g.measureText(text).width > max && s > 12) {
    s -= 2;
    g.font = font.replace("VALUE", String(s));
  }
  g.fillText(text, x, y);
}

/** Word-wraps into at most `lines` lines. */
function wrap(g: Ctx, text: string, x: number, y: number, max: number, lh: number, lines: number) {
  const words = text.split(" ");
  let line = "";
  let k = 0;
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (g.measureText(next).width > max && line) {
      g.fillText(line, x, y + k * lh);
      if (++k >= lines) return;
      line = w;
    } else line = next;
  }
  if (line) g.fillText(line, x, y + k * lh);
}

function roundRect(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** The words that go with a barrel's card. */
export function postText(b: CardBarrel) {
  if (isLast(b)) return `I pumped the last barrel. The well is dry, the barrel is still CEO. ${TICKER}`;
  const left = Math.max(0, b.total - b.n).toLocaleString("en-US");
  return `I pumped barrel #${b.n.toLocaleString("en-US")} (${gradeOf(b.n)}). ${headlineOf(b.n)} ${left} barrels left in the well. ${TICKER}`;
}
