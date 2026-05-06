# Roadmap & TODO

Living checklist of what's done, what's next, and which editors we're targeting. Update this file as work lands — don't let it drift.

> **Single source of truth:** every target below reads from [`scripts/manifest.mjs`](../../scripts/manifest.mjs). New editors = new emitters, never new icon copies.

---

## Where we are today

- [x] VS Code extension scaffold (`package.json`, contribution points)
- [x] Build pipeline (`scripts/manifest.mjs` + `scripts/build.mjs`)
- [x] Starter set of **124 icons** copied from Hugeicons Pro
- [x] File icon theme JSON generated → [`themes/makinda-file-icon-theme.solid.json`](../../themes/makinda-file-icon-theme.solid.json)
- [x] Product icon theme JSON generated → [`themes/makinda-product-icon-theme.solid.json`](../../themes/makinda-product-icon-theme.solid.json)
- [x] Documentation set in [`docs/`](../)
- [x] Bumped to **`1.0.1`** and made publishable (removed `private`, added `bugs` / `homepage`)
- [x] `vsce package` smoke test green → `makinda-icons-1.0.1.vsix` (132 files, 137 KB)
- [ ] Polish pass on existing 124 icons (visual QA, alignment, optical sizing)
- [ ] Expand coverage toward ~300 file icons + full codicon override set
- [ ] First public release on the VS Code Marketplace
- [ ] Mirror release to Open VSX

---

## Phase 1 — Ship the VS Code extension (current)

**Goal:** publish `1.0.1` to every registry that serves the VS Code family.

- [ ] Final icon polish across the 124 starter icons
- [ ] Add missing high-frequency file types (audit against [`docs/file-icons/file-icons-list.md`](../file-icons/file-icons-list.md))
- [ ] Audit codicon coverage against [`docs/product-icons/product-icons-list.md`](../product-icons/product-icons-list.md)
- [x] `vsce package` smoke test
- [ ] Publish to **VS Code Marketplace** (`makindajack.makinda-icons`) — `vsce publish` (needs Azure DevOps PAT)
- [ ] Publish to **Open VSX Registry** — `ovsx publish` (needs open-vsx.org token); unlocks VSCodium, Cursor, Windsurf, Trae, Gitpod, Theia, code-server with zero extra code
- [ ] Tag `v1.0.1` GitHub release with attached `.vsix`

Editors covered after Phase 1: **VS Code, VS Code Insiders, VSCodium, Cursor, Windsurf, Trae, GitHub Codespaces, vscode.dev, github.dev, Gitpod, code-server, Theia**.

---

## Phase 2 — JetBrains family

**Why next:** largest non-VS-Code audience by a wide margin. Highest payoff per hour.

**Targets:** IntelliJ IDEA, WebStorm, PyCharm, Rider, GoLand, RubyMine, CLion, PhpStorm, DataGrip, Android Studio.

- [x] Scaffold `packages/jetbrains/` Gradle plugin project (`org.jetbrains.intellij`)
- [x] New emitter `scripts/build-jetbrains.mjs`
  - [x] Copy SVGs into `src/main/resources/icons/makinda/`
  - [x] Generate `MakindaFileIconProvider.kt` from manifest
  - [x] Emit `_dark.svg` variants (auto-picked by IntelliJ in dark themes)
  - [x] Generate `plugin.xml` with `fileIconProvider` extension
