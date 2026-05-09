# makinda-icons

Multi-style icon themes for Visual Studio Code by Makinda Jackson, tuned for the Makinda brand. Covers both file/folder icons and product (UI) icons.

## Status

Phase 1: **Solid** (filled) — shipped as `Makinda Icons (Solid)` and `Makinda Product Icons (Solid)`. 124 starter icons, zero missing. Other upstream styles (Duotone, Twotone, Stroke, Bulk, Sharp Solid, Sharp Stroke) are scaffolded but disabled — see [`docs/project-scope.md`](docs/project-scope.md).

## Repository structure

```
makinda-icons/
├── package.json                       Extension manifest
├── themes/                            Generated theme JSONs (don't hand-edit)
│   ├── makinda-file-icon-theme.<style>.json
│   └── makinda-product-icon-theme.<style>.json
├── icons/
│   └── <style>/                       SVGs copied from the upstream library per style
│       ├── file-icons/
│       │   ├── dark/
│       │   └── light/
│       └── product-icons/
├── scripts/
│   ├── manifest.mjs                   Single source of truth: name → upstream path
│   ├── styles.mjs                     Style registry (which upstream sets to build)
│   └── build.mjs                      Per-style copy + theme JSON emit
└── docs/                              Documentation about VS Code icons & this project
```

## Develop

Prerequisite: an unzipped copy of the upstream icon library. The default source root is:

```
/Users/makindajack/Downloads/Compressed/icons-src/25,000+ SVG icons
```

Override with `ICONS_SRC_ROOT=/path/to/25,000+ SVG icons npm run build`.

```sh
npm run build           # build every enabled style (currently: solid)
npm run build:clean     # wipe icons/ + themes/ and rebuild
npm run build:solid     # build a specific style
node scripts/build.mjs --style=solid --style=duotone   # build several
```

Then in VS Code:

1. Open this folder.
2. Press `F5` to launch the Extension Development Host.
3. `Cmd+Shift+P → Preferences: File Icon Theme → Makinda Icons (Solid)`
4. `Cmd+Shift+P → Preferences: Product Icon Theme → Makinda Product Icons (Solid)`

## Add or change an icon

Edit [scripts/manifest.mjs](scripts/manifest.mjs) and re-run `npm run build`. The manifest is the only place you need to touch — file lists, theme JSONs, and copied SVGs are all derived from it.

## Add a new style variant

1. Flip `enabled: true` (or add a new entry) in [scripts/styles.mjs](scripts/styles.mjs).
2. Add the matching `iconThemes` / `productIconThemes` entries in [package.json](package.json).
3. Run `npm run build:clean`. Patch any per-style filename mismatches via `fileAlias` on the style entry.

## Docs

- [Project scope & workflow](docs/project-scope.md) ← **start here**
- [What are VS Code icons](docs/overview/what-are-vscode-icons.md)
- [How the project works](docs/overview/how-it-works.md)
- [Supported IDEs](docs/overview/supported-ides.md)
- [Roadmap & TODO](docs/overview/roadmap.md)
- [How file icons work](docs/file-icons/how-file-icons-work.md)
- [File icons checklist](docs/file-icons/file-icons-list.md)
- [How product icons work](docs/product-icons/how-product-icons-work.md)
- [Product icons checklist](docs/product-icons/product-icons-list.md)
- [Building an icon theme](docs/theme-development/building-icon-themes.md)

## Companion extension

The matching **color theme** (Makinda Light + Makinda Dark) lives in [makinda-themes](https://github.com/makindajack/makinda-themes). The two are designed to be installed together but ship separately.

## License

See [LICENSE.md](LICENSE.md). Icon assets are derived from the upstream icon library and are not redistributable without your own license to the upstream library.
