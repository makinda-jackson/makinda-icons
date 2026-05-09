# Makinda Icons for Emacs

File-icon overlay for [`nerd-icons.el`][nerd-icons], using the same icon
manifest as the [Makinda Icons VS Code extension][vscode], the
[JetBrains plugin](../jetbrains/README.md), and the
[Neovim plugin](../nvim/README.md).

Like the Neovim port, Emacs in a terminal can only render Nerd Font glyphs
(not the original SVGs). This package maps each Makinda file type
to the closest Nerd Font codepoint plus a color from the Makinda palette.

## Requirements

- Emacs 27.1+
- [`nerd-icons.el`][nerd-icons]
- A [Nerd Font][nerdfont] in your default frame font

## Install

This package isn't on MELPA yet. While the upstream rolls out Phase 4, install
straight from the monorepo checkout:

### use-package + straight.el

```elisp
(use-package makinda-icons
  :straight (:host github
             :repo "makindajack/makinda-icons"
             :files ("packages/emacs/makinda-icons.el"))
  :after nerd-icons
  :config (makinda-icons-setup))
```

### Manual

Copy [`makinda-icons.el`](makinda-icons.el) onto your `load-path`, then:

```elisp
(require 'nerd-icons)
(require 'makinda-icons)
(makinda-icons-setup)
```

## API

```elisp
;; Apply the overlay (idempotent). Call after nerd-icons is loaded.
(makinda-icons-setup)

;; Get the glyph for a canonical Makinda icon name.
(makinda-icons-icon-for-name "markdown")
;; => "" (propertized with the Makinda fg face)
```

## What's overridden

The build emits one entry per file-icon name in
[`scripts/manifest.mjs`](../../scripts/manifest.mjs) that has a Nerd Font
codepoint mapping in
[`scripts/nerd-font-glyphs.mjs`](../../scripts/nerd-font-glyphs.mjs).
Extensions and exact filenames declared in the manifest are pushed to the
front of `nerd-icons-extension-icon-alist` and
`nerd-icons-regexp-icon-alist`, so any consumer of `nerd-icons-icon-for-file`
(dired-sidebar, treemacs-nerd-icons, doom-modeline, etc.) picks them up
automatically.

Re-run `npm run build:emacs` from the repo root after editing the manifest
or glyph table.

## Limitations

- **Monochrome glyphs.** Same constraint as the Neovim port — Emacs renders
  the Nerd Font codepoint, not the SVG. Makinda colors apply via face props.
- **No directory icons.** `nerd-icons.el` doesn't theme directories the way
  it does files; configure `treemacs` / `dired-sidebar` separately.
- **`all-the-icons.el` not yet supported.** v1 targets `nerd-icons.el` only,
  which is the more actively-maintained option in 2026. Open an issue if you
  need the older package.

## License

[MIT](../../LICENSE.md) — same as the rest of the Makinda Icons monorepo.

[nerd-icons]: https://github.com/rainforest-cafe/nerd-icons.el
[vscode]: https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons
[nerdfont]: https://www.nerdfonts.com
