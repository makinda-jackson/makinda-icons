# Changelog

All notable changes to **Makinda Icons** will be documented in this file.

## [Unreleased]

### Added

- **Visual QA contact sheet.** New build script [`scripts/build-contact-sheet.mjs`](scripts/build-contact-sheet.mjs) composes every file icon in the active style into a labeled grid SVG and rasterizes it via `@resvg/resvg-js` to [`images/contact-sheet.solid.png`](images/contact-sheet.solid.png) (142 KB) — usable as the README hero / Marketplace screenshot, and as a regression check between builds.
- **CI workflow.** New [`.github/workflows/build.yml`](.github/workflows/build.yml) validates the manifest + theme JSON and runs `vsce package` on every push and PR to `main`, attaching the resulting `.vsix` as a build artifact.
- **Multi-IDE cross-references.** [`docs/overview/supported-ides.md`](docs/overview/supported-ides.md) now links to each per-package README (JetBrains, Neovim, Emacs, Sublime, Visual Studio) so the multi-target story is discoverable from the main docs.
- **Phase 6 — Visual Studio (Windows IDE) emitter.** New build script [`scripts/build-vsfull.mjs`](scripts/build-vsfull.mjs) emits a VSIX 2.0 package under [`packages/visualstudio/MakindaIcons/`](packages/visualstudio/) targeting Visual Studio 2022 Community / Pro / Enterprise. Generates 165 PNGs (55 icons × 16/24/32 px), a `MakindaIcons.imagemanifest` with 55 monikers / 127 extension bindings / 57 filename bindings, an `extension.vsixmanifest`, and a `[Content_Types].xml`. Auto-zips into `packages/visualstudio/makinda-icons.vsix` (~126 KB) when `zip` is on PATH.
- New npm scripts `build:vsfull` and `build:contact-sheet`; `build:all` now chains VS Code → JetBrains → Neovim → Emacs → Sublime → Visual Studio → contact sheet.

### Changed

- **Phase 5 auto-zip.** `npm run build:sublime` now produces `packages/sublime/makinda-icons.sublime-package` (~157 KB) directly when `zip` is on PATH; the old manual `cd && zip` step is documented as a fallback only.

### Added (earlier in this Unreleased cycle)

