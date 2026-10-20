/**
 * Draws the app icons in public/icons/ from the real logo (components/brand/Logo.tsx).
 * Dev-only; the PNGs are committed, so you don't need to run this.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/make-icons.ts   (needs Playwright + a Chromium)
 */
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { LogoArabic } from "../components/brand/Logo";

const FOREST = "#0f3d2e";
const INK = "#f2f5ec";
const LEAF = "#d7f26a";

/** `pad` = share of the square left empty around the logo (maskable icons need a bigger safe zone). */
function page(size: number, pad: number, rounded: boolean): string {
  const logo = renderToStaticMarkup(createElement(LogoArabic, { width: Math.round(size * (1 - pad * 2)) }));
  return `<!doctype html><html><body style="margin:0;background:transparent">
  <div style="--logo-leaf:${LEAF};--ground:${FOREST};color:${INK};width:${size}px;height:${size}px;background:${FOREST};
    border-radius:${rounded ? size * 0.22 : 0}px;display:flex;align-items:center;justify-content:center">
    <div style="transform:translateY(-${size * 0.03}px)">${logo}</div>
  </div></body></html>`;
}

const ICONS: { file: string; size: number; pad: number; rounded?: boolean }[] = [
  { file: "icon-192.png", size: 192, pad: 0.16 },
  { file: "icon-512.png", size: 512, pad: 0.16 },
  { file: "maskable-512.png", size: 512, pad: 0.24 },
  { file: "apple-touch-icon.png", size: 180, pad: 0.16 },
  { file: "favicon-64.png", size: 64, pad: 0.1, rounded: true },
];

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  for (const icon of ICONS) {
    const p = await browser.newPage({ viewport: { width: icon.size, height: icon.size } });
    await p.setContent(page(icon.size, icon.pad, icon.rounded ?? false));
    const png = await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: icon.size, height: icon.size } });
    writeFileSync(`public/icons/${icon.file}`, png);
    await p.close();
    console.log("wrote", icon.file);
  }
  await browser.close();
}

void main();
