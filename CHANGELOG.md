# Changelog

All notable changes to **Makinda Icons** will be documented in this file.

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
