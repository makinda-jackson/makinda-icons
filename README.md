<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/makindajack/makinda-icons/main/images/icon-dark.png" alt="Makinda Icons" width="128">
  <br>
  Makinda Icons
  <br>
</h1>

<h4 align="center">Multi-style icon themes for VS Code and the wider VS Code family — inspired by Hugeicons, tuned for the Makinda brand.</h4>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons">
    <img alt="Version" src="https://img.shields.io/vscode-marketplace/v/makindajack.makinda-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons">
    <img alt="Installs" src="https://img.shields.io/vscode-marketplace/d/makindajack.makinda-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=installs">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons">
    <img alt="Rating" src="https://img.shields.io/vscode-marketplace/r/makindajack.makinda-icons.svg?style=for-the-badge&labelColor=0e0e0f&color=ff6b0d&label=rating">
  </a>
</p>

<p align="center">
  <a href="#install">Install</a> •
  <a href="#activate">Activate</a> •
  <a href="#pair-with-makinda-themes">Pair with Makinda Themes</a> •
  <a href="#troubleshooting">Troubleshooting</a> •
  <a href="#license">License</a>
</p>

---

This extension ships **two** independent themes you can mix and match:

- **`Makinda Icons (Solid)`** — file & folder icons in the Explorer, tabs, breadcrumbs, Quick Open.
- **`Makinda Product Icons (Solid)`** — UI icons in the Activity Bar, status bar, gutters, and panels (84 codicon overrides).

> Iconography inspired by [Hugeicons](https://hugeicons.com). Currently shipping the **Solid** style. Duotone, Twotone, Stroke, Bulk, and Sharp variants are on the roadmap.

---

## Install

Pick the section that matches your editor.

### Visual Studio Code · VS Code Insiders · GitHub Codespaces

**From the Marketplace UI**

1. Open **Extensions** (`Cmd/Ctrl + Shift + X`).
2. Search for `Makinda Icons`.
3. Click **Install**.

**From the command line**

```sh
# Stable
code --install-extension makindajack.makinda-icons

# Insiders
code-insiders --install-extension makindajack.makinda-icons
```

In Codespaces and `vscode.dev` / `github.dev`, install the same way as desktop VS Code — search and install from the in-browser Extensions view.

### Cursor

1. Open **Extensions** in the sidebar.
2. Search for `Makinda Icons`.
3. Click **Install**. (Cursor pulls from Open VSX; the listing is mirrored automatically.)

CLI alternative:

```sh
cursor --install-extension makindajack.makinda-icons
```

### Windsurf (Codeium)

1. Open the **Extensions** view.
2. Search for `Makinda Icons` and install.

CLI:

```sh
windsurf --install-extension makindajack.makinda-icons
```

### Trae (ByteDance)

1. Open **Extensions**.
2. Search for `Makinda Icons` and install.

If your build of Trae can't reach the registry, use the manual install below.

### VSCodium

VSCodium uses the [Open VSX Registry](https://open-vsx.org), not the VS Code Marketplace.

1. Open **Extensions**, search for `Makinda Icons`, install.
2. Or from the CLI:

```sh
codium --install-extension makindajack.makinda-icons
```

### Gitpod · code-server · Eclipse Theia

These editors also use Open VSX. Install via the in-app Extensions view, or:

```sh
# code-server
code-server --install-extension makindajack.makinda-icons
```

If your code-server instance points at a different gallery, set:

```sh
export EXTENSIONS_GALLERY='{"serviceUrl":"https://open-vsx.org/vscode/gallery","itemUrl":"https://open-vsx.org/vscode/item"}'
```

before launching it.

### Manual install (any compatible editor)

If a registry isn't reachable, every editor listed above accepts a local `.vsix`:

1. Download `makinda-icons-<version>.vsix` from the [GitHub Releases](https://github.com/makindajack/makinda-icons/releases) page.
2. In your editor: **Extensions** view → `…` menu → **Install from VSIX…** → pick the file.
3. Reload if prompted.

CLI alternative — works for VS Code, VSCodium, Cursor, Windsurf, Trae, code-server:

```sh
<editor-cli> --install-extension /path/to/makinda-icons-<version>.vsix
```

### Not yet supported

JetBrains IDEs, Sublime Text, Neovim, Emacs, Xcode, Visual Studio (Windows), Fleet, and Zed don't implement the VS Code icon-theme format. Separate ports are tracked in the [roadmap](https://github.com/makindajack/makinda-icons/blob/main/docs/overview/roadmap.md).

---

## Activate

Once installed, switch each theme independently. They're separate settings — you can use one without the other.

### File icons

1. Open the Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows / Linux).
2. Run **Preferences: File Icon Theme**.
3. Select **Makinda Icons (Solid)**.

Or set it directly in `settings.json`:

```jsonc
{
  "workbench.iconTheme": "makinda-file-icons-solid",
}
```

### Product icons (UI icons)

1. Command Palette → **Preferences: Product Icon Theme**.
2. Select **Makinda Product Icons (Solid)**.

Or in `settings.json`:

```jsonc
{
  "workbench.productIconTheme": "makinda-product-icons-solid",
}
```

### Use both at once

```jsonc
{
  "workbench.iconTheme": "makinda-file-icons-solid",
  "workbench.productIconTheme": "makinda-product-icons-solid",
}
```

---

## Pair with Makinda Themes

These icons are color-tuned to match the [Makinda Themes](https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes) color set:

```jsonc
{
  "workbench.colorTheme": "Makinda Dark",
  "workbench.iconTheme": "makinda-file-icons-solid",
  "workbench.productIconTheme": "makinda-product-icons-solid",
}
```

Auto-switch with your OS appearance:

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Makinda Light",
  "workbench.preferredDarkColorTheme": "Makinda Dark",
  "workbench.iconTheme": "makinda-file-icons-solid",
  "workbench.productIconTheme": "makinda-product-icons-solid",
}
```

---

## Troubleshooting

**Icons didn't change after installing.** Run **Preferences: File Icon Theme** _and_ **Preferences: Product Icon Theme** explicitly — installation alone doesn't activate either.

**A specific file type still uses the default icon.** That extension isn't in the starter set yet. Open an [issue](https://github.com/makindajack/makinda-icons/issues) with the extension name and I'll add it.

**Some UI icons (gutter, status bar) are unchanged.** Product Icon Themes can only override icons whose codicon ID is mapped. Anything not yet in the manifest falls back to the built-in codicon — that's by design, not a bug. The list of overrides will grow.

**Cursor / Windsurf / Trae can't find it.** Their bundled Open VSX index sometimes lags. Fall back to the [manual `.vsix` install](#manual-install-any-compatible-editor).

---

## Links

- [GitHub repository](https://github.com/makindajack/makinda-icons)
- [Report an issue](https://github.com/makindajack/makinda-icons/issues)
- [Roadmap](https://github.com/makindajack/makinda-icons/blob/main/docs/overview/roadmap.md)
- [Contributing & build docs](https://github.com/makindajack/makinda-icons/blob/main/docs/README.dev.md)
- [Companion color theme: Makinda Themes](https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes)

---

## License

See [LICENSE.md](LICENSE.md). Icon assets are derived from Hugeicons Pro and are not redistributable without your own Hugeicons license.
