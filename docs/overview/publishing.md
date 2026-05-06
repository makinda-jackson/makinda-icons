# Publishing Makinda Icons

A repeatable checklist. Run top-to-bottom every time `package.json` `version` bumps. **One git tag, one CHANGELOG entry, one publish pass across every marketplace.**

> **Never** publish without bumping the version. All marketplaces reject duplicate versions silently or noisily.

---

## TL;DR — happy path

```sh
# 1. Decide new version (e.g. 1.0.13)
NEW=1.0.13

# 2. Bump
npm version "$NEW" --no-git-tag-version
# Edit packages/jetbrains/gradle.properties → pluginVersion=$NEW
# Move CHANGELOG.md `[Unreleased]` block under `[$NEW] — YYYY-MM-DD`

# 3. Rebuild every target
npm run build:all

# 4. Package the VS Code extension
npx @vscode/vsce package --no-dependencies --out "makinda-icons-$NEW.vsix"

# 5. Commit, tag, push
git add -A
git commit -m "Release v$NEW"
git tag -a "v$NEW" -m "v$NEW"
git push origin main "v$NEW"

# 6. Mirror the Sublime subtree (Package Control needs a standalone repo)
./scripts/sync-sublime-repo.sh "$NEW"   # see `Sublime` section below

# 7. GitHub release (drag .vsix files in, or use gh)
gh release create "v$NEW" \
  "makinda-icons-$NEW.vsix" \
  packages/sublime/makinda-icons.sublime-package \
  packages/visualstudio/makinda-icons.vsix \
  --title "v$NEW" --notes-from-tag

# 8. Marketplaces
npx @vscode/vsce publish --packagePath "makinda-icons-$NEW.vsix"
OVSX_PAT="$OPEN_VSX_TOKEN"  npx ovsx publish "makinda-icons-$NEW.vsix"
( cd packages/jetbrains && PUBLISH_TOKEN="$JETBRAINS_TOKEN" ./gradlew publishPlugin )
# MELPA + Package Control + Visual Studio: see sections below — only on first publish
```

---

## Prerequisites (one-time setup)

Store these credentials somewhere safe (1Password, macOS Keychain, etc.). Never commit them.

| Env var           | Where to get it                                                                                                               | Used by                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `VSCE_PAT`        | <https://dev.azure.com/makindajack/_usersSettings/tokens> · scope `Marketplace (Manage)` · org `All accessible organizations` | `vsce publish`                |
| `OPEN_VSX_TOKEN`  | <https://open-vsx.org/user-settings/tokens> · click `Generate New Token`                                                      | `ovsx publish`                |
| `JETBRAINS_TOKEN` | <https://plugins.jetbrains.com/author/me/tokens> · scope `Plugin upload`                                                      | `./gradlew publishPlugin`     |
| `gh` CLI auth     | `gh auth login`                                                                                                               | `gh release create`, fork PRs |

`vsce` already remembers the publisher PAT after first `vsce login makindajack`. The others are passed as env vars per-command.

---

## Step-by-step

### 1. Pick the version number

Follow [`docs/overview/versioning.md`](versioning.md):

- **patch** (1.0.x): icon polish, doc fixes — no new bindings
- **minor** (1.x.0): new file types, new emitter, new style
- **major** (x.0.0): manifest schema break, removal of a target

### 2. Bump in three places

```sh
# a) package.json — single source of truth
npm version "$NEW" --no-git-tag-version

# b) JetBrains plugin (only place not auto-derived)
sed -i '' "s/^pluginVersion=.*/pluginVersion=$NEW/" packages/jetbrains/gradle.properties

# c) CHANGELOG.md — promote Unreleased → [$NEW] — YYYY-MM-DD
```

> Sublime, Emacs, Visual Studio versions are read from `package.json` at build time. Don't edit them.

### 3. Build everything

```sh
npm run build:all
```

This regenerates 7 outputs in lock-step:

1. `themes/*.json` + 252 SVGs (VS Code)
2. `packages/jetbrains/build/distributions/*.zip` (JetBrains)
3. `packages/nvim/lua/makinda-icons/{init,icons,mini}.lua` (Neovim)
4. `packages/emacs/makinda-icons.el` (Emacs)
5. `packages/sublime/makinda-icons.sublime-package` (Sublime)
6. `packages/visualstudio/makinda-icons.vsix` (Visual Studio)
7. `images/contact-sheet.solid.png` (visual QA)

### 4. Package the VS Code VSIX

```sh
npx --yes @vscode/vsce package --no-dependencies --out "makinda-icons-$NEW.vsix"
```

`--no-dependencies` is required because this is a pure-asset extension (no Node code).

### 5. Commit, tag, push

```sh
git add -A
git commit -m "Release v$NEW"
git tag -a "v$NEW" -m "v$NEW"
git push origin main "v$NEW"
```

### 6. GitHub release

```sh
gh release create "v$NEW" \
  "makinda-icons-$NEW.vsix" \
  packages/sublime/makinda-icons.sublime-package \
  packages/visualstudio/makinda-icons.vsix \
  --title "v$NEW" \
  --notes-from-tag
```

### 7. Sync the Sublime mirror repo

