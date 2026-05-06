// Makinda Icons — Neovim emitter
//
// Reads scripts/manifest.mjs (the single source of truth) and emits a Lua
// plugin that overlays Makinda's file-icon mappings onto
// nvim-web-devicons (https://github.com/nvim-tree/nvim-web-devicons).
//
//   • packages/nvim/lua/makinda-icons/icons.lua   (data: name → { icon, color, name })
//   • packages/nvim/lua/makinda-icons/init.lua    (setup() that calls devicons.set_icon)
//
// Run: `npm run build:nvim`
//
// Terminal Neovim is monochrome from a glyph perspective: each file type is
// represented by a Nerd Font codepoint, not the SVG itself. The codepoint
// table below is the canonical mapping. Colors come from Makinda's palette.
//
// References:
//   • nvim-web-devicons API: https://github.com/nvim-tree/nvim-web-devicons#api
//   • Nerd Fonts cheat sheet: https://www.nerdfonts.com/cheat-sheet

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { fileIcons } from "./manifest.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outRoot = path.join(repoRoot, "packages", "nvim", "lua", "makinda-icons");
fs.mkdirSync(outRoot, { recursive: true });

// ---------- Glyph + color table ----------
//
// Keyed by manifest icon `name`. Each entry:
//   glyph        : Nerd Font codepoint (hex, no prefix)
//   color        : GUI hex color used in graphical Neovim
//   cterm_color  : 0-255 ANSI color used in terminal Neovim
//
// Colors lean on Makinda's brand palette + functional accents. Anything
// missing from this table falls back to the generic "file" entry.

const PALETTE = {
    fg: { color: "#e7e8ea", cterm: "250" },
    muted: { color: "#9aa0a6", cterm: "246" },
    blue: { color: "#5aa6ff", cterm: "75" },
    cyan: { color: "#5fd3d8", cterm: "80" },
    green: { color: "#7bd88f", cterm: "114" },
    yellow: { color: "#f1c75b", cterm: "221" },
    orange: { color: "#f1923c", cterm: "208" },
    red: { color: "#e5484d", cterm: "203" },
    purple: { color: "#b08cff", cterm: "141" },
    pink: { color: "#e478b9", cterm: "175" },
};

function tone(p) {
    return { color: PALETTE[p].color, cterm_color: PALETTE[p].cterm };
}

// name → { glyph, ...tone }
const iconTable = {
    // Generic
    file: { glyph: "f15b", ...tone("fg") },
    folder: { glyph: "f07b", ...tone("yellow") },
    "folder-open": { glyph: "f07c", ...tone("yellow") },

    // Source code
    code: { glyph: "e60c", ...tone("blue") }, // seti-default (TS-ish)
    "code-square": { glyph: "f121", ...tone("blue") },
    "command-line": { glyph: "f120", ...tone("muted") },

    // Languages (Nerd Font dev / seti glyphs)
    js: { glyph: "e60c", ...tone("yellow") },
    ts: { glyph: "e628", ...tone("blue") },
    java: { glyph: "e738", ...tone("orange") },
    php: { glyph: "e608", ...tone("purple") },
    c: { glyph: "e61e", ...tone("blue") },
    cpp: { glyph: "e61d", ...tone("blue") },
    python: { glyph: "e606", ...tone("yellow") },
    ruby: { glyph: "e21e", ...tone("red") },
    go: { glyph: "e627", ...tone("cyan") },
    rust: { glyph: "e7a8", ...tone("orange") },
    vue: { glyph: "e6a0", ...tone("green") },
    svelte: { glyph: "e697", ...tone("orange") },
    astro: { glyph: "e6b3", ...tone("orange") },
    font: { glyph: "f031", ...tone("muted") },
    lock: { glyph: "f023", ...tone("muted") },

    // Web markup / styles
    html: { glyph: "e736", ...tone("orange") },
    css: { glyph: "e749", ...tone("blue") },

    // Data / config
    json: { glyph: "e60b", ...tone("yellow") },
    yaml: { glyph: "e6a8", ...tone("red") },
    xml: { glyph: "e619", ...tone("orange") },
    markdown: { glyph: "e73e", ...tone("fg") },
    license: { glyph: "f24e", ...tone("yellow") },
    config: { glyph: "e615", ...tone("muted") },

    // Documents
    pdf: { glyph: "f1c1", ...tone("red") },
    doc: { glyph: "f1c2", ...tone("blue") },
    ppt: { glyph: "f1c4", ...tone("orange") },
    csv: { glyph: "f1c3", ...tone("green") },
    txt: { glyph: "f0f6", ...tone("fg") },

    // Images & media
    image: { glyph: "f1c5", ...tone("purple") },
    svg: { glyph: "e69d", ...tone("orange") },
    gif: { glyph: "f1c5", ...tone("pink") },
    video: { glyph: "f1c8", ...tone("pink") },
    audio: { glyph: "f1c7", ...tone("cyan") },

    // Archives
    archive: { glyph: "f1c6", ...tone("muted") },

    // Database
    database: { glyph: "f1c0", ...tone("cyan") },

    // Brand-ish
    github: { glyph: "f09b", ...tone("fg") },
    figma: { glyph: "f3a4", ...tone("pink") },

    // Folder variants — included for callers that want them, even though
    // nvim-web-devicons doesn't theme directories by default.
    "folder-shared": { glyph: "f0c0", ...tone("blue") },
    "folder-cloud": { glyph: "f0c2", ...tone("cyan") },
    "folder-locked": { glyph: "f023", ...tone("muted") },
    "folder-zip": { glyph: "f410", ...tone("yellow") },
    "folder-music": { glyph: "f001", ...tone("pink") },
    "folder-video": { glyph: "f03d", ...tone("pink") },
    "folder-audio": { glyph: "f001", ...tone("cyan") },
    "folder-search": { glyph: "f002", ...tone("blue") },
    "folder-favourite": { glyph: "f005", ...tone("yellow") },
    "folder-library": { glyph: "f02d", ...tone("orange") },
    "folder-management": { glyph: "f013", ...tone("muted") },
    "folder-code": { glyph: "f121", ...tone("green") },
};