- **Phase 5 — Sublime Text emitter.** New build script [`scripts/build-sublime.mjs`](scripts/build-sublime.mjs) rasterizes the Hugeicons solid SVGs (via [`@resvg/resvg-js`](https://www.npmjs.com/package/@resvg/resvg-js)) into a Sublime package layout under [`packages/sublime/Makinda Icons/`](packages/sublime/): 165 PNGs (55 icons × 16/32/48 px) plus 23 `.tmPreferences` bindings for the manifest entries that map to known TextMate scopes. Build with `npm run build:sublime`, then `cd packages/sublime/Makinda\ Icons && zip -rq ../makinda-icons.sublime-package .` to produce the installable bundle.
- New devDependency: `@resvg/resvg-js` (pure-rust SVG rasterizer, no system deps).
- New npm script `build:sublime`; `build:all` now chains VS Code → JetBrains → Neovim → Emacs → Sublime.

- **Phase 4 — Emacs emitter.** New build script [`scripts/build-emacs.mjs`](scripts/build-emacs.mjs) emits a single-file MELPA-ready package at [`packages/emacs/makinda-icons.el`](packages/emacs/makinda-icons.el). `(makinda-icons-setup)` pushes 55 Makinda glyphs / 127 extension overlays / 56 filename overlays onto `nerd-icons-extension-icon-alist` and `nerd-icons-regexp-icon-alist` — picked up automatically by anything that uses `nerd-icons-icon-for-file` (treemacs, dired-sidebar, doom-modeline, etc.). See [`packages/emacs/README.md`](packages/emacs/README.md).
- New npm script `build:emacs`; `build:all` now chains VS Code → JetBrains → Neovim → Emacs.

### Changed

- **Shared glyph table.** Extracted the Nerd Font codepoint + Makinda palette table from `scripts/build-nvim.mjs` into [`scripts/nerd-font-glyphs.mjs`](scripts/nerd-font-glyphs.mjs) so the Neovim and Emacs builds stay in lock-step. No behavioral change in the Neovim output.

- **Phase 3 — Neovim emitter.** New build script [`scripts/build-nvim.mjs`](scripts/build-nvim.mjs) reads the manifest and generates a `nvim-web-devicons` overlay plugin under [`packages/nvim/`](packages/nvim/) (`lua/makinda-icons/init.lua` + `icons.lua`). Maps 55 Makinda file icons to Nerd Font codepoints + Makinda palette colors, covering 127 extensions and 56 exact filenames with zero gaps. Install via `lazy.nvim` / `packer` and call `require("makinda-icons").setup()`. See [`packages/nvim/README.md`](packages/nvim/README.md).
- New npm scripts: `build:nvim` and an updated `build:all` that now chains VS Code → JetBrains → Neovim.

## [1.0.11] — 2026-05-06

### Fixed

- **Marketplace overview logo** — switched the README H1 image from an absolute `raw.githubusercontent.com` URL to a relative `images/icon-dark.png` path so the VS Code Marketplace renders it from the packaged asset (matches the approach used in `makinda-themes`).

## [1.0.10] — 2026-05-06

### Fixed

- **Product icon theme — invalid format.** Earlier 1.0.x releases shipped the product icon theme with `iconDefinitions` pointing at `iconPath` (SVG files). VS Code's product icon theme spec only accepts glyphs from a bundled font (`fontCharacter` + `fontId`), so it rejected the theme with `"Invalid format for product icons theme file: Must contain iconDefinitions and fonts."`
  - Added [`fantasticon`](https://www.npmjs.com/package/fantasticon) to bake the 84 product-icon SVGs into a real WOFF/WOFF2 font with deterministic PUA codepoints (`U+E000`+).
  - Build now emits `themes/fonts/makinda-product-icons-<style>.woff{,2}` and a sidecar JSON map.
  - Theme JSON rewritten to a single `fonts` entry referencing both formats and `iconDefinitions` mapping each codicon ID to a `fontCharacter`.
- **Marketplace overview** — logo and badges now load:
  - Switched the version / installs / rating badges from `img.shields.io/vscode-marketplace/*` (retired by shields.io — was rendering as "RETIRED BADGE") to Microsoft's `vsmarketplacebadges.dev`, which still honours the Makinda colour params.
  - Repushed all `images/` assets to `main` so the absolute logo URL resolves.

## [1.0.9] — 2026-05-06

### Changed

- Reorganized file-icon assets into explicit `dark/` and `light/` subfolders for clarity:
  ```
  icons/<style>/file-icons/
  ├── dark/   # used when a dark color theme is active
  └── light/  # used when a light color theme is active
  ```
  Product icons stay flat under `icons/<style>/product-icons/` because they use `currentColor` and don't need separate variants.

## [1.0.8] — 2026-05-06

### Fixed

- Activating the product icon theme threw "Invalid format for product icons theme file: Must contain iconDefinitions and fonts." VS Code's parser requires a `fonts` key even when icons are defined via SVG `iconPath`. Added an empty `fonts: []` to the generated product-icon theme JSON.

## [1.0.7] — 2026-05-06

### Added

- **Automatic light/dark adaptation for file icons.** Each file icon now ships in two variants — dark (`#e7e8ea` on dark themes) and light (`#1e2022` on light themes) — wired up via the icon-theme JSON's `light` block. VS Code switches between them automatically when you toggle between a light and a dark color theme. No user action required.
- 40 new `*.light.svg` variants generated by the build script.

### Notes

- Product icons already adapt automatically (since 1.0.3) via `fill="currentColor"`. They inherit whatever foreground color the active color theme defines.
- Light/dark fills are taken from the [makinda-themes](https://github.com/makindajack/makinda-themes) palette: `fg.default` for each variant.

## [1.0.6] — 2026-05-06

### Fixed

- README hero logo now resolves on the Marketplace overview (switched from a relative `images/icon-dark.png` path to an absolute `raw.githubusercontent.com` URL).
- Replaced the retired shields.io `visual-studio-marketplace` badges with the current `vscode-marketplace` endpoint so version / installs / rating render correctly.

## [1.0.5] — 2026-05-06

### Changed

- Marketplace tile now uses the dark brand logo (`images/icon-dark.png`) — interim asset until a custom icon-pack logo is designed.
- Wording: "drawn from Hugeicons" → **"inspired by Hugeicons"** across the README, package description, and dev docs.

## [1.0.4] — 2026-05-06

### Added

- Brand identity from [makinda-themes](https://github.com/makindajack/makinda-themes): logo (`images/icon.png`) is now the Marketplace icon, and the README ships a centered logo banner with version / downloads / rating badges in brand orange (`#ff6b0d`).
- `galleryBanner` set to `#0e0e0f` (Makinda Dark editor background) so the Marketplace header matches the brand.

## [1.0.3] — 2026-05-06

### Fixed

- **Product icons now adopt the editor theme color.** Previously every product-icon SVG shipped with a hard-coded `#141B34` fill from Hugeicons, which made them invisible (or near-invisible) on dark themes. The build now rewrites all `fill`/`stroke` colors on product icons to `currentColor`, so VS Code's CSS-driven theming applies correctly. File icons retain their original colors — VS Code never recolors file icons.

## [1.0.2] — 2026-05-06

### Changed

- Rewrote the README as a Marketplace-facing install & activation guide covering every supported VS Code-family editor (VS Code, Insiders, Codespaces, Cursor, Windsurf, Trae, VSCodium, Gitpod, code-server, Theia). The previous developer-facing README was moved to [`docs/README.dev.md`](docs/README.dev.md).

## [1.0.1] — 2026-05-06

First public release.

### Added

- Multi-style icon-theme architecture, with **Solid** as the launch style.
- File icon theme: `Makinda Icons (Solid)` — covers 124 starter file/folder bindings.
- Product icon theme: `Makinda Product Icons (Solid)` — overrides the codicon set used in the Activity Bar, status bar, gutters, and panels.
- Build pipeline: single manifest in [`scripts/manifest.mjs`](scripts/manifest.mjs) → per-style icon folders + theme JSONs via [`scripts/build.mjs`](scripts/build.mjs).
- Documentation set in [`docs/`](docs/) covering project scope, the build pipeline, supported IDEs, and a public roadmap.

### Notes

- Other Hugeicons styles (Duotone, Twotone, Stroke, Bulk, Sharp Solid, Sharp Stroke) are scaffolded but disabled until later phases. See [`docs/project-scope.md`](docs/project-scope.md).
- Companion color theme: [makinda-themes](https://github.com/makindajack/makinda-themes).

## [Unreleased]

- Refactored to multi-style architecture: each Hugeicons style ships as its own theme variant.
- Added [`docs/project-scope.md`](docs/project-scope.md) defining phases, naming, and workflow.
- **Phase 1 active: Solid (filled).** Other styles scaffolded (Duotone, Twotone, Stroke, Bulk, Sharp Solid, Sharp Stroke) but disabled.
- Build script supports `--style=<id>` selection and per-style filename aliasing.
- 124 starter icons, zero missing in Solid.
