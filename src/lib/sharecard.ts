/**
 * The share card in the browser: the same drawing as the engine's link previews (src/card/draw.ts),
 * on a page canvas once the page's fonts are ready. Nothing is sent anywhere.
 */
import { drawBarrelCard, postText, type CardBarrel } from "../card/draw";

export type { CardBarrel };
export { postText };

async function fonts() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load('800 72px "Archivo Variable"'),
    document.fonts.load('italic 400 90px "Instrument Serif"'),
    document.fonts.load('500 18px "JetBrains Mono Variable"'),
  ]).catch(() => {});
}

const make = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

export async function drawCard(barrel: CardBarrel, scale = 2) {
  await fonts();
  return drawBarrelCard(make, (d) => new Path2D(d), barrel, window.location.host, scale) as HTMLCanvasElement;
}