const FALLBACK = iconTable.file;

// ---------- Build name → entry, ext → name, filename → name ----------

const usedNames = new Set();
const byExt = {};
const byFilename = {};

for (const icon of fileIcons) {
    if (!iconTable[icon.name]) continue; // only emit entries we have a glyph for
    usedNames.add(icon.name);
    for (const ext of icon.extensions ?? []) byExt[ext.toLowerCase()] = icon.name;
    for (const fn of icon.fileNames ?? []) byFilename[fn.toLowerCase()] = icon.name;
}

// Ensure the generic fallback names are always available even if the
// manifest doesn't bind any extension to them.
for (const generic of ["file", "folder", "folder-open"]) {
    if (iconTable[generic]) usedNames.add(generic);
}

// ---------- Lua emitters ----------

function pascal(name) {
    return name
        .split(/[-_]/)
        .map((p) => p[0]?.toUpperCase() + p.slice(1))
        .join("");
}

function luaStr(s) {
    return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}

function luaTableLiteral(map) {
    const keys = Object.keys(map).sort();
    if (keys.length === 0) return "{}";
    const lines = keys.map((k) => {
        // Lua identifier-ish keys (letters, digits, underscores, no leading digit)
        // are emitted bare; everything else uses the [string] form.
        const bareOk = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k);
        const key = bareOk ? k : `[${luaStr(k)}]`;
        return `    ${key} = ${luaStr(map[k])},`;
    });
    return `{\n${lines.join("\n")}\n}`;
}

const sortedNames = [...usedNames].sort();

const iconsLua = `-- AUTO-GENERATED by scripts/build-nvim.mjs — DO NOT EDIT BY HAND.
-- Source of truth: scripts/manifest.mjs

local M = {}

-- name → devicons entry. \`icon\` is a Nerd Font codepoint (utf-8 string).
M.icons = {
${sortedNames
        .map((name) => {
            const e = iconTable[name];
            return `    [${luaStr(name)}] = { icon = "\\u{${e.glyph}}", color = ${luaStr(e.color)}, cterm_color = ${luaStr(e.cterm_color)}, name = ${luaStr(pascal(name))} },`;
        })
        .join("\n")}
}

-- file extension (lowercase, no leading dot) → icon name
M.by_extension = ${luaTableLiteral(byExt)}

-- exact filename (lowercase) → icon name
M.by_filename = ${luaTableLiteral(byFilename)}

return M
`;

const initLua = `-- AUTO-GENERATED by scripts/build-nvim.mjs — DO NOT EDIT BY HAND.
-- Public API for makinda-icons. Overlays Makinda's file-icon mappings onto
-- nvim-web-devicons. Safe to call multiple times.

local M = {}

local data = require("makinda-icons.icons")

local function expand(map)
    local out = {}
    for key, name in pairs(map) do
        local def = data.icons[name]
        if def then out[key] = def end
    end
    return out
end

--- Apply Makinda's file-icon overlay to nvim-web-devicons.
--- Call this once after nvim-web-devicons is loaded (or pass it as
--- a dependency in your plugin manager).
---
--- @param opts table|nil
---   default_icon  boolean  -- override devicons' fallback icon (default: false)
function M.setup(opts)
    opts = opts or {}

    local ok, devicons = pcall(require, "nvim-web-devicons")
    if not ok then
        vim.notify(
            "[makinda-icons] nvim-web-devicons is required but not installed",
            vim.log.levels.WARN
        )
        return
    end

    devicons.set_icon(expand(data.by_extension))

    if devicons.set_icon_by_filename then
        devicons.set_icon_by_filename(expand(data.by_filename))
    end

    if opts.default_icon and data.icons.file and devicons.set_default_icon then
        local f = data.icons.file
        devicons.set_default_icon(f.icon, f.color, f.cterm_color)
    end
end

--- Convenience: get the Makinda definition for a known icon name.
--- @param name string
--- @return table|nil
function M.get(name)
    return data.icons[name]
end

M._data = data
return M
`;

fs.writeFileSync(path.join(outRoot, "icons.lua"), iconsLua);
fs.writeFileSync(path.join(outRoot, "init.lua"), initLua);

// ---------- Report ----------

const skipped = fileIcons
    .filter((i) => !iconTable[i.name])
    .map((i) => i.name);

console.log("makinda-icons (nvim) build");
console.log(`  manifest entries:    ${fileIcons.length}`);
console.log(`  emitted icons:       ${sortedNames.length}`);
console.log(`  ext mappings:        ${Object.keys(byExt).length}`);
console.log(`  filename mappings:   ${Object.keys(byFilename).length}`);
console.log(`  skipped (no glyph):  ${skipped.length}`);
for (const s of skipped) console.log(`    • ${s}`);

console.log(`\nWrote:`);
console.log(`  ${path.relative(repoRoot, path.join(outRoot, "icons.lua"))}`);
console.log(`  ${path.relative(repoRoot, path.join(outRoot, "init.lua"))}`);
console.log(`\nNext: install in Neovim and call require("makinda-icons").setup()`);
