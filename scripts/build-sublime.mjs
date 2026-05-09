// Makinda Icons — Sublime Text emitter
//
// Reads scripts/manifest.mjs and rasterizes the solid SVGs into a
// Sublime Text package layout:
//
//   packages/sublime/Makinda Icons/
//     icons/<name>.png        (16×16 — 1×)
//     icons/<name>@2x.png     (32×32 — 2×)
//     icons/<name>@3x.png     (48×48 — 3×)
//     preferences/<name>.tmPreferences   (scope → icon binding)
//     README.md
//
// Sublime picks the right @-scale at render time. Only icons whose manifest
// `languageIds` map to a known TextMate scope are bound — Sublime's
// .tmPreferences mechanism is scope-driven, not extension-driven.
//
// Run: `npm run build:sublime`
//
// Zip the output into a real .sublime-package with:
//   cd "packages/sublime/Makinda Icons" && zip -rq ../makinda-icons.sublime-package .

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";
import { fileIcons } from "./manifest.mjs";
import { enabledStyles } from "./styles.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const ICONS_SRC_ROOT = process.env.ICONS_SRC_ROOT
    || "/Users/makindajack/Downloads/Compressed/icons-src/25,000+ SVG icons";

const FILL = "#1e2022"; // dark glyph on Sublime's typical light sidebar bg
const SIZES = [
    { suffix: "", px: 16 },
    { suffix: "@2x", px: 32 },
    { suffix: "@3x", px: 48 },
];

// Use the first enabled style (usually `solid`). Override with STYLE=duotone.
const styleId = process.env.STYLE || "solid";
const style = enabledStyles().find((s) => s.id === styleId);
if (!style) {
    console.error(`Unknown or disabled style "${styleId}". Enable it in scripts/styles.mjs first.`);
    process.exit(1);
}

const pkgRoot = path.join(repoRoot, "packages", "sublime", "Makinda Icons");
const iconsOutDir = path.join(pkgRoot, "icons");
const prefsOutDir = path.join(pkgRoot, "preferences");
for (const dir of [iconsOutDir, prefsOutDir]) {
    fs.mkdirSync(dir, { recursive: true });
}

// Wipe so removed manifest entries don't linger.
for (const dir of [iconsOutDir, prefsOutDir]) {
    for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
}

// ---------- Resolve source SVG, identical to build-jetbrains.mjs ----------

function resolveSrc(rel) {
    if (path.isAbsolute(rel)) return rel;
    if (style.srcRoot && !rel.startsWith("../")) {
        return path.join(ICONS_SRC_ROOT, style.srcRoot, rel);
    }
    return path.join(ICONS_SRC_ROOT, rel);
}

