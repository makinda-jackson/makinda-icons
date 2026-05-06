# How product icons work

A **Product Icon Theme** replaces the icons used throughout the VS Code UI — everything that isn't a file/folder icon. These icons all have stable IDs (the **codicon** set).

## The theme JSON

Two valid shapes. Almost everyone uses the **font-based** shape because it matches how codicons ship.

### Font-based (recommended)

```jsonc
{
  "fonts": [
    {
      "id": "makinda",
      "src": [{ "path": "./fonts/makinda.woff", "format": "woff" }],
      "weight": "normal",
      "style": "normal",
    },
  ],
  "iconDefinitions": {
    "chevron-down": { "fontCharacter": "\\ea4e", "fontId": "makinda" },
    "chevron-right": { "fontCharacter": "\\eab6", "fontId": "makinda" },
    "gear": { "fontCharacter": "\\eaf8", "fontId": "makinda" },
    "search": { "fontCharacter": "\\ea6d", "fontId": "makinda" },
  },
}
```

Keys in `iconDefinitions` are **codicon IDs**. Any ID you don't override falls back to the built-in codicon, so you can ship a partial theme.

### SVG-based

```jsonc
{
  "iconDefinitions": {
    "chevron-down": { "iconPath": "./icons/chevron-down.svg" },
    "chevron-right": { "iconPath": "./icons/chevron-right.svg" },
  },
}
```

Simpler to author, but every icon you ship is a separate HTTP-cacheable file. Fine for small sets.

## Codicon IDs

Every UI icon has a known ID. Examples:

| ID                               | Used for                              |
| -------------------------------- | ------------------------------------- |
| `account`                        | User / account button on activity bar |
| `bell` / `bell-dot`              | Notifications status bar              |
| `bug`                            | Run & Debug view                      |
| `extensions`                     | Extensions activity bar               |
| `files`                          | Explorer activity bar                 |
| `git-branch`                     | Status bar branch indicator           |
| `git-merge` / `git-pull-request` | SCM views                             |
| `gear`                           | Settings                              |
| `play` / `debug-start`           | Run buttons                           |
| `search`                         | Search activity bar                   |
| `terminal`                       | Terminal panel                        |

The full list is in [product-icons-list.md](./product-icons-list.md).

## Generating the font

If you go font-based, you need a `.woff` (or `.ttf`) where each glyph sits at the correct PUA (Private Use Area) codepoint matching the codicon ID.

Common toolchains:

- **fantasticon** (`npm i -D fantasticon`) — config-driven, supports a JSON manifest of `id → codepoint`.
- **icon-font-buildr / svg2ttf / ttf2woff** — lower-level pipeline.
- **IcoMoon** (web app) — hand-managed mapping.

The codepoints must match VS Code's expected codicon codepoints. The canonical mapping is in the [`@vscode/codicons` repo](https://github.com/microsoft/vscode-codicons), file `src/template/mapping.json`.

## Sizing

- Design glyphs on a **16×16 grid**, with a 1px stroke equivalent.
- VS Code renders product icons at 16px in most chrome and 14px in compact UI; ensure crispness at both.
- Use a single color — VS Code will tint via `currentColor`.

## Distribution

Product icon themes are contributed via the same extension manifest as file icon themes:

```jsonc
"contributes": {
  "productIconThemes": [
    {
      "id": "makinda-product-icons",
      "label": "Makinda Product Icons",
      "path": "./themes/makinda-product-icon-theme.json"
    }
  ]
}
```

## Reference

- Official guide: <https://code.visualstudio.com/api/extension-guides/product-icon-theme>
- Live codicon reference: <https://microsoft.github.io/vscode-codicons/dist/codicon.html>
- Source mapping: <https://github.com/microsoft/vscode-codicons/blob/main/src/template/mapping.json>
