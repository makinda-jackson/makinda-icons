// Single source of truth that maps Hugeicons (Rounded/Duotone) sources to
// makinda icon names. The build script (./build.mjs) reads this manifest,
// copies the SVGs into the icons/ folders, and emits both theme JSONs.
//
// To add or replace an icon: edit this file and re-run `npm run build`.
// Source path is relative to HUGEICONS_ROOT (configured in build.mjs).

// ---------- File icons ----------
//
// `name` is the canonical icon id (no extension). It also becomes the SVG
// filename inside icons/file-icons/.
// `src` is the relative path inside Hugeicons Rounded/Duotone.
// `extensions` / `fileNames` / `languageIds` populate the file-icon theme JSON.

export const fileIcons = [
    // Generic
    { name: "file", src: "Files Folders/file-01.svg" },
    { name: "folder", src: "Files Folders/folder-01.svg" },
    { name: "folder-open", src: "Files Folders/folder-02.svg" },

    // Source code (used as fallback for many languages)
    {
        name: "code",
        src: "Programming Language/source-code.svg",
        extensions: ["mjs", "cjs", "jsx", "tsx", "ts", "js", "coffee"],
        languageIds: ["javascript", "typescript", "javascriptreact", "typescriptreact"]
    },
    {
        name: "code-square",
        src: "Programming Language/source-code-square.svg",
        languageIds: ["coffeescript"]
    },
    {
        name: "command-line",
        src: "Programming Language/command-line.svg",
        extensions: ["sh", "bash", "zsh", "fish", "ps1", "bat", "cmd"],
        languageIds: ["shellscript", "powershell", "bat"]
    },

    // Web markup / styles
    {
        name: "html",
        src: "Brand Logo/html-5.svg",
        extensions: ["html", "htm", "xhtml"],
        languageIds: ["html"]
    },
    {
        name: "css",
        src: "Edit Formatting/colors.svg",
        extensions: ["css", "scss", "sass", "less", "styl", "pcss"],
        languageIds: ["css", "scss", "sass", "less", "stylus", "postcss"]
    },

    // Data / config
    {
        name: "json",
        src: "Programming Language/source-code.svg",
        extensions: ["json", "jsonc", "json5"],
        fileNames: ["package.json", "tsconfig.json", "tsconfig.base.json", "jsconfig.json"],
        languageIds: ["json", "jsonc"]
    },
    {
        name: "yaml",
        src: "Programming Language/document-code.svg",
        extensions: ["yml", "yaml", "toml"],
        languageIds: ["yaml", "toml"]
    },
    {
        name: "xml",
        src: "Files Folders/xml-01.svg",
        extensions: ["xml", "xsl", "xslt", "xsd", "plist"],
        languageIds: ["xml", "xsl"]
    },
    {
        name: "markdown",
        src: "Files Folders/scroll.svg",
        extensions: ["md", "mdx", "markdown", "mdown", "rst", "adoc"],
        fileNames: ["README", "README.md", "readme.md", "readme.markdown"],
        languageIds: ["markdown", "mdx"]
    },
    {
        name: "license",
        src: "Files Folders/license.svg",
        fileNames: ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING", "NOTICE"]
    },
    {
        name: "config",
        src: "Settings/setting-01.svg",
        extensions: ["config", "conf", "ini", "cfg", "properties", "env"],
        fileNames: [".env", ".env.local", ".env.development", ".env.production",
            ".editorconfig", ".gitattributes", ".gitignore", ".npmrc", ".npmignore",
            ".prettierrc", ".prettierignore", ".eslintrc", ".eslintrc.json",
            ".eslintignore", ".stylelintrc", ".browserslistrc"],
        languageIds: ["ini", "properties", "dotenv"]
    },

    // Documents
    { name: "pdf", src: "Files Folders/pdf-01.svg", extensions: ["pdf"] },
    { name: "doc", src: "Files Folders/doc-01.svg", extensions: ["doc", "docx", "rtf", "odt"] },
    { name: "ppt", src: "Files Folders/ppt-01.svg", extensions: ["ppt", "pptx", "key"] },
    { name: "csv", src: "Files Folders/csv-01.svg", extensions: ["csv", "tsv"] },
    { name: "txt", src: "Files Folders/txt-01.svg", extensions: ["txt", "log"] },

    // Images & media
    {
        name: "image",
        src: "Files Folders/png-01.svg",
        extensions: ["png", "jpg", "jpeg", "webp", "avif", "bmp", "ico", "tiff", "heic"]
    },
    { name: "svg", src: "Files Folders/svg-01.svg", extensions: ["svg"] },
    { name: "gif", src: "Files Folders/gif-01.svg", extensions: ["gif"] },
    { name: "video", src: "Files Folders/mp4-01.svg", extensions: ["mp4", "mov", "webm", "mkv", "avi", "flv"] },
    { name: "audio", src: "Files Folders/mp3-01.svg", extensions: ["mp3", "wav", "flac", "ogg", "aac", "m4a"] },

    // Archives
    {
        name: "archive",
        src: "Files Folders/zip-01.svg",
        extensions: ["zip", "tar", "gz", "tgz", "rar", "7z", "bz2", "xz"]
    },

    // Database
    {
        name: "database",
        src: "Programming Language/database.svg",
        extensions: ["sql", "db", "sqlite", "sqlite3"],
        languageIds: ["sql"]
    },

    // Brand-ish (limited by what Hugeicons ships)
    {
        name: "github",
        src: "Brand Logo/github.svg",
        fileNames: ["FUNDING.yml", "CODEOWNERS", "PULL_REQUEST_TEMPLATE.md", "ISSUE_TEMPLATE.md"]
    },
    {
        name: "figma",
        src: "Brand Logo/figma.svg",
        extensions: ["fig"]
    },

    // Folder variants (each gets a `-open` companion below)
    { name: "folder-shared", src: "Files Folders/folder-shared-01.svg" },
    { name: "folder-cloud", src: "Files Folders/folder-cloud.svg" },
    { name: "folder-locked", src: "Files Folders/folder-locked.svg" },
    { name: "folder-zip", src: "Files Folders/folder-zip.svg" },
    { name: "folder-music", src: "Files Folders/folder-music.svg" },
    { name: "folder-video", src: "Files Folders/folder-video.svg" },
    { name: "folder-audio", src: "Files Folders/folder-audio.svg" },
    { name: "folder-search", src: "Files Folders/folder-search.svg" },
    { name: "folder-favourite", src: "Files Folders/folder-favourite.svg" },
    { name: "folder-library", src: "Files Folders/folder-library.svg" },
    { name: "folder-management", src: "Files Folders/folder-management.svg" },
    { name: "folder-code", src: "Programming Language/code-folder.svg" },
];

