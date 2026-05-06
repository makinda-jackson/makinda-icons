# Building the makinda icon themes

This is the working plan for shipping `makinda-file-icons` and `makinda-product-icons` as a single VS Code extension.

## 1. Project layout (target)

```
makinda-icons/
├── package.json                       Extension manifest
├── icons/
│   ├── file-icons/                    SVG sources
│   └── product-icons/                 SVG sources
├── fonts/
│   └── makinda-product.woff           Generated codicon-replacement font
├── themes/
│   ├── makinda-file-icon-theme.json
│   └── makinda-product-icon-theme.json
├── scripts/
│   └── build-font.mjs                 SVG → WOFF pipeline
└── docs/
```

## 2. Tooling

- **Node 20+**
- **fantasticon** for font generation
- **svgo** to optimize SVGs
- **@vscode/vsce** to package and publish
- **vscode** API typings for editor integration tests (optional)

## 3. Authoring rules

### File icons (SVG)

- 32×32 viewBox, 2px stroke, full color allowed.
- Filename = the canonical key in the theme JSON (`javascript.svg`, `folder-src.svg`, …).
- Provide `-open` variants for folders that should react to expansion.

### Product icons (SVG → font)

- 16×16 viewBox, single color (`currentColor` / black fill).
- Filename = codicon ID (`chevron-down.svg`, `git-branch.svg`).
- Codepoint comes from the canonical [codicons mapping](https://github.com/microsoft/vscode-codicons/blob/main/src/template/mapping.json).

## 4. Build pipeline

1. `npm run optimize` → svgo over all icons.
2. `npm run build:font` → fantasticon reads `icons/product-icons/` + the codicon mapping, outputs `fonts/makinda-product.woff` and a generated `themes/makinda-product-icon-theme.json`.
3. `npm run build:file-theme` → small node script that reads `icons/file-icons/` and emits `themes/makinda-file-icon-theme.json` from a manifest.
4. `vsce package` → produces `.vsix`.

## 5. Manifest (sketch)

```jsonc
{
  "name": "makinda-icons",
  "displayName": "Makinda Icons",
  "publisher": "makindajack",
  "version": "0.0.1",
  "engines": { "vscode": "^1.85.0" },
  "categories": ["Themes"],
  "contributes": {
    "iconThemes": [
      {
        "id": "makinda-file-icons",
        "label": "Makinda File Icons",
        "path": "./themes/makinda-file-icon-theme.json",
      },
    ],
    "productIconThemes": [
      {
        "id": "makinda-product-icons",
        "label": "Makinda Product Icons",
        "path": "./themes/makinda-product-icon-theme.json",
      },
    ],
  },
}
```

## 6. Testing

- Open the extension folder in VS Code → press `F5` → an Extension Development Host opens.
- `Preferences: File Icon Theme` → pick _Makinda File Icons_.
- `Preferences: Product Icon Theme` → pick _Makinda Product Icons_.
- Toggle dark / light / high-contrast to verify variants.

## 7. Publishing

```sh
vsce login makindajack
vsce publish
```

Marketplace listing should include screenshots of: Explorer with file icons, Activity Bar with product icons, side-by-side dark/light.
