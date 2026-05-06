# Changelog

All notable changes to **Makinda Icons** will be documented in this file.

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
