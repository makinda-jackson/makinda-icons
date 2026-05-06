# Roadmap & TODO

Living checklist of what's done, what's next, and which editors we're targeting. Update this file as work lands — don't let it drift.

> **Single source of truth:** every target below reads from [`scripts/manifest.mjs`](../../scripts/manifest.mjs). New editors = new emitters, never new icon copies.

## Build status (locally generated)

| Target            | Emitter                                                                    | Output                                            | Status     |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| **VS Code**       | [`scripts/build.mjs`](../../scripts/build.mjs)                             | `themes/*.json` + 252 SVGs                        | ✅ shipped |
| **JetBrains**     | [`scripts/build-jetbrains.mjs`](../../scripts/build-jetbrains.mjs)         | `.jar` plugin · 110 SVGs · Kotlin provider        | ✅ built   |
| **Neovim**        | [`scripts/build-nvim.mjs`](../../scripts/build-nvim.mjs)                   | `packages/nvim/lua/makinda-icons/`                | ✅ built   |
| **Emacs**         | [`scripts/build-emacs.mjs`](../../scripts/build-emacs.mjs)                 | `packages/emacs/makinda-icons.el`                 | ✅ built   |
| **Sublime Text**  | [`scripts/build-sublime.mjs`](../../scripts/build-sublime.mjs)             | `makinda-icons.sublime-package` · 165 PNGs        | ✅ built   |
| **Visual Studio** | [`scripts/build-vsfull.mjs`](../../scripts/build-vsfull.mjs)               | `makinda-icons.vsix` · 165 PNGs · 55 monikers     | ✅ built   |
| **Visual QA**     | [`scripts/build-contact-sheet.mjs`](../../scripts/build-contact-sheet.mjs) | [`images/contact-sheet.solid.png`](../../images/) | ✅ built   |

Run everything: `npm run build:all`.

What's **not** automatable from this repo:

- Marketplace publishes (VS Code, JetBrains, Open VSX, MELPA, Package Control, VS Marketplace) — need account credentials.
- Tagging GitHub releases — needs `gh` auth.
- Visual Studio 2022 smoke test — needs Windows.

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
- [x] Move JetBrains from "Not supported" → cross-linked in [`supported-ides.md`](supported-ides.md) (and Neovim / Emacs / Sublime / Visual Studio along with it)

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
- [x] Auto-zip into `makinda-icons.sublime-package` — `npm run build:sublime` produces the installable bundle when `zip` is on PATH (manual fallback documented)
- [ ] Submit to Package Control

---

## Phase 6 — Visual Studio (Windows full IDE)

**Status:** in progress. Build emits a working VSIX from the same manifest;
publishing requires Windows + Visual Studio for sign-off testing.

- [x] Emitter [`scripts/build-vsfull.mjs`](../../scripts/build-vsfull.mjs) using `@resvg/resvg-js`
- [x] Rasterize 55 icons × 16 / 24 / 32 px (VS Image Service file-icon sizes) → 165 PNGs
- [x] Generate `MakindaIcons.imagemanifest` (55 monikers, 127 extension bindings, 57 filename bindings)
- [x] Generate `extension.vsixmanifest` (VSIX 2.0, targets VS 2022 Community / Pro / Enterprise)
- [x] Generate `[Content_Types].xml` and self-contained README under [`packages/visualstudio/MakindaIcons/`](../../packages/visualstudio/)
- [x] Auto-zip into `packages/visualstudio/makinda-icons.vsix` when `zip` is on PATH
- [ ] Smoke-test installation in Visual Studio 2022 on Windows
- [ ] Publish to the Visual Studio Marketplace

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

- [x] Visual QA harness — [`scripts/build-contact-sheet.mjs`](../../scripts/build-contact-sheet.mjs) renders every icon in the active style to [`images/contact-sheet.<style>.svg`](../../images/) + a 2× PNG. Run via `npm run build:contact-sheet` (or as part of `build:all`).
- [x] CI: [`.github/workflows/build.yml`](../../.github/workflows/build.yml) validates the manifest, theme JSON, and runs `vsce package` on every PR/push to `main`, attaching the resulting `.vsix` as an artifact.
- [x] Automated screenshot generation — the contact sheet doubles as the README / Marketplace screenshot for each style; per-package READMEs link back to it.
- [ ] Versioning policy across the multi-package setup (single repo tag vs. independent versions)

---

## How to update this file

When you finish an item, tick the box in the same PR that ships the work. When a phase is fully done, move its summary into **"Where we are today"** and delete the phase section. Keep the file short and current — stale roadmaps are worse than no roadmap.
