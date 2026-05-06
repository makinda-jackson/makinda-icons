# How Makinda Icons works

This page explains the end-to-end pipeline: from raw Hugeicons SVGs on disk to a working icon theme inside the editor.

## The big picture

```
Hugeicons Pro (Rounded / Duotone)         scripts/manifest.mjs
        ▼                                            ▼
    raw .svg files  ─────────►  scripts/build.mjs  ─────────►  icons/{file,product}-icons/*.svg
                                       │                                +
                                       ▼                          themes/makinda-*-icon-theme.json
                                generated artifacts

                                       ▼
                              VS Code (or any compatible
                              editor) loads the theme JSON
```

There are three moving parts:

1. **Source icons** — the unzipped Hugeicons Pro download. Nothing here is committed; you bring your own license.
2. **Manifest** — [`scripts/manifest.mjs`](../../scripts/manifest.mjs) is the single source of truth. Every icon the theme exposes is listed here, mapping a Hugeicons name to a Makinda alias plus the file types / codicon IDs it should cover.
3. **Build script** — [`scripts/build.mjs`](../../scripts/build.mjs) reads the manifest, copies the SVGs it needs into [`icons/`](../../icons/), and emits the two theme JSONs in [`themes/`](../../themes/).

## The build pipeline

Run:

```sh
npm run build         # incremental
npm run build:clean   # wipe icons/ first
```

What happens, step by step:

1. The script resolves the Hugeicons root. Default is the path documented in the [README](../../README.md#develop); override with `HUGEICONS_ROOT=/path npm run build`.
2. For each entry in the manifest:
   - Locate the matching SVG in the Hugeicons tree.
   - Copy it into `icons/file-icons/` or `icons/product-icons/` under its Makinda alias.
3. Generate `themes/makinda-file-icon-theme.json`:
   - One `iconDefinitions` entry per file icon SVG.
   - `fileExtensions`, `fileNames`, and `languageIds` maps wiring extensions / filenames / language IDs to those definitions.
   - A `folder` / `folderExpanded` pair plus `rootFolder` variants.
4. Generate `themes/makinda-product-icon-theme.json`:
   - Each entry maps a built-in [codicon ID](https://microsoft.github.io/vscode-codicons/dist/codicon.html) (e.g. `chevron-down`, `gear`, `git-branch`) to a Makinda SVG.
5. Done. The two JSONs in `themes/` are what the extension actually ships.

## How the editor loads it

The extension manifest [`package.json`](../../package.json) declares two contribution points:

```jsonc
"contributes": {
  "iconThemes":         [{ "id": "makinda-file-icons",    "path": "./themes/makinda-file-icon-theme.json"    }],
  "productIconThemes":  [{ "id": "makinda-product-icons", "path": "./themes/makinda-product-icon-theme.json" }]
}
```

When the user picks **Makinda Icons (Dualtone)** from `Preferences: File Icon Theme`, the editor reads the JSON, resolves every `iconPath` relative to it, and renders the SVGs in the Explorer, tabs, breadcrumbs, etc. Product icons follow the same flow via `Preferences: Product Icon Theme`.

For deeper background see:

- [What are VS Code icons](what-are-vscode-icons.md)
- [How file icons work](../file-icons/how-file-icons-work.md)
- [How product icons work](../product-icons/how-product-icons-work.md)
- [Building an icon theme](../theme-development/building-icon-themes.md)

## Adding or changing an icon

You almost never edit the generated files. The workflow is:

1. Open [`scripts/manifest.mjs`](../../scripts/manifest.mjs).
2. Add or edit the entry — Hugeicons name, Makinda alias, and the extensions / filenames / language IDs / codicon IDs it should bind to.
3. Run `npm run build`.
4. Reload the Extension Development Host (`Cmd+R` / `Ctrl+R`) to see the change.

If a file icon doesn't appear, the most common causes are:

- The extension is missing from the manifest entry's extension list.
- The user's file is matched by a more specific rule (filename beats language ID beats extension).
- The SVG didn't copy because the Hugeicons name doesn't exist in the source tree — check the build log.

## Relationship to Makinda Themes

[Makinda Themes](https://github.com/makindajack/makinda-themes) is the sibling **color theme** extension (Makinda Light + Makinda Dark). The two are designed to be installed together but are released as separate extensions:

| Concern                            | Extension                            |
| ---------------------------------- | ------------------------------------ |
| Editor colors, syntax tokens       | `makinda-themes`                     |
| File / folder icons                | `makinda-icons`                      |
| Activity bar, status bar, UI icons | `makinda-icons` (product icon theme) |

You can mix and match — e.g. use Makinda Icons with a different color theme — but the duotone orange palette in this pack is tuned to match `#f05106` (light) and `#ff6b0d` (dark) from Makinda Themes.

## Supported editors

Any editor that implements the VS Code icon-theme contribution points. See [Supported IDEs](supported-ides.md) for the full list.
