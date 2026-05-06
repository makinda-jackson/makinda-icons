// Shared Nerd Font glyph + color table for terminal-oriented emitters.
//
// Used by:
//   • scripts/build-nvim.mjs     (Phase 3 — Neovim / nvim-web-devicons)
//   • scripts/build-emacs.mjs    (Phase 4 — Emacs / nerd-icons.el)
//
// Keys match the canonical icon `name` from scripts/manifest.mjs. Every entry:
//   glyph        : Nerd Font codepoint (hex, no prefix)
//   color        : GUI hex color used in graphical clients
//   cterm_color  : 0-255 ANSI color used in terminal clients
//
// Colors lean on Makinda's brand palette + functional accents. Anything
// missing from this table falls back to the generic "file" entry.
//
// Reference: https://www.nerdfonts.com/cheat-sheet

export const PALETTE = {
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

export const glyphTable = {
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
    // nvim-web-devicons / nerd-icons don't theme directories by default.
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
