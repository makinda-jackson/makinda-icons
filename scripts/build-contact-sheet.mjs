// Makinda Icons — visual QA contact sheet
//
// Composes every file-icon SVG from `icons/<style>/file-icons/dark/` into a
// single grid-shaped SVG, then rasterizes it to PNG. Useful for:
//   • README hero shots
//   • Marketplace screenshots
//   • Catching alignment / optical-size regressions at a glance
//
// Outputs:
//   images/contact-sheet.<style>.svg
//   images/contact-sheet.<style>.png
//
// Run: `npm run build:contact-sheet` (defaults to STYLE=solid)

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { enabledStyles } from "./styles.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const styleId = process.env.STYLE || "solid";
const style = enabledStyles().find((s) => s.id === styleId);
if (!style) {
    console.error(`Unknown or disabled style "${styleId}".`);
    process.exit(1);
}

const iconsDir = path.join(repoRoot, "icons", style.id, "file-icons", "dark");
if (!fs.existsSync(iconsDir)) {
    console.error(`No icons under ${iconsDir}. Run \`npm run build\` first.`);
    process.exit(1);
}

// Layout
const TILE = 88;
const ICON = 48;
const LABEL = 18;
const COLS = 8;
const PAD = 24;
const BG = "#0e0e0f"; // matches galleryBanner color
const FG = "#e7e8ea";
const MUTED = "#9aa0a6";

const files = fs
    .readdirSync(iconsDir)
    .filter((f) => f.endsWith(".svg"))
    .sort();

const rows = Math.ceil(files.length / COLS);
const width = PAD * 2 + COLS * TILE;
const height = PAD * 2 + rows * TILE + 60; // header band

const titleBand = `
    <rect x="0" y="0" width="${width}" height="60" fill="${BG}"/>
    <text x="${PAD}" y="36" font-family="-apple-system, 'Segoe UI', sans-serif" font-size="20" font-weight="600" fill="${FG}">Makinda Icons — ${style.label}</text>
    <text x="${width - PAD}" y="36" text-anchor="end" font-family="-apple-system, 'Segoe UI', sans-serif" font-size="13" fill="${MUTED}">${files.length} icons</text>
`;

let tiles = "";
files.forEach((file, i) => {
    const name = file.replace(/\.svg$/, "");
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * TILE;
    const y = 60 + PAD + row * TILE;

    // Inline the SVG inside a <g> with a viewport. We strip the outer
    // <svg> wrapper and re-mount its children into a 24×24-ish frame.
    const raw = fs.readFileSync(path.join(iconsDir, file), "utf8");
    const inner = extractSvgInner(raw);
    const viewBox = extractViewBox(raw) || "0 0 24 24";

    const iconX = x + (TILE - ICON) / 2;
    const iconY = y;

    tiles += `
        <g transform="translate(${iconX} ${iconY})">
            <svg width="${ICON}" height="${ICON}" viewBox="${viewBox}">${inner}</svg>
        </g>
        <text x="${x + TILE / 2}" y="${y + ICON + LABEL}" text-anchor="middle"
              font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="10" fill="${MUTED}">${escapeXml(name)}</text>`;
});

const composite = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${BG}"/>
    ${titleBand}
    ${tiles}
</svg>
`;

const outDir = path.join(repoRoot, "images");
fs.mkdirSync(outDir, { recursive: true });
const svgOut = path.join(outDir, `contact-sheet.${style.id}.svg`);
const pngOut = path.join(outDir, `contact-sheet.${style.id}.png`);
fs.writeFileSync(svgOut, composite);

// Rasterize at 2× for crisp README screenshots.
const png = new Resvg(composite, {
    fitTo: { mode: "width", value: width * 2 },
    background: BG,
}).render().asPng();
fs.writeFileSync(pngOut, png);

console.log("makinda-icons (contact-sheet) build");
console.log(`  style:   ${style.id}`);
console.log(`  icons:   ${files.length}`);
console.log(`  layout:  ${COLS} cols × ${rows} rows @ ${TILE}px tile`);
console.log(`  wrote:   ${path.relative(repoRoot, svgOut)}`);
console.log(`           ${path.relative(repoRoot, pngOut)} (${(fs.statSync(pngOut).size / 1024).toFixed(1)} KB)`);

// ---------- helpers ----------

function extractSvgInner(svg) {
    const open = svg.match(/<svg[^>]*>/i);
    const close = svg.lastIndexOf("</svg>");
    if (!open || close < 0) return "";
    return svg.slice(open.index + open[0].length, close);
}

function extractViewBox(svg) {
    const m = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
    return m ? m[1] : null;
}

function escapeXml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
