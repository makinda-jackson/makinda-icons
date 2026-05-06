# How file icons work

A **File Icon Theme** is a JSON file that tells VS Code which image to draw for every file and folder.

## The theme JSON

A minimal example:

```jsonc
{
  "iconDefinitions": {
    "_file": { "iconPath": "./icons/file.svg" },
    "_folder": { "iconPath": "./icons/folder.svg" },
    "_folder_open": { "iconPath": "./icons/folder-open.svg" },
    "_js": { "iconPath": "./icons/javascript.svg" },
    "_ts": { "iconPath": "./icons/typescript.svg" },
    "_readme": { "iconPath": "./icons/readme.svg" },
  },

  "file": "_file",
  "folder": "_folder",
  "folderExpanded": "_folder_open",

  "fileExtensions": {
    "js": "_js",
    "mjs": "_js",
    "ts": "_ts",
    "tsx": "_ts",
  },

  "fileNames": {
    "readme.md": "_readme",
    "package.json": "_npm",
  },

  "languageIds": {
    "javascript": "_js",
    "typescript": "_ts",
  },

  "folderNames": {
    "src": "_folder_src",
    "test": "_folder_test",
    ".git": "_folder_git",
  },
  "folderNamesExpanded": {
    "src": "_folder_src_open",
  },

  "light": {
    /* same shape, used in light themes */
  },
  "highContrast": {
    /* same shape, high contrast */
  },

  "hidesExplorerArrows": false,
}
```

## Resolution order

When VS Code needs an icon for a file, it picks the **first match** in this order:

1. `fileNames` — exact filename match (case-insensitive), e.g. `package.json`
2. `fileExtensions` — extension match, longest extension first (e.g. `d.ts` before `ts`)
3. `languageIds` — the file's detected language ID (e.g. `typescript`)
4. `file` — the generic fallback file icon

For folders:

1. `folderNames` / `folderNamesExpanded` — exact folder name
2. `folder` / `folderExpanded` — generic folder

## Light / high-contrast variants

Top-level keys (`fileExtensions`, `fileNames`, etc.) are the **dark** defaults. The `light` and `highContrast` objects can override any of them with the same shape.

## Icon definitions

Each entry in `iconDefinitions` points to an image:

```jsonc
"_js": {
  "iconPath": "./icons/javascript.svg",
  "fontCharacter": "\\E001",   // alternative: use a glyph from a custom font
  "fontColor": "#f7df1e",
  "fontId": "myfont"
}
```

Two ways to provide an icon:

- **SVG/PNG path** via `iconPath` (one file per icon — simplest, what most themes use).
- **Font glyph** via `fontCharacter` + a `fonts` array at the top level (smaller distribution but harder to author).

## Hiding Explorer arrows

```jsonc
"hidesExplorerArrows": true
```

Hides the chevron arrows next to folders. Useful if your folder icons already convey open/closed state.

## Things to watch out for

- **Extensions are case-insensitive** but matched by the longest dot-separated suffix, so `component.test.ts` matches `test.ts` before `ts`.
- **Language IDs** are powerful — they let you cover files like `Dockerfile.dev` automatically because the file is detected as the `dockerfile` language.
- VS Code does **not** scale your SVGs with antialiasing favors, so design at 16×16 / 32×32 with crisp strokes.
- Animated SVGs are not supported.

## Reference

- Official guide: <https://code.visualstudio.com/api/extension-guides/file-icon-theme>
- Schema: search for `vscode-icon-theme.schema.json` in the VS Code repo.