function recolor(svg, color) {
    return svg
        .replace(/fill\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`)
        .replace(/stroke\s*=\s*"#[0-9a-fA-F]{3,8}"/g, `stroke="${color}"`);
}

// ---------- Sublime scope table ----------
//
// languageId → TextMate scope. Only icons whose manifest entry references at
// least one of these languageIds can be bound (.tmPreferences works on scope
// selectors, not on extensions). Add entries here when adding new icons.

const scopeByLangId = {
    javascript: "source.js",
    javascriptreact: "source.jsx",
    typescript: "source.ts",
    typescriptreact: "source.tsx",
    json: "source.json",
    jsonc: "source.json",
    html: "text.html.basic",
    css: "source.css",
    scss: "source.scss",
    sass: "source.sass",
    less: "source.css.less",
    stylus: "source.stylus",
    postcss: "source.css.postcss",
    markdown: "text.html.markdown",
    mdx: "text.html.markdown.mdx",
    yaml: "source.yaml",
    toml: "source.toml",
    xml: "text.xml",
    xsl: "text.xml.xsl",
    python: "source.python",
    ruby: "source.ruby",
    go: "source.go",
    rust: "source.rust",
    java: "source.java",
    php: "source.php",
    c: "source.c",
    cpp: "source.c++",
    vue: "source.vue",
    svelte: "source.svelte",
    astro: "source.astro",
    shellscript: "source.shell",
    powershell: "source.powershell",
    bat: "source.dosbatch",
    sql: "source.sql",
    dockerfile: "source.dockerfile",
    makefile: "source.makefile",
    coffeescript: "source.coffee",
    ini: "source.ini",
    properties: "source.ini",
    dotenv: "source.env",
};

// ---------- Rasterize + emit tmPreferences ----------

function tmPreferencesXml(name, scopes) {
    const scopeStr = scopes.join(", ");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>name</key>
    <string>Makinda ${name}</string>
    <key>scope</key>
    <string>${scopeStr}</string>
    <key>settings</key>
    <dict>
        <key>icon</key>
        <string>Packages/Makinda Icons/icons/${name}</string>
    </dict>
    <key>uuid</key>
    <string>${stableUuid("makinda-icons:" + name)}</string>
</dict>
</plist>
`;
}

// Deterministic stable UUID-shaped id from a string. Sublime doesn't enforce
// real UUIDs, but a stable identifier per icon makes diffs clean.
function stableUuid(seed) {
    // FNV-1a 64 → expand to 32 hex chars by hashing seed and seed+"#" separately.
    const fnv = (s) => {
        let h = 0xcbf29ce484222325n;
        const prime = 0x100000001b3n;
        const mask = (1n << 64n) - 1n;
        for (const ch of s) {
            h ^= BigInt(ch.charCodeAt(0));
            h = (h * prime) & mask;
        }
        return h.toString(16).padStart(16, "0");
    };
    const a = fnv(seed);
    const b = fnv(seed + "#");
    return [
        a.slice(0, 8),
        a.slice(8, 12),
        "5" + a.slice(13, 16),
        "9" + b.slice(1, 4),
        b.slice(4, 16),
    ].join("-").toUpperCase();
}

let renderedIcons = 0;
let writtenPrefs = 0;
const missingSvgs = [];
const skippedNoScope = [];

for (const icon of fileIcons) {
    const srcAbs = resolveSrc(icon.src);
    if (!fs.existsSync(srcAbs)) {
        missingSvgs.push(`${icon.name}: ${icon.src}`);
        continue;
    }

    // Rasterize the (recolored) SVG at every Sublime scale.
    const svg = recolor(fs.readFileSync(srcAbs, "utf8"), FILL);
    for (const { suffix, px } of SIZES) {
        const png = new Resvg(svg, {
            fitTo: { mode: "width", value: px },
            background: "rgba(0,0,0,0)",
        }).render().asPng();
        fs.writeFileSync(path.join(iconsOutDir, `${icon.name}${suffix}.png`), png);
    }
    renderedIcons++;

    // Bind to scopes (via languageIds) if we know any.
    const scopes = (icon.languageIds ?? [])
        .map((lid) => scopeByLangId[lid])
        .filter(Boolean);
    if (scopes.length === 0) {
        skippedNoScope.push(icon.name);
        continue;
    }
    fs.writeFileSync(
        path.join(prefsOutDir, `${icon.name}.tmPreferences`),
        tmPreferencesXml(icon.name, [...new Set(scopes)])
    );
    writtenPrefs++;
}

// ---------- Package README ----------

const readme = `# Makinda Icons (Sublime Text package)

Auto-generated by \`scripts/build-sublime.mjs\` — do not edit by hand. Regenerate
with \`npm run build:sublime\` from the monorepo root.

## Install

1. Run \`npm run build:sublime\` to (re)generate this directory **and** the
   \`makinda-icons.sublime-package\` zip alongside it.
2. Drop \`packages/sublime/makinda-icons.sublime-package\` into Sublime's
   \`Installed Packages/\` directory and restart Sublime.

If \`zip\` isn't on PATH the build skips the auto-zip step; produce it manually:

\`\`\`bash
cd "packages/sublime/Makinda Icons" && zip -rq ../makinda-icons.sublime-package .
\`\`\`

## Layout

- \`icons/<name>.png\` / \`<name>@2x.png\` / \`<name>@3x.png\` — 16/32/48 px raster
  variants. Sublime selects the right size for the current display scale.
- \`preferences/<name>.tmPreferences\` — binds a TextMate scope (e.g.
  \`source.js\`) to the icon at \`Packages/Makinda Icons/icons/<name>\`.

## Limitations

- Bindings are scope-driven. Icons whose manifest entry has no
  \`languageIds\` (or whose languageIds aren't in the scope table inside
  \`scripts/build-sublime.mjs\`) get rasterized but **not** bound — extension-only
  icons aren't reachable through Sublime's public icon API.
- Single dark-fill rasterization (Makinda \`fg.default\`). Sublime can't
  auto-swap by color theme without a separate package per palette.
`;

fs.writeFileSync(path.join(pkgRoot, "README.md"), readme);

// ---------- Report ----------

console.log("makinda-icons (sublime) build");
console.log(`  style:               ${style.id}`);
console.log(`  ICONS_SRC_ROOT:      ${ICONS_SRC_ROOT}`);
console.log(`  rasterized icons:    ${renderedIcons} (×3 sizes = ${renderedIcons * 3} PNGs)`);
console.log(`  tmPreferences:       ${writtenPrefs}`);
console.log(`  no scope mapping:    ${skippedNoScope.length}`);
for (const s of skippedNoScope) console.log(`    • ${s}`);
console.log(`  missing SVGs:        ${missingSvgs.length}`);
for (const m of missingSvgs) console.log(`    • ${m}`);

if (missingSvgs.length) process.exit(1);

// ---------- Auto-zip into .sublime-package ----------
//
// .sublime-package is just a regular zip with a renamed extension. Skip when
// `zip` isn't on PATH (common on bare Windows shells) — the README documents
// the manual step in that case.

const zipOut = path.join(repoRoot, "packages", "sublime", "makinda-icons.sublime-package");
try {
    fs.rmSync(zipOut, { force: true });
    execFileSync("zip", ["-rq", zipOut, "."], { cwd: pkgRoot, stdio: "inherit" });
    const bytes = fs.statSync(zipOut).size;
    console.log(`\nWrote: ${path.relative(repoRoot, zipOut)} (${(bytes / 1024).toFixed(1)} KB)`);
} catch (err) {
    console.warn(`\nSkipped auto-zip (${err.code === "ENOENT" ? "`zip` not on PATH" : err.message}).`);
    console.warn(`Manual: cd "packages/sublime/Makinda Icons" && zip -rq ../makinda-icons.sublime-package .`);
}
