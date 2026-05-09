# Project scope — makinda-icons

> Last updated: 2026-05-06

This document defines **what we're building, why, and how we work on it**. It is the contract between past-me and future-me. Read this before adding features, restructuring, or making decisions.

## 1. What this project is

`makinda-icons` is a single VS Code extension that ships **multiple icon themes** by Makinda Jackson.

Each upstream drawing style becomes a separate, user-selectable theme. Each style covers **both** kinds of VS Code iconography:

- a **file icon theme** (Explorer, tabs, file pickers)
- a **product icon theme** (activity bar, status bar, debug controls, etc.)

So a user can, for example, pick _Makinda Icons (Solid)_ for files and _Makinda Product Icons (Solid)_ for UI — or mix styles between the two.

## 2. Why

- One coherent visual language across **the entire VS Code surface** — file icons and product icons sharing one visual family.
- A personal brand artifact for Makinda Jackson's portfolio.
- A practical, license-respecting reuse of an asset library I already own (the upstream icon library).

## 3. Scope

### In scope

- Shipping every upstream style as a theme variant (see §4).
- A build pipeline that converts a single manifest (`scripts/manifest.mjs`) into per-style icon folders and theme JSONs.
- Documentation explaining VS Code's icon model so the theme is easy to maintain (`docs/`).
- Coverage of the most common file/folder types, languages, frameworks, and product (codicon) IDs.

### Out of scope (for now)

- An icon font pipeline. We use per-icon SVGs in both icon themes; we are not generating a `.woff` codicon-replacement font yet.
- Hand-drawn or original artwork. Every icon is sourced from the upstream library.
- Support for editors other than VS Code (Cursor, JetBrains, etc.).
- Localized icon variants.
- 100% codicon coverage on day one — partial product-icon themes are valid; unmapped IDs fall back to the built-in codicon.

### Non-goals

- Beating Material/Seti/VSCode-Icons on file-type coverage breadth. Quality and stylistic consistency over count.
- Animated icons.

## 4. Style variants

The upstream icon library ships these styles (folder layout under `25,000+ SVG icons/`):

| Variant | Style   | Description                              | Phase |
| ------- | ------- | ---------------------------------------- | ----- |
| Rounded | Solid   | Filled, rounded corners — **start here** | 1     |
| Rounded | Duotone | Filled background + stroke overlay       | 2     |
| Rounded | Twotone | Stroke + low-opacity accent strokes      | 3     |
| Rounded | Stroke  | Pure stroke, rounded corners             | 3     |
| Rounded | Bulk    | Stroke + filled accent shapes            | 4     |
| Sharp   | Solid   | Filled, sharp corners                    | 4     |
| Sharp   | Stroke  | Pure stroke, sharp corners               | 4     |

### Phasing rationale

1. **Solid first.** The filled variant is the most legible at 16×16 in the Explorer and gives the strongest visual identity. Ship and iterate on this before duplicating effort across styles.
2. **Duotone next.** Already partially scaffolded; the most distinctive Makinda look.
3. **Twotone + Stroke** together (they share a stroke-based design language).
4. **Bulk + Sharp variants** last (smaller audience).

A style is "shipped" when:

- All manifest entries resolve in that style's source folder.
- A theme JSON is generated and registered in `package.json`.
- A screenshot exists in the marketplace listing.

## 5. Naming

| Where                   | Convention                                                |
| ----------------------- | --------------------------------------------------------- |
| Repo / extension id     | `makindajack.makinda-icons`                               |
| File icon theme id      | `makinda-file-icons-<style>` (e.g. `…-solid`)             |
| Product icon theme id   | `makinda-product-icons-<style>`                           |
| Display label (file)    | `Makinda Icons (Solid)` / `(Duotone)` / …                 |
| Display label (product) | `Makinda Product Icons (Solid)` / …                       |
| Manifest icon name      | kebab-case, no style suffix (`folder-code`, `git-branch`) |
| On-disk SVG path        | `icons/<style>/file-icons/{dark,light}/<name>.svg`        |
| Generated theme JSON    | `themes/makinda-file-icon-theme.<style>.json`             |

## 6. Architecture

```
manifest.mjs ───┐
                ├──► build.mjs ──► icons/<style>/...        (copied SVGs)
styles config ──┘                └► themes/...<style>.json  (generated)

package.json registers one iconTheme + one productIconTheme per built style.
```

- **One manifest, many styles.** `scripts/manifest.mjs` is style-agnostic — it lists upstream paths _relative to a style root_ (e.g. `Files Folders/file-01.svg`). The build script applies that manifest against each enabled style root.
- **Category aliasing.** Sharp variants collapse `Arrows (Round)` and `Arrows (Sharp)` into a single `Arrows` folder. The build resolves these via per-style alias maps.
- **No node deps.** Build runs on plain Node ≥ 18, no `package-lock.json` baggage.
- **Icon assets are committed.** Marketplace consumers shouldn't need to install anything to use the extension; the SVGs are part of the `.vsix`.

## 7. Workflow

### To add or change an icon

1. Edit `scripts/manifest.mjs` (single source of truth).
2. Run `npm run build` — this regenerates **every enabled style**.
3. Press `F5` in VS Code to verify in the Extension Development Host.
4. Commit `scripts/manifest.mjs` + the generated `icons/` and `themes/` files together.

### To add a new style variant

1. Add an entry to the `styles` array in `scripts/build.mjs` (id, label, source root, optional category aliases).
2. Add the corresponding `iconThemes` / `productIconThemes` entries to `package.json`.
3. Run `npm run build:clean`.
4. Update this doc — move the variant from "planned" to "shipped".

### Cadence

- No fixed release schedule. Ship when a style covers the manifest with zero missing icons.
- `CHANGELOG.md` is updated on every published `.vsix`.

## 8. Quality bar

Before publishing a style:

- [ ] Build reports `missing: 0`
- [ ] Manual sweep of the Explorer with a representative project (TS, Markdown, configs, images, folders)
- [ ] Manual sweep of the Activity Bar, Status Bar, Source Control view, Debug toolbar
- [ ] Light + Dark + High Contrast all readable
- [ ] No accidental `fill="white"` reading as transparent in dark mode (Upstream Solid uses `fill` so verify)
- [ ] Marketplace screenshot updated

## 9. Licensing

- Code (manifest, build, theme JSONs): owned by Makinda Jackson — license TBD before v1.
- Icon assets: derived from the upstream icon library under Makinda's personal license. Forks must obtain their own license to the upstream library. See [LICENSE.md](../../LICENSE.md).
- Brand-mark icons (GitHub, Figma, etc.) used under nominative fair use to identify file types.

## 10. Open questions

- Should Solid be the default theme on first activation? (Leaning yes.)
- Do we want a "Makinda Icons (Auto)" entry that picks Stroke for Light themes and Solid for Dark? (Possible via `light` overrides in the theme JSON, but increases maintenance.)
- Is there a need for a CLI to sync the codicon ID list against upstream? (See `docs/product-icons/product-icons-list.md` §"Keeping this list in sync".)

## 11. Definition of done (v0.1.0)

- [x] Repo scaffolded; build pipeline produces zero-missing output.
- [x] Documentation set in `docs/`.
- [ ] Solid (filled) variant ships with full manifest coverage.
- [ ] At least one second style variant in active development.
- [ ] Marketplace listing draft (icon, description, screenshots).
- [ ] Real-world test on Makinda's daily-driver workspace for a week.