- [x] `./gradlew buildPlugin` produces installable `.zip` — [`packages/jetbrains/build/distributions/makinda-icons-jetbrains-1.0.0.zip`](../../packages/jetbrains/build/distributions/) (110 KB, 80 SVGs)
- [ ] Publish to JetBrains Marketplace (needs `PUBLISH_TOKEN` from <https://plugins.jetbrains.com/author/me/tokens>)
- [ ] Move JetBrains from "Not supported" → matrix in [`supported-ides.md`](supported-ides.md) as **experimental**

**Known limitations:**

- Product/UI icon parity is **out of scope** — JetBrains does not expose a public API for UI icons (only individual platform plugins can theme themselves). The plugin ships file icons only.
- `iconMapper` was removed from the plan — `FileIconProvider` covers the full Project view + tabs use case.

---

## Phase 3 — Neovim / Vim

**Why:** small, high-leverage. Lua overlay is a few hundred lines.

- [x] New emitter [`scripts/build-nvim.mjs`](../../scripts/build-nvim.mjs)
- [x] Generate `lua/makinda-icons/init.lua` + `icons.lua` calling `nvim-web-devicons.set_icon` / `set_icon_by_filename` per manifest entry
- [x] Pick closest Nerd Font glyph + Makinda palette color per icon (table maintained in the emitter)
- [x] `npm run build:nvim` produces a drop-in plugin under [`packages/nvim/`](../../packages/nvim/) — 55 icons, 127 ext mappings, 56 filename mappings, zero missing
- [ ] Optional later: `mini.icons` adapter
- [ ] Publish on GitHub as its own repo (or `packages/nvim` subtree); document `lazy.nvim` / `packer` install
- [ ] **Stretch:** custom Nerd Font patch that bakes Makinda's own SVGs into private-use codepoints

**Known limitation:** terminal Neovim is monochrome — icons are Nerd Font glyphs, not the SVGs themselves. Highlight colors still come from the Makinda palette.

---

## Phase 4 — Emacs

- [x] Emitter [`scripts/build-emacs.mjs`](../../scripts/build-emacs.mjs)
- [x] Generate `nerd-icons.el` overlay — single-file package at [`packages/emacs/makinda-icons.el`](../../packages/emacs/makinda-icons.el) (`makinda-icons-setup` pushes 127 ext + 56 filename overlays into `nerd-icons-extension-icon-alist` / `nerd-icons-regexp-icon-alist`)
- [x] Shared glyph table extracted to [`scripts/nerd-font-glyphs.mjs`](../../scripts/nerd-font-glyphs.mjs) so Phase 3 (Neovim) and Phase 4 (Emacs) stay in lock-step
- [ ] Publish via MELPA
- [ ] `all-the-icons.el` adapter (later — `nerd-icons.el` is the active package in 2026)

Same Nerd Font / monochrome caveats as Neovim.

---

## Phase 5 — Sublime Text

**Why later:** Sublime needs **rasterized PNGs** at 1×/2×/3× and only ships file icons (no product-icon API). Slower iteration loop.

- [x] Emitter [`scripts/build-sublime.mjs`](../../scripts/build-sublime.mjs) using [`@resvg/resvg-js`](https://www.npmjs.com/package/@resvg/resvg-js)
- [x] Output 16 / 32 / 48 px PNGs (Sublime's `@2x` / `@3x` convention) — 55 icons × 3 sizes = 165 PNGs per build
- [x] Generate `.tmPreferences` per scope binding — 23 prefs covering the 23 manifest entries with mapped TextMate scopes (extension-only icons can't bind via Sublime's public API)
- [x] Package layout under [`packages/sublime/Makinda Icons/`](../../packages/sublime/) with self-contained README and zip command
- [ ] Auto-zip into `makinda-icons.sublime-package` (currently a documented one-liner)
- [ ] Submit to Package Control

---

## Phase 6 — Visual Studio (Windows full IDE)

**Status:** parked. Doable via VSIX with `.imagemanifest`, but niche audience and high build cost.

- [ ] Decide whether to pursue based on user demand

---

## Not planned

These editors don't expose a public icon-theming API:

- **Xcode** — no public extension API for file icons
- **Fleet** — extension model still in flux; revisit when stable
- **Atom** — discontinued

If any of these change upstream, reopen the question.

---

## Cross-cutting work

Things that benefit every target:

- [ ] Visual QA harness — render every icon to a contact sheet PNG per build
- [ ] CI: run `npm run build:clean` on every PR and fail if `themes/` would change without a manifest edit
- [ ] Automated screenshot generation for the README of each package
- [ ] Versioning policy across the multi-package setup (single repo tag vs. independent versions)

---

## How to update this file

When you finish an item, tick the box in the same PR that ships the work. When a phase is fully done, move its summary into **"Where we are today"** and delete the phase section. Keep the file short and current — stale roadmaps are worse than no roadmap.
