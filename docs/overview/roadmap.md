# Roadmap & TODO

Living checklist. Tick items in the same PR that ships them. Stale roadmaps are worse than no roadmap.

> **Single source of truth:** every target reads from [`scripts/manifest.mjs`](../../scripts/manifest.mjs). New editors = new emitters, never new icon copies.

## Build status (locally generated)

| Target            | Emitter                                                                    | Output                                            | Status     |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| **VS Code**       | [`scripts/build.mjs`](../../scripts/build.mjs)                             | `themes/*.json` + 252 SVGs                        | ✅ shipped |
| **JetBrains**     | [`scripts/build-jetbrains.mjs`](../../scripts/build-jetbrains.mjs)         | `.jar` plugin · 110 SVGs · Kotlin provider        | ✅ built   |
| **Neovim**        | [`scripts/build-nvim.mjs`](../../scripts/build-nvim.mjs)                   | `init.lua` + `icons.lua` + `mini.lua` adapter     | ✅ built   |
| **Emacs**         | [`scripts/build-emacs.mjs`](../../scripts/build-emacs.mjs)                 | `packages/emacs/makinda-icons.el`                 | ✅ built   |
| **Sublime Text**  | [`scripts/build-sublime.mjs`](../../scripts/build-sublime.mjs)             | `makinda-icons.sublime-package` · 165 PNGs        | ✅ built   |
| **Visual Studio** | [`scripts/build-vsfull.mjs`](../../scripts/build-vsfull.mjs)               | `makinda-icons.vsix` · 165 PNGs · 55 monikers     | ✅ built   |
| **Visual QA**     | [`scripts/build-contact-sheet.mjs`](../../scripts/build-contact-sheet.mjs) | [`images/contact-sheet.solid.png`](../../images/) | ✅ built   |

Run everything: `npm run build:all`.

---

## Done

- [x] VS Code extension scaffold + build pipeline (`scripts/manifest.mjs` + `scripts/build.mjs`)
- [x] File icon theme JSON → [`themes/makinda-file-icon-theme.solid.json`](../../themes/makinda-file-icon-theme.solid.json)
- [x] Product icon theme JSON → [`themes/makinda-product-icon-theme.solid.json`](../../themes/makinda-product-icon-theme.solid.json)
- [x] `vsce package` smoke test green
- [x] Phase 2 — JetBrains emitter, Gradle plugin, dual-fill `_dark.svg`
- [x] Phase 3 — Neovim emitter (`nvim-web-devicons` overlay + `mini.icons` adapter)
- [x] Phase 4 — Emacs emitter (`nerd-icons.el` overlay, single-file MELPA-ready)
- [x] Phase 5 — Sublime Text emitter (165 PNGs + `.tmPreferences`, auto-zip)
- [x] Phase 6 — Visual Studio emitter (VSIX 2.0, image manifest, monikers)
- [x] Shared Nerd Font glyph table for nvim + emacs ([`scripts/nerd-font-glyphs.mjs`](../../scripts/nerd-font-glyphs.mjs))
- [x] Visual QA contact sheet generator
- [x] CI workflow validating manifest + theme JSON + `vsce package` per PR
- [x] Documentation: `supported-ides.md` cross-links every per-package README
- [x] [Versioning policy](versioning.md) for the multi-package setup

---

## In flight (locally automatable)

These are real todos — they need design or audit work, not external credentials.

- [ ] **Icon polish pass** on the existing 55 manifest entries — alignment, optical sizing, stroke weight
- [ ] **Coverage expansion** — current manifest has 55 named icons / 127 extension bindings. Wishlist in [`docs/file-icons/file-icons-list.md`](../file-icons/file-icons-list.md) targets ~300; pick the next batch (Kotlin, Swift, Dart, Elixir, Haskell, Scala, FSharp, Zig, GraphQL, Prisma, Terraform, Docker variants…)
- [ ] **Codicon coverage audit** against [`docs/product-icons/product-icons-list.md`](../product-icons/product-icons-list.md) — flag missing product-icon overrides
- [ ] **Stretch — custom Nerd Font patch** that bakes Makinda's own SVGs into private-use codepoints (would let Neovim/Emacs render the actual icons, not nearest-glyph approximations)

---

## Blocked on external action

Not work-in-progress — listed for visibility. Each needs accounts, tokens, Windows, or an upstream submission queue.

| Action                                    | Blocker                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Publish to **VS Code Marketplace**        | Azure DevOps PAT for `makindajack` publisher · `vsce publish`                                      |
| Mirror to **Open VSX**                    | open-vsx.org token · `ovsx publish` (unlocks VSCodium / Cursor / Windsurf / Trae / Gitpod / Theia) |
| Tag `v1.0.x` **GitHub release**           | Run `gh release create` locally with `.vsix` attached                                              |
| Publish to **JetBrains Marketplace**      | `PUBLISH_TOKEN` from <https://plugins.jetbrains.com/author/me/tokens>                              |
| Submit to **MELPA**                       | PR against melpa/melpa with a recipe for `makinda-icons.el`                                        |
| Submit to **Package Control** (Sublime)   | PR against wbond/package_control_channel                                                           |
| Publish to **Visual Studio Marketplace**  | Microsoft account + Windows + VS 2022 for sign-off                                                 |
| **Smoke-test VSIX** in Visual Studio 2022 | Windows machine                                                                                    |
| Publish nvim plugin as standalone repo    | Decision: standalone `makindajack/makinda-icons.nvim` repo vs. `packages/nvim` subtree             |

---

## Not planned

These editors don't expose a public icon-theming API:

- **Xcode** — no public extension API for file icons
- **Fleet** — extension model still in flux; revisit when stable
- **Atom** — discontinued

---

## Deferred

- `all-the-icons.el` adapter — `nerd-icons.el` is the active package in 2026; revisit if there's user demand.

---

## How to update this file

When you finish an item, tick the box in the same PR that ships the work. Don't tick boxes for things that aren't done — list them under **Blocked** if they need external action.
