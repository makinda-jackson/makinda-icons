# Supported IDEs

Makinda Icons is a **VS Code icon theme extension**. It works in any editor that implements the VS Code extension API and honours the `iconThemes` and `productIconThemes` contribution points.

In practice that means **every editor in the VS Code family** — the original Microsoft build plus all the popular forks and AI-first derivatives.

## Compatibility matrix

| Editor                                 | File icons | Product icons | Install method                                                                          |
| -------------------------------------- | :--------: | :-----------: | --------------------------------------------------------------------------------------- |
| **Visual Studio Code**                 |     ✅     |      ✅       | VS Code Marketplace · `code --install-extension makindajack.makinda-icons`              |
| **VS Code Insiders**                   |     ✅     |      ✅       | VS Code Marketplace · `code-insiders --install-extension makindajack.makinda-icons`     |
| **VSCodium**                           |     ✅     |      ✅       | [Open VSX Registry](https://open-vsx.org) · `codium --install-extension …` · or `.vsix` |
| **Cursor**                             |     ✅     |      ✅       | Built-in Extensions view (uses Open VSX) · or `cursor --install-extension …`            |
| **Windsurf** (Codeium)                 |     ✅     |      ✅       | Built-in Extensions view · or `windsurf --install-extension …`                          |
| **Trae** (ByteDance)                   |     ✅     |      ✅       | Built-in Extensions view · or `.vsix`                                                   |
| **Zed Preview** (VS Code compat layer) | ⚠️ partial |  ⚠️ partial   | Manual `.vsix` — limited contribution-point coverage                                    |
| **GitHub Codespaces**                  |     ✅     |      ✅       | Same as VS Code (web or desktop)                                                        |
| **github.dev / vscode.dev**            |     ✅     |      ✅       | Install from the Marketplace inside the web editor                                      |
| **Gitpod**                             |     ✅     |      ✅       | Open VSX                                                                                |
| **Coder / code-server**                |     ✅     |      ✅       | Open VSX or `.vsix`                                                                     |
| **Eclipse Theia**–based IDEs           |     ✅     |      ✅       | Open VSX · most Theia distributions support both icon-theme types                       |

> **Not supported:** JetBrains IDEs (IntelliJ, WebStorm, PyCharm…), Sublime Text, Atom, Vim/Neovim, Emacs, Xcode, Visual Studio (the full IDE), Android Studio, Fleet. These editors don't implement the VS Code icon-theme format. A separate icon pack would be needed for each — that work is out of scope for this repo.

## Marketplaces

Makinda Icons is published to:

- **[VS Code Marketplace](https://marketplace.visualstudio.com)** — used by Visual Studio Code (Stable + Insiders) and Codespaces.
- **[Open VSX Registry](https://open-vsx.org)** — used by VSCodium, Cursor, Windsurf, Trae, Gitpod, Theia, code-server, and most other forks that ship without Microsoft's marketplace.

If your editor only sees one of the two registries, install from the one it supports — the published `.vsix` is identical.

## Manual install (any compatible editor)

If a registry isn't reachable, every listed editor accepts a local `.vsix`:

1. Download `makinda-icons-<version>.vsix` from the [GitHub Releases](https://github.com/makindajack/makinda-icons/releases) page.
2. Open the editor's **Extensions** view → `…` menu → **Install from VSIX…**
3. Select the file. Reload if prompted.

CLI alternative — works in VS Code, VSCodium, Cursor, Windsurf, Trae, code-server:

```sh
<editor-cli> --install-extension /path/to/makinda-icons-<version>.vsix
```

## Activate the themes

After install, in any supported editor:

1. **File icons** — `Cmd/Ctrl + Shift + P` → **Preferences: File Icon Theme** → select **Makinda Icons (Dualtone)**.
2. **Product icons** — `Cmd/Ctrl + Shift + P` → **Preferences: Product Icon Theme** → select **Makinda Product Icons (Dualtone)**.

Both can be activated independently; they don't depend on each other.

## Editor-specific notes

### Cursor / Windsurf / Trae

These ship a curated Open VSX index by default. If Makinda Icons doesn't appear in search, the publisher feed may not have been mirrored yet — fall back to the `.vsix` install above. Activation paths and command IDs are identical to upstream VS Code.

### VSCodium / code-server / Gitpod

Configure the registry if needed. For `code-server`, set:

```sh
export EXTENSIONS_GALLERY='{"serviceUrl":"https://open-vsx.org/vscode/gallery","itemUrl":"https://open-vsx.org/vscode/item"}'
```

then install via the Extensions view.

### Web editors (vscode.dev, github.dev, Codespaces)

Web editors only render extensions whose assets resolve over HTTPS — Makinda Icons ships pure SVGs with no native code, so it works without a remote workspace.

### Zed

Zed's VS Code extension support is still evolving. File icons render correctly in recent builds; product icons may fall back to defaults for unmapped IDs. Treat it as **best-effort** until Zed's compatibility layer reaches feature parity.

## Reporting compatibility issues

If Makinda Icons looks wrong in a listed editor, please open an issue with:

- Editor name and version
- Operating system
- Whether file icons, product icons, or both are affected
- A screenshot if visual

→ [github.com/makindajack/makinda-icons/issues](https://github.com/makindajack/makinda-icons/issues)
