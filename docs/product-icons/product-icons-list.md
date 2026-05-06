# Product icons list (codicons)

A working checklist of every product icon the **makinda-product-icons** theme will redesign. Codicon IDs match the canonical [`@vscode/codicons` mapping](https://github.com/microsoft/vscode-codicons/blob/main/src/template/mapping.json) — keep them stable so VS Code can substitute icons correctly.

> The list below covers the well-known codicons grouped by purpose. Before each release, regenerate against the upstream `mapping.json` to catch new IDs added by VS Code.

## Activity bar / primary navigation

- [ ] `files`
- [ ] `search`
- [ ] `source-control`
- [ ] `debug-alt` / `debug-alt-small`
- [ ] `extensions`
- [ ] `account`
- [ ] `settings-gear`
- [ ] `remote-explorer`
- [ ] `remote`
- [ ] `live-share`
- [ ] `output`
- [ ] `notebook`

## Layout / panels / windows

- [ ] `layout`
- [ ] `layout-sidebar-left` / `layout-sidebar-right`
- [ ] `layout-sidebar-left-off` / `layout-sidebar-right-off`
- [ ] `layout-panel` / `layout-panel-off`
- [ ] `layout-panel-justify` / `layout-panel-center` / `layout-panel-left` / `layout-panel-right`
- [ ] `layout-activitybar-left` / `layout-activitybar-right`
- [ ] `layout-statusbar`
- [ ] `layout-menubar`
- [ ] `multiple-windows`
- [ ] `empty-window`
- [ ] `window`
- [ ] `split-horizontal` / `split-vertical`
- [ ] `editor-layout`

## Editor chrome & tabs

- [ ] `close` / `close-all` / `close-dirty`
- [ ] `chrome-close` / `chrome-minimize` / `chrome-maximize` / `chrome-restore`
- [ ] `pin` / `pinned` / `pinned-dirty`
- [ ] `preserve-case`
- [ ] `case-sensitive`
- [ ] `whole-word`
- [ ] `regex`
- [ ] `replace` / `replace-all`
- [ ] `find-in-selection`

## File / folder actions

- [ ] `new-file` / `new-folder`
- [ ] `file` / `file-code` / `file-binary` / `file-media` / `file-pdf` / `file-zip` / `file-symlink-file` / `file-symlink-directory`
- [ ] `folder` / `folder-opened` / `folder-active` / `folder-library`
- [ ] `root-folder` / `root-folder-opened`
- [ ] `save` / `save-all` / `save-as`
- [ ] `trash` / `clear-all`
- [ ] `cloud-download` / `cloud-upload` / `cloud`
- [ ] `desktop-download`
- [ ] `archive`
- [ ] `package`
- [ ] `briefcase`
- [ ] `book` / `bookmark`

## Navigation & arrows

- [ ] `chevron-up` / `chevron-down` / `chevron-left` / `chevron-right`
- [ ] `arrow-up` / `arrow-down` / `arrow-left` / `arrow-right`
- [ ] `arrow-small-up` / `arrow-small-down` / `arrow-small-left` / `arrow-small-right`
- [ ] `arrow-circle-up` / `arrow-circle-down` / `arrow-circle-left` / `arrow-circle-right`
- [ ] `arrow-both`
- [ ] `arrow-swap`
- [ ] `triangle-up` / `triangle-down` / `triangle-left` / `triangle-right`
- [ ] `fold` / `fold-up` / `fold-down`
- [ ] `unfold`
- [ ] `expand-all` / `collapse-all`
- [ ] `list-tree` / `list-flat` / `list-selection` / `list-unordered` / `list-ordered`

## Editing / text manipulation

- [ ] `add` / `plus`
- [ ] `remove` / `dash`
- [ ] `edit`
- [ ] `pencil`
- [ ] `copy`
- [ ] `clippy`
- [ ] `clone`
- [ ] `link` / `unlink`
- [ ] `link-external`
- [ ] `quote`
- [ ] `text-size`
- [ ] `symbol-color` / `symbol-keyword` / etc. _(see "Symbols" below)_
- [ ] `indent`
- [ ] `comment` / `comment-discussion` / `comment-unresolved` / `comment-draft`
- [ ] `selection`
- [ ] `find-selection`
- [ ] `discard`

## Status / state

- [ ] `check` / `check-all`
- [ ] `pass` / `pass-filled`
- [ ] `error`
- [ ] `warning`
- [ ] `info`
- [ ] `question`
- [ ] `circle` / `circle-filled` / `circle-large` / `circle-large-filled` / `circle-large-outline` / `circle-outline` / `circle-slash`
- [ ] `primitive-square` / `primitive-dot`
- [ ] `verified` / `verified-filled` / `unverified`
- [ ] `shield` / `lock` / `unlock`
- [ ] `eye` / `eye-closed` / `eye-watch`
- [ ] `loading` / `sync` / `sync-ignored`
- [ ] `refresh`
- [ ] `stop` / `stop-circle`
- [ ] `play` / `play-circle`
- [ ] `record` / `record-keys` / `record-small`
- [ ] `mute` / `unmute`

## Source control (Git)

- [ ] `git-branch` / `git-branch-create` / `git-branch-delete`
- [ ] `git-commit`
- [ ] `git-compare`
- [ ] `git-fetch`
- [ ] `git-fork-private`
- [ ] `git-merge`
- [ ] `git-pull-request` / `git-pull-request-closed` / `git-pull-request-create` / `git-pull-request-draft` / `git-pull-request-go-to-changes` / `git-pull-request-new-changes`
- [ ] `git-stash` / `git-stash-apply` / `git-stash-pop`
- [ ] `repo` / `repo-clone` / `repo-force-push` / `repo-forked` / `repo-pull` / `repo-push`
- [ ] `cloud` / `mirror`
- [ ] `request-changes`
- [ ] `diff` / `diff-added` / `diff-ignored` / `diff-modified` / `diff-removed` / `diff-renamed` / `diff-multiple` / `diff-single`
- [ ] `compare-changes`
- [ ] `history`

## Debug

- [ ] `debug` / `debug-alt` / `debug-alt-small`
- [ ] `debug-start` / `debug-stop` / `debug-restart` / `debug-restart-frame`
- [ ] `debug-pause` / `debug-continue` / `debug-continue-small`
- [ ] `debug-step-into` / `debug-step-out` / `debug-step-over` / `debug-step-back`
- [ ] `debug-disconnect`
- [ ] `debug-breakpoint` / `debug-breakpoint-conditional` / `debug-breakpoint-conditional-unverified` / `debug-breakpoint-data` / `debug-breakpoint-data-unverified` / `debug-breakpoint-function` / `debug-breakpoint-function-unverified` / `debug-breakpoint-log` / `debug-breakpoint-log-unverified` / `debug-breakpoint-unsupported` / `debug-breakpoint-pending` / `debug-breakpoint-unverified`
- [ ] `debug-stackframe` / `debug-stackframe-active` / `debug-stackframe-dot`
- [ ] `debug-console`
- [ ] `debug-coverage`
- [ ] `debug-line-by-line`
- [ ] `debug-rerun`
- [ ] `debug-reverse-continue`
- [ ] `bug`
- [ ] `callstack-view-icon` / `callstack-view-session`

## Terminal

- [ ] `terminal`
- [ ] `terminal-bash`
- [ ] `terminal-cmd`
- [ ] `terminal-debian`
- [ ] `terminal-linux`
- [ ] `terminal-powershell`
- [ ] `terminal-tmux`
- [ ] `terminal-ubuntu`
- [ ] `console`

## Notifications & feedback

- [ ] `bell` / `bell-dot` / `bell-slash` / `bell-slash-dot`
- [ ] `megaphone`
- [ ] `mail` / `mail-read` / `mail-reply`
- [ ] `feedback`
- [ ] `heart` / `heart-filled`
- [ ] `star-empty` / `star-full` / `star-half`
- [ ] `thumbsup` / `thumbsup-filled` / `thumbsdown` / `thumbsdown-filled`
- [ ] `report`

## Search & filter

- [ ] `search` / `search-stop` / `search-fuzzy` / `search-save`
- [ ] `filter` / `filter-filled`
- [ ] `sort-precedence`
- [ ] `case-sensitive`
- [ ] `whole-word`
- [ ] `regex`
- [ ] `find-replace`

## Symbols (IntelliSense / outline)

- [ ] `symbol-array`
- [ ] `symbol-boolean`
- [ ] `symbol-class`
- [ ] `symbol-color`
- [ ] `symbol-constant`
- [ ] `symbol-constructor`
- [ ] `symbol-enum` / `symbol-enum-member`
- [ ] `symbol-event`
- [ ] `symbol-field`
- [ ] `symbol-file`
- [ ] `symbol-folder`
- [ ] `symbol-function`
- [ ] `symbol-interface`
- [ ] `symbol-key`
- [ ] `symbol-keyword`
- [ ] `symbol-method`
- [ ] `symbol-misc`
- [ ] `symbol-module` / `symbol-namespace` / `symbol-package`
- [ ] `symbol-null`
- [ ] `symbol-number` / `symbol-numeric`
- [ ] `symbol-object`
- [ ] `symbol-operator`
- [ ] `symbol-parameter`
- [ ] `symbol-property`
- [ ] `symbol-reference`
- [ ] `symbol-ruler`
- [ ] `symbol-snippet`
- [ ] `symbol-string` / `symbol-text`
- [ ] `symbol-struct` / `symbol-structure`
- [ ] `symbol-type-parameter` / `symbol-parameter`
- [ ] `symbol-unit`
- [ ] `symbol-value`
- [ ] `symbol-variable`

## Settings, accounts, preferences

- [ ] `settings`
- [ ] `gear`
- [ ] `tools`
- [ ] `keybindings`
- [ ] `key`
- [ ] `account`
- [ ] `person` / `person-add`
- [ ] `organization`
- [ ] `home`
- [ ] `globe`

## Media / view modes

- [ ] `preview`
- [ ] `open-preview`
- [ ] `device-camera` / `device-camera-video`
- [ ] `device-desktop`
- [ ] `device-mobile`
- [ ] `vr`
- [ ] `film`
- [ ] `screen-full` / `screen-normal`
- [ ] `zoom-in` / `zoom-out`
- [ ] `eye`
- [ ] `light-bulb` / `lightbulb` / `lightbulb-autofix` / `lightbulb-sparkle`

## Tasks, runs, builds

- [ ] `play`
- [ ] `run` / `run-all` / `run-above` / `run-below` / `run-errors`
- [ ] `rocket`
- [ ] `wrench` / `wrench-subaction`
- [ ] `gear`
- [ ] `tasklist`
- [ ] `checklist`

## Tables, charts, math

- [ ] `table`
- [ ] `graph` / `graph-line` / `graph-scatter` / `graph-left`
- [ ] `pie-chart`
- [ ] `dashboard`
- [ ] `pulse`
- [ ] `radio-tower`

## Misc / decorative

- [ ] `flame`
- [ ] `lightbulb`
- [ ] `sparkle` / `sparkle-filled`
- [ ] `wand` / `magic-wand`
- [ ] `paintcan`
- [ ] `palette`
- [ ] `color-mode`
- [ ] `compass` / `compass-active` / `compass-dot`
- [ ] `key`
- [ ] `tag`
- [ ] `tags`
- [ ] `pinned`
- [ ] `inbox`
- [ ] `outbox`
- [ ] `paste`
- [ ] `kebab-vertical`
- [ ] `more` / `ellipsis`
- [ ] `menu`
- [ ] `gripper`
- [ ] `hubot`
- [ ] `octoface`
- [ ] `github` / `github-alt` / `github-inverted`
- [ ] `github-action`
- [ ] `vscode` / `vscode-insiders`
- [ ] `azure` / `azure-devops`

## Copilot / AI (recent additions)

- [ ] `copilot`
- [ ] `comment-draft`
- [ ] `sparkle` / `sparkle-filled`
- [ ] `lightbulb-sparkle`
- [ ] `chat`
- [ ] `chat-sparkle`

---

### Keeping this list in sync

The canonical source is:

```
https://raw.githubusercontent.com/microsoft/vscode-codicons/main/src/template/mapping.json
```

Suggested workflow: a `scripts/sync-codicon-list.mjs` that fetches `mapping.json`, diffs against this file, and prints any new IDs to add (or removed ones to drop).
