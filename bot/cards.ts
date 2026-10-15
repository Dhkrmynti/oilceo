/**
 * Link previews. The engine draws the same cards as the page (src/card/draw.ts) on a server canvas,
 * so a link to the site or to one barrel shows its picture on X, Telegram and Discord.
 *
 *   /api/card/site.png          the reserve as it stands (drawn again at most every 20 seconds)
 *   /api/card/barrel/<n>.png    one barrel's card (a barrel's card never changes, kept for good)
 *   /barrel/<n>                 a page whose preview is that card; people who open it land on the site
 *
 * Display only. A barrel that has not been pumped yet gets no card.
 */
import fs from "fs";
import path from "path";
import { Canvas, GlobalFonts, Path2D } from "@napi-rs/canvas";
import { drawSiteCard, drawBarrelCard, postText, type CardBarrel, type Make, type ToPath } from "../src/card/draw";
import { NAME, TICKER } from "../src/lib/brand";
import { gradeOf } from "../src/lib/barrels";

const fontDir = path.join(process.cwd(), "node_modules");
// static weights: a server canvas reads only one weight out of a variable font
const FONTS: [string, string][] = [
  ...[400, 800].map((w): [string, string] => [`@fontsource/archivo/files/archivo-latin-${w}-normal.woff2`, "Archivo Variable"]),
  ["@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", "Instrument Serif"],
  ...[500, 600, 700].map((w): [string, string] => [`@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff2`, "JetBrains Mono Variable"]),
];
let fontsReady = false;
function loadFonts() {
  if (fontsReady) return;
  fontsReady = true;
  for (const [file, family] of FONTS) {
    const p = path.join(fontDir, file);
    if (!fs.existsSync(p) || !GlobalFonts.registerFromPath(p, family)) console.warn(`card font missing: ${family}`);
  }
}

const make: Make = (w, h) => new Canvas(w, h);
const toPath: ToPath = (d) => new Path2D(d);
const png = (c: unknown) => (c as Canvas).toBuffer("image/png");

const barrelCache = new Map<number, Buffer>();
let siteCache: { key: string; at: number; png: Buffer } | null = null;

export function barrelPng(b: CardBarrel, host: string) {
  const hit = barrelCache.get(b.n);
  if (hit) return hit;
  loadFonts();
  const out = png(drawBarrelCard(make, toPath, b, host, 1));
  barrelCache.set(b.n, out);
  if (barrelCache.size > 300) barrelCache.delete(barrelCache.keys().next().value!);
  return out;
}

/** The site's card. Drawn again at most every 20 seconds while barrels come up, so a busy hour costs little. */
export function sitePng(pumped: number, total: number, host: string) {
  const key = `${pumped}/${total}`;
  if (siteCache && (siteCache.key === key || Date.now() - siteCache.at < 20_000)) return siteCache.png;
  loadFonts();
  siteCache = { key, at: Date.now(), png: png(drawSiteCard(make, toPath, pumped, total, host, 1)) };
  return siteCache.png;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** The page behind /barrel/<n>: a preview for crawlers, and a hop to the site for people. */
export function barrelPage(b: CardBarrel, site: string) {
  const title = b.n >= b.total ? "The last barrel" : `Barrel #${b.n.toLocaleString("en-US")} (${gradeOf(b.n)}) pumped`;
  const desc = postText(b);
  const img = `${site}/api/card/barrel/${b.n}.png`;
  const to = `${site}/?barrel=${b.n}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(title)} · ${esc(TICKER)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(NAME)} · ${esc(TICKER)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(`${site}/barrel/${b.n}`)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(img)}">
<meta http-equiv="refresh" content="0; url=${esc(to)}">
<link rel="canonical" href="${esc(`${site}/barrel/${b.n}`)}">
</head><body style="background:#0b1220;color:#f2ead8;font-family:system-ui;padding:40px">
<p><a style="color:#ff4a2e" href="${esc(to)}">${esc(title)}. Open the Barrel House.</a></p>
</body></html>`;
}
