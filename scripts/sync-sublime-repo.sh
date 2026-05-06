#!/usr/bin/env bash
# Mirror packages/sublime/Makinda Icons/ to the standalone Package Control repo
# at github.com/makindajack/makinda-icons-sublime, then tag the new version.
#
# Why a separate repo: Package Control's channel format only supports
# whole-repo fetches, not subdirectories. The mirror exists solely so
# Package Control can pull a tagged release.
#
# Usage:  ./scripts/sync-sublime-repo.sh 1.0.13
#
# Idempotent: safe to re-run; will refuse if the tag already exists upstream.

set -euo pipefail

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
    echo "usage: $0 <version>" >&2
    exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/packages/sublime/Makinda Icons"
MIRROR_DIR="$(mktemp -d -t makinda-icons-sublime.XXXXXX)"
MIRROR_REMOTE="git@github.com:makindajack/makinda-icons-sublime.git"

echo "→ syncing Sublime mirror to v$VERSION"
echo "  source: $SRC"
echo "  scratch: $MIRROR_DIR"

# Fresh shallow clone of the mirror.
git clone --depth=1 "$MIRROR_REMOTE" "$MIRROR_DIR" >/dev/null 2>&1

# Refuse to overwrite an existing tag — bump the source version instead.
if git -C "$MIRROR_DIR" ls-remote --tags origin "v$VERSION" | grep -q "v$VERSION"; then
    echo "✗ tag v$VERSION already exists on the mirror — bump the version first" >&2
    rm -rf "$MIRROR_DIR"
    exit 1
fi

# Wipe everything except .git, then copy fresh contents + LICENSE.
( cd "$MIRROR_DIR" && find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} + )
cp -R "$SRC/." "$MIRROR_DIR/"
cp "$REPO_ROOT/LICENSE.md" "$MIRROR_DIR/"

cd "$MIRROR_DIR"
git add -A
if git diff --cached --quiet; then
    echo "  (no content changes; tagging existing HEAD)"
else
    git commit -m "Sync v$VERSION

Mirror of packages/sublime/Makinda Icons/ from
https://github.com/makindajack/makinda-icons at tag v$VERSION."
fi

git tag -a "v$VERSION" -m "v$VERSION"
git push origin main "v$VERSION"

cd /
rm -rf "$MIRROR_DIR"

echo "✓ Sublime mirror synced and tagged v$VERSION"
echo "  Package Control will pick this up automatically on its next channel refresh."
