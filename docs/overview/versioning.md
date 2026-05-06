# Versioning policy

Makinda Icons is a **single repo with multiple emitter targets**. To keep
release ops manageable, we use one repo-wide version number and one git tag
per release. Per-package versions only diverge when a target needs a hotfix
that the others don't.

## Rules

1. **Source of truth: [`package.json`](../../package.json) `version`.**
   The VS Code extension version. Bumped first.
2. Every emitter writes the same version into its target's manifest at build time:
   - `packages/jetbrains/build.gradle.kts` — `version` property
   - `scripts/build-vsfull.mjs` — `extension.vsixmanifest` `<Version>`
   - `scripts/build-sublime.mjs` — copied into the package's `messages.json` if used
   - `scripts/build-emacs.mjs` — `;; Version:` header in `makinda-icons.el`
   - `scripts/build-nvim.mjs` — emitted as `M.version` in `init.lua` (informational)
3. **One git tag per release: `v<version>`** (e.g. `v1.1.0`). The tag carries
   all emitter outputs as release artifacts.
4. **SemVer at the repo level:**
   - **patch** — icon polish, glyph fixes, doc fixes. No new file types.
   - **minor** — new file types, new manifest entries, new emitter target,
     new optional adapter (e.g. mini.icons), new style.
   - **major** — breaking changes to the manifest schema, removal of a target,
     change of publisher id.
5. **Per-package hotfix exception.** If a single target needs an urgent fix
   (e.g. JetBrains crash on a specific IDE build), bump only that package's
   internal version with a `+jb.1` build-metadata suffix and tag
   `v<version>+jb.1`. Next normal release re-aligns everything.

## Release checklist

When the repo version bumps:

1. Edit `package.json` `version`.
2. Run `npm run build:all` — every target picks up the new version.
3. Update [`CHANGELOG.md`](../../CHANGELOG.md): move `Unreleased` items into a
   new `[<version>] — <date>` section.
4. Commit, then tag: `git tag -a v<version> -m "v<version>"`.
5. Push tag. CI picks it up (when the publish workflow is wired) or run the
   marketplace `publish` commands manually with the appropriate credentials.

## Why one version, not five

- Users installing across editors expect the same feature set under the same
  version label.
- The manifest is the single source of truth — desyncing emitter versions
  would imply the data behind them differs, which it doesn't.
- One CHANGELOG, one release-notes page, one place to look.
