# Makinda Icons for Neovim

File-icon overlay for [`nvim-web-devicons`][devicons] using the same icon
manifest as the [Makinda Icons VS Code extension][vscode] and the
[JetBrains plugin](../jetbrains/README.md).

Terminal Neovim is a monochrome (glyph-only) world, so this package maps each
Makinda file type to the closest [Nerd Font][nerdfont] codepoint plus a color
from the Makinda palette. You'll need a Nerd Font installed and selected in
your terminal for the glyphs to render.

## Requirements

- Neovim 0.9+
- [`nvim-web-devicons`][devicons]
- A [Nerd Font][nerdfont] in your terminal (e.g. JetBrainsMono Nerd Font)

## Install

### lazy.nvim

```lua
{
    "makindajack/makinda-icons",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
        require("nvim-web-devicons").setup({ default = true })
        require("makinda-icons").setup()
    end,
}
```

> Until this package is published as its own repository, point lazy at a
> local checkout: `dir = "/path/to/makinda-icons/packages/nvim"`.

### packer.nvim

```lua
use({
    "makindajack/makinda-icons",
    requires = { "nvim-tree/nvim-web-devicons" },
    config = function()
        require("makinda-icons").setup()
    end,
})
```

### Manual

Copy `lua/makinda-icons/` somewhere on your `runtimepath` and add:

```lua
require("makinda-icons").setup()
```

## API

```lua
local makinda = require("makinda-icons")

-- Apply the overlay (idempotent). Call after nvim-web-devicons is loaded.
makinda.setup({
    default_icon = false,  -- set to true to also override devicons' fallback
})

-- Look up a Makinda icon by canonical name.
local def = makinda.get("markdown")
-- def == { icon = "", color = "#e7e8ea", cterm_color = "250", name = "Markdown" }
```

## What's overridden

The build emits one entry per file-icon name in [`scripts/manifest.mjs`](../../scripts/manifest.mjs)
that has a Nerd Font glyph mapping in [`scripts/build-nvim.mjs`](../../scripts/build-nvim.mjs).
File **extensions** and exact **filenames** declared in the manifest are routed
to those entries via `nvim-web-devicons.set_icon` / `set_icon_by_filename`.

Re-run `npm run build:nvim` from the repo root after editing the manifest.

## Limitations

- **Monochrome glyphs.** Terminal Neovim can't render the SVGs
  themselves; you get a Nerd Font codepoint instead. The Makinda _colors_ still
  apply via the highlight group set by `nvim-web-devicons`.
- **No directory icons.** `nvim-web-devicons` only themes files. If you want
  directory icons in `nvim-tree` / `neo-tree`, configure those plugins
  separately — Makinda doesn't override them.
- **Glyph drift.** Nerd Font codepoints occasionally shift between font
  versions. If you see a tofu (□), bump your Nerd Font and reapply.

## License

[MIT](../../LICENSE.md) — same as the rest of the Makinda Icons monorepo.

[devicons]: https://github.com/nvim-tree/nvim-web-devicons
[vscode]: https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons
[nerdfont]: https://www.nerdfonts.com