// Folder name → icon mapping (closed). The build also generates an `-open`
// variant by reusing `folder-open.svg` unless an explicit override is added.
export const folderNames = {
    src: "folder-code",
    app: "folder-code",
    pages: "folder-code",
    routes: "folder-code",
    components: "folder-code",
    hooks: "folder-code",
    utils: "folder-code",
    lib: "folder-library",
    helpers: "folder-library",
    services: "folder-cloud",
    api: "folder-cloud",
    server: "folder-cloud",
    client: "folder-code",
    store: "folder-management",
    context: "folder-management",
    providers: "folder-management",
    layouts: "folder-code",
    styles: "folder-favourite",
    public: "folder-shared",
    static: "folder-shared",
    assets: "folder-favourite",
    images: "folder-video",
    fonts: "folder-favourite",
    icons: "folder-favourite",
    themes: "folder-favourite",
    locales: "folder-shared",
    i18n: "folder-shared",
    config: "folder-management",
    scripts: "folder-code",
    tools: "folder-management",
    test: "folder-search",
    tests: "folder-search",
    __tests__: "folder-search",
    spec: "folder-search",
    e2e: "folder-search",
    mocks: "folder-search",
    fixtures: "folder-search",
    types: "folder-code",
    typings: "folder-code",
    docs: "folder-library",
    examples: "folder-library",
    demo: "folder-library",
    controllers: "folder-code",
    models: "folder-code",
    middleware: "folder-cloud",
    migrations: "folder-management",
    prisma: "folder-management",
    database: "folder-management",
    node_modules: "folder-zip",
    dist: "folder-zip",
    build: "folder-zip",
    out: "folder-zip",
    coverage: "folder-search",
    cache: "folder-zip",
    ".cache": "folder-zip",
    ".git": "folder-locked",
    ".github": "folder-shared",
    ".vscode": "folder-management",
    ".husky": "folder-locked",
    ".vercel": "folder-cloud",
    ".next": "folder-zip",
    ".nuxt": "folder-zip",
    ".svelte-kit": "folder-zip",
};