Package Control fetches whole repos at git tags — it can't read a subdirectory. We keep a tagged mirror at <https://github.com/makindajack/makinda-icons-sublime>.

```sh
./scripts/sync-sublime-repo.sh "$NEW"
```

(see `scripts/sync-sublime-repo.sh` — created with this guide.)

### 8. Publish: VS Code Marketplace

```sh
npx --yes @vscode/vsce publish --packagePath "makinda-icons-$NEW.vsix"
```

Live within ~5 minutes at <https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-icons>.

### 9. Publish: Open VSX

```sh
OVSX_PAT="$OPEN_VSX_TOKEN" npx --yes ovsx publish "makinda-icons-$NEW.vsix"
```

Live within seconds at <https://open-vsx.org/extension/makindajack/makinda-icons>. Unlocks VSCodium, Cursor, Windsurf, Trae, Gitpod, Theia, code-server.

> **First-time only:** run `OVSX_PAT="…" npx ovsx create-namespace makindajack` once before the first publish.

### 10. Publish: JetBrains Marketplace

```sh
cd packages/jetbrains
PUBLISH_TOKEN="$JETBRAINS_TOKEN" ./gradlew publishPlugin --no-daemon
cd ../..
```

> **First-time only:** new plugins go through manual moderation (1–3 business days). Subsequent updates are typically auto-approved within minutes if no major changes.

Live at <https://plugins.jetbrains.com/plugin/makinda-icons>.

### 11. MELPA (Emacs) — first publish only

One-time: open a PR adding `recipes/makinda-icons` to <https://github.com/melpa/melpa>.

```sh
(makinda-icons
 :fetcher github
 :repo "makindajack/makinda-icons"
 :files ("packages/emacs/makinda-icons.el"))
```

After the recipe is merged, MELPA rebuilds automatically on every new git tag — **no further action needed for subsequent releases**.

### 12. Package Control (Sublime) — first publish only

One-time: open a PR adding an entry to `repository/m.json` in <https://github.com/sublimehq/package_control_channel> pointing at `makindajack/makinda-icons-sublime`.

```json
{
  "name": "Makinda Icons",
  "details": "https://github.com/makindajack/makinda-icons-sublime",
  "labels": ["theme", "icons", "file icons"],
  "releases": [{ "sublime_text": ">=3000", "platforms": ["*"], "tags": true }]
}
```

Subsequent releases are picked up automatically from new git tags on the mirror repo (step 7).

### 13. Visual Studio Marketplace — manual

Cannot be automated. For each release:

1. Go to <https://marketplace.visualstudio.com/manage/publishers/makindajack>.
2. Find **Makinda Icons** → **Edit** → **New version**.
3. Drag `packages/visualstudio/makinda-icons.vsix` into the upload field.
4. Save. Microsoft scans the package (~5 min) and goes live.

> **Pre-flight (recommended):** test the VSIX in a Windows VS 2022 install before each publish. The build is structurally validated at every commit by CI, but only Windows can confirm runtime behavior.

---

## Verification

After publish, sanity-check that every marketplace serves the new version:

```sh
NEW=1.0.13   # whatever you just released

# VS Code Marketplace
curl -s -X POST "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery" \
  -H "Accept: application/json;api-version=3.0-preview.1" \
  -H "Content-Type: application/json" \
  -d '{"filters":[{"criteria":[{"filterType":7,"value":"makindajack.makinda-icons"}]}],"flags":914}' \
  | python3 -c "import sys,json; print('vsce:', json.load(sys.stdin)['results'][0]['extensions'][0]['versions'][0]['version'])"

# Open VSX
curl -s "https://open-vsx.org/api/makindajack/makinda-icons" \
  | python3 -c "import sys,json; print('ovsx:', json.load(sys.stdin)['version'])"

# JetBrains (returns plugin page HTML; grep for the version)
curl -s "https://plugins.jetbrains.com/plugin/makinda-icons" | grep -o "Version $NEW" | head -1
```

---

## Recovery

| Problem                                    | Fix                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| `vsce publish` says version already exists | Bump again — marketplaces never accept overwrites                                 |
| `ovsx publish` returns "Unknown publisher" | First-time only: `OVSX_PAT=… npx ovsx create-namespace makindajack`               |
| JetBrains plugin page 404 after publish    | Moderation queue. Check status at <https://plugins.jetbrains.com/author/me>       |
| Need to unpublish a broken release         | All three marketplaces support it via their dashboards. Open VSX is fastest.      |
| MELPA build broken                         | Watch <https://melpa.org/packages/makinda-icons-badge.svg> — turns red on failure |

---

## What's NOT in this guide

- **Initial publisher account creation.** One-time, browser flow:
  - VS Code: <https://marketplace.visualstudio.com/manage/createpublisher>
  - JetBrains: <https://plugins.jetbrains.com/author/me>
  - Open VSX: sign in with GitHub at <https://open-vsx.org/login>
  - VS Marketplace: <https://marketplace.visualstudio.com/manage/createpublisher> (separate flow from VS Code)
- **Code signing.** None of these marketplaces require it for non-binary extensions. Revisit if we ever ship a JetBrains plugin with native code.
