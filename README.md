# makinda-icons

A custom icon theme for Visual Studio Code by Makinda Jackson — covering both **file icons** (the icons next to files/folders in the Explorer) and **product icons** (the UI icons used throughout the VS Code interface).

## Repository structure

```
makinda-icons/
├── docs/                      Documentation about VS Code icons
│   ├── overview/              What VS Code icons are and how they work
│   ├── file-icons/            File/folder icon theme reference
│   ├── product-icons/         Product (UI) icon theme reference
│   └── theme-development/     How to build and publish the themes
├── icons/                     Icon source assets (SVG)
│   ├── file-icons/            File/folder SVGs
│   └── product-icons/         Codicon-replacement SVGs
└── README.md
```

## Goals

- Build a **file icon theme** (`makinda-file-icons`) covering common languages, frameworks, and folder types.
- Build a **product icon theme** (`makinda-product-icons`) replacing VS Code's built-in codicons.
- Document the icon system thoroughly so the theme is easy to extend and maintain.

## Status

Early scaffolding. Documentation first, icons next.

## Docs index

- [What are VS Code icons](docs/overview/what-are-vscode-icons.md)
- [How file icons work](docs/file-icons/how-file-icons-work.md)
- [File icons list](docs/file-icons/file-icons-list.md)
- [How product icons work](docs/product-icons/how-product-icons-work.md)
- [Product icons list (codicons)](docs/product-icons/product-icons-list.md)
- [Building an icon theme](docs/theme-development/building-icon-themes.md)