// ---------- Product icons ----------
//
// Keys are codicon IDs (https://microsoft.github.io/vscode-codicons/dist/codicon.html).
// Any codicon not listed here falls back to the built-in default.

export const productIcons = [
    // Activity bar
    { id: "files", src: "Files Folders/folder-01.svg" },
    { id: "search", src: "Search/search.svg" },
    { id: "search-view-icon", src: "Search/search.svg" },
    { id: "source-control", src: "Git/git-branch.svg" },
    { id: "source-control-view-icon", src: "Git/git-branch.svg" },
    { id: "debug-alt", src: "Programming Language/bug-01.svg" },
    { id: "run-view-icon", src: "Programming Language/bug-01.svg" },
    // Hugeicons doesn't ship a puzzle-piece in many categories; the Game &
    // Sports puzzle reads more like "extension/plugin" than the previous
    // generic "shapes" glyph.
    { id: "extensions", src: "Game & Sports/puzzle.svg" },
    { id: "extensions-view-icon", src: "Game & Sports/puzzle.svg" },
    { id: "account", src: "Users/user-circle.svg", optional: true },
    { id: "settings-gear", src: "Settings/setting-01.svg" },
    { id: "settings-view-bar-icon", src: "Settings/setting-01.svg" },

    // Navigation arrows (chevrons)
    { id: "chevron-up", src: "Arrows (Round)/arrow-up-01-round.svg" },
    { id: "chevron-down", src: "Arrows (Round)/arrow-down-01-round.svg" },
    { id: "chevron-left", src: "Arrows (Round)/arrow-left-01-round.svg" },
    { id: "chevron-right", src: "Arrows (Round)/arrow-right-01-round.svg" },
    { id: "arrow-up", src: "Arrows (Round)/arrow-up-02-round.svg" },
    { id: "arrow-down", src: "Arrows (Round)/arrow-down-02-round.svg" },
    { id: "arrow-left", src: "Arrows (Round)/arrow-left-02-round.svg" },
    { id: "arrow-right", src: "Arrows (Round)/arrow-right-02-round.svg" },
    { id: "fold", src: "Arrows (Round)/unfold-less-round.svg" },
    { id: "unfold", src: "Arrows (Round)/unfold-more-round.svg" },
    { id: "expand-all", src: "Arrows (Round)/unfold-more-round.svg" },
    { id: "collapse-all", src: "Arrows (Round)/unfold-less-round.svg" },

    // Add / remove / close
    { id: "add", src: "Add Remove Delete/add-01.svg" },
    { id: "plus", src: "Add Remove Delete/add-01.svg" },
    { id: "remove", src: "Add Remove Delete/remove-01.svg" },
    { id: "close", src: "Add Remove Delete/cancel-01.svg" },
    { id: "close-all", src: "Add Remove Delete/cancel-square.svg" },
    { id: "trash", src: "Add Remove Delete/delete-02.svg" },
    { id: "clear-all", src: "Add Remove Delete/delete-02.svg" },

    // Status / state
    { id: "check", src: "Check Validation/tick-02.svg" },
    { id: "pass", src: "Check Validation/checkmark-circle-02.svg" },
    { id: "error", src: "Alert Notification/alert-circle.svg" },
    { id: "warning", src: "Alert Notification/alert-02.svg" },
    { id: "info", src: "Alert Notification/information-circle.svg" },
    { id: "question", src: "Alert Notification/help-circle.svg" },

    // File / folder actions
    { id: "new-file", src: "Files Folders/file-add.svg" },
    { id: "new-folder", src: "Files Folders/folder-add.svg" },
    { id: "save", src: "Devices/floppy-disk.svg" },
    { id: "file", src: "Files Folders/file-01.svg" },
    { id: "folder", src: "Files Folders/folder-01.svg" },
    { id: "folder-opened", src: "Files Folders/folder-02.svg" },

    // Editing
    { id: "edit", src: "Edit Formatting/edit-02.svg" },
    { id: "pencil", src: "Edit Formatting/edit-02.svg" },
    { id: "copy", src: "Edit Formatting/copy-01.svg" },
    { id: "comment", src: "Communications/comment-01.svg" },
    { id: "eye", src: "Edit Formatting/view.svg" },
    { id: "eye-closed", src: "Edit Formatting/view-off.svg" },

    // Source control
    { id: "git-branch", src: "Git/git-branch.svg" },
    { id: "git-commit", src: "Git/git-commit.svg" },
    { id: "git-merge", src: "Git/git-merge.svg" },
    { id: "git-compare", src: "Git/git-compare.svg" },
    { id: "git-pull-request", src: "Git/git-pull-request.svg" },
    { id: "github", src: "Brand Logo/github.svg" },

    // Debug
    { id: "bug", src: "Programming Language/bug-01.svg" },
    // `play` and `debug-start` previously pointed at view.svg (an eye glyph);
    // Media/play is the proper triangle play button.
    { id: "play", src: "Media/play.svg" },
    { id: "debug-start", src: "Media/play.svg" },
    { id: "debug-continue", src: "Media/play.svg" },
    { id: "debug-pause", src: "Media/pause.svg" },
    { id: "debug-stop", src: "Media/stop.svg" },
    { id: "debug-restart", src: "Edit Formatting/reload.svg" },
    { id: "debug-disconnect", src: "Login Logout/logout-01.svg" },
    { id: "debug-step-into", src: "Programming Language/step-into.svg" },
    { id: "debug-step-out", src: "Programming Language/step-out.svg" },
    { id: "debug-step-over", src: "Programming Language/step-over.svg" },
    { id: "stop", src: "Media/stop.svg" },
    { id: "stop-circle", src: "Media/stop.svg" },
    { id: "record", src: "Media/record.svg" },
    { id: "record-keys", src: "Media/record.svg" },

    // Terminal
    { id: "terminal", src: "Programming Language/command-line.svg" },
    { id: "terminal-bash", src: "Programming Language/command-line.svg" },

    // Notifications & feedback
    { id: "bell", src: "Alert Notification/notification-01.svg" },
    { id: "bell-dot", src: "Alert Notification/notification-bubble.svg" },
    { id: "heart", src: "Bookmark Favorite/favourite.svg" },
    { id: "star-empty", src: "Bookmark Favorite/star.svg" },
    { id: "star-full", src: "Bookmark Favorite/star.svg" },
    { id: "bookmark", src: "Bookmark Favorite/bookmark-01.svg" },
    { id: "tag", src: "Bookmark Favorite/tag-01.svg" },

    // Search & filter
    { id: "filter", src: "Filter Sorting/filter.svg", optional: true },
    { id: "refresh", src: "Edit Formatting/refresh.svg" },
    { id: "sync", src: "Edit Formatting/reload.svg" },

    // Misc
    { id: "lock", src: "Security/square-lock-01.svg", optional: true },
    { id: "unlock", src: "Security/square-unlock-01.svg", optional: true },
    { id: "menu", src: "More Menu/menu-01.svg" },
    { id: "ellipsis", src: "More Menu/more-horizontal.svg" },
    { id: "kebab-vertical", src: "More Menu/more-vertical.svg" },
    { id: "home", src: "Home/home-01.svg", optional: true },
    { id: "globe", src: "Location Map/global.svg" },
    { id: "key", src: "Security/lock-key.svg" },
    { id: "gear", src: "Settings/setting-01.svg" },
    { id: "tools", src: "Settings/wrench-01.svg" },
    { id: "lightbulb", src: "Devices/bulb.svg" },

    // Pin / clock / history
    { id: "pin", src: "Location Map/pin.svg" },
    { id: "pinned", src: "Location Map/pin.svg" },
    { id: "unpin", src: "Location Map/pin-off.svg" },
    { id: "clock", src: "Date and Time/clock-01.svg" },
    { id: "history", src: "Date and Time/time-04.svg" },
    { id: "calendar", src: "Date and Time/calendar-01.svg" },

    // Layout / window chrome
    { id: "layout-sidebar-left", src: "Programming Language/sidebar-left.svg" },
    { id: "layout-sidebar-right", src: "Programming Language/sidebar-right.svg" },
    { id: "chrome-close", src: "Add Remove Delete/cancel-01.svg" },
    { id: "chrome-minimize", src: "Edit Formatting/minimize-screen.svg" },
    { id: "chrome-maximize", src: "Edit Formatting/maximize-screen.svg" },
    { id: "chrome-restore", src: "Edit Formatting/minimize-screen.svg" },
    { id: "screen-full", src: "Edit Formatting/maximize-screen.svg" },
    { id: "screen-normal", src: "Edit Formatting/minimize-screen.svg" },

    // Cloud / transfer
    { id: "cloud", src: "Weather/cloud.svg" },
    { id: "cloud-download", src: "Download Upload/cloud-download.svg" },
    { id: "cloud-upload", src: "Download Upload/cloud-upload.svg" },
    { id: "desktop-download", src: "Download Upload/download-01.svg" },

    // Files / archive / package / repo
    { id: "archive", src: "Files Folders/archive-01.svg" },
    { id: "package", src: "E-Commerce/package.svg" },
    { id: "repo", src: "Programming Language/repository.svg" },
    { id: "library", src: "Files Folders/folder-library.svg" },
    { id: "code", src: "Programming Language/code.svg" },
    { id: "go-to-file", src: "Files Folders/file-search.svg" },
    { id: "file-code", src: "Programming Language/document-code.svg" },
    { id: "export", src: "Files Folders/file-export.svg" },
    { id: "import", src: "Files Folders/file-import.svg" },
    { id: "discard", src: "Edit Formatting/eraser.svg" },

    // Links / sharing
    { id: "link", src: "Link Unlink/link-01.svg" },
    { id: "link-external", src: "Link Unlink/link-forward.svg" },
    { id: "share", src: "Link Unlink/share-01.svg" },

    // Mail / inbox / chat
    { id: "mail", src: "Communications/mail-01.svg" },
    { id: "mail-read", src: "Communications/mail-open-01.svg" },
    { id: "inbox", src: "Communications/inbox.svg" },
    { id: "reply", src: "Communications/mail-reply-01.svg" },
    { id: "comment-discussion", src: "Communications/bubble-chat.svg" },

    // Notes / output
    { id: "note", src: "Note Task/note-01.svg" },
    { id: "notebook", src: "Note Task/notebook.svg" },
    { id: "output", src: "Programming Language/console.svg" },
    { id: "console", src: "Programming Language/console.svg" },

    // Sign in/out
    { id: "sign-in", src: "Login Logout/login-01.svg" },
    { id: "sign-out", src: "Login Logout/logout-01.svg" },

    // Feedback / misc
    { id: "feedback", src: "Bookmark Favorite/thumbs-up.svg" },
    { id: "thumbsup", src: "Bookmark Favorite/thumbs-up.svg" },
    { id: "thumbsdown", src: "Bookmark Favorite/thumbs-down.svg" },
    { id: "loading", src: "Edit Formatting/reload.svg" },
    { id: "search-stop", src: "Search/search-remove.svg" },
    { id: "zoom-in", src: "Search/zoom-in-area.svg" },
    { id: "zoom-out", src: "Search/zoom-out-area.svg" },
];
