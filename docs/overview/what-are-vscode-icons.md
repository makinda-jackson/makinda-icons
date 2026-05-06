# What are VS Code icons?

VS Code uses icons in two distinct systems. They look similar to users but are configured, themed, and contributed in completely different ways.

## 1. File icons

File icons are the small images shown next to files and folders in:

- The **Explorer** view
- **Open editors** list
- **Editor tabs**
- **Quick Open** (`Cmd/Ctrl + P`)
- **Breadcrumbs**

They are controlled by a **File Icon Theme**. The user picks one via:

> `Preferences: File Icon Theme` (`workbench.iconTheme`)

A file icon theme maps file names, file extensions, and language IDs to icon definitions (usually SVGs).

Built-in themes:

- **Minimal** (default-ish, very plain)
- **Seti** (the popular colorful one)
- _(none)_ — disables file icons entirely

## 2. Product icons

Product icons are the icons used **everywhere else in the VS Code UI**:

- Activity bar (Explorer, Search, Source Control, Run, Extensions…)
- Status bar (errors, warnings, sync, branch…)
- Editor gutter (breakpoints, folding chevrons…)
- Panel toolbars (close, split, refresh, settings gear…)
- Menus, hovers, notifications, problems panel, terminal, debug controls

VS Code ships a built-in font called **Codicons** that contains every product icon. Each icon has a stable ID like `chevron-down`, `gear`, `git-branch`, `error`.

A **Product Icon Theme** replaces some or all of these icons. The user picks one via:

> `Preferences: Product Icon Theme` (`workbench.productIconTheme`)

Built-in themes:

- **Default** (the standard codicon set)

## Key differences

| Aspect             | File icons                           | Product icons                                                                               |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Where they appear  | Explorer, tabs, file pickers         | Everything else (activity bar, status bar, toolbars, etc.)                                  |
| Setting            | `workbench.iconTheme`                | `workbench.productIconTheme`                                                                |
| Contribution point | `iconThemes`                         | `productIconThemes`                                                                         |
| Identifier system  | Language IDs, file names, extensions | Stable codicon IDs                                                                          |
| Format             | SVG / PNG (icon-per-file mapping)    | Icon font (`.woff` / `.ttf`) or per-icon SVGs                                               |
| Reference          | Custom JSON map                      | The full [codicon reference](https://microsoft.github.io/vscode-codicons/dist/codicon.html) |

## How they're contributed (extension manifest)

In `package.json`:

```jsonc
{
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

## Further reading

- [File Icon Theme guide](https://code.visualstudio.com/api/extension-guides/file-icon-theme)
- [Product Icon Theme guide](https://code.visualstudio.com/api/extension-guides/product-icon-theme)
- [Codicon reference](https://microsoft.github.io/vscode-codicons/dist/codicon.html)
